import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json()

    if (!address) {
      return NextResponse.json({ error: "Wallet address required" }, { status: 400 })
    }

    // Simulate balance check
    await new Promise((resolve) => setTimeout(resolve, 300))

    const mockBalance = {
      address,
      balance: Math.floor(Math.random() * 10000) + 1000,
      staked: Math.floor(Math.random() * 5000) + 500,
      rewards: Math.floor(Math.random() * 100) + 50,
    }

    return NextResponse.json(mockBalance)
  } catch (error) {
    console.error("Balance check error:", error)
    return NextResponse.json({ error: "Failed to get balance" }, { status: 500 })
  }
}
