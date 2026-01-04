import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

// Configuration du webhook n8n
const N8N_BASE_URL = process.env.N8N_URL || 'http://localhost:5678'

// Workflow n8n - Agent Marketing v2 (Smart Labels)
const webhookConfigs: Record<string, { url: string; active: boolean }> = {
  'reseaux-sociaux': {
    url: `${N8N_BASE_URL}/webhook/marketing-v2`,
    active: true,
  },
  'ressources-humaines': {
    url: `${N8N_BASE_URL}/webhook/rh`,
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

          // Si contenu structuré avec media à générer
          if (parsedContent?.type_contenu) {
            const geminiKey = process.env.GEMINI_API_KEY || ''

            // Gérer la génération vidéo (polling asynchrone)
            if (parsedContent.generate_video && parsedContent.poll_url) {
              console.log('Video generation started, polling...', parsedContent.video_operation_name)
              try {
                // Polling jusqu'à ce que la vidéo soit prête (max 2 min)
                const maxAttempts = 24 // 24 * 5s = 2 minutes
                let attempts = 0
                let videoReady = false

                while (attempts < maxAttempts && !videoReady) {
                  await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5s
                  attempts++
                  console.log(`Polling video status... attempt ${attempts}/${maxAttempts}`)

                  const pollResp = await fetch(parsedContent.poll_url, {
                    headers: { 'x-goog-api-key': geminiKey },
                    signal: AbortSignal.timeout(30000),
                  })

                  if (pollResp.ok) {
                    const pollData = await pollResp.json()
                    if (pollData.done) {
                      const videoUri = pollData.response?.generateVideoResponse?.generatedSamples?.[0]?.video?.uri
                      if (videoUri) {
                        console.log('Video generated successfully! Downloading...')

                        // Télécharger la vidéo depuis Gemini
                        try {
                          const videoResp = await fetch(videoUri, {
                            headers: { 'x-goog-api-key': geminiKey },
                            signal: AbortSignal.timeout(120000), // 2 min timeout pour gros fichiers
                          })

                          if (videoResp.ok) {
                            const videoBuffer = await videoResp.arrayBuffer()
                            const videoBytes = new Uint8Array(videoBuffer)

                            // Créer le dossier media s'il n'existe pas
                            const mediaDir = path.join(process.cwd(), 'public', 'media')
                            if (!existsSync(mediaDir)) {
                              await mkdir(mediaDir, { recursive: true })
                            }

                            // Sauvegarder avec un nom unique
                            const filename = `video-${Date.now()}.mp4`
                            const filepath = path.join(mediaDir, filename)
                            await writeFile(filepath, videoBytes)

                            parsedContent.video_local_url = `/media/${filename}`
                            parsedContent.video_ready = true
                            parsedContent.video_status = 'completed'
                            videoReady = true
                            console.log('Video saved locally:', parsedContent.video_local_url)
                          } else {
                            console.error('Failed to download video:', videoResp.status)
                            parsedContent.video_uri = videoUri
                            parsedContent.video_status = 'download_failed'
                          }
                        } catch (downloadErr) {
                          console.error('Video download error:', downloadErr)
                          parsedContent.video_uri = videoUri
                          parsedContent.video_status = 'download_error'
                        }
                      }
                    }
                  }
                }

                if (!videoReady) {
                  console.log('Video generation timeout, returning partial response')
                  parsedContent.video_status = 'timeout'
                }
              } catch (err) {
                console.error('Video polling error:', err)
                parsedContent.video_status = 'error'
              }
            }

            // Si n8n a déjà généré une image base64, la sauvegarder sur le serveur
            if (parsedContent.image_base64 && parsedContent.image_ready) {
              console.log('Saving n8n-generated image to server...')
              try {
                const imageBuffer = Buffer.from(parsedContent.image_base64, 'base64')
                const ext = parsedContent.mimeType?.includes('jpeg') ? 'jpg' : 'png'
                const filename = `generated-${Date.now()}.${ext}`
                const filepath = path.join(process.cwd(), 'public', 'media', filename)

                const mediaDir = path.join(process.cwd(), 'public', 'media')
                if (!existsSync(mediaDir)) {
                  await mkdir(mediaDir, { recursive: true })
                }

                await writeFile(filepath, imageBuffer)

                // Remplacer base64 par l'URL
                parsedContent.image_url = `/media/${filename}`
                delete parsedContent.image_base64  // Ne plus envoyer le base64
                console.log('Image saved from n8n:', parsedContent.image_url)
              } catch (saveErr) {
                console.error('Error saving n8n image:', saveErr)
                // Garder image_base64 comme fallback
              }
            }

            // Gérer la génération d'image (si pas déjà générée par n8n)
            const shouldGenerateImage =
              parsedContent.type_contenu === 'image' ||
              (parsedContent.type_contenu === 'social_post' && parsedContent.generate_image)

            const imagePrompt = parsedContent.prompt_ameliore || parsedContent.image_prompt

            if (shouldGenerateImage && imagePrompt && !parsedContent.image_ready && !parsedContent.image_url) {
              console.log('Generating image with prompt:', imagePrompt.slice(0, 100))
              try {
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
                      // Sauvegarder l'image directement sur le serveur
                      const imageBuffer = Buffer.from(part.inlineData.data, 'base64')
                      const ext = part.inlineData.mimeType?.includes('jpeg') ? 'jpg' : 'png'
                      const filename = `generated-${Date.now()}.${ext}`
                      const filepath = path.join(process.cwd(), 'public', 'media', filename)

                      // Créer le dossier media s'il n'existe pas
                      const mediaDir = path.join(process.cwd(), 'public', 'media')
                      if (!existsSync(mediaDir)) {
                        await mkdir(mediaDir, { recursive: true })
                      }

                      await writeFile(filepath, imageBuffer)

                      // Retourner l'URL au lieu du base64
                      parsedContent.image_url = `/media/${filename}`
                      parsedContent.mimeType = part.inlineData.mimeType || 'image/png'
                      parsedContent.image_ready = true
                      console.log('Image saved directly:', parsedContent.image_url)
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

          // Gérer les actions de l'Agent RH
          if (agentId === 'ressources-humaines' && data.action && data.action !== 'none') {
            const action = data.action
            const params = data.params || {}
            let actionResult = null
            let actionSuccess = false

            console.log(`[Agent RH] Action détectée: ${action}`, params)

            // Pour l'instant, on retourne les infos de l'action pour que le frontend puisse les afficher
            // L'exécution réelle des actions Google sera ajoutée avec les tokens OAuth
            switch (action) {
              case 'schedule_interview':
                actionResult = {
                  type: 'calendar_event',
                  candidat: params.candidat,
                  poste: params.poste,
                  date: params.date,
                  heure: params.heure,
                  message: `📅 Entretien planifié pour ${params.candidat} - ${params.poste}\n📆 ${params.date} à ${params.heure}`,
                  status: 'pending_oauth' // En attente d'implémentation OAuth côté serveur
                }
                actionSuccess = true
                break

              case 'send_email':
                actionResult = {
                  type: 'email',
                  destinataire: params.destinataire,
                  sujet: params.sujet,
                  contenu: params.contenu,
                  message: `✉️ Email préparé pour ${params.destinataire}\n📝 Sujet: ${params.sujet}`,
                  status: 'pending_oauth'
                }
                actionSuccess = true
                break

              case 'search_cv':
                actionResult = {
                  type: 'drive_search',
                  criteres: params.criteres,
                  message: `🔍 Recherche de CV avec: "${params.criteres}"`,
                  status: 'pending_oauth'
                }
                actionSuccess = true
                break

              case 'list_candidates':
                actionResult = {
                  type: 'sheets_read',
                  message: `📋 Liste des candidats demandée`,
                  status: 'pending_oauth'
                }
                actionSuccess = true
                break

              default:
                actionResult = { type: 'unknown', action }
            }

            return NextResponse.json({
              success: true,
              response: response,
              action,
              params,
              actionResult,
              actionSuccess,
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
