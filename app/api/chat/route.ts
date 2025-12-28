import { NextRequest, NextResponse } from 'next/server'

// Configuration du webhook n8n
const N8N_BASE_URL = process.env.N8N_URL || 'http://localhost:5678'

// Workflow n8n par agent (celui qui fonctionne)
const webhookConfigs: Record<string, { url: string; active: boolean }> = {
  'reseaux-sociaux': {
    url: `${N8N_BASE_URL}/webhook/4bd6ad35-7ef0-43af-9a78-d14e818abb10/chat`,
    active: true,
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, sessionId, history } = body

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'agentId et message requis' },
        { status: 400 }
      )
    }

    const config = webhookConfigs[agentId]

    // Si webhook n8n actif, l'appeler
    if (config?.active) {
      try {
        const formattedHistory = history?.map((msg: { role: string; content: string }) =>
          `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`
        ).join('\n') || ''

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
            history: formattedHistory,
            historyArray: history || [],
          }),
          signal: AbortSignal.timeout(60000),
        })

        if (n8nResponse.ok) {
          const data = await n8nResponse.json()
          let response = data.response || data.output || data.text || data.message

          let parsedContent = null

          // Si response est déjà un objet (n8n le parse automatiquement)
          if (typeof response === 'object' && response !== null) {
            parsedContent = response
          } else if (typeof response === 'string') {
            try {
              let jsonStr = response
              const jsonMatch = response.match(/```json\n?([\s\S]*?)```/)
              if (jsonMatch) jsonStr = jsonMatch[1]
              parsedContent = JSON.parse(jsonStr.trim())
            } catch {
              // Pas de JSON, réponse texte normale
            }
          }

          // Si contenu structuré avec image à générer
          if (parsedContent?.type_contenu) {
            const shouldGenerateImage =
              parsedContent.type_contenu === 'image' ||
              (parsedContent.type_contenu === 'social_post' && parsedContent.generate_image)

            const imagePrompt = parsedContent.prompt_ameliore || parsedContent.image_prompt

            if (shouldGenerateImage && imagePrompt) {
              console.log('Generating image with prompt:', imagePrompt.slice(0, 100))
              try {
                const geminiKey = process.env.GEMINI_API_KEY || ''
                const geminiResp = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${geminiKey}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ parts: [{ text: imagePrompt }] }],
                      generationConfig: {
                        responseModalities: ['IMAGE', 'TEXT']
                      }
                    }),
                    signal: AbortSignal.timeout(60000),
                  }
                )

                if (geminiResp.ok) {
                  const imgData = await geminiResp.json()
                  const parts = imgData.candidates?.[0]?.content?.parts || []
                  for (const part of parts) {
                    if (part.inlineData) {
                      parsedContent.image_base64 = part.inlineData.data
                      parsedContent.mimeType = part.inlineData.mimeType || 'image/png'
                      parsedContent.image_ready = true
                      console.log('Image generated successfully!')
                      break
                    }
                  }
                } else {
                  const errorText = await geminiResp.text()
                  console.error('Gemini API error:', geminiResp.status, errorText)
                }
              } catch (err) {
                console.error('Gemini image error:', err)
              }
            }

            return NextResponse.json({
              success: true,
              response: parsedContent,
              agentId,
            })
          }

          // Fallback: retourner la réponse brute
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

    // Dernier fallback
    return NextResponse.json({
      success: true,
      response: `Je traite votre demande : "${message}"\n\n(Agent en cours de configuration)`,
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
