import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, readdir, unlink, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const AGENTS_BASE = process.env.AGENTS_BASE || "/home/webmaster/omnia-agents"
const COMPANY_DATA_DIR = process.env.COMPANY_DATA_DIR || path.join(AGENTS_BASE, "shared-data")

const ALLOWED_EXTENSIONS = [".pdf", ".csv", ".xlsx", ".xls", ".json", ".txt", ".doc", ".docx", ".png", ".jpg", ".jpeg"]
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function GET() {
  try {
    if (!existsSync(COMPANY_DATA_DIR)) {
      return NextResponse.json({ files: [] })
    }

    const entries = await readdir(COMPANY_DATA_DIR)
    const files = await Promise.all(
      entries.map(async (name) => {
        const filePath = path.join(COMPANY_DATA_DIR, name)
        const stats = await stat(filePath)
        return {
          name,
          size: stats.size,
          uploadedAt: stats.mtime.toISOString(),
        }
      })
    )

    return NextResponse.json({ files })
  } catch (error) {
    console.error("[COMPANY] Erreur lecture fichiers:", error)
    return NextResponse.json({ files: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const agentId = formData.get("agentId") as string | null

    if (!file) {
      return NextResponse.json({ error: "Fichier requis" }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: `Extension non autorisee: ${ext}. Autorisees: ${ALLOWED_EXTENSIONS.join(", ")}` },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Fichier trop volumineux (max 10 MB)" },
        { status: 400 }
      )
    }

    const targetDir = agentId
      ? path.join(AGENTS_BASE, `agent-${agentId}`, "data")
      : COMPANY_DATA_DIR

    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
    const filePath = path.join(targetDir, safeName)

    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      file: {
        name: safeName,
        size: file.size,
        targetAgent: agentId || "shared",
      },
    })
  } catch (error) {
    console.error("[COMPANY] Erreur upload:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { filename } = await request.json()

    if (!filename) {
      return NextResponse.json({ error: "Nom de fichier requis" }, { status: 400 })
    }

    const safeName = path.basename(filename)
    const filePath = path.join(COMPANY_DATA_DIR, safeName)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "Fichier non trouve" }, { status: 404 })
    }

    await unlink(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[COMPANY] Erreur suppression:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    )
  }
}
