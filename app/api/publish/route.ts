import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const N8N_URL = process.env.N8N_URL || 'http://localhost:5678'
const DATA_DIR = join(process.cwd(), 'data')
const POSTS_FILE = join(DATA_DIR, 'social-posts.json')

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

interface SocialPost {
  id: string
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'
  content: { text: string; hashtags?: string[] }
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  externalId?: string
  publishedAt?: string
  createdAt: string
}

async function loadPosts(): Promise<SocialPost[]> {
  try {
    if (!existsSync(POSTS_FILE)) return []
    const data = await readFile(POSTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch { return [] }
}

async function savePosts(posts: SocialPost[]): Promise<void> {
  await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
}

interface PublishRequest {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'
  content: {
    text: string
    hashtags?: string[]
    hook?: string
    cta?: string
  }
  imageUrl?: string
  videoUrl?: string
}

interface PublishResponse {
  success: boolean
  platform: string
  tweetId?: string
  postId?: string
  message: string
  error?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json()

    // Validate required fields
    if (!body.platform) {
      return NextResponse.json(
        { success: false, error: 'Platform is required' },
        { status: 400 }
      )
    }

    if (!body.content?.text) {
      return NextResponse.json(
        { success: false, error: 'Content text is required' },
        { status: 400 }
      )
    }

    console.log(`Publishing to ${body.platform}:`, body.content.text.substring(0, 50) + '...')

    // Call n8n webhook based on platform
    const webhookPaths: Record<string, string> = {
      twitter: '/webhook/twitter-publish',
      // Future platforms will be added here
    }

    const webhookPath = webhookPaths[body.platform]
    if (!webhookPath) {
      return NextResponse.json(
        {
          success: false,
          platform: body.platform,
          error: `Plateforme "${body.platform}" non supportée. Disponible: twitter`
        },
        { status: 400 }
      )
    }

    const webhookUrl = `${N8N_URL}${webhookPath}`

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('n8n webhook error:', errorText)
      return NextResponse.json(
        {
          success: false,
          platform: body.platform,
          error: `Erreur n8n: ${response.status} - ${errorText}`
        },
        { status: response.status }
      )
    }

    const result: PublishResponse = await response.json()

    console.log(`Published successfully to ${body.platform}:`, result)

    // Save post to history
    if (result.success) {
      try {
        const posts = await loadPosts()
        const newPost: SocialPost = {
          id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          platform: body.platform,
          content: {
            text: body.content.text,
            hashtags: body.content.hashtags || []
          },
          mediaUrl: body.imageUrl || body.videoUrl,
          mediaType: body.videoUrl ? 'video' : (body.imageUrl ? 'image' : undefined),
          status: 'published',
          externalId: result.tweetId || result.postId,
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        }
        posts.push(newPost)
        await savePosts(posts)
        console.log('Post saved to history:', newPost.id)
      } catch (saveError) {
        console.error('Failed to save post to history:', saveError)
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Publish API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// Health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    supportedPlatforms: ['twitter'],
    pendingPlatforms: ['linkedin', 'instagram', 'facebook', 'tiktok']
  })
}
