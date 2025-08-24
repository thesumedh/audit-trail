import { type NextRequest, NextResponse } from "next/server"

interface ActivityPubObject {
  "@context": string | string[]
  id: string
  type: string
  actor: string
  object: {
    id: string
    type: string
    content: string
    published: string
    updated?: string
    attributedTo: string
  }
  published: string
  updated?: string
}

interface MonitoredPost {
  id: string
  activityPubId: string
  author: string
  content: string
  contentHash: string
  timestamp: string
  lastModified?: string
  status: "active" | "modified" | "deleted"
  originalContent?: string
  modificationHistory: Array<{
    timestamp: string
    content: string
    action: "created" | "updated" | "deleted"
  }>
}

// In-memory store for demo (use database in production)
const monitoredPosts: Map<string, MonitoredPost> = new Map()
const activityPubInstances: string[] = ["https://mastodon.social", "https://fosstodon.org", "https://mas.to"]

function generateContentHash(content: string): string {
  // Simple hash function for demo (use crypto.subtle in production)
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16)
}

async function fetchActivityPubFeed(instanceUrl: string): Promise<ActivityPubObject[]> {
  try {
    // Fetch public timeline from ActivityPub instance
    const response = await fetch(`${instanceUrl}/api/v1/timelines/public?limit=20`, {
      headers: {
        Accept: "application/activity+json",
        "User-Agent": "AuditTrail/1.0",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${instanceUrl}: ${response.status}`)
    }

    const posts = await response.json()

    // Convert Mastodon API format to ActivityPub format
    return posts.map((post: any) => ({
      "@context": "https://www.w3.org/ns/activitystreams",
      id: post.uri,
      type: "Create",
      actor: post.account.url,
      object: {
        id: post.uri,
        type: "Note",
        content: post.content,
        published: post.created_at,
        updated: post.edited_at,
        attributedTo: post.account.url,
      },
      published: post.created_at,
      updated: post.edited_at,
    }))
  } catch (error) {
    console.error(`Error fetching from ${instanceUrl}:`, error)
    return []
  }
}

function detectChanges(
  newPost: ActivityPubObject,
  existingPost?: MonitoredPost,
): {
  hasChanged: boolean
  changeType: "created" | "updated" | "deleted"
  changes: string[]
} {
  if (!existingPost) {
    return {
      hasChanged: true,
      changeType: "created",
      changes: ["Post created"],
    }
  }

  const changes: string[] = []
  const newContent = newPost.object.content
  const newContentHash = generateContentHash(newContent)

  if (existingPost.contentHash !== newContentHash) {
    changes.push("Content modified")
  }

  if (newPost.updated && newPost.updated !== existingPost.lastModified) {
    changes.push("Timestamp updated")
  }

  return {
    hasChanged: changes.length > 0,
    changeType: "updated",
    changes,
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  if (action === "status") {
    return NextResponse.json({
      monitoredPosts: monitoredPosts.size,
      instances: activityPubInstances.length,
      lastSync: new Date().toISOString(),
    })
  }

  if (action === "posts") {
    const posts = Array.from(monitoredPosts.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 50) // Return latest 50 posts

    return NextResponse.json({ posts })
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}

export async function POST(request: NextRequest) {
  try {
    const { action, instanceUrl } = await request.json()

    if (action === "sync") {
      const allPosts: ActivityPubObject[] = []

      // Fetch from all monitored instances
      for (const instance of activityPubInstances) {
        const posts = await fetchActivityPubFeed(instance)
        allPosts.push(...posts)
      }

      let newPosts = 0
      let modifiedPosts = 0

      // Process each post
      for (const post of allPosts) {
        const existingPost = monitoredPosts.get(post.object.id)
        const detection = detectChanges(post, existingPost)

        if (detection.hasChanged) {
          const contentHash = generateContentHash(post.object.content)

          if (detection.changeType === "created") {
            const newMonitoredPost: MonitoredPost = {
              id: crypto.randomUUID(),
              activityPubId: post.object.id,
              author: post.actor,
              content: post.object.content,
              contentHash,
              timestamp: post.published,
              status: "active",
              modificationHistory: [
                {
                  timestamp: post.published,
                  content: post.object.content,
                  action: "created",
                },
              ],
            }

            monitoredPosts.set(post.object.id, newMonitoredPost)
            newPosts++
          } else if (detection.changeType === "updated" && existingPost) {
            // Store original content if this is the first modification
            if (!existingPost.originalContent) {
              existingPost.originalContent = existingPost.content
            }

            existingPost.content = post.object.content
            existingPost.contentHash = contentHash
            existingPost.lastModified = post.updated || new Date().toISOString()
            existingPost.status = "modified"
            existingPost.modificationHistory.push({
              timestamp: post.updated || new Date().toISOString(),
              content: post.object.content,
              action: "updated",
            })

            modifiedPosts++
          }
        }
      }

      return NextResponse.json({
        success: true,
        processed: allPosts.length,
        newPosts,
        modifiedPosts,
        totalMonitored: monitoredPosts.size,
      })
    }

    if (action === "add_instance") {
      if (instanceUrl && !activityPubInstances.includes(instanceUrl)) {
        activityPubInstances.push(instanceUrl)
        return NextResponse.json({ success: true, instances: activityPubInstances })
      }
      return NextResponse.json({ error: "Invalid or duplicate instance URL" }, { status: 400 })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("ActivityPub monitor error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
