import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import path from "path"

const DOCS_DIR = path.join(process.cwd(), "public", "documents")

const MIME_BY_EXT: Record<string, string> = {
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".pdf": "application/pdf",
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = decodeURIComponent(params.filename)
    const safeName = path.basename(filename)
    const filePath = path.join(DOCS_DIR, safeName)

    if (!filePath.startsWith(DOCS_DIR)) {
      return NextResponse.json({ error: "Acces interdit" }, { status: 403 })
    }

    const stats = await stat(filePath).catch(() => null)
    if (!stats || !stats.isFile()) {
      return NextResponse.json({ error: "Fichier non trouve" }, { status: 404 })
    }

    const buffer = await readFile(filePath)
    const ext = path.extname(safeName).toLowerCase()
    const mimeType = MIME_BY_EXT[ext] || "application/octet-stream"

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "private, max-age=0, must-revalidate",
        "Content-Disposition": `inline; filename="${safeName}"`,
      },
    })
  } catch (error) {
    console.error("[DOCUMENTS] Erreur lecture:", error)
    return NextResponse.json({ error: "Erreur lecture fichier" }, { status: 500 })
  }
}
