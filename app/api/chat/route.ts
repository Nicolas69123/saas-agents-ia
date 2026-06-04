import { NextRequest, NextResponse } from "next/server"
import { execFile } from "child_process"
import { writeFile, mkdir, copyFile } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { Pool } from "pg"
import { randomUUID } from "crypto"

const UPLOADS_ROOT = process.env.UPLOADS_ROOT || "/home/webmaster/saas-uploads"

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

interface AttachmentRef {
  id?: string
  filename: string
  name?: string
  type?: string
  size?: number
}

async function copyAttachmentsToAgent(params: {
  agentPath: string
  attachments: AttachmentRef[]
  userId: string
  conversationId: string
}): Promise<string[]> {
  const { agentPath, attachments, userId, conversationId } = params
  if (!attachments || attachments.length === 0) return []

  const safeUser = sanitizeName(userId)
  const safeConv = sanitizeName(conversationId)
  const srcDir = path.join(UPLOADS_ROOT, safeUser, safeConv)
  const dstDir = path.join(agentPath, "data", `conv-${safeConv}`)
  if (!existsSync(dstDir)) await mkdir(dstDir, { recursive: true })

  const relativePaths: string[] = []
  for (const att of attachments) {
    const safeName = sanitizeName(att.filename)
    const src = path.join(srcDir, safeName)
    const dst = path.join(dstDir, safeName)
    if (!existsSync(src)) {
      console.warn(`[ATTACH] source manquante: ${src}`)
      continue
    }
    try {
      await copyFile(src, dst)
      relativePaths.push(path.relative(agentPath, dst))
    } catch (err) {
      console.error(`[ATTACH] copie echouee ${safeName}:`, err)
    }
  }
  return relativePaths
}

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

// HOME / PATH pour claude : valeurs VM par defaut, surchargeables en local via .env
// (CLAUDE_HOME, CLAUDE_PATH_PREFIX) pour pouvoir lancer le chat en developpement.
const CLAUDE_HOME = process.env.CLAUDE_HOME || "/home/webmaster"
const CLAUDE_PATH_PREFIX = process.env.CLAUDE_PATH_PREFIX || "/home/webmaster/.npm-global/bin"

