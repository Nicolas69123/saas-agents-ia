import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agentId, message, conversationId } = body

    if (!agentId || !message) {
      return NextResponse.json(
        { error: 'agentId et message requis' },
        { status: 400 }
      )
    }

    // Importer la configuration des webhooks n8n
    const { getWebhookUrl, hasActiveWebhook } = await import('@/config/n8n-webhooks')

    let agentResponse = `Merci pour votre message ! Je traite votre demande : "${message}"\n\n(Agent en cours de configuration)`

    // Appeler le webhook n8n si disponible et actif
    if (hasActiveWebhook(agentId)) {
      const webhookUrl = getWebhookUrl(agentId)

      if (webhookUrl) {
        try {
          const n8nResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message,
              agentId,
              conversationId: conversationId || 'new'
            }),
            signal: AbortSignal.timeout(30000) // Timeout 30 secondes
          })

          if (n8nResponse.ok) {
            const data = await n8nResponse.json()
            agentResponse = data.response || data.output || JSON.stringify(data)
          } else {
            console.error(`Webhook n8n erreur ${n8nResponse.status}:`, await n8nResponse.text())
            agentResponse = `Erreur de connexion au workflow n8n (${n8nResponse.status})`
          }
        } catch (error) {
          console.error('Erreur webhook n8n:', error)
          agentResponse = `Erreur: Le workflow n8n n'a pas repondu. Verifiez qu'il est actif.`
        }
      }
    } else {
      agentResponse = `L'agent "${agentId}" n'a pas de workflow actif. Activez-le dans n8n.`
    }

    return NextResponse.json({
      success: true,
      agentMessage: {
        content: agentResponse
      }
    })

  } catch (error) {
    console.error('Erreur API chat:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET - Les conversations sont stockees en localStorage cote client
export async function GET() {
  return NextResponse.json({
    message: 'Les conversations sont gerees cote client (localStorage)'
  })
}
