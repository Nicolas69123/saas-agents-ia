import { NextRequest, NextResponse } from "next/server"
import { execFile } from "child_process"
import { promisify } from "util"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { Pool } from "pg"
import { randomUUID } from "crypto"

const execFileAsync = promisify(execFile)

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: parseInt(process.env.PG_PORT || "5432"),
  database: process.env.PG_DATABASE || "saas_agents_ia_prod",
  user: process.env.PG_USER || "saas_agents_ia_user",
  password: process.env.PG_PASSWORD || "",
})

const AGENT_DIRS: Record<string, string> = {
  "reseaux-sociaux": "agent-social",
  "email-marketing": "agent-marketing",
  "ressources-humaines": "agent-rh",
  "comptable": "agent-compta",
  "tresorier": "agent-tresorerie",
  "investissements": "agent-invest",
  "support-client": "agent-support",
  "telephonique": "agent-tel",
}

const AGENTS_BASE = process.env.AGENTS_BASE || "/home/webmaster/omnia-agents"
const CLAUDE_BIN = process.env.CLAUDE_BIN || "/home/webmaster/.npm-global/bin/claude"
const SESSION_TIMEOUT_MS = 60 * 60 * 1000

// --- Session Dispatcher ---

interface SessionInfo {
  sessionId: string
  conversationId: string
  lastActivity: number
}

// In-memory session index: "userId:agentId:conversationId" -> SessionInfo
const activeSessions = new Map<string, SessionInfo>()

function getSessionKey(userId: string, agentId: string, conversationId: string): string {
  return `${userId}:${agentId}:${conversationId}`
}

function isSessionExpired(session: SessionInfo): boolean {
  return Date.now() - session.lastActivity > SESSION_TIMEOUT_MS
}

async function dispatch(
  agentId: string,
  agentDir: string,
  message: string,
  userId: string,
  conversationId: string | null
): Promise<{ response: string; conversationId: string; sessionId: string }> {

  const agentPath = `${AGENTS_BASE}/${agentDir}`

  // Resolve or create conversation (always upsert to ensure FK exists)
  const convId = conversationId || `conv-${Date.now()}-${randomUUID().slice(0, 8)}`
  await pool.query(
    "INSERT INTO conversations (id, agent_id, user_id, title) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
    [convId, agentId, userId, message.substring(0, 50)]
  )

  // Save user message
  await pool.query(
    "INSERT INTO messages (id, conversation_id, role, content) VALUES ($1, $2, $3, $4)",
    [`msg-${Date.now()}-${randomUUID().slice(0, 8)}`, convId, "user", message]
  )

  // Session lookup
  const sessionKey = getSessionKey(userId, agentId, convId)
  let session = activeSessions.get(sessionKey)

  let claudeArgs: string[]

  if (session && !isSessionExpired(session)) {
    // Resume existing session
    claudeArgs = ["-p", "--resume", session.sessionId, message]
    console.log(`[DISPATCH] Resume session ${session.sessionId} for ${agentDir}`)
  } else {
    // Create new session
    const newSessionId = randomUUID()
    session = {
      sessionId: newSessionId,
      conversationId: convId,
      lastActivity: Date.now(),
    }
    activeSessions.set(sessionKey, session)
    claudeArgs = ["-p", "--model", "haiku", "--session-id", newSessionId, message]
    console.log(`[DISPATCH] New session ${newSessionId} for ${agentDir}`)
  }

  // Call claude -p (redirect stdin to /dev/null to avoid "no stdin" warning)
  const { stdout, stderr } = await new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    const child = execFile(CLAUDE_BIN, claudeArgs, {
      cwd: agentPath,
      timeout: 120000,
      maxBuffer: 1024 * 1024 * 5,
      env: {
        ...process.env,
        HOME: "/home/webmaster",
        PATH: `/home/webmaster/.npm-global/bin:${process.env.PATH}`,
      },
    }, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
    child.stdin?.end()
  })

  if (stderr) {
    console.error(`[DISPATCH] stderr ${agentDir}:`, stderr.substring(0, 200))
  }

  // Update session activity
  session.lastActivity = Date.now()
  activeSessions.set(sessionKey, session)

  const rawResponse = stdout.trim()

  // Save assistant message
  await pool.query(
    "INSERT INTO messages (id, conversation_id, role, content, metadata) VALUES ($1, $2, $3, $4, $5)",
    [
      `msg-${Date.now()}-${randomUUID().slice(0, 8)}`,
      convId,
      "assistant",
      rawResponse,
      JSON.stringify({ agentId, agentDir, sessionId: session.sessionId }),
    ]
  )

  await pool.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [convId])

  return {
    response: rawResponse,
    conversationId: convId,
    sessionId: session.sessionId,
  }
}

