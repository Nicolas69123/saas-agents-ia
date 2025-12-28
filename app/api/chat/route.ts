import { NextRequest, NextResponse } from 'next/server'

// Configuration n8n - Workflow complet (tout géré par n8n)
const N8N_BASE_URL = process.env.N8N_URL || 'http://localhost:5678'
const WEBHOOK_URL = `${N8N_BASE_URL}/webhook/marketing-agent`

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

    // Formater l'historique pour le contexte
    const formattedHistory = history?.map((msg: { role: string; content: string }) =>
      `${msg.role === 'user' ? 'Utilisateur' : 'Assistant'}: ${msg.content}`
    ).join('\n') || ''

    try {
      console.log('🔵 Calling n8n webhook:', WEBHOOK_URL)
      console.log('📝 Message:', message)

      const n8nResponse = await fetch(WEBHOOK_URL, {
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
        // Timeout long pour génération image/video (2 minutes)
        signal: AbortSignal.timeout(120000),
      })

      console.log('📥 n8n response status:', n8nResponse.status)

      if (n8nResponse.ok) {
        const data = await n8nResponse.json()
        console.log('✅ n8n response received, keys:', Object.keys(data))

        // n8n retourne { response: { ... } }
        let response = data.response || data.output || data

        console.log('📦 Response type:', typeof response)

        // n8n gère tout (texte + image)
        // Retourner directement la réponse
        return NextResponse.json({
          success: true,
          response: response,
          agentId,
        })
      } else {
        const errorText = await n8nResponse.text()
        console.error('❌ n8n webhook error:', n8nResponse.status, errorText)

        return NextResponse.json({
          success: false,
          response: `Erreur webhook n8n (${n8nResponse.status})`,
          agentId,
        }, { status: n8nResponse.status })
      }
    } catch (error) {
      console.error('❌ Erreur webhook n8n:', error)

      return NextResponse.json({
        success: false,
        response: `Erreur de connexion au workflow n8n: ${error}`,
        agentId,
      }, { status: 500 })
    }

  } catch (error) {
    console.error('❌ Erreur API chat:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