function callClaude(args: string[], agentPath: string): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = execFile(CLAUDE_BIN, args, {
      cwd: agentPath,
      timeout: 180000,
      maxBuffer: 1024 * 1024 * 5,
      env: {
        ...process.env,
        HOME: CLAUDE_HOME,
        PATH: `${CLAUDE_PATH_PREFIX}:${process.env.PATH}`,
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
  attachments?: AttachmentRef[]
}) {
  const { messageId, agentId, agentDir, message, userId, conversationId, attachments } = params
  const agentPath = `${AGENTS_BASE}/${agentDir}`

  try {
    let finalMessage = message
    if (attachments && attachments.length > 0) {
      const copied = await copyAttachmentsToAgent({ agentPath, attachments, userId, conversationId })
      if (copied.length > 0) {
        const lines = copied.map((p, i) => {
          const att = attachments[i]
          return `- ${att?.name || att?.filename || p} -> ${p}`
        }).join("\n")
        finalMessage = `${message}\n\n---\nPieces jointes fournies par l'utilisateur (utilise l'outil Read pour les ouvrir si pertinent) :\n${lines}`
        console.log(`[ATTACH] ${copied.length} fichier(s) copies pour ${agentDir}`)
      }
    }

    // Session lookup
    const sessionKey = getSessionKey(userId, agentId, conversationId)
    let session = activeSessions.get(sessionKey)

    // Lance une NOUVELLE session claude (toujours fiable).
    const startNewSession = async () => {
      const newSessionId = randomUUID()
      session = { sessionId: newSessionId, conversationId, lastActivity: Date.now() }
      activeSessions.set(sessionKey, session)
      console.log(`[DISPATCH] New session ${newSessionId} for ${agentDir}`)
      return callClaude(["-p", "--model", "haiku", "--session-id", newSessionId, finalMessage], agentPath)
    }

    let stdout: string
    let stderr: string

    if (session && !isSessionExpired(session)) {
      // Tentative de reprise ; si la session claude n'existe plus, on repart a neuf.
      try {
        console.log(`[DISPATCH] Resume session ${session.sessionId} for ${agentDir}`)
        const res = await callClaude(["-p", "--resume", session.sessionId, finalMessage], agentPath)
        stdout = res.stdout
        stderr = res.stderr
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err)
        if (/No conversation found|session/i.test(msg)) {
          console.warn(`[DISPATCH] Resume echoue (${session.sessionId}), nouvelle session: ${msg.substring(0, 120)}`)
          activeSessions.delete(sessionKey)
          const res = await startNewSession()
          stdout = res.stdout
          stderr = res.stderr
        } else {
          throw err
        }
      }
    } else {
      const res = await startNewSession()
      stdout = res.stdout
      stderr = res.stderr
    }

    if (stderr) console.error(`[DISPATCH] stderr ${agentDir}:`, stderr.substring(0, 200))

    if (session) {
      session.lastActivity = Date.now()
      activeSessions.set(sessionKey, session)
    }

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
        // Comptable
        "invoice", "monthly_report", "quarterly_report", "expense_analysis",
        "balance_sheet", "vat_check", "presentation", "client_deck",
        "pitch_deck", "contract", "certificate",
        // RH (Claire)
        "job_posting", "job_offer", "employment_contract", "hr_letter",
        "onboarding_plan", "interview_guide", "cv_analysis", "work_certificate",
        "pay_slip_summary", "hr_presentation",
        // Reseaux sociaux (Thomas)
        "content_calendar", "social_strategy", "social_report",
        // Email marketing (Sophie)
        "newsletter", "email_campaign", "marketing_plan", "audience_analysis",
        // Tresorerie (Marc)
        "cashflow_forecast", "treasury_dashboard", "treasury_report",
        // Investissements (Julie)
        "portfolio_analysis", "investment_report", "market_report",
        // Support client (Emma)
        "ticket_response", "faq_document", "response_template", "satisfaction_report",
        // Telephonique (Lea)
        "call_script", "voicemail_script", "callback_plan",
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

    // Image pour les posts sociaux : recuperation via Pexels (gratuit, libre de droit)
    // si l'agent demande une image (generate_image + image_prompt) et qu'aucune n'est deja fournie.
    if (
      typeof responseContent === "object" &&
      responseContent?.generate_image &&
      responseContent?.image_prompt &&
      !responseContent?.image_url
    ) {
      try {
        const { findImageUrl } = await import("@/lib/documents/pexels-service")
        const ref = await findImageUrl(String(responseContent.image_prompt))
        if (ref?.url) {
          responseContent.image_url = ref.url
          responseContent.image_credit = `Photo : ${ref.photographer} (Pexels)`
          console.log(`[API] Image Pexels social: ${responseContent.image_prompt} -> ${ref.url}`)
        } else {
          console.warn(`[API] Pexels: aucune image pour "${responseContent.image_prompt}"`)
        }
      } catch (err) {
        console.error("[API] Erreur image Pexels:", err)
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
        JSON.stringify({ agentId, agentDir, sessionId: session?.sessionId, status: "done" }),
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
    const { agentId, message, conversationId, userId, attachments } = body

    if (!agentId || !message) {
      return NextResponse.json({ error: "agentId et message requis" }, { status: 400 })
    }

    const safeAttachments: AttachmentRef[] = Array.isArray(attachments)
      ? attachments
          .filter((a) => a && typeof a.filename === "string")
          .map((a) => ({
            id: typeof a.id === "string" ? a.id : undefined,
            filename: String(a.filename),
            name: typeof a.name === "string" ? a.name : undefined,
            type: typeof a.type === "string" ? a.type : undefined,
            size: typeof a.size === "number" ? a.size : undefined,
          }))
      : []

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
    const userMeta = safeAttachments.length > 0 ? { attachments: safeAttachments } : null
    await pool.query(
      "INSERT INTO messages (id, conversation_id, role, content, metadata) VALUES ($1, $2, $3, $4, $5)",
      [userMsgId, convId, "user", message, userMeta ? JSON.stringify(userMeta) : null]
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
      attachments: safeAttachments,
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
