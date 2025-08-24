import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, author } = await request.json()

    if (!content || !author) {
      return NextResponse.json({ error: "Content and author required" }, { status: 400 })
    }

    // Simulate blockchain logging
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Generate mock hash
    const hash = "0x" + Math.random().toString(16).substring(2, 14)

    const loggedPost = {
      id: Date.now().toString(),
      author,
      content,
      hash,
      timestamp: new Date().toISOString(),
      status: "verified",
      aiScore: Math.random() * 0.3 + 0.7, // 0.7-1.0
      zkProof: true,
      blockchainTx: `aptos_tx_${Math.random().toString(16).substring(2, 10)}`,
    }

    return NextResponse.json({ success: true, post: loggedPost })
  } catch (error) {
    console.error("Log post error:", error)
    return NextResponse.json({ error: "Failed to log post" }, { status: 500 })
  }
}
