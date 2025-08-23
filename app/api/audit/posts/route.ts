import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    await auditDb.initialize()

    const { searchParams } = new URL(request.url)
    const asOfDate = searchParams.get("asOfDate")
    const postId = searchParams.get("postId")

    if (postId) {
      const post = await auditDb.getPost(postId)
      if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
      }

      const modifications = await auditDb.getPostModifications(postId)
      return NextResponse.json({ post, modifications })
    }

    if (asOfDate) {
      const historicalPosts = await auditDb.getPostsAsOfDate(asOfDate)
      return NextResponse.json({ posts: historicalPosts, asOfDate })
    }

    const posts = await auditDb.getAllPosts()
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("[v0] Error fetching posts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await auditDb.initialize()
    const data = await request.json()

    // Create content hash
    const contentHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data.content)).then((buffer) =>
      Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )

    const post = await auditDb.createPost({
      activitypub_id: data.activitypub_id,
      instance_url: data.instance_url,
      author: data.author,
      content: data.content,
      content_hash: contentHash,
      published_at: data.published_at,
      blockchain_verified: false,
      status: "active",
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating post:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
