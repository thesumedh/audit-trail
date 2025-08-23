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
      totalPosts: 892,
      posts: [
        {
          id: "1",
          author: "@financial.news",
          content: "Market analysis shows strong Q3 performance...",
          originalTimestamp: "2024-01-15T10:30:00Z",
          status: "active",
        },
        {
          id: "2",
          author: "@market.updates",
          content: "This post was later deleted but preserved in audit trail",
          originalTimestamp: "2024-01-15T09:15:00Z",
          status: "deleted",
          deletedAt: "2024-01-15T14:22:00Z",
        },
      ],
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
