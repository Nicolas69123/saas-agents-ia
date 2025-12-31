import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

const DATA_DIR = join(process.cwd(), 'data')
const POSTS_FILE = join(DATA_DIR, 'social-posts.json')

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true })
}

interface SocialPost {
  id: string
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'tiktok'
  content: {
    text: string
    hashtags?: string[]
  }
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  scheduledAt?: string
  publishedAt?: string
  createdAt: string
}

// Load posts from file
async function loadPosts(): Promise<SocialPost[]> {
  try {
    if (!existsSync(POSTS_FILE)) {
      return []
    }
    const data = await readFile(POSTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

// Save posts to file
async function savePosts(posts: SocialPost[]): Promise<void> {
  await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2))
}

// GET - List all posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const platform = searchParams.get('platform')
    const status = searchParams.get('status')

    let posts = await loadPosts()

    // Filter by platform
    if (platform) {
      posts = posts.filter(p => p.platform === platform)
    }

    // Filter by status
    if (status) {
      posts = posts.filter(p => p.status === status)
    }

    // Sort by creation date (newest first)
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const stats = {
      total: posts.length,
      byPlatform: {
        twitter: posts.filter(p => p.platform === 'twitter').length,
        linkedin: posts.filter(p => p.platform === 'linkedin').length,
        instagram: posts.filter(p => p.platform === 'instagram').length,
        facebook: posts.filter(p => p.platform === 'facebook').length,
        tiktok: posts.filter(p => p.platform === 'tiktok').length,
      },
      byStatus: {
        draft: posts.filter(p => p.status === 'draft').length,
        scheduled: posts.filter(p => p.status === 'scheduled').length,
        published: posts.filter(p => p.status === 'published').length,
        failed: posts.filter(p => p.status === 'failed').length,
      }
    }

    return NextResponse.json({
      success: true,
      posts,
      stats
    })
  } catch (error) {
    console.error('Error listing posts:', error)
    return NextResponse.json({ success: false, error: 'Failed to list posts' }, { status: 500 })
  }
}

// POST - Create a new post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { platform, content, mediaUrl, mediaType, scheduledAt, status = 'draft' } = body

    if (!platform || !content?.text) {
      return NextResponse.json({ error: 'platform and content.text are required' }, { status: 400 })
    }

    const posts = await loadPosts()

    const newPost: SocialPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      platform,
      content: {
        text: content.text,
        hashtags: content.hashtags || []
      },
      mediaUrl,
      mediaType,
      status,
      scheduledAt,
      createdAt: new Date().toISOString()
    }

    posts.push(newPost)
    await savePosts(posts)

    return NextResponse.json({
      success: true,
      post: newPost
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ success: false, error: 'Failed to create post' }, { status: 500 })
  }
}

// PATCH - Update a post
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')
    const body = await request.json()

    if (!postId) {
      return NextResponse.json({ error: 'post id required' }, { status: 400 })
    }

    const posts = await loadPosts()
    const postIndex = posts.findIndex(p => p.id === postId)

    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Update post fields
    posts[postIndex] = {
      ...posts[postIndex],
      ...body,
      content: body.content ? { ...posts[postIndex].content, ...body.content } : posts[postIndex].content
    }

    // If marking as published, add publishedAt
    if (body.status === 'published' && !posts[postIndex].publishedAt) {
      posts[postIndex].publishedAt = new Date().toISOString()
    }

    await savePosts(posts)

    return NextResponse.json({
      success: true,
      post: posts[postIndex]
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 })
  }
}

// DELETE - Remove a post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({ error: 'post id required' }, { status: 400 })
    }

    const posts = await loadPosts()
    const filteredPosts = posts.filter(p => p.id !== postId)

    if (filteredPosts.length === posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    await savePosts(filteredPosts)

    return NextResponse.json({ success: true, deleted: postId })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 })
  }
}
