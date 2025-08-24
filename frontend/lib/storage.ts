import type { Post, PostModification, AuditSnapshot, LegalDiscoveryRequest } from "./schema"

// In-memory storage with file persistence
class AuditDatabase {
  private posts: Map<string, Post> = new Map()
  private modifications: Map<string, PostModification[]> = new Map()
  private snapshots: Map<string, AuditSnapshot> = new Map()
  private legalRequests: Map<string, LegalDiscoveryRequest> = new Map()
  private isLoaded = false

  async initialize() {
    if (this.isLoaded) return

    try {
      // In a real implementation, this would load from persistent storage
      console.log("[v0] Initializing audit database")
      this.isLoaded = true
    } catch (error) {
      console.error("[v0] Failed to initialize database:", error)
    }
  }

  // Post operations
  async createPost(post: Omit<Post, "id" | "created_at" | "updated_at">): Promise<Post> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    const newPost: Post = {
      ...post,
      id,
      created_at: now,
      updated_at: now,
    }

    this.posts.set(id, newPost)
    await this.persistData()
    return newPost
  }

  async getPost(id: string): Promise<Post | null> {
    return this.posts.get(id) || null
  }

  async getPostByActivityPubId(activitypub_id: string): Promise<Post | null> {
    for (const post of this.posts.values()) {
      if (post.activitypub_id === activitypub_id) {
        return post
      }
    }
    return null
  }

  async getAllPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    const post = this.posts.get(id)
    if (!post) return null

    const updatedPost = {
      ...post,
      ...updates,
      updated_at: new Date().toISOString(),
    }

    this.posts.set(id, updatedPost)
    await this.persistData()
    return updatedPost
  }

  // Modification operations
  async addModification(modification: Omit<PostModification, "id">): Promise<PostModification> {
    const id = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newModification: PostModification = {
      ...modification,
      id,
    }

    const postMods = this.modifications.get(modification.post_id) || []
    postMods.push(newModification)
    this.modifications.set(modification.post_id, postMods)

    await this.persistData()
    return newModification
  }

  async getPostModifications(post_id: string): Promise<PostModification[]> {
    return this.modifications.get(post_id) || []
  }

  async getAllModifications(): Promise<PostModification[]> {
    const allMods: PostModification[] = []
    for (const mods of this.modifications.values()) {
      allMods.push(...mods)
    }
    return allMods.sort((a, b) => new Date(b.detected_at).getTime() - new Date(a.detected_at).getTime())
  }

  // Snapshot operations
  async createSnapshot(snapshot: Omit<AuditSnapshot, "id" | "created_at">): Promise<AuditSnapshot> {
    const id = `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newSnapshot: AuditSnapshot = {
      ...snapshot,
      id,
      created_at: new Date().toISOString(),
    }

    this.snapshots.set(id, newSnapshot)
    await this.persistData()
    return newSnapshot
  }

  async getSnapshotByDate(date: string): Promise<AuditSnapshot | null> {
    for (const snapshot of this.snapshots.values()) {
      if (snapshot.snapshot_date === date) {
        return snapshot
      }
    }
    return null
  }

  // Legal discovery operations
  async createLegalRequest(request: Omit<LegalDiscoveryRequest, "id" | "created_at">): Promise<LegalDiscoveryRequest> {
    const id = `legal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newRequest: LegalDiscoveryRequest = {
      ...request,
      id,
      created_at: new Date().toISOString(),
    }

    this.legalRequests.set(id, newRequest)
    await this.persistData()
    return newRequest
  }

  async getLegalRequest(id: string): Promise<LegalDiscoveryRequest | null> {
    return this.legalRequests.get(id) || null
  }

  async getAllLegalRequests(): Promise<LegalDiscoveryRequest[]> {
    return Array.from(this.legalRequests.values())
  }

  async updateLegalRequest(id: string, updates: Partial<LegalDiscoveryRequest>): Promise<LegalDiscoveryRequest | null> {
    const request = this.legalRequests.get(id)
    if (!request) return null

    const updatedRequest = {
      ...request,
      ...updates,
    }

    this.legalRequests.set(id, updatedRequest)
    await this.persistData()
    return updatedRequest
  }

  // Historical data retrieval for legal discovery
  async getPostsAsOfDate(date: string): Promise<Post[]> {
    const targetDate = new Date(date)
    const historicalPosts: Post[] = []

    for (const post of this.posts.values()) {
      const postDate = new Date(post.created_at)
      if (postDate <= targetDate) {
        // Get the state of the post as of the target date
        const modifications = await this.getPostModifications(post.id)
        const relevantMods = modifications
          .filter((mod) => new Date(mod.detected_at) <= targetDate)
          .sort((a, b) => new Date(a.detected_at).getTime() - new Date(b.detected_at).getTime())

        const historicalPost = { ...post }

        // Apply modifications chronologically up to the target date
        for (const mod of relevantMods) {
          if (mod.modification_type === "edit" && mod.new_content) {
            historicalPost.content = mod.new_content
            historicalPost.content_hash = mod.new_hash || historicalPost.content_hash
            historicalPost.status = "edited"
          } else if (mod.modification_type === "delete") {
            historicalPost.status = "deleted"
          } else if (mod.modification_type === "restore") {
            historicalPost.status = "active"
          }
        }

        historicalPosts.push(historicalPost)
      }
    }

    return historicalPosts
  }

  private async persistData() {
    // In a real implementation, this would save to file system or database
    console.log("[v0] Persisting audit data to storage")
  }
}

export const auditDb = new AuditDatabase()
