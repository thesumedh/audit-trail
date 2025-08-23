import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    await auditDb.initialize()

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get("requestId")

    if (requestId) {
      const legalRequest = await auditDb.getLegalRequest(requestId)
      if (!legalRequest) {
        return NextResponse.json({ error: "Legal request not found" }, { status: 404 })
      }
      return NextResponse.json({ request: legalRequest })
    }

    const allRequests = await auditDb.getAllLegalRequests()
    return NextResponse.json({ requests: allRequests })
  } catch (error) {
    console.error("[v0] Error fetching legal requests:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await auditDb.initialize()
    const data = await request.json()

    const legalRequest = await auditDb.createLegalRequest({
      case_number: data.case_number,
      requested_date: data.requested_date,
      date_range_start: data.date_range_start,
      date_range_end: data.date_range_end,
      status: "pending",
    })

    // Start processing the legal discovery request
    processLegalDiscovery(legalRequest.id)

    return NextResponse.json({ request: legalRequest }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating legal request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function processLegalDiscovery(requestId: string) {
  try {
    const request = await auditDb.getLegalRequest(requestId)
    if (!request) return

    // Update status to processing
    await auditDb.updatePost(requestId, { status: "processing" })

    // Get historical data for the requested date
    const historicalPosts = await auditDb.getPostsAsOfDate(request.requested_date)

    // Create a hash of the discovery results for integrity
    const resultData = JSON.stringify(historicalPosts)
    const resultHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(resultData)).then((buffer) =>
      Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
    )

    // Update request with completion
    await auditDb.updatePost(requestId, {
      status: "completed",
      result_hash: resultHash,
      completed_at: new Date().toISOString(),
    })

    console.log(`[v0] Legal discovery completed for request ${requestId}`)
  } catch (error) {
    console.error(`[v0] Error processing legal discovery ${requestId}:`, error)
    await auditDb.updatePost(requestId, { status: "failed" })
  }
}
