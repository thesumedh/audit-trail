import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    await auditDb.initialize()

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const author = searchParams.get("author")
    const instance = searchParams.get("instance")
    const includeDeleted = searchParams.get("includeDeleted") === "true"
    const format = searchParams.get("format") || "json"

    if (!date && !startDate) {
      return NextResponse.json({ error: "Date or date range required" }, { status: 400 })
    }

    let historicalPosts
    if (date) {
      historicalPosts = await auditDb.getPostsAsOfDate(date)
    } else if (startDate && endDate) {
      historicalPosts = await getPostsInDateRange(startDate, endDate)
    }

    // Apply filters
    if (author) {
      historicalPosts = historicalPosts?.filter((post) => post.author.toLowerCase().includes(author.toLowerCase()))
    }

    if (instance) {
      historicalPosts = historicalPosts?.filter((post) => post.instance_url.includes(instance))
    }

    if (!includeDeleted) {
      historicalPosts = historicalPosts?.filter((post) => post.status !== "deleted")
    }

    // Format response
    if (format === "csv") {
      const csv = await formatAsCSV(historicalPosts || [])
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-data-${date || `${startDate}-to-${endDate}`}.csv"`,
        },
      })
    }

    return NextResponse.json({
      posts: historicalPosts,
      metadata: {
        query_date: date,
        date_range: startDate && endDate ? { start: startDate, end: endDate } : null,
        total_posts: historicalPosts?.length || 0,
        filters_applied: { author, instance, includeDeleted },
        generated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching historical data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function getPostsInDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const allPosts = await auditDb.getAllPosts()

  return allPosts.filter((post) => {
    const postDate = new Date(post.created_at)
    return postDate >= start && postDate <= end
  })
}

async function formatAsCSV(posts: any[]) {
  const headers = [
    "ID",
    "ActivityPub ID",
    "Author",
    "Instance",
    "Content",
    "Status",
    "Created At",
    "Blockchain Verified",
  ]
  const rows = posts.map((post) => [
    post.id,
    post.activitypub_id,
    post.author,
    post.instance_url,
    `"${post.content.replace(/"/g, '""')}"`, // Escape quotes in CSV
    post.status,
    post.created_at,
    post.blockchain_verified ? "Yes" : "No",
  ])

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")
}
