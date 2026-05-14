import { createClient, ErrorResponse, Photos } from "pexels"

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || ""

const client = PEXELS_API_KEY ? createClient(PEXELS_API_KEY) : null

interface FetchedImage {
  url: string
  buffer: Buffer
  width: number
  height: number
  photographer: string
  source: "pexels"
}

const cache = new Map<string, FetchedImage>()

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image download HTTP ${res.status}`)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

export async function findImageBuffer(query: string): Promise<FetchedImage | null> {
  if (!query?.trim()) return null

  const cached = cache.get(query.toLowerCase())
  if (cached) return cached

  if (!client) {
    console.warn("[PEXELS] No PEXELS_API_KEY set, image search disabled")
    return null
  }

  try {
    const result = await client.photos.search({ query, per_page: 1, orientation: "landscape" })

    if ("error" in result) {
      console.error("[PEXELS] API error:", (result as ErrorResponse).error)
      return null
    }

    const photos = (result as Photos).photos
    if (!photos.length) return null

    const photo = photos[0]
    const imageUrl = photo.src.large2x || photo.src.large || photo.src.original

    const buffer = await downloadImage(imageUrl)

    const fetched: FetchedImage = {
      url: imageUrl,
      buffer,
      width: photo.width,
      height: photo.height,
      photographer: photo.photographer,
      source: "pexels",
    }

    cache.set(query.toLowerCase(), fetched)
    return fetched
  } catch (err) {
    console.error("[PEXELS] Search failed for:", query, err)
    return null
  }
}
