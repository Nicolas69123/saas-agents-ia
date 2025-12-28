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
          let response = data.response || data.output || data.text || data.message

          // Parser pour détecter une demande d'image
          let parsedContent = null
          try {
            let jsonStr = response
            const jsonMatch = response.match(/```json\n?([\s\S]*?)```/)
            if (jsonMatch) jsonStr = jsonMatch[1]
            parsedContent = JSON.parse(jsonStr.trim())
          } catch {}

          // Si contenu structuré détecté
          if (parsedContent?.type_contenu) {
            // Si image demandée, la générer avec Gemini 2.5 Flash Image
            if (parsedContent.type_contenu === 'image') {
              try {
                const geminiKey = process.env.GEMINI_API_KEY || ''
                const geminiResp = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-goog-api-key': geminiKey
                    },
                    body: JSON.stringify({
                      contents: [{
                        parts: [{ text: parsedContent.prompt_ameliore }]
                      }],
                      generationConfig: {
                        responseModalities: ['IMAGE']
                      }
                    }),
                    signal: AbortSignal.timeout(60000),
                  }
                )

                if (geminiResp.ok) {
                  const imgData = await geminiResp.json()
                  // Extraire l'image base64 de la réponse Gemini
                  const imagePart = imgData.candidates?.[0]?.content?.parts?.find(
                    (p: { inlineData?: { data: string; mimeType: string } }) => p.inlineData
                  )
                  if (imagePart?.inlineData) {
                    parsedContent.image_base64 = imagePart.inlineData.data
                    parsedContent.mimeType = imagePart.inlineData.mimeType
                    parsedContent.image_ready = true
                  }
                } else {
                  console.error('Gemini API error:', await geminiResp.text())
                }
              } catch (err) {
                console.error('Gemini image error:', err)
              }
            }

            // Retourner l'objet structuré pour tous les types (texte, image, video, etc.)
            return NextResponse.json({
              success: true,
              response: parsedContent,
              agentId,
            })
          }

          // Fallback: retourner la réponse brute si pas de JSON structuré
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
