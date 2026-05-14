import { NextRequest, NextResponse } from "next/server"
import { readFile, stat } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const UPLOADS_ROOT = process.env.UPLOADS_ROOT || "/home/webmaster/saas-uploads"

const MIME_TYPES: Record<string, string> = {
  ".pdf": "application/pdf",
  ".csv": "text/csv",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".json": "application/json",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

function isPathInside(child: string, parent: string): boolean {
  const rel = path.relative(parent, child)
  return !rel.startsWith("..") && !path.isAbsolute(rel)
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; conversationId: string; filename: string } }
) {
  try {
    const userId = sanitizeName(decodeURIComponent(params.userId))
    const conversationId = sanitizeName(decodeURIComponent(params.conversationId))
    const filename = sanitizeName(decodeURIComponent(params.filename))

    const fullPath = path.join(UPLOADS_ROOT, userId, conversationId, filename)

    if (!isPathInside(fullPath, UPLOADS_ROOT)) {
      return NextResponse.json({ error: "Chemin invalide" }, { status: 400 })
    }
    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 })
    }

    const stats = await stat(fullPath)
    const buffer = await readFile(fullPath)
    const ext = path.extname(filename).toLowerCase()
    const mimeType = MIME_TYPES[ext] || "application/octet-stream"

    const originalName = filename.replace(/^\d+-/, "")
    const isInline = request.nextUrl.searchParams.get("download") !== "1"
    const disposition = isInline ? "inline" : "attachment"

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": stats.size.toString(),
        "Content-Disposition": `${disposition}; filename="${originalName}"`,
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch (err) {
    console.error("[UPLOADS] Serve error:", err)
    return NextResponse.json({ error: "Erreur lecture fichier" }, { status: 500 })
  }
}
