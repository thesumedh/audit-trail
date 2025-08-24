import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function POST(request: NextRequest) {
  try {
    await auditDb.initialize()
    const data = await request.json()

    const {
      format = "json",
      date_range,
      include_modifications = true,
      include_blockchain_data = true,
      case_number,
      export_reason,
    } = data

    // Create legal discovery request if case number provided
    let legalRequest
    if (case_number) {
      legalRequest = await auditDb.createLegalRequest({
        case_number,
        requested_date: date_range?.end || new Date().toISOString(),
        date_range_start: date_range?.start || "1970-01-01T00:00:00.000Z",
        date_range_end: date_range?.end || new Date().toISOString(),
        status: "processing",
      })
    }

    // Get historical data
    const posts = date_range?.end ? await auditDb.getPostsAsOfDate(date_range.end) : await auditDb.getAllPosts()

    const exportData: any = {
      metadata: {
        export_timestamp: new Date().toISOString(),
        date_range,
        total_posts: posts.length,
        case_number,
        export_reason,
        legal_request_id: legalRequest?.id,
      },
      posts,
    }

    if (include_modifications) {
      const allModifications = await auditDb.getAllModifications()
      exportData.modifications = allModifications
    }

    if (include_blockchain_data) {
      exportData.blockchain_verification = {
        verified_posts: posts.filter((p) => p.blockchain_verified).length,
        unverified_posts: posts.filter((p) => !p.blockchain_verified).length,
      }
    }

    // Generate integrity hash
    const dataString = JSON.stringify(exportData)
    const integrityHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(dataString)).then((buffer) =>
      Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )

    exportData.metadata.integrity_hash = integrityHash

    // Update legal request if created
    if (legalRequest) {
      await auditDb.updatePost(legalRequest.id, {
        status: "completed",
        result_hash: integrityHash,
        completed_at: new Date().toISOString(),
      })
    }

    if (format === "csv") {
      const csv = await formatExportAsCSV(exportData)
      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="audit-export-${case_number || Date.now()}.csv"`,
        },
      })
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error("[v0] Error creating export:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function formatExportAsCSV(exportData: any) {
  const headers = [
    "Post ID",
    "ActivityPub ID",
    "Author",
    "Instance",
    "Content",
    "Status",
    "Created At",
    "Blockchain Verified",
    "Content Hash",
  ]

  const rows = exportData.posts.map((post: any) => [
    post.id,
    post.activitypub_id,
    post.author,
    post.instance_url,
    `"${post.content.replace(/"/g, '""')}"`,
    post.status,
    post.created_at,
    post.blockchain_verified ? "Yes" : "No",
    post.content_hash,
  ])

  return [
    `# Audit Trail Export - Generated: ${exportData.metadata.export_timestamp}`,
    `# Case Number: ${exportData.metadata.case_number || "N/A"}`,
    `# Integrity Hash: ${exportData.metadata.integrity_hash}`,
    "",
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n")
}
