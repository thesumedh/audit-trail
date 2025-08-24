"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Clock, Database } from "lucide-react"

export function HistoricalViewer() {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [historicalData, setHistoricalData] = useState<any>(null)

  const handleViewSnapshot = () => {
    // Simulate fetching historical data from Aptos blockchain
    const mockSnapshot = {
      timestamp: `${selectedDate} ${selectedTime}`,
      totalPosts: 1247,
      blockHeight: 847392,
      posts: [
        {
          id: "hist-1",
          author: "@federalreserve.official",
          content: "The Federal Open Market Committee decided to maintain the federal funds rate at 5.25-5.50 percent. The Committee will continue to assess additional information and its implications for monetary policy.",
          originalTimestamp: "2024-01-15T14:30:00Z",
          status: "active",
          hash: "sha256:fed123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          txHash: "0xfed456789abc123456789abcdef0123456789abcdef0123456789abcdef012345",
          verificationStatus: "verified"
        },
        {
          id: "hist-2",
          author: "@sec.enforcement",
          content: "SEC announces settlement with major investment firm for $50M regarding disclosure violations. This case demonstrates our commitment to protecting investors and maintaining market integrity.",
          originalTimestamp: "2024-01-15T11:45:00Z",
          status: "active",
          hash: "sha256:sec789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345",
          txHash: "0xsec789abc456def0123456789abcdef0123456789abcdef0123456789abcdef678",
          verificationStatus: "verified"
        },
        {
          id: "hist-3",
          author: "@treasury.dept",
          content: "U.S. Treasury announces new sanctions on entities involved in illicit financial activities. These measures are part of our ongoing efforts to combat financial crimes and protect the integrity of the global financial system.",
          originalTimestamp: "2024-01-15T09:15:00Z",
          status: "deleted",
          deletedAt: "2024-01-15T16:22:00Z",
          deletionReason: "Content updated with more accurate information",
          hash: "sha256:treas456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          txHash: "0xtreas123456789abcdef0123456789abcdef0123456789abcdef0123456789abc",
          verificationStatus: "verified"
        },
        {
          id: "hist-4",
          author: "@nasdaq.official",
          content: "NASDAQ Composite closes at record high of 16,847.35, up 2.3% on strong tech earnings. Trading volume reached 4.2B shares, indicating robust investor confidence in technology sector growth.",
          originalTimestamp: "2024-01-15T21:00:00Z",
          status: "modified",
          originalContent: "NASDAQ closes higher on tech earnings.",
          modifiedAt: "2024-01-15T21:15:00Z",
          hash: "sha256:nasdaq789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
          txHash: "0xnasdaq456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
          verificationStatus: "verified"
        },
        {
          id: "hist-5",
          author: "@imf.communications",
          content: "IMF revises global growth forecast to 3.1% for 2024, citing resilient consumer spending and easing supply chain pressures. However, geopolitical tensions remain a key risk factor for economic stability.",
          originalTimestamp: "2024-01-15T13:20:00Z",
          status: "active",
          hash: "sha256:imf123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0",
          txHash: "0ximf789abcdef0123456789abcdef0123456789abcdef0123456789abcdef012345",
          verificationStatus: "verified"
        },
        {
          id: "hist-6",
          author: "@worldbank.news",
          content: "World Bank approves $2.5B in climate financing for developing nations. This funding will support renewable energy projects and climate adaptation measures across 15 countries in Africa and Asia.",
          originalTimestamp: "2024-01-15T08:30:00Z",
          status: "active",
          hash: "sha256:wb456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123",
          txHash: "0xwb123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef67",
          verificationStatus: "verified"
        }
      ],
      complianceMetrics: {
        totalRecords: 1247,
        verifiedRecords: 1247,
        modifiedRecords: 23,
        deletedRecords: 8,
        integrityScore: 99.7
      }
    }
    setHistoricalData(mockSnapshot)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historical Data Viewer</CardTitle>
          <CardDescription>View the exact state of posts as they appeared at any point in time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Date</label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Select Time</label>
              <Input type="time" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button onClick={handleViewSnapshot} disabled={!selectedDate || !selectedTime} className="w-full">
                <Database className="w-4 h-4 mr-2" />
                View Snapshot
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {historicalData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Snapshot: {historicalData.timestamp}
            </CardTitle>
            <CardDescription>Historical state retrieved from Aptos blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                {historicalData.totalPosts} posts active at this time
              </Badge>
            </div>

            <div className="space-y-4">
              {historicalData.posts.map((post: any) => (
                <div key={post.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{post.author}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={post.status === "active" ? "default" : "destructive"}>{post.status}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.originalTimestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm">{post.content}</p>
                  {post.status === "deleted" && (
                    <p className="text-xs text-destructive mt-2">
                      Deleted at: {new Date(post.deletedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
