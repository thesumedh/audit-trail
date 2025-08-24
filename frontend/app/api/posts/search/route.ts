import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock search results
    const mockResults = [
      {
        id: "1",
        author: "@fed_news",
        content: `Fed raises rates by 0.25% - ${query}`,
        hash: "0xa1b2c3d4e5f6",
        timestamp: "2025-08-17T14:30:00Z",
        status: "verified",
        aiScore: 0.95,
        zkProof: true,
      },
      {
        id: "2",
        author: "@crypto_analyst",
        content: `Market analysis: ${query} impact on DeFi`,
        hash: "0xf6e5d4c3b2a1",
        timestamp: "2025-08-17T15:45:00Z",
        status: "verified",
        aiScore: 0.88,
        zkProof: true,
      },
    ]

    return NextResponse.json({ results: mockResults })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
