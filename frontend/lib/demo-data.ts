export const demoFinancialNews = [
  {
    id: "demo-1",
    headline: "Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty",
    content: "Federal Reserve Chair Jerome Powell indicated that the central bank may consider rate cuts in the coming months as economic indicators show mixed signals. Speaking at the Jackson Hole Economic Symposium, Powell emphasized the Fed's commitment to maintaining price stability while supporting employment. Market analysts interpret this as a dovish shift in monetary policy stance.",
    author: "Financial News Team",
    timestamp: Date.now() - 1800000, // 30 minutes ago
    hash: "fed2024a1b2c3d4e",
    verified: true,
    category: "monetary-policy",
    impact: "high" as const,
    tx_hash: "0xfed123456789abcdef..."
  },
  {
    id: "demo-2",
    headline: "Major Banks Report Strong Q4 Earnings Despite Market Volatility",
    content: "JPMorgan Chase, Bank of America, and Wells Fargo all exceeded analyst expectations in their Q4 earnings reports. Combined net income reached $45.2 billion, up 12% year-over-year. Strong trading revenues and lower credit loss provisions drove the outperformance. CEO statements suggest optimism for 2024 despite ongoing economic headwinds.",
    author: "Banking Correspondent",
    timestamp: Date.now() - 3600000, // 1 hour ago
    hash: "bank2024e5f6g7h8",
    verified: true,
    category: "earnings",
    impact: "medium" as const,
    tx_hash: "0xbank456789abcdef123..."
  },
  {
    id: "demo-3",
    headline: "Bitcoin ETF Inflows Surge Past $2B as Institutional Adoption Accelerates",
    content: "Bitcoin exchange-traded funds saw record inflows of $2.1 billion this week, marking the largest weekly inflow since their launch. BlackRock's IBIT led with $800 million in new investments, followed by Fidelity's FBTC with $650 million. The surge coincides with growing corporate treasury adoption and regulatory clarity improvements.",
    author: "Crypto Markets Team",
    timestamp: Date.now() - 5400000, // 1.5 hours ago
    hash: "btc2024i9j0k1l2",
    verified: true,
    category: "crypto",
    impact: "high" as const,
    tx_hash: "0xbtc789abcdef123456..."
  },
  {
    id: "demo-4",
    headline: "European Central Bank Maintains Rates at 4.5% Amid Inflation Concerns",
    content: "The European Central Bank kept its main refinancing rate unchanged at 4.5% during today's monetary policy meeting. ECB President Christine Lagarde cited persistent inflation pressures in services sector as a key concern. The decision was unanimous among governing council members, with next review scheduled for March.",
    author: "European Markets",
    timestamp: Date.now() - 7200000, // 2 hours ago
    hash: "ecb2024m3n4o5p6",
    verified: true,
    category: "monetary-policy",
    impact: "medium" as const,
    tx_hash: "0xecb123456789abcdef..."
  },
  {
    id: "demo-5",
    headline: "Tech Giants Rally on AI Revenue Growth, NASDAQ Hits New High",
    content: "The NASDAQ Composite reached a new all-time high of 18,450 as major technology companies reported strong AI-driven revenue growth. Microsoft's Azure AI services grew 85% year-over-year, while Google's cloud AI revenue doubled. Nvidia's data center business continues to exceed expectations with $22.6 billion in quarterly revenue.",
    author: "Technology Reporter",
    timestamp: Date.now() - 9000000, // 2.5 hours ago
    hash: "tech2024q7r8s9t0",
    verified: true,
    category: "market-update",
    impact: "high" as const,
    tx_hash: "0xtech456789abcdef123..."
  }
];

export const complianceEvents = [
  {
    id: "compliance-1",
    type: "create",
    entityId: "demo-1",
    timestamp: Date.now() - 1800000,
    description: "Article created and anchored to blockchain",
    txHash: "0xfed123456789abcdef...",
    verified: true
  },
  {
    id: "compliance-2", 
    type: "access",
    entityId: "demo-1",
    timestamp: Date.now() - 1200000,
    description: "Article accessed by compliance officer",
    txHash: "0xaccess123456789abc...",
    verified: true
  },
  {
    id: "compliance-3",
    type: "create",
    entityId: "demo-2",
    timestamp: Date.now() - 3600000,
    description: "Banking earnings report published",
    txHash: "0xbank456789abcdef123...",
    verified: true
  },
  {
    id: "compliance-4",
    type: "update",
    entityId: "demo-2",
    timestamp: Date.now() - 2400000,
    description: "Minor correction applied to earnings figures",
    txHash: "0xupdate789abcdef456...",
    verified: true
  }
];

export const auditMetrics = {
  totalArticles: 247,
  verificationRate: 99.9,
  complianceScore: 98.5,
  blockchainHeight: 847392,
  dailyTransactions: 1247,
  activeMonitoring: true
};