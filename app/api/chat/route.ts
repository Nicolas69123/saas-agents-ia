import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Trouver ou créer la conversation
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: true }
      })
    }

    if (!conversation) {
      // Créer nouvelle conversation
      conversation = await prisma.conversation.create({
        data: {
          title: message.slice(0, 50),
          agentId,
          userId: null, // TODO: Ajouter auth plus tard
        },
        include: { messages: true }
      })

      // Ajouter message de bienvenue de l'agent
      const agent = await prisma.agent.findUnique({
        where: { agentId }
      })

      if (agent) {
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            role: 'agent',
            content: agent.welcomeMessage
          }
        })
      }
    }

    // Sauvegarder le message utilisateur
    const userMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'user',
        content: message
      }
    })

    // Importer la configuration des webhooks n8n
    const { getWebhookUrl, hasActiveWebhook } = await import('@/config/n8n-webhooks')

    let agentResponse = `Merci pour votre message ! Je traite votre demande : "${message}"\n\n(Agent en cours d'intégration)`

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
              conversationId: conversation.id
            }),
            signal: AbortSignal.timeout(10000) // Timeout 10 secondes
          })

          if (n8nResponse.ok) {
            const data = await n8nResponse.json()
            agentResponse = data.response || agentResponse
          } else {
            console.error(`Webhook n8n erreur ${n8nResponse.status}:`, await n8nResponse.text())
          }
        } catch (error) {
          console.error('Erreur webhook n8n:', error)
          // Fallback sur réponse par défaut
        }
      }
    }

    // Sauvegarder la réponse de l'agent
    const agentMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'agent',
        content: agentResponse
      }
    })

    // Récupérer la conversation complète
    const updatedConversation = await prisma.conversation.findUnique({
      where: { id: conversation.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    return NextResponse.json({
      success: true,
      conversation: updatedConversation,
      userMessage,
      agentMessage
    })

  } catch (error) {
    console.error('Erreur API chat:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer une conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('conversationId')

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId requis' },
        { status: 400 }
      )
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({ conversation })

  } catch (error) {
    console.error('Erreur API chat GET:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
