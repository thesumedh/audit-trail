import { type NextRequest, NextResponse } from "next/server"

interface ActivityPubWebhookPayload {
  "@context": string | string[]
  type: string
  actor: string
  object: any
  published?: string
  updated?: string
}

export async function POST(request: NextRequest) {
  try {
    const payload: ActivityPubWebhookPayload = await request.json()

    // Validate ActivityPub payload
    if (!payload["@context"] || !payload.type || !payload.actor) {
      return NextResponse.json({ error: "Invalid ActivityPub payload" }, { status: 400 })
    }

    // Process different activity types
    switch (payload.type) {
      case "Create":
        await handleCreateActivity(payload)
        break
      case "Update":
        await handleUpdateActivity(payload)
        break
      case "Delete":
        await handleDeleteActivity(payload)
        break
      default:
        console.log(`Unhandled activity type: ${payload.type}`)
    }

    return NextResponse.json({ success: true, processed: payload.type })
  } catch (error) {
    console.error("Webhook processing error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}

async function handleCreateActivity(payload: ActivityPubWebhookPayload) {
  // Handle new post creation
  console.log("New post created:", {
    actor: payload.actor,
    object: payload.object,
    published: payload.published,
  })

  // Here you would:
  // 1. Store the post in your monitoring system
  // 2. Queue it for blockchain verification
  // 3. Trigger real-time updates to connected clients
}

async function handleUpdateActivity(payload: ActivityPubWebhookPayload) {
  // Handle post updates/edits
  console.log("Post updated:", {
    actor: payload.actor,
    object: payload.object,
    updated: payload.updated,
  })

  // Here you would:
  // 1. Compare with existing post content
  // 2. Log the modification in audit trail
  // 3. Update blockchain record with change history
}

async function handleDeleteActivity(payload: ActivityPubWebhookPayload) {
  // Handle post deletions
  console.log("Post deleted:", {
    actor: payload.actor,
    object: payload.object,
  })

  // Here you would:
  // 1. Mark post as deleted in audit trail
  // 2. Preserve original content for legal discovery
  // 3. Record deletion event on blockchain
}

export async function GET() {
  return NextResponse.json({
    message: "ActivityPub Webhook Endpoint",
    supportedActivities: ["Create", "Update", "Delete"],
    format: "ActivityStreams 2.0",
  })
}