// --- Cleanup expired sessions periodically ---
setInterval(() => {
  const keys = Array.from(activeSessions.keys())
  for (const key of keys) {
    const session = activeSessions.get(key)!
    if (isSessionExpired(session)) {
      console.log(`[CLEANUP] Archiving session ${session.sessionId}`)
      activeSessions.delete(key)
    }
  }
}, 5 * 60 * 1000)

// --- API Route ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, conversationId, userId } = body

    if (!agentId || !message) {
      return NextResponse.json({ error: "agentId et message requis" }, { status: 400 })
    }

    const agentDir = AGENT_DIRS[agentId]
    if (!agentDir) {
      return NextResponse.json({ error: `Agent inconnu: ${agentId}` }, { status: 400 })
    }

    const effectiveUserId = userId || "anonymous"

    console.log(`[API] ${effectiveUserId} -> ${agentDir}: ${message.substring(0, 80)}...`)

    const result = await dispatch(
      agentId,
      agentDir,
      message,
      effectiveUserId,
      conversationId || null
    )

    // Parse JSON if agent returned structured data
    let responseContent: string | Record<string, unknown> = result.response
    try {
      const jsonMatch = result.response.match(/```json\n?([\s\S]*?)```/)
      if (jsonMatch) {
        responseContent = JSON.parse(jsonMatch[1].trim())
      }
    } catch {
      // Keep as string
    }

    // Generate document (DOCX/XLSX/PPTX/PDF) for structured responses
    if (typeof responseContent === "object" && responseContent?.type) {
      const docType = responseContent.type as string
      const docTypes = [
        "invoice", "monthly_report", "quarterly_report", "expense_analysis",
        "balance_sheet", "vat_check", "presentation", "client_deck",
        "pitch_deck", "contract", "certificate",
      ]
      if (docTypes.includes(docType)) {
        try {
          const docRes = await fetch(`http://localhost:${process.env.PORT || "3000"}/api/document`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(responseContent),
          })
          const docData = await docRes.json()
          if (docData.success) {
            responseContent.document_url = docData.url
            responseContent.document_filename = docData.filename
            responseContent.document_format = docData.format
            responseContent.document_preview_url = docData.previewUrl
            if (docData.downloadUrl) {
              responseContent.document_download_url = docData.downloadUrl
              responseContent.document_download_filename = docData.downloadFilename
            }
            console.log(`[API] Document ${docData.format} genere: ${docData.url}`)
          }
        } catch (err) {
          console.error("[API] Erreur generation document:", err)
        }
      }
    }

    // Handle base64 images
    if (typeof responseContent === "object" && responseContent?.image_base64) {
      try {
        const imageBuffer = Buffer.from(responseContent.image_base64 as string, "base64")
        const ext = (responseContent.mimeType as string)?.includes("jpeg") ? "jpg" : "png"
        const filename = `generated-${Date.now()}.${ext}`
        const mediaDir = path.join(process.cwd(), "public", "media")
        if (!existsSync(mediaDir)) {
          await mkdir(mediaDir, { recursive: true })
        }
        await writeFile(path.join(mediaDir, filename), imageBuffer)
        responseContent.image_url = `/media/${filename}`
        delete responseContent.image_base64
      } catch (err) {
        console.error("[API] Erreur sauvegarde image:", err)
      }
    }

    return NextResponse.json({
      success: true,
      response: responseContent,
      agentId,
      conversationId: result.conversationId,
      sessionId: result.sessionId,
    })
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string }
    console.error("[API] Erreur:", err.message)

    return NextResponse.json({
      success: true,
      response: `L'agent est en cours de configuration.\n\n(Erreur: ${err.message?.substring(0, 100)})`,
      agentId: "fallback",
    })
  }
}
