import { type NextRequest, NextResponse } from "next/server"
import { auditDb } from "@/lib/storage"

export async function GET(request: NextRequest) {
  try {
    await auditDb.initialize()

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (postId) {
      const modifications = await auditDb.getPostModifications(postId)
      return NextResponse.json({ modifications })
    }

    const allModifications = await auditDb.getAllModifications()
    return NextResponse.json({ modifications: allModifications })
  } catch (error) {
    console.error("[v0] Error fetching modifications:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await auditDb.initialize()
    const data = await request.json()

    // Create content hashes if content is provided
    let previousHash, newHash
    if (data.previous_content) {
      previousHash = await crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(data.previous_content))
        .then((buffer) =>
          Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(""),
        )
    }

    if (data.new_content) {
      newHash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data.new_content)).then((buffer) =>
        Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      )
    }

    const modification = await auditDb.addModification({
      post_id: data.post_id,
      modification_type: data.modification_type,
      previous_content: data.previous_content,
      new_content: data.new_content,
      previous_hash: previousHash,
      new_hash: newHash,
      detected_at: new Date().toISOString(),
      blockchain_verified: false,
      metadata: data.metadata || {},
    })

    // Update the original post status
    if (data.modification_type === "edit" && data.new_content) {
      await auditDb.updatePost(data.post_id, {
        content: data.new_content,
        content_hash: newHash,
        status: "edited",
      })
    } else if (data.modification_type === "delete") {
      await auditDb.updatePost(data.post_id, {
        status: "deleted",
      })
    }

    return NextResponse.json({ modification }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating modification:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
