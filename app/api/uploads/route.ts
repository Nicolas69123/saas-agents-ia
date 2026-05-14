import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises"
import { existsSync } from "fs"
import path from "path"

const UPLOADS_ROOT = process.env.UPLOADS_ROOT || "/home/webmaster/saas-uploads"

const ALLOWED_EXTS = [".pdf", ".csv", ".xlsx", ".xls", ".json", ".txt", ".md", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".gif"]
const MAX_FILE_SIZE = 20 * 1024 * 1024

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

function isPathInside(child: string, parent: string): boolean {
  const rel = path.relative(parent, child)
  return !rel.startsWith("..") && !path.isAbsolute(rel)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const conversationId = formData.get("conversationId") as string | null
    const userId = (formData.get("userId") as string | null) || "anonymous"

    if (!file) return NextResponse.json({ error: "Fichier requis" }, { status: 400 })
    if (!conversationId) return NextResponse.json({ error: "conversationId requis" }, { status: 400 })

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ error: `Extension non autorisee: ${ext}` }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Fichier trop volumineux (max 20 Mo)" }, { status: 400 })
    }

    const safeUser = sanitizeName(userId)
    const safeConv = sanitizeName(conversationId)
    const dir = path.join(UPLOADS_ROOT, safeUser, safeConv)
    if (!existsSync(dir)) await mkdir(dir, { recursive: true })

    const safeFilename = sanitizeName(file.name)
    const stamped = `${Date.now()}-${safeFilename}`
    const fullPath = path.join(dir, stamped)
    if (!isPathInside(fullPath, UPLOADS_ROOT)) {
      return NextResponse.json({ error: "Chemin invalide" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(fullPath, buffer)

    return NextResponse.json({
      success: true,
      id: stamped,
      name: file.name,
      filename: stamped,
      size: file.size,
      type: file.type,
      url: `/api/uploads/${encodeURIComponent(safeUser)}/${encodeURIComponent(safeConv)}/${encodeURIComponent(stamped)}`,
    })
  } catch (err) {
    console.error("[UPLOADS] POST error:", err)
    return NextResponse.json({ error: "Erreur upload" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || "anonymous"
    const conversationId = request.nextUrl.searchParams.get("conversationId")
    if (!conversationId) return NextResponse.json({ error: "conversationId requis" }, { status: 400 })

    const dir = path.join(UPLOADS_ROOT, sanitizeName(userId), sanitizeName(conversationId))
    if (!existsSync(dir)) return NextResponse.json({ files: [] })

    const entries = await readdir(dir)
    const files = await Promise.all(entries.map(async (name) => {
      const stats = await stat(path.join(dir, name))
      const originalName = name.replace(/^\d+-/, "")
      return {
        id: name,
        filename: name,
        name: originalName,
        size: stats.size,
        uploadedAt: stats.mtime.toISOString(),
        url: `/api/uploads/${encodeURIComponent(sanitizeName(userId))}/${encodeURIComponent(sanitizeName(conversationId))}/${encodeURIComponent(name)}`,
      }
    }))

    return NextResponse.json({ files })
  } catch (err) {
    console.error("[UPLOADS] GET error:", err)
    return NextResponse.json({ files: [] })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, conversationId, filename } = await request.json()
    if (!conversationId || !filename) {
      return NextResponse.json({ error: "params requis" }, { status: 400 })
    }
    const fullPath = path.join(
      UPLOADS_ROOT,
      sanitizeName(userId || "anonymous"),
      sanitizeName(conversationId),
      sanitizeName(filename)
    )
    if (!isPathInside(fullPath, UPLOADS_ROOT)) {
      return NextResponse.json({ error: "Chemin invalide" }, { status: 400 })
    }
    if (existsSync(fullPath)) await unlink(fullPath)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[UPLOADS] DELETE error:", err)
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 })
  }
}
