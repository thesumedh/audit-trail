import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    await auditDb.initialize()

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    if (postId) {
      // Get timeline for a specific post
      const timeline = await getPostTimeline(postId)
      return NextResponse.json({ timeline })
    }

    // Get global timeline of all modifications
    const allModifications = await auditDb.getAllModifications()
    let filteredMods = allModifications

    if (startDate) {
      const start = new Date(startDate)
      filteredMods = filteredMods.filter((mod) => new Date(mod.detected_at) >= start)
    }

    if (endDate) {
      const end = new Date(endDate)
      filteredMods = filteredMods.filter((mod) => new Date(mod.detected_at) <= end)
    }

    const timeline = filteredMods.slice(0, limit).map((mod) => ({
      id: mod.id,
      post_id: mod.post_id,
      type: mod.modification_type,
      detected_at: mod.detected_at,
      blockchain_verified: mod.blockchain_verified,
      has_content_change: mod.previous_content !== mod.new_content,
    }))

    return NextResponse.json({
      timeline,
      metadata: {
        total_modifications: allModifications.length,
        filtered_count: filteredMods.length,
        returned_count: timeline.length,
        date_range: { start: startDate, end: endDate },
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching timeline:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getPostTimeline(postId: string) {
  const post = await auditDb.getPost(postId)
  const modifications = await auditDb.getPostModifications(postId)

  if (!post) {
    throw new Error("Post not found")
  }

  const timeline = [
    {
      type: "created",
      timestamp: post.created_at,
      content: post.content,
      blockchain_verified: post.blockchain_verified,
    },
    ...modifications.map((mod) => ({
      type: mod.modification_type,
      timestamp: mod.detected_at,
      previous_content: mod.previous_content,
      new_content: mod.new_content,
      blockchain_verified: mod.blockchain_verified,
    })),
  ].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return timeline
}
