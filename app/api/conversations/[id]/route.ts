import { NextRequest, NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  host: process.env.PG_HOST || "localhost",
  port: parseInt(process.env.PG_PORT || "5432"),
  database: process.env.PG_DATABASE || "saas_agents_ia_prod",
  user: process.env.PG_USER || "saas_agents_ia_user",
  password: process.env.PG_PASSWORD || "",
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const convId = params.id
    if (!convId) {
      return NextResponse.json({ error: "id requis" }, { status: 400 })
    }

    const conv = await pool.query(
      "SELECT id, agent_id, user_id, title, created_at, updated_at FROM conversations WHERE id = $1",
      [convId]
    )

    if (conv.rows.length === 0) {
      return NextResponse.json({ error: "Conversation non trouvee" }, { status: 404 })
    }

    const messages = await pool.query(
      `SELECT id, role, content, metadata, created_at
       FROM messages
       WHERE conversation_id = $1
       ORDER BY created_at ASC`,
      [convId]
    )

    const parsedMessages = messages.rows.map((row) => {
      const meta = row.metadata || {}
      const status = meta.status || "done"
      let parsedContent: string | Record<string, unknown> = row.content

      if (row.role === "assistant" && status === "done" && row.content) {
        try {
          parsedContent = JSON.parse(row.content)
        } catch {
          // keep as string
        }
      }

      return {
        id: row.id,
        role: row.role,
        content: parsedContent,
        status,
        error: meta.error,
        attachments: Array.isArray(meta.attachments) ? meta.attachments : undefined,
        actions: Array.isArray(meta.actions) ? meta.actions : undefined,
        createdAt: row.created_at,
      }
    })

    return NextResponse.json({
      conversation: conv.rows[0],
      messages: parsedMessages,
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("[CONV] GET error:", err.message)
    return NextResponse.json({ error: err.message?.substring(0, 200) }, { status: 500 })
  }
}
