import { NextRequest, NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId requis' }, { status: 400 })
    }

    // Lire le fichier créé par n8n
    const filePath = `/tmp/n8n-image-${sessionId}.json`

    if (!existsSync(filePath)) {
      return NextResponse.json({
        ready: false,
        image: null,
        message: 'Image en cours de génération...'
      })
    }

    // Lire les données de l'image
    const imageData = JSON.parse(readFileSync(filePath, 'utf-8'))

    return NextResponse.json({
      ready: true,
      image_base64: imageData.base64,
      mimeType: imageData.mimeType,
      description: imageData.description,
      hashtags: imageData.hashtags
    })

  } catch (error) {
    console.error('Erreur get-image:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
