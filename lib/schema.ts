export interface Post {
  id: string
  activitypub_id: string
  instance_url: string
  author: string
  content: string
  content_hash: string
  published_at: string
  created_at: string
  updated_at: string
  blockchain_tx_hash?: string
  blockchain_verified: boolean
  status: "active" | "edited" | "deleted"
}

export interface PostModification {
  id: string
  post_id: string
  modification_type: "edit" | "delete" | "restore"
  previous_content?: string
  new_content?: string
  previous_hash?: string
  new_hash?: string
  detected_at: string
  blockchain_tx_hash?: string
  blockchain_verified: boolean
  metadata: {
    user_agent?: string
    ip_address?: string
    activitypub_update?: any
  }
}

export interface AuditSnapshot {
  id: string
  snapshot_date: string
  post_count: number
  blockchain_height: number
  merkle_root: string
  created_at: string
}

export interface LegalDiscoveryRequest {
  id: string
  case_number: string
  requested_date: string
  date_range_start: string
  date_range_end: string
  status: "pending" | "processing" | "completed" | "failed"
  result_hash?: string
  created_at: string
  completed_at?: string
}
