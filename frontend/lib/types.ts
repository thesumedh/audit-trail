export interface Post {
  id: string
  author: string
  content: string
  timestamp: string
  status: "verified" | "pending" | "modified"
  changes: number
  hash: string
  previousHash: string
  blockHeight: number
  aiScore: number
  zkProof: boolean
  defiTrigger: boolean
  gasUsed: number
}
