"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Search,
  Wallet,
  Play,
  RefreshCw,
  Plus,
  Eye,
  Calendar,
  Download,
  Shield,
  BarChart3,
  Moon,
  Sun,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Bot,
  Layers,
  TrendingUp,
  Link,
  Activity,
  Database,
  Globe,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Post {
  id: string
  author: string
  content: string
  timestamp: string
  status: "verified" | "pending" | "modified" | "integrity-compromised"
  changes: number
  hash: string
  blockHeight: number
  aiScore?: number
  zkProof?: boolean
  defiTrigger?: boolean
  previousHash?: string
  gasUsed?: number
}

interface Stats {
  totalPosts: number
  verified: number
  pending: number
  todayChanges: number
  feedEarned: number
  hashChainIntegrity: number
}

const liveUpdates = true

export default function ImmutableFeedDashboard() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("monitor")
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [feedBalance, setFeedBalance] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    verified: 0,
    pending: 0,
    todayChanges: 0,
    feedEarned: 0,
    hashChainIntegrity: 100,
  })
  const [posts, setPosts] = useState<Post[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [blockHeight, setBlockHeight] = useState(12345678)
  const [modificationAlert, setModificationAlert] = useState<string | null>(null)
  const [selectedTimepoint, setSelectedTimepoint] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const [demoContent, setDemoContent] = useState("")
  const [demoAuthor, setDemoAuthor] = useState("")
  const [isLoggingPost, setIsLoggingPost] = useState(false)
  const [lastLoggedPost, setLastLoggedPost] = useState<Post | null>(null)

  const [selectedPersona, setSelectedPersona] = useState<"healthcare" | "banking" | "corporate" | "regulator">(
    "corporate",
  )
  const [regulatorMode, setRegulatorMode] = useState(false)

  useEffect(() => {
    const mockStats = {
      totalPosts: 1247,
      verified: 1198,
      pending: 26,
      todayChanges: 23,
      feedEarned: 45.75,
      hashChainIntegrity: 99.8,
    }
    setStats(mockStats)

    const mockPosts: Post[] = [
      {
        id: "1",
        author: "@compliance_officer",
        content:
          "Patient record #PR-2025-0115 updated with new treatment protocol. All modifications logged for regulatory compliance...",
        timestamp: "2025-01-15 14:30:22",
        status: "verified",
        changes: 0,
        hash: "0xa1b2c3d4e5f67890",
        previousHash: "0x9876543210abcdef",
        blockHeight: 12345678,
        aiScore: 0.95,
        zkProof: true,
        defiTrigger: true,
        gasUsed: 0.0023,
      },
      {
        id: "2",
        author: "@risk_manager",
        content:
          "Transaction audit report #TA-2025-0115 shows compliance with SOX requirements. All financial records verified and immutable...",
        timestamp: "2025-01-15 13:45:11",
        status: "modified",
        changes: 2,
        hash: "0xe5f6g7h8i9j0k1l2",
        previousHash: "0xa1b2c3d4e5f67890",
        blockHeight: 12345677,
        aiScore: 0.72,
        zkProof: false,
        defiTrigger: false,
        gasUsed: 0.0019,
      },
      {
        id: "3",
        author: "@audit_department",
        content:
          "Quarterly compliance review completed. All departmental records meet regulatory standards with full audit trail maintained...",
        timestamp: "2025-01-15 12:15:33",
        status: "pending",
        changes: 0,
        hash: "0xf9g8h7i6j5k4l3m2",
        previousHash: "0xe5f6g7h8i9j0k1l2",
        blockHeight: 12345676,
        aiScore: 0.88,
        zkProof: true,
        defiTrigger: true,
        gasUsed: 0.0031,
      },
    ]
    setPosts(mockPosts)
  }, [])

  useEffect(() => {
    if (liveUpdates && isMonitoring) {
      const interval = setInterval(() => {
        setLastSync(new Date())
        if (Math.random() < 0.1) {
          setModificationAlert("Record #2 has been modified - review required for compliance audit")
          setTimeout(() => setModificationAlert(null), 5000)
        }
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [liveUpdates, isMonitoring])

  const connectWallet = async () => {
    setIsConnecting(true)
    try {
      if (typeof window !== "undefined" && (window as any).aptos) {
        const response = await (window as any).aptos.connect()
        setIsConnected(true)
        setWalletAddress(response.address.slice(0, 6) + "..." + response.address.slice(-4))

        const balanceResponse = await fetch("/api/wallet/balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: response.address }),
        })
        const balanceData = await balanceResponse.json()
        setFeedBalance(balanceData.balance || 0)
      } else {
        throw new Error("Petra wallet not found")
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      alert("Failed to connect Petra wallet. Please make sure it's installed and unlocked.")
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).aptos) {
        await (window as any).aptos.disconnect()
      }
    } catch (error) {
      console.error("Error disconnecting wallet:", error)
    }
    setIsConnected(false)
    setWalletAddress("")
    setFeedBalance(0)
  }

  const toggleMonitoring = async () => {
    const newState = !isMonitoring
    setIsMonitoring(newState)

    try {
      await fetch("/api/monitor/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monitoring: newState }),
      })
      setLastSync(new Date())
    } catch (error) {
      console.error("Failed to toggle monitoring:", error)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch("/api/posts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await response.json()
      if (data.results) {
        setPosts(data.results)
      }
    } catch (error) {
      console.error("Search failed:", error)
      alert("Search failed. Please try again.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch("/api/posts/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      setLastSync(new Date())
      setBlockHeight(data.blockHeight || blockHeight)
      if (data.success) {
        setStats((prev) => ({
          ...prev,
          totalPosts: data.totalMonitored || prev.totalPosts,
        }))
      }
    } catch (error) {
      console.error("Sync failed:", error)
      alert("Sync failed. Please try again.")
    } finally {
      setIsSyncing(false)
    }
  }

  const handleLogPost = async () => {
    if (!demoContent.trim() || !demoAuthor.trim()) {
      alert("Please enter both content and author")
      return
    }

    setIsLoggingPost(true)
    try {
      const response = await fetch("/api/posts/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: demoContent,
          author: demoAuthor,
        }),
      })
      const data = await response.json()

      if (data.success) {
        const newPost: Post = {
          id: data.post.id,
          author: data.post.author,
          content: data.post.content,
          timestamp: new Date(data.post.timestamp).toLocaleString(),
          status: "verified",
          changes: 0,
          hash: data.post.hash,
          blockHeight: blockHeight + 1,
          aiScore: data.post.aiScore,
          zkProof: data.post.zkProof,
          defiTrigger: false,
          gasUsed: 0.0015,
        }

        setLastLoggedPost(newPost)
        setPosts((prev) => [newPost, ...prev])
        setStats((prev) => ({
          ...prev,
          totalPosts: prev.totalPosts + 1,
          verified: prev.verified + 1,
        }))
        setBlockHeight((prev) => prev + 1)
        setDemoContent("")
        setDemoAuthor("")
      }
    } catch (error) {
      console.error("Failed to log post:", error)
      alert("Failed to log post. Please try again.")
    } finally {
      setIsLoggingPost(false)
    }
  }

  const generateLegalReport = async () => {
    setIsGeneratingReport(true)
    try {
      const response = await fetch("/api/reports/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseNumber: `CASE-${Date.now()}`,
          dateRange: { start: "2025-01-01", end: new Date().toISOString() },
        }),
      })

      const data = await response.json()
      if (data.success) {
        const element = document.createElement("a")
        const file = new Blob(
          [
            `Legal Report Generated: ${data.report.caseNumber}\nGenerated: ${data.report.generatedAt}\nTotal Posts: ${data.report.totalPosts}\nIntegrity Hash: ${data.report.integrityHash}`,
          ],
          { type: "text/plain" },
        )
        element.href = URL.createObjectURL(file)
        element.download = `legal-report-${data.report.caseNumber}.txt`
        document.body.appendChild(element)
        element.click()
        document.body.removeChild(element)
      }
    } catch (error) {
      console.error("Report generation failed:", error)
      alert("Failed to generate legal report. Please try again.")
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500 hover:bg-green-600"
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "changed":
        return "bg-orange-500 hover:bg-orange-600"
      case "modified":
        return "bg-yellow-500 hover:bg-yellow-600 animate-pulse"
      case "integrity-compromised":
        return "bg-red-500 hover:bg-red-600 animate-pulse"
      default:
        return "bg-gray-500"
    }
  }

  const getPersonaModules = () => {
    switch (selectedPersona) {
      case "healthcare":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Patient Record Access Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">847</div>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">HIPAA-compliant access logs</p>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  HIPAA Compliance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">98.7%</div>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">Privacy protection rate</p>
              </CardContent>
            </Card>
          </div>
        )
      case "banking":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  High-Value Transaction Ledger
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">$2.4M</div>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Tracked transactions today</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Fraud Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">3</div>
                <p className="text-xs text-red-600/70 dark:text-red-400/70">Active investigations</p>
              </CardContent>
            </Card>
          </div>
        )
      case "corporate":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  Board Records Vault
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">156</div>
                <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Governance documents secured</p>
              </CardContent>
            </Card>
            <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Disclosure Tracker
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">12</div>
                <p className="text-xs text-orange-600/70 dark:text-orange-400/70">Pending SEC filings</p>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  const RegulatorModeView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Regulator/Auditor Mode</h2>
        <Button onClick={() => setRegulatorMode(false)} variant="outline">
          Exit Regulator Mode
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Record Integrity Proofs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
            <p className="text-xs text-green-600/70 dark:text-green-400/70">Cryptographically verified</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
            <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Chronological entries</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Evidence Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
              Download Evidence
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Simplified Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${post.status === "verified" ? "bg-green-500" : "bg-yellow-500"}`}
                  />
                  <span className="font-mono text-sm">{post.id.substring(0, 8)}...</span>
                  <Badge variant="outline">{post.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{new Date(post.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (regulatorMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <RegulatorModeView />
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-25 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <header className="sticky top-0 z-50 w-full border-b-2 border-purple-200/50 dark:border-gray-800 bg-gradient-to-r from-purple-50/80 via-white/80 to-indigo-50/80 dark:from-gray-950/80 dark:via-gray-900/80 dark:to-gray-950/80 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent font-mono">
                AptosAudit
              </h1>
              <nav className="hidden lg:flex items-center">
                <div className="flex border-2 border-purple-300 dark:border-gray-600 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                  <Button
                    variant={activeTab === "monitor" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("monitor")}
                    className={`text-xs sm:text-sm border-r-2 border-purple-300 dark:border-gray-600 rounded-r-none ${
                      activeTab === "monitor"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-transparent hover:bg-purple-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Monitor
                  </Button>
                  <Button
                    variant={activeTab === "historical" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("historical")}
                    className={`text-xs sm:text-sm border-r-2 border-purple-300 dark:border-gray-600 rounded-none ${
                      activeTab === "historical"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-transparent hover:bg-purple-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Historical
                  </Button>
                  <Button
                    variant={activeTab === "legal" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setActiveTab("legal")}
                    className={`text-xs sm:text-sm rounded-l-none ${
                      activeTab === "legal"
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-transparent hover:bg-purple-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    Legal
                  </Button>
                </div>
              </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>

              {isConnected ? (
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs sm:text-sm bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  >
                    {feedBalance.toFixed(2)} $FEED
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={disconnectWallet}
                    className="hidden sm:flex bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-purple-300 dark:border-gray-600"
                  >
                    <Wallet className="h-4 w-4 mr-2" />
                    <span className="font-mono">{walletAddress}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={disconnectWallet}
                    className="sm:hidden bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-purple-300 dark:border-gray-600"
                  >
                    <Wallet className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-xs sm:text-sm font-mono"
                >
                  <Wallet className="h-4 w-4 mr-1 sm:mr-2" />
                  {isConnecting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      <span className="hidden sm:inline">Connecting...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline font-mono">Connect Petra</span>
                      <span className="sm:hidden font-mono">Connect</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </header>

        {modificationAlert && (
          <Alert className="mx-4 sm:mx-6 mt-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-semibold text-yellow-700 dark:text-yellow-300">
              {modificationAlert}
            </AlertDescription>
          </Alert>
        )}

        <div className="container mx-auto px-4 py-8">
          {/* Enhanced Header with Persona Selection */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">AptosAudit - Enterprise Compliance Platform</h1>
              <p className="text-muted-foreground">
                Immutable audit trails for enterprise compliance and regulatory reporting
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedPersona} onValueChange={(value: any) => setSelectedPersona(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthcare">Healthcare (Maria)</SelectItem>
                  <SelectItem value="banking">Banking (James)</SelectItem>
                  <SelectItem value="corporate">Corporate (Samantha)</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setRegulatorMode(true)} variant="outline">
                <Shield className="w-4 h-4 mr-2" />
                Regulator Mode
              </Button>
            </div>
          </div>

          {/* Persona-Specific Modules */}
          {getPersonaModules()}

          {/* Enhanced Compliance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                  Records Verified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.8%</div>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">Integrity maintained</p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Recent Modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">7</div>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Active Regulations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">HIPAA/SOX</div>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Compliance active</p>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                  Generate PDF/CSV
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="w-full">
            {/* Mobile tab navigation */}
            <div className="lg:hidden mb-4">
              <div className="grid grid-cols-3 border-2 border-purple-300 dark:border-gray-600 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                <Button
                  variant={activeTab === "monitor" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("monitor")}
                  className={`text-xs border-r-2 border-purple-300 dark:border-gray-600 rounded-r-none ${
                    activeTab === "monitor"
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-transparent hover:bg-purple-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Monitor
                </Button>
                <Button
                  variant={activeTab === "historical" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("historical")}
                  className={`text-xs border-r-2 border-purple-300 dark:border-gray-600 rounded-none ${
                    activeTab === "historical"
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-transparent hover:bg-purple-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Historical
                </Button>
                <Button
                  variant={activeTab === "legal" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("legal")}
                  className={`text-xs rounded-l-none ${
                    activeTab === "legal"
                      ? "bg-purple-600 text-white hover:bg-purple-700"
                      : "bg-transparent hover:bg-purple-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Legal
                </Button>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "monitor" && (
              <div className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="hover-scale transition-all duration-200 border-2 border-purple-300/50 dark:border-gray-600 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/30 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl sm:text-3xl font-bold text-primary">
                            {stats.totalPosts.toLocaleString()}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Total Records</p>
                        </div>
                        <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-scale transition-all duration-200 border-2 border-purple-300/50 dark:border-gray-600 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/30 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl sm:text-3xl font-bold text-green-500">
                            {stats.verified.toLocaleString()}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Verified</p>
                        </div>
                        <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-scale transition-all duration-200 border-2 border-purple-300/50 dark:border-gray-600 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/30 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl sm:text-3xl font-bold text-yellow-500">{stats.pending}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Pending</p>
                        </div>
                        <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-scale transition-all duration-200 border-2 border-purple-300/50 dark:border-gray-600 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/30 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl sm:text-3xl font-bold text-blue-500">{stats.todayChanges}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">Modifications</p>
                        </div>
                        <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-2 border-purple-300/50 dark:border-gray-600 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/30 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search posts, authors, hashes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-purple-300 dark:border-gray-600"
                          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleSearch}
                          disabled={isSearching}
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 flex-1 sm:flex-none"
                        >
                          {isSearching ? (
                            <RefreshCw className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                          ) : (
                            <Search className="h-4 w-4 mr-1 sm:mr-2" />
                          )}
                          <span className="hidden sm:inline">Search</span>
                          <span className="sm:hidden">Search</span>
                        </Button>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={generateLegalReport}
                              disabled={isGeneratingReport}
                              variant="outline"
                              className="bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900 border-green-300 dark:border-green-700 flex-1 sm:flex-none"
                            >
                              {isGeneratingReport ? (
                                <RefreshCw className="h-4 w-4 mr-1 sm:mr-2 animate-spin" />
                              ) : (
                                <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                              )}
                              <span className="hidden sm:inline">Legal Report</span>
                              <span className="sm:hidden">Report</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download court-ready report with cryptographic proofs</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-300/50 dark:border-gray-600 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/30 backdrop-blur-sm">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="space-y-2">
                        <p className="font-semibold flex items-center text-sm sm:text-base">
                          <Activity className="h-4 w-4 mr-2" />
                          Monitor 5 instances • {stats.totalPosts.toLocaleString()} posts tracked
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground italic">
                          Last sync: {lastSync.toLocaleString()} • Gas used: 0.0073 APT
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          onClick={toggleMonitoring}
                          size="sm"
                          className={isMonitoring ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}
                        >
                          <Play className="h-4 w-4 mr-1 sm:mr-2" />
                          {isMonitoring ? "Stop" : "Start"}
                        </Button>
                        <Button
                          onClick={handleSync}
                          disabled={isSyncing}
                          variant="outline"
                          size="sm"
                          className="border-purple-300 dark:border-gray-600 bg-transparent"
                        >
                          <RefreshCw className={`h-4 w-4 mr-1 sm:mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                          Sync
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-300 dark:border-gray-600 bg-transparent"
                        >
                          <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-purple-200/50 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-sm sm:text-base">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 sm:p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full table-striped min-w-[800px]">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Status</th>
                            <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Author</th>
                            <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Content</th>
                            <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Timestamp</th>
                            <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Features</th>
                            <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {posts.map((post) => (
                            <tr
                              key={post.id}
                              className={`border-b hover:bg-muted/50 transition-colors ${post.status === "modified" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}`}
                            >
                              <td className="p-2 sm:p-3">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className={`status-pill ${getStatusColor(post.status)} cursor-help text-xs`}>
                                      {post.status === "verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                                      {post.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                      {post.status === "modified" && <AlertTriangle className="h-3 w-3 mr-1" />}
                                      {post.status === "integrity-compromised" && (
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                      )}
                                      {post.status}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {post.status === "modified"
                                        ? "Record modified after initial entry - review required for compliance"
                                        : `Record is ${post.status} on Aptos blockchain`}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                              <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">{post.author}</td>
                              <td className="p-2 sm:p-3 max-w-xs">
                                <p className="truncate text-xs sm:text-sm">{post.content}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className="text-xs text-muted-foreground font-mono">
                                    {post.hash.substring(0, 12)}...
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant="link" className="p-0 h-auto text-primary text-xs">
                                        View
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="max-w-xs space-y-2">
                                        <p>{post.content}</p>
                                        <p className="text-xs font-mono">Hash: {post.hash}</p>
                                        <p className="text-xs">Gas: {post.gasUsed} APT</p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </td>
                              <td className="p-2 sm:p-3 text-xs text-muted-foreground font-mono">{post.timestamp}</td>
                              <td className="p-2 sm:p-3">
                                <div className="flex flex-wrap items-center gap-1">
                                  {post.aiScore && post.aiScore > 0.8 && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                        >
                                          <Bot className="h-3 w-3 mr-1" />
                                          {Math.round(post.aiScore * 100)}%
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>AI authenticity score: {Math.round(post.aiScore * 100)}%</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {post.zkProof && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                        >
                                          <Layers className="h-3 w-3 mr-1" />
                                          ZK
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Zero-knowledge proof verified - privacy preserved</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {post.defiTrigger && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Badge
                                          variant="secondary"
                                          className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                        >
                                          <TrendingUp className="h-3 w-3 mr-1" />
                                          DeFi
                                        </Badge>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>DeFi market trigger activated - automated trading enabled</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                                  {post.changes > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                      {post.changes} edits
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="p-2 sm:p-3">
                                <div className="flex items-center space-x-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View full post and hash chain</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="outline">
                                        <Link className="h-3 w-3 sm:h-4 sm:w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>View on Aptos Explorer</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "historical" && (
              <div className="space-y-4 sm:space-y-6">
                <Card className="border-2 border-purple-200/50 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm sm:text-base">
                      <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Point-in-Time Reconstruction
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Query Timestamp</label>
                        <Input
                          type="datetime-local"
                          value={selectedTimepoint}
                          onChange={(e) => setSelectedTimepoint(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Post ID/Hash</label>
                        <Input placeholder="Enter post ID or hash..." />
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button className="btn-primary flex-1 sm:flex-none">
                        <Database className="h-4 w-4 mr-2" />
                        Reconstruct State
                      </Button>
                      <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Export Timeline
                      </Button>
                    </div>

                    <Card className="bg-muted/30">
                      <CardHeader>
                        <CardTitle className="text-sm">Demo: Financial News Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">2024-01-15 14:30:22</p>
                              <p className="text-xs text-muted-foreground">
                                Fed announces rate increase - Original post
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              CREATE
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">2024-01-15 14:45:11</p>
                              <p className="text-xs text-muted-foreground">
                                Content clarification - Modification tracked
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              UPDATE
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold">2024-01-15 15:12:33</p>
                              <p className="text-xs text-muted-foreground">Enhancement added - Version controlled</p>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                              ENHANCE
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "legal" && (
              <div className="space-y-4 sm:space-y-6">
                <Card className="border-2 border-purple-200/50 dark:border-gray-700 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm sm:text-base">
                      <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                      Legal Discovery & Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Discovery Date Range</label>
                        <Input type="datetime-local" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Case Reference</label>
                        <Input placeholder="SEC-2024-001..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="zk-proof" className="rounded" />
                        <label htmlFor="zk-proof" className="text-sm">
                          Include ZK Proof
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="hash-chain" className="rounded" defaultChecked />
                        <label htmlFor="hash-chain" className="text-sm">
                          Hash Chain Proof
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="digital-sig" className="rounded" defaultChecked />
                        <label htmlFor="digital-sig" className="text-sm">
                          Digital Signatures
                        </label>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button
                        onClick={generateLegalReport}
                        className="bg-green-500 hover:bg-green-600 flex-1 sm:flex-none"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Court Report
                      </Button>
                      <Button variant="outline" className="flex-1 sm:flex-none bg-transparent">
                        <Globe className="h-4 w-4 mr-2" />
                        Notarize on Chain
                      </Button>
                    </div>

                    <Card className="bg-muted/30">
                      <CardHeader>
                        <CardTitle className="text-sm">Legal Report Contents</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Cryptographic hash verification</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Aptos blockchain transaction proofs</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Immutable timestamp attestations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Chain of custody documentation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Court-admissible format (PDF/A)</span>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <footer className="border-t-2 border-purple-200/50 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-muted-foreground space-y-2 sm:space-y-0">
              <p className="text-center sm:text-left">
                Powered by Aptos • Block: {blockHeight.toLocaleString()} • Sync: {lastSync.toLocaleTimeString()}
              </p>
              <div className="flex items-center space-x-4">
                <Button variant="link" className="p-0 h-auto text-muted-foreground text-xs sm:text-sm">
                  Privacy Policy
                </Button>
                <Button variant="link" className="p-0 h-auto text-muted-foreground text-xs sm:text-sm">
                  API Docs
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  )
}
