import { NextRequest, NextResponse } from 'next/server'

// Configuration des webhooks n8n
const N8N_BASE_URL = process.env.N8N_URL || 'http://localhost:5678'

const webhookConfigs: Record<string, { url: string; active: boolean }> = {
  'reseaux-sociaux': {
    // Chat Trigger - répond immédiatement, images générées en async
    url: `${N8N_BASE_URL}/webhook/4bd6ad35-7ef0-43af-9a78-d14e818abb10/chat`,
    active: true,
  },
  'comptable': {
    url: `${N8N_BASE_URL}/webhook/comptable`,
    active: false,
  },
  // Ajouter d'autres agents ici
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, sessionId } = body

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'agentId et message requis' },
        { status: 400 }
      )
    }

    const config = webhookConfigs[agentId]

    // Si webhook actif, appeler n8n
    if (config?.active) {
      try {
        const n8nResponse = await fetch(config.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId: sessionId || `session-${Date.now()}`,
            chatInput: message,
            message: message,
            agentId,
          }),
          // Timeout plus long pour la génération d'images (60s)
          signal: AbortSignal.timeout(60000),
        })

        if (n8nResponse.ok) {
          const data = await n8nResponse.json()

          // Le workflow peut retourner différents formats selon le type de contenu
          // Pour les images: { response, type_contenu, image_base64, mimeType, description }
          // Pour les conversations: { response }

          let response = data.response || data.output || data.text || data.message

          // Si c'est un objet avec type_contenu, on retourne les données complètes
          if (data.type_contenu) {
            return NextResponse.json({
              success: true,
              response: JSON.stringify(data), // Le frontend parsera le JSON
              agentId,
            })
          }

          return NextResponse.json({
            success: true,
            response: response,
            agentId,
          })
        } else {
          console.error(`Webhook n8n erreur ${n8nResponse.status}`)
        }
      } catch (error) {
        console.error('Erreur webhook n8n:', error)
      }
    }

    // Fallback si webhook non disponible
    return NextResponse.json({
      success: true,
      response: `Je traite votre demande : "${message}"\n\n(Agent en cours d'intégration)`,
      agentId,
    })

  } catch (error) {
    console.error('Erreur API chat:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
