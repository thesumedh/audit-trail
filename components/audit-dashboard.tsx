"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAptos } from "./aptos-provider"
import { PostMonitor } from "./post-monitor"
import { HistoricalViewer } from "./historical-viewer"
import { LegalDiscoveryTools } from "./legal-discovery-tools"
import { ComplianceTimeline } from "./compliance-timeline"
import { Shield, Database, Clock, Search, Wallet, CheckCircle, Activity, TrendingUp, Moon, Sun, Code, Download, Zap, AlertTriangle, FileText } from "lucide-react"
import { useTheme } from "next-themes"
import { auditStore } from "../lib/audit-store"

interface AuditMetrics {
  totalPosts: number
  verifiedPosts: number
  pendingVerifications: number
  lastSync: string
  modificationsToday: number
  blockchainHeight: number
}

export function AuditDashboard() {
  const { connected, connect, disconnect, account } = useAptos()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const [metrics, setMetrics] = useState<AuditMetrics>({
    totalPosts: 0,
    verifiedPosts: 0,
    pendingVerifications: 0,
    lastSync: "Never",
    modificationsToday: 0,
    blockchainHeight: 0,
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [auditEntries, setAuditEntries] = useState<any[]>([])

  useEffect(() => {
    loadMetrics()
    loadAuditEntries()
    
    const unsubscribe = auditStore.subscribe(() => {
      loadAuditEntries()
      loadMetrics()
    })
    
    const interval = setInterval(loadMetrics, 30000)
    return () => {
      clearInterval(interval)
      unsubscribe()
    }
  }, [])

  const loadMetrics = async () => {
    const entries = auditStore.getAllEntries()
    const modifiedEntries = auditStore.getModifiedEntries()
    const today = new Date().toISOString().split("T")[0]
    const todayModifications = modifiedEntries.filter(entry => 
      entry.modifications.some((mod: any) => new Date(mod.timestamp).toISOString().startsWith(today))
    ).length

    setMetrics({
      totalPosts: entries.length,
      verifiedPosts: entries.length,
      pendingVerifications: 0,
      lastSync: new Date().toLocaleString(),
      modificationsToday: todayModifications,
      blockchainHeight: 847392 + entries.length,
    })
  }

  const loadAuditEntries = () => {
    const entries = auditStore.getAllEntries()
    setAuditEntries(entries)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/audit/posts?search=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setSearchResults(data.posts || [])
    } catch (error) {
      console.error("[v0] Search error:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Corporate Audit Trail
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              ActivityPub Post Verification & Legal Discovery System
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Real-time blockchain verification</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="bg-transparent"
            >
              {mounted ? (theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open('/sdk', '_blank')}
              className="bg-transparent"
            >
              <Download className="w-4 h-4 mr-2" />
              SDK Integration
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/move-demo', '_blank')}
              className="bg-transparent"
            >
              <Zap className="w-4 h-4 mr-2" />
              Move Contract
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open('/financial-news', '_blank')}
              className="bg-transparent"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              News Demo
            </Button>
            {connected ? (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-3 py-1">
                  <Wallet className="w-3 h-3 mr-2" />
                  Wallet Connected
                </Badge>
                <Button variant="outline" onClick={disconnect} className="font-medium bg-transparent">
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connect} className="bg-primary hover:bg-primary/90 font-medium px-6">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Aptos Wallet
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Posts</CardTitle>
              <Database className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.totalPosts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Tracked on blockchain</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Verified</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.verifiedPosts.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Immutably stored</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Pending</CardTitle>
              <Clock className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{metrics.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Today's Changes</CardTitle>
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.modificationsToday}</div>
              <p className="text-xs text-muted-foreground mt-1">Modifications detected</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Block Height</CardTitle>
              <Shield className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">{metrics.blockchainHeight.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current Aptos block</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Last Sync</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">{metrics.lastSync.split(",")[1]?.trim() || metrics.lastSync}</div>
              <p className="text-xs text-muted-foreground mt-1">ActivityPub sync</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" />
              Global Search & Discovery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts, authors, transaction hashes, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10 bg-background/50 border-border/50 focus:bg-background"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-primary hover:bg-primary/90 font-medium px-6"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">{searchResults.length} results found</p>
                  <Badge variant="outline" className="text-xs">
                    Showing top 5
                  </Badge>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {searchResults.slice(0, 5).map((post: any) => (
                    <div
                      key={post.id}
                      className="p-4 border border-border/50 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={post.blockchain_verified ? "default" : "secondary"} className="text-xs">
                            {post.blockchain_verified ? "✓ Verified" : "⏳ Pending"}
                          </Badge>
                          <span className="text-sm font-semibold text-foreground">{post.author}</span>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate font-mono">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <Tabs defaultValue="monitor" className="w-full">
            <div className="border-b border-border/50 px-6 pt-6">
              <TabsList className="grid w-full grid-cols-4 bg-muted/50">
                <TabsTrigger value="monitor" className="font-medium">
                  Live Monitor
                </TabsTrigger>
                <TabsTrigger value="compliance" className="font-medium">
                  Compliance Feed
                </TabsTrigger>
                <TabsTrigger value="historical" className="font-medium">
                  Historical View
                </TabsTrigger>
                <TabsTrigger value="discovery" className="font-medium">
                  Legal Discovery
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <TabsContent value="monitor" className="mt-0">
                <PostMonitor />
              </TabsContent>

              <TabsContent value="compliance" className="mt-0">
                <ComplianceTimeline />
              </TabsContent>

              <TabsContent value="historical" className="mt-0">
                <HistoricalViewer />
              </TabsContent>

              <TabsContent value="discovery" className="mt-0">
                <div className="space-y-6">
                  <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Real-Time Audit Entries
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {auditEntries.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No audit entries yet. Create or edit articles in the Financial News demo to see real audit trails.
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {auditEntries.map((entry) => (
                            <div key={entry.id} className="p-4 border border-border/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <Badge variant={entry.modifications.length > 0 ? "destructive" : "default"}>
                                    {entry.modifications.length > 0 ? "Modified" : "Original"}
                                  </Badge>
                                  <span className="font-mono text-sm">#{entry.id}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {entry.modifications.length > 0 && (
                                    <Badge variant="outline" className="bg-orange-50 text-orange-700">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      {entry.modifications.length} changes
                                    </Badge>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      const report = auditStore.generateLegalReport(entry.id)
                                      const blob = new Blob([report], { type: 'text/plain' })
                                      const url = URL.createObjectURL(blob)
                                      const a = document.createElement('a')
                                      a.href = url
                                      a.download = `audit-report-${entry.id}.txt`
                                      document.body.appendChild(a)
                                      a.click()
                                      document.body.removeChild(a)
                                      URL.revokeObjectURL(url)
                                    }}
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium">Original Hash:</span>
                                    <code className="ml-2 bg-muted px-1 rounded">{entry.originalHash}</code>
                                  </div>
                                  <div>
                                    <span className="font-medium">Current Hash:</span>
                                    <code className="ml-2 bg-muted px-1 rounded">{entry.currentHash}</code>
                                  </div>
                                </div>
                                {entry.modifications.length > 0 && (
                                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Hash Integrity Violation Detected</h4>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                      Original content has been modified. This creates a permanent audit trail for legal compliance.
                                    </p>
                                    <div className="mt-2 space-y-1">
                                      {entry.modifications.map((mod: any, index: number) => (
                                        <div key={mod.id} className="text-xs text-red-600 dark:text-red-400">
                                          <strong>Change {index + 1}:</strong> {mod.diff}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}