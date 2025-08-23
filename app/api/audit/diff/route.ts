import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    await auditDb.initialize()

    const { searchParams } = new URL(request.url)
    const fromDate = searchParams.get("fromDate")
    const toDate = searchParams.get("toDate")
    const postId = searchParams.get("postId")

    if (!fromDate || !toDate) {
      return NextResponse.json({ error: "Both fromDate and toDate are required" }, { status: 400 })
    }

    if (postId) {
      // Get diff for a specific post
      const postDiff = await getPostDiff(postId, fromDate, toDate)
      return NextResponse.json({ diff: postDiff })
    }

    // Get diff for all posts between two dates
    const fromPosts = await auditDb.getPostsAsOfDate(fromDate)
    const toPosts = await auditDb.getPostsAsOfDate(toDate)

    const diff = await calculatePostsDiff(fromPosts, toPosts)

    return NextResponse.json({
      diff,
      metadata: {
        from_date: fromDate,
        to_date: toDate,
        from_post_count: fromPosts.length,
        to_post_count: toPosts.length,
        generated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Error calculating diff:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getPostDiff(postId: string, fromDate: string, toDate: string) {
  const modifications = await auditDb.getPostModifications(postId)
  const fromDateObj = new Date(fromDate)
  const toDateObj = new Date(toDate)

  const relevantMods = modifications.filter((mod) => {
    const modDate = new Date(mod.detected_at)
    return modDate >= fromDateObj && modDate <= toDateObj
  })

  return {
    post_id: postId,
    modifications_in_period: relevantMods.length,
    changes: relevantMods.map((mod) => ({
      type: mod.modification_type,
      detected_at: mod.detected_at,
      content_changed: mod.previous_content !== mod.new_content,
      blockchain_verified: mod.blockchain_verified,
    })),
  }
}

async function calculatePostsDiff(fromPosts: any[], toPosts: any[]) {
  const fromPostsMap = new Map(fromPosts.map((p) => [p.activitypub_id, p]))
  const toPostsMap = new Map(toPosts.map((p) => [p.activitypub_id, p]))

  const added = []
  const removed = []
  const modified = []

  // Find added posts
  for (const [id, post] of toPostsMap) {
    if (!fromPostsMap.has(id)) {
      added.push(post)
    }
  }

  // Find removed posts
  for (const [id, post] of fromPostsMap) {
    if (!toPostsMap.has(id)) {
      removed.push(post)
    }
  }

  // Find modified posts
  for (const [id, fromPost] of fromPostsMap) {
    const toPost = toPostsMap.get(id)
    if (toPost && fromPost.content_hash !== toPost.content_hash) {
      modified.push({
        post_id: id,
        from_content: fromPost.content,
        to_content: toPost.content,
        from_status: fromPost.status,
        to_status: toPost.status,
      })
    }
  }

  return {
    summary: {
      added_count: added.length,
      removed_count: removed.length,
      modified_count: modified.length,
    },
    added,
    removed,
    modified,
  }
}
