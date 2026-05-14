import { NextRequest, NextResponse } from "next/server"
import { execFile } from "child_process"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { Pool } from "pg"
import { randomUUID } from "crypto"

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

interface SessionInfo {
  sessionId: string
  conversationId: string
  lastActivity: number
}

const activeSessions = new Map<string, SessionInfo>()

function getSessionKey(userId: string, agentId: string, conversationId: string): string {
  return `${userId}:${agentId}:${conversationId}`
}

function isSessionExpired(session: SessionInfo): boolean {
  return Date.now() - session.lastActivity > SESSION_TIMEOUT_MS
}

function callClaude(args: string[], agentPath: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = execFile(CLAUDE_BIN, args, {
      cwd: agentPath,
      timeout: 180000,
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
}

async function processAssistantMessage(params: {
  messageId: string
  agentId: string
  agentDir: string
  message: string
  userId: string
  conversationId: string
}) {
  const { messageId, agentId, agentDir, message, userId, conversationId } = params
  const agentPath = `${AGENTS_BASE}/${agentDir}`

  try {
    // Session lookup
    const sessionKey = getSessionKey(userId, agentId, conversationId)
    let session = activeSessions.get(sessionKey)
    let claudeArgs: string[]

    if (session && !isSessionExpired(session)) {
      claudeArgs = ["-p", "--resume", session.sessionId, message]
      console.log(`[DISPATCH] Resume session ${session.sessionId} for ${agentDir}`)
    } else {
      const newSessionId = randomUUID()
      session = {
        sessionId: newSessionId,
        conversationId,
        lastActivity: Date.now(),
      }
      activeSessions.set(sessionKey, session)
      claudeArgs = ["-p", "--model", "haiku", "--session-id", newSessionId, message]
      console.log(`[DISPATCH] New session ${newSessionId} for ${agentDir}`)
    }

    const { stdout, stderr } = await callClaude(claudeArgs, agentPath)
    if (stderr) console.error(`[DISPATCH] stderr ${agentDir}:`, stderr.substring(0, 200))

    session.lastActivity = Date.now()
    activeSessions.set(sessionKey, session)

    const rawResponse = stdout.trim()

    // Parse JSON if agent returned structured data
    let responseContent: string | Record<string, unknown> = rawResponse
    try {
      const jsonMatch = rawResponse.match(/```json\n?([\s\S]*?)```/)
      if (jsonMatch) {
        responseContent = JSON.parse(jsonMatch[1].trim())
      }
    } catch {
      // Keep as string
    }

    // Generate document if structured response with a document type
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
        if (!existsSync(mediaDir)) await mkdir(mediaDir, { recursive: true })
        await writeFile(path.join(mediaDir, filename), imageBuffer)
        responseContent.image_url = `/media/${filename}`
        delete responseContent.image_base64
      } catch (err) {
        console.error("[API] Erreur sauvegarde image:", err)
      }
    }

    const finalContent = typeof responseContent === "string"
      ? responseContent
      : JSON.stringify(responseContent)

    // Update the pending message in DB to "done"
    await pool.query(
      `UPDATE messages
       SET content = $1,
           metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb
       WHERE id = $3`,
      [
        finalContent,
        JSON.stringify({ agentId, agentDir, sessionId: session.sessionId, status: "done" }),
        messageId,
      ]
    )

    await pool.query("UPDATE conversations SET updated_at = NOW() WHERE id = $1", [conversationId])
    console.log(`[API] Message ${messageId} completed`)
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string }
    console.error(`[API] Message ${messageId} failed:`, err.message)

    await pool.query(
      `UPDATE messages
       SET content = $1,
           metadata = COALESCE(metadata, '{}'::jsonb) || $2::jsonb
       WHERE id = $3`,
      [
        `L'agent a rencontre une erreur.\n\n(${err.message?.substring(0, 200)})`,
        JSON.stringify({ status: "error", error: err.message?.substring(0, 500) }),
        messageId,
      ]
    )
  }
}

// Cleanup expired sessions
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
    const convId = conversationId || `conv-${Date.now()}-${randomUUID().slice(0, 8)}`

    console.log(`[API] ${effectiveUserId} -> ${agentDir}: ${message.substring(0, 80)}...`)

    // 1. Upsert conversation
    await pool.query(
      "INSERT INTO conversations (id, agent_id, user_id, title) VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING",
      [convId, agentId, effectiveUserId, message.substring(0, 50)]
    )

    // 2. Save user message
    const userMsgId = `msg-${Date.now()}-${randomUUID().slice(0, 8)}`
    await pool.query(
      "INSERT INTO messages (id, conversation_id, role, content) VALUES ($1, $2, $3, $4)",
      [userMsgId, convId, "user", message]
    )

    // 3. Create pending assistant message
    const assistantMsgId = `msg-${Date.now()}-${randomUUID().slice(0, 8)}-pending`
    await pool.query(
      "INSERT INTO messages (id, conversation_id, role, content, metadata) VALUES ($1, $2, $3, $4, $5)",
      [
        assistantMsgId,
        convId,
        "assistant",
        "",
        JSON.stringify({ status: "pending", agentId }),
      ]
    )

    // 4. Launch generation in background (do NOT await)
    processAssistantMessage({
      messageId: assistantMsgId,
      agentId,
      agentDir,
      message,
      userId: effectiveUserId,
      conversationId: convId,
    }).catch((err) => {
      console.error(`[API] Background process failed:`, err)
    })

    // 5. Return immediately
    return NextResponse.json({
      success: true,
      status: "pending",
      messageId: assistantMsgId,
      userMessageId: userMsgId,
      conversationId: convId,
      agentId,
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("[API] Erreur:", err.message)
    return NextResponse.json({
      success: false,
      error: err.message?.substring(0, 200),
    }, { status: 500 })
  }
}

// GET /api/chat?messageId=xxx -> get status of a pending message
export async function GET(request: NextRequest) {
  try {
    const messageId = request.nextUrl.searchParams.get("messageId")
    if (!messageId) {
      return NextResponse.json({ error: "messageId requis" }, { status: 400 })
    }

    const result = await pool.query(
      "SELECT id, content, metadata, created_at FROM messages WHERE id = $1",
      [messageId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Message non trouve" }, { status: 404 })
    }

    const row = result.rows[0]
    const meta = row.metadata || {}
    const status = meta.status || "done"

    // Parse the content if it's JSON
    let response: string | Record<string, unknown> = row.content
    if (status === "done" && row.content) {
      try {
        const parsed = JSON.parse(row.content)
        response = parsed
      } catch {
        // Keep as string
      }
    }

    return NextResponse.json({
      messageId,
      status,
      response,
      error: meta.error,
      createdAt: row.created_at,
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("[API] GET error:", err.message)
    return NextResponse.json({ error: err.message?.substring(0, 200) }, { status: 500 })
  }
}
