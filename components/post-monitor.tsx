"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useAptos } from "./aptos-provider"
import { ExternalLink, Shield, AlertTriangle, CheckCircle, Play, Pause, Plus, RefreshCw } from "lucide-react"

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
  verificationStatus?: "verified" | "pending" | "failed"
  txHash?: string
}

interface MonitorStatus {
  monitoredPosts: number
  instances: number
  lastSync: string
}

export function PostMonitor() {
  const { connected, submitTransaction } = useAptos()
  const [posts, setPosts] = useState<MonitoredPost[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [monitorStatus, setMonitorStatus] = useState<MonitorStatus>({
    monitoredPosts: 0,
    instances: 0,
    lastSync: "Never",
  })
  const [newInstanceUrl, setNewInstanceUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("/api/activitypub/monitor?action=posts")
      const data = await response.json()
      if (data.posts) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    }
  }, [])

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/activitypub/monitor?action=status")
      const data = await response.json()
      setMonitorStatus(data)
    } catch (error) {
      console.error("Failed to fetch status:", error)
    }
  }, [])

  const syncActivityPub = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/activitypub/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sync" }),
      })

      const result = await response.json()
      if (result.success) {
        await fetchPosts()
        await fetchStatus()
      }
    } catch (error) {
      console.error("Sync failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addInstance = async () => {
    if (!newInstanceUrl.trim()) return

    try {
      const response = await fetch("/api/activitypub/monitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_instance",
          instanceUrl: newInstanceUrl.trim(),
        }),
      })

      const result = await response.json()
      if (result.success) {
        setNewInstanceUrl("")
        await fetchStatus()
      }
    } catch (error) {
      console.error("Failed to add instance:", error)
    }
  }

  const handleVerifyPost = async (post: MonitoredPost) => {
    if (!connected) return

    const payload = {
      type: "entry_function_payload",
      function: "0x1::audit_trail::log_post_with_history",
      arguments: [
        post.activityPubId,
        post.content,
        post.author,
        Math.floor(new Date(post.timestamp).getTime() / 1000).toString(),
        post.status,
        JSON.stringify(post.modificationHistory),
      ],
      type_arguments: [],
    }

    const txHash = await submitTransaction(payload)
    if (txHash) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, verificationStatus: "verified" as const, txHash } : p)),
      )
    }
  }

  useEffect(() => {
    fetchPosts()
    fetchStatus()
  }, [fetchPosts, fetchStatus])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isMonitoring) {
      interval = setInterval(() => {
        syncActivityPub()
      }, 30000) // Sync every 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMonitoring])

  const getStatusIcon = (post: MonitoredPost) => {
    if (post.verificationStatus === "verified") {
      return <CheckCircle className="h-4 w-4 text-primary" />
    }
    if (post.status === "modified") {
      return <Shield className="h-4 w-4 text-destructive" />
    }
    return <AlertTriangle className="h-4 w-4 text-secondary" />
  }

  const getStatusBadge = (post: MonitoredPost) => {
    if (post.verificationStatus === "verified") {
      return <Badge className="bg-primary/10 text-primary border-primary/20">Verified</Badge>
    }
    if (post.status === "modified") {
      return <Badge variant="destructive">Modified</Badge>
    }
    return (
      <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
        Pending
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ActivityPub Monitor Control</CardTitle>
              <CardDescription>
                Monitor {monitorStatus.instances} instances • {monitorStatus.monitoredPosts} posts tracked
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={isMonitoring ? "destructive" : "default"} onClick={() => setIsMonitoring(!isMonitoring)}>
                {isMonitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isMonitoring ? "Stop Monitor" : "Start Monitor"}
              </Button>
              <Button variant="outline" onClick={syncActivityPub} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Sync Now
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add ActivityPub instance (e.g., https://mastodon.social)"
              value={newInstanceUrl}
              onChange={(e) => setNewInstanceUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addInstance} disabled={!newInstanceUrl.trim()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Instance
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Last sync: {new Date(monitorStatus.lastSync).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monitored Posts</CardTitle>
          <CardDescription>Real-time ActivityPub post tracking with change detection</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Changes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(post)}
                      {getStatusBadge(post)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{post.author.split("/").pop() || post.author}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={post.content}>
                      {post.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                      {post.content.length > 100 && "..."}
                    </div>
                    {post.status === "modified" && post.originalContent && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Original: {post.originalContent.replace(/<[^>]*>/g, "").substring(0, 50)}...
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{new Date(post.timestamp).toLocaleString()}</div>
                    {post.lastModified && (
                      <div className="text-xs text-muted-foreground">
                        Modified: {new Date(post.lastModified).toLocaleString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {post.modificationHistory.length} events
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {post.verificationStatus !== "verified" && (
                        <Button size="sm" onClick={() => handleVerifyPost(post)} disabled={!connected}>
                          Verify
                        </Button>
                      )}
                      <Button size="sm" variant="outline" asChild>
                        <a href={post.activityPubId} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                      {post.txHash && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`https://explorer.aptoslabs.com/txn/${post.txHash}?network=testnet`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View TX
                          </a>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No posts monitored yet. Start monitoring to begin tracking ActivityPub posts.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
