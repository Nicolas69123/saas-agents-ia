import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const MEDIA_DIR = join(process.cwd(), 'public', 'media')

// Ensure media directory exists
if (!existsSync(MEDIA_DIR)) {
  mkdirSync(MEDIA_DIR, { recursive: true })
}

// GET - List all media files
export async function GET() {
  try {
    const files = await readdir(MEDIA_DIR)
    const mediaFiles = await Promise.all(
      files
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .map(async (file) => {
          const filePath = join(MEDIA_DIR, file)
          const stats = await stat(filePath)
          return {
            id: file.replace(/\.[^/.]+$/, ''),
            name: file,
            url: `/media/${file}`,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
          }
        })
    )

    // Sort by creation date (newest first)
    mediaFiles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, files: mediaFiles })
  } catch (error) {
    console.error('Error listing media:', error)
    return NextResponse.json({ success: false, error: 'Failed to list media' }, { status: 500 })
  }
}

// POST - Save a new image from base64
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { base64, mimeType, name } = body

    if (!base64) {
      return NextResponse.json({ error: 'base64 data required' }, { status: 400 })
    }

    // Determine file extension from mime type
    const ext = mimeType?.includes('jpeg') || mimeType?.includes('jpg') ? 'jpg' : 'png'

    // Generate unique filename
    const timestamp = Date.now()
    const filename = name || `image-${timestamp}.${ext}`
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = join(MEDIA_DIR, safeName)

    // Convert base64 to buffer and save
    const buffer = Buffer.from(base64, 'base64')
    await writeFile(filePath, buffer)

    return NextResponse.json({
      success: true,
      file: {
        id: safeName.replace(/\.[^/.]+$/, ''),
        name: safeName,
        url: `/media/${safeName}`,
        size: buffer.length,
        createdAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Error saving media:', error)
    return NextResponse.json({ success: false, error: 'Failed to save media' }, { status: 500 })
  }
}

// DELETE - Remove a media file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('file')

    if (!filename) {
      return NextResponse.json({ error: 'filename required' }, { status: 400 })
    }

    // Security: ensure filename doesn't contain path traversal
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '')
    const filePath = join(MEDIA_DIR, safeName)

    // Check file exists and is within media directory
    if (!filePath.startsWith(MEDIA_DIR)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
    }

    await unlink(filePath)

    return NextResponse.json({ success: true, deleted: safeName })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete media' }, { status: 500 })
  }
}
