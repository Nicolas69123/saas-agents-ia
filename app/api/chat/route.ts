import { NextRequest, NextResponse } from "next/server"
import { execFile } from "child_process"
import { promisify } from "util"
import { writeFile, mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { Pool } from "pg"

const execFileAsync = promisify(execFile)

// PostgreSQL
const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "saas_agents_ia_prod",
  user: "saas_agents_ia_user",
  password: "Hubble:2001",
})

// Mapping agentId du frontend → répertoire agent
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

const AGENTS_BASE = "/home/webmaster/omnia-agents"
const CLAUDE_BIN = "/home/webmaster/.npm-global/bin/claude"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, history, conversationId } = body

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "agentId et message requis" },
        { status: 400 }
      )
    }

    const agentDir = AGENT_DIRS[agentId]
    if (!agentDir) {
      return NextResponse.json(
        { error: `Agent inconnu: ${agentId}` },
        { status: 400 }
      )
    }

    const agentPath = `${AGENTS_BASE}/${agentDir}`

    // Créer ou récupérer la conversation
    let convId = conversationId
    if (!convId) {
      convId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      await pool.query(
        "INSERT INTO conversations (id, agent_id, title) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING",
        [convId, agentId, message.substring(0, 50)]
      )
    }

    // Sauvegarder le message utilisateur
    const userMsgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    await pool.query(
      "INSERT INTO messages (id, conversation_id, role, content) VALUES ($1, $2, $3, $4)",
      [userMsgId, convId, "user", message]
    )

    // Construire le prompt avec historique
    let fullPrompt = ""
    if (history && history.length > 0) {
      const formattedHistory = history
        .slice(-6)
        .map((msg: { role: string; content: string }) =>
          `${msg.role === "user" ? "Utilisateur" : "Assistant"}: ${msg.content}`
        )
        .join("\n")
      fullPrompt = `Historique de conversation:\n${formattedHistory}\n\nNouveau message de l utilisateur: ${message}`
    } else {
      fullPrompt = message
    }

    console.log(`[AGENT] Appel ${agentDir} avec: ${message.substring(0, 100)}...`)

    // Appeler claude -p
    const { stdout, stderr } = await execFileAsync(
      CLAUDE_BIN,
      ["-p", "--model", "haiku", fullPrompt],
      {
        cwd: agentPath,
        timeout: 120000,
        maxBuffer: 1024 * 1024 * 5,
        env: {
          ...process.env,
          HOME: "/home/webmaster",
          PATH: `/home/webmaster/.npm-global/bin:${process.env.PATH}`,
        },
      }
    )

    if (stderr) {
      console.error(`[AGENT] stderr ${agentDir}:`, stderr.substring(0, 200))
    }

    const rawResponse = stdout.trim()
    console.log(`[AGENT] Réponse ${agentDir}: ${rawResponse.substring(0, 200)}...`)

    // Parser le JSON si possible
    let parsedContent = null
    try {
      const jsonMatch = rawResponse.match(/```json\n?([\s\S]*?)```/)
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawResponse
      parsedContent = JSON.parse(jsonStr)
    } catch {
      parsedContent = null
    }

    // Sauvegarder image si base64
    if (parsedContent?.image_base64) {
      try {
        const imageBuffer = Buffer.from(parsedContent.image_base64, "base64")
        const ext = parsedContent.mimeType?.includes("jpeg") ? "jpg" : "png"
        const filename = `generated-${Date.now()}.${ext}`
        const mediaDir = path.join(process.cwd(), "public", "media")
        if (!existsSync(mediaDir)) {
          await mkdir(mediaDir, { recursive: true })
        }
        await writeFile(path.join(mediaDir, filename), imageBuffer)
        parsedContent.image_url = `/media/${filename}`
        delete parsedContent.image_base64
      } catch (err) {
        console.error("[AGENT] Erreur sauvegarde image:", err)
      }
    }

    const responseContent = parsedContent || rawResponse

    // Sauvegarder la réponse de l agent
    const assistantMsgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const responseText = typeof responseContent === "string" ? responseContent : JSON.stringify(responseContent)
    await pool.query(
      "INSERT INTO messages (id, conversation_id, role, content, metadata) VALUES ($1, $2, $3, $4, $5)",
      [assistantMsgId, convId, "assistant", responseText, JSON.stringify({ agentId, agentDir })]
    )

    // Mettre à jour updated_at de la conversation
    await pool.query(
      "UPDATE conversations SET updated_at = NOW() WHERE id = $1",
      [convId]
    )

    return NextResponse.json({
      success: true,
      response: responseContent,
      agentId,
      conversationId: convId,
    })
  } catch (error: unknown) {
    const err = error as Error & { stderr?: string }
    console.error("[AGENT] Erreur:", err.message)

    return NextResponse.json({
      success: true,
      response: `L agent est en cours de configuration.\n\n(Erreur: ${err.message?.substring(0, 100)})`,
      agentId: "fallback",
    })
  }
}
