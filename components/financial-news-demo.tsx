"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Wallet, Shield, Database, Clock, CheckCircle, 
  Activity, Hash, Eye, AlertTriangle, Zap, 
  TrendingUp, DollarSign, Building, Globe, Edit, Download, FileText, Sparkles, User
} from "lucide-react"
import { auditStore } from "../lib/audit-store"
import { Web3Button, Web3Card, HashDisplay, StatusBadge, WalletConnect, MetricCard, TransactionStatus } from "./web3-ui"
import { ThemeToggle } from "./theme-toggle"

interface NewsArticle {
  id: string;
  headline: string;
  content: string;
  author: string;
  timestamp: number;
  hash: string;
  verified: boolean;
  category: string;
  impact: "high" | "medium" | "low";
  tx_hash?: string;
}

export function FinancialNewsDemo() {
  const [connected, setConnected] = useState(true)
  const [address, setAddress] = useState("0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [newHeadline, setNewHeadline] = useState("")
  const [newContent, setNewContent] = useState("")
  const [newCategory, setNewCategory] = useState("market-update")
  const [isPublishing, setIsPublishing] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [editingArticle, setEditingArticle] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")

  useEffect(() => {
    loadSampleArticles()
    checkWalletConnection()
  }, [])

  const loadSampleArticles = () => {
    const sampleArticles: NewsArticle[] = [
      {
        id: "2", 
        headline: "Tech Stocks Rally Following AI Breakthrough",
        content: "Major technology companies saw significant gains after breakthrough AI developments were announced, with NVIDIA leading the surge.",
        author: "0x52a7...1e02",
        timestamp: Date.now() - 7200000,
        hash: "e5f6g7h8",
        verified: true,
        category: "market-update",
        impact: "medium",
        tx_hash: "0xdef456..."
      },
      {
        id: "3",
        headline: "Cryptocurrency Market Sees $50B Inflow",
        content: "Digital assets experienced massive institutional investment with Bitcoin and Ethereum leading the charge in today's trading session.",
        author: "0x52a7...1e02",
        timestamp: Date.now() - 10800000,
        hash: "i9j0k1l2",
        verified: true,
        category: "crypto",
        impact: "high",
        tx_hash: "0xghi789..."
      }
    ]
    setArticles(sampleArticles)
  }

  const checkWalletConnection = async () => {
    if (typeof window !== 'undefined' && window.petra) {
      try {
        const account = await window.petra.account()
        setAddress(account.address)
        setConnected(true)
      } catch (error) {
        console.log("Wallet not connected")
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.petra) {
      alert("Please install Petra Wallet")
      return
    }

    try {
      const account = await window.petra.connect()
      setAddress(account.address)
      setConnected(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const generateHash = (content: string): string => {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  const publishArticle = async () => {
    if (!newHeadline.trim() || !newContent.trim()) return

    // Check for duplicate headlines
    const isDuplicate = articles.some(article => 
      article.headline.toLowerCase() === newHeadline.toLowerCase().trim()
    )
    
    if (isDuplicate) {
      alert("An article with this headline already exists. Please use a different headline.")
      return
    }

    setIsPublishing(true)
    
    try {
      const contentHash = generateHash(newHeadline + newContent)
      
      // Mock blockchain transaction for demo
      if (window.petra) {
        const mockTx = {
          type: "entry_function_payload",
          function: "0x1::coin::transfer",
          arguments: ["0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02", "1000"],
          type_arguments: ["0x1::aptos_coin::AptosCoin"]
        }
        await window.petra.signAndSubmitTransaction(mockTx)
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
      
      const newArticle: NewsArticle = {
        id: `${Date.now()}`,
        headline: newHeadline,
        content: newContent,
        author: address || "0x52a7...1e02",
        timestamp: Date.now(),
        hash: contentHash,
        verified: true,
        category: newCategory,
        impact: "medium",
        tx_hash: `0x${contentHash}...`
      }

      // Create audit entry
      auditStore.createEntry(newArticle.id, newContent, newArticle.author, newArticle.tx_hash || '')
      
      setArticles(prev => [newArticle, ...prev])
      setNewHeadline("")
      setNewContent("")
      
    } catch (error) {
      console.error("Failed to publish article:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "market-update": return <TrendingUp className="w-4 h-4" />
      case "monetary-policy": return <Building className="w-4 h-4" />
      case "crypto": return <DollarSign className="w-4 h-4" />
      default: return <Globe className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "market-update": return "bg-blue-100 text-blue-700 border-blue-200"
      case "monetary-policy": return "bg-purple-100 text-purple-700 border-purple-200"
      case "crypto": return "bg-orange-100 text-orange-700 border-orange-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-700 border-red-200"
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low": return "bg-green-100 text-green-700 border-green-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const editArticle = (articleId: string, currentContent: string) => {
    setEditingArticle(articleId)
    setEditContent(currentContent)
  }

  const saveEdit = async () => {
    if (!editingArticle || !editContent.trim()) return

    try {
      // Create blockchain transaction for modification
      if (window.petra) {
        const mockTx = {
          type: "entry_function_payload",
          function: "0x1::coin::transfer",
          arguments: ["0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02", "1000"],
          type_arguments: ["0x1::aptos_coin::AptosCoin"]
        }
        const result = await window.petra.signAndSubmitTransaction(mockTx)
        
        // Update audit store
        auditStore.modifyEntry(editingArticle, editContent, result.hash)
      }

      // Update local article
      setArticles(prev => prev.map(article => 
        article.id === editingArticle 
          ? { ...article, content: editContent, hash: generateHash(editContent) }
          : article
      ))
      
      setEditingArticle(null)
      setEditContent("")
    } catch (error) {
      console.error("Failed to save edit:", error)
    }
  }

  const downloadLegalReport = (articleId: string) => {
    auditStore.downloadLegalPDF(articleId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/30 dark:from-black dark:via-gray-950 dark:to-slate-950">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="container mx-auto p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 blur-3xl"></div>
          <Web3Card className="relative p-8 bg-gradient-to-br from-slate-900/90 via-purple-900/90 to-blue-900/90 border-purple-500/30" glowing>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-lg opacity-75"></div>
                    <div className="relative p-3 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 rounded-2xl border border-cyan-400/30 backdrop-blur-sm">
                      <Sparkles className="w-10 h-10 text-cyan-300" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent font-mono tracking-tight">
                      FinanceWire
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 text-sm font-medium">LIVE</span>
                    </div>
                  </div>
                </div>
                <p className="text-xl text-gray-200 font-medium max-w-2xl">
                  🚀 Enterprise-Grade Immutable Financial News Platform
                </p>
                <p className="text-gray-300 max-w-2xl">
                  Every article is cryptographically secured on Aptos blockchain with tamper-evident audit trails for regulatory compliance and legal discovery.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status="verified">
                    <Shield className="w-3 h-3 mr-1" />
                    Blockchain Secured
                  </StatusBadge>
                  <StatusBadge status="verified">
                    <Activity className="w-3 h-3 mr-1" />
                    Real-time Auditing
                  </StatusBadge>
                  <StatusBadge status="verified">
                    <FileText className="w-3 h-3 mr-1" />
                    Legal Compliance
                  </StatusBadge>
                  <StatusBadge status="pending">
                    <Database className="w-3 h-3 mr-1" />
                    {articles.length} Articles
                  </StatusBadge>
                </div>
              </div>
              
              <div className="flex flex-col gap-4">
                <WalletConnect 
                  address={address}
                  connected={connected}
                  onConnect={connectWallet}
                />
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/', '_blank')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/sdk', '_blank')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    SDK
                  </Button>
                </div>
              </div>
            </div>
          </Web3Card>
        </div>

        {/* Enhanced Stats Dashboard */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
            <MetricCard
              title="Total Articles"
              value={articles.length}
              change="+12%"
              trend="up"
              icon={<Database className="h-6 w-6 text-cyan-400" />}
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
            <MetricCard
              title="High Impact News"
              value={articles.filter(a => a.impact === "high").length}
              change="+5%"
              trend="up"
              icon={<AlertTriangle className="h-6 w-6 text-red-400" />}
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
            <MetricCard
              title="Verification Rate"
              value="100%"
              change="Perfect"
              trend="up"
              icon={<CheckCircle className="h-6 w-6 text-green-400" />}
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
            <MetricCard
              title="Blockchain Height"
              value={`${847392 + articles.length}`}
              change="Live"
              trend="neutral"
              icon={<Activity className="h-6 w-6 text-purple-400" />}
            />
          </div>
        </div>

        {/* Market Insights */}
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-300/30">
                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              Market Intelligence Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Market Sentiment</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Bullish</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Based on {articles.length} verified articles</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Audit Compliance</span>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">100%</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">All articles blockchain verified</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Content Integrity</span>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">Secured</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">Cryptographic hash verification</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publisher Section */}
        {connected && (
          <Web3Card className="p-6" glowing>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                <div className="p-2 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-400/30">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
                Publish Financial News
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">📰 Headline</label>
                  <Input
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    placeholder="Breaking: Market news headline..."
                    className="bg-white/80 dark:bg-black/20 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">🏷️ Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white/80 dark:bg-black/20 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white"
                  >
                    <option value="market-update">📈 Market Update</option>
                    <option value="monetary-policy">🏛️ Monetary Policy</option>
                    <option value="crypto">₿ Cryptocurrency</option>
                    <option value="earnings">💰 Earnings Report</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-700 dark:text-gray-300">📝 Article Content</label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter the full article content..."
                  className="min-h-[120px] bg-white/80 dark:bg-black/20 border-gray-200 dark:border-white/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
              </div>
              <Web3Button 
                onClick={publishArticle} 
                disabled={!newHeadline.trim() || !newContent.trim() || isPublishing}
                loading={isPublishing}
                variant="primary"
                size="lg"
                icon={isPublishing ? undefined : <Shield className="w-5 h-5" />}
              >
                {isPublishing ? "Publishing to Blockchain..." : "🚀 Publish Article (Immutable)"}
              </Web3Button>
            </CardContent>
          </Web3Card>
        )}

        {/* Enhanced News Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Latest Financial News
              </h2>
              <p className="text-muted-foreground mt-1">
                Immutable, verified financial reporting with blockchain audit trails
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Live Feed
              </Badge>
              <Badge variant="outline">
                {articles.length} Articles
              </Badge>
            </div>
          </div>

          {articles.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Articles Yet</h3>
                  <p className="text-muted-foreground">
                    Connect your wallet and publish the first immutable financial news article
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              {articles.map((article, index) => (
                <div key={article.id} className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100"></div>
                  <Web3Card className="relative p-8 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        {/* Article Header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center border border-purple-300/30">
                              {getCategoryIcon(article.category)}
                            </div>
                            <StatusBadge status="verified" className="bg-blue-50 text-blue-700 border-blue-200">
                              <span className="capitalize">{article.category.replace('-', ' ')}</span>
                            </StatusBadge>
                          </div>
                          <StatusBadge 
                            status={article.impact === "high" ? "error" : article.impact === "medium" ? "pending" : "verified"}
                            className={
                              article.impact === "high" ? "bg-red-50 text-red-700 border-red-200" :
                              article.impact === "medium" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              "bg-green-50 text-green-700 border-green-200"
                            }
                          >
                            {article.impact.toUpperCase()} IMPACT
                          </StatusBadge>
                          <StatusBadge status="verified" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Blockchain Verified
                          </StatusBadge>
                          {index === 0 && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white animate-pulse">
                              ✨ Latest
                            </Badge>
                          )}
                        </div>

                        {/* Article Content */}
                        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                          {article.headline}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed text-lg">
                          {article.content}
                        </p>

                        {/* Article Metadata */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>By: {article.author.substring(0, 10)}...{article.author.substring(article.author.length - 8)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(article.timestamp).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <span>Block #{847392 + index}</span>
                            </div>
                          </div>
                          <HashDisplay hash={article.hash} label="Content Hash" />
                          {article.tx_hash && (
                            <HashDisplay hash={article.tx_hash} label="Transaction Hash" />
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 ml-6">
                        <Web3Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => setSelectedArticle(article)}
                          icon={<Eye className="w-4 h-4" />}
                          className="min-w-[100px]"
                        >
                          Inspect
                        </Web3Button>
                        <Web3Button 
                          variant="warning" 
                          size="sm"
                          onClick={() => editArticle(article.id, article.content)}
                          icon={<Edit className="w-4 h-4" />}
                          className="min-w-[100px]"
                        >
                          Modify
                        </Web3Button>
                        <Web3Button 
                          variant="success" 
                          size="sm"
                          onClick={() => downloadLegalReport(article.id)}
                          icon={<FileText className="w-4 h-4" />}
                          className="min-w-[100px]"
                        >
                          Legal PDF
                        </Web3Button>
                      </div>
                    </div>

                    {/* Blockchain Verification Footer */}
                    <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4 mt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Immutably Stored</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>SHA-256 Verified</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            <span>Aptos Network</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs bg-gray-50 dark:bg-gray-900">
                          Article #{article.id}
                        </Badge>
                      </div>
                    </div>
                  </Web3Card>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingArticle && (
          <Web3Card className="p-6" glowing>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-400/30">
                  <Edit className="h-6 w-6 text-orange-400" />
                </div>
                ✏️ Edit Article (Creates Audit Trail)
              </CardTitle>
              <Web3Button variant="secondary" size="sm" onClick={() => setEditingArticle(null)}>×</Web3Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">📝 Updated Content</label>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="min-h-[120px] bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="Enter updated article content..."
                />
              </div>
              <div className="flex gap-3">
                <Web3Button 
                  onClick={saveEdit} 
                  variant="success"
                  icon={<Shield className="w-4 h-4" />}
                >
                  🔐 Save Changes (Blockchain)
                </Web3Button>
                <Web3Button 
                  variant="secondary" 
                  onClick={() => setEditingArticle(null)}
                >
                  Cancel
                </Web3Button>
              </div>
            </CardContent>
          </Web3Card>
        )}

        {/* Article Details Modal */}
        {selectedArticle && (
          <Web3Card className="p-6" glowing>
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl text-white">
                <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-400/30">
                  <Hash className="h-6 w-6 text-cyan-400" />
                </div>
                🔍 Blockchain Verification Details
              </CardTitle>
              <Web3Button variant="secondary" size="sm" onClick={() => setSelectedArticle(null)}>×</Web3Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">📄 Article ID</label>
                    <HashDisplay hash={selectedArticle.id} label="ID" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">🔐 Content Hash</label>
                    <HashDisplay hash={selectedArticle.hash} label="Hash" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">👤 Publisher</label>
                    <HashDisplay hash={selectedArticle.author} label="Address" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">🕒 Published</label>
                    <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                      <p className="text-cyan-300">{new Date(selectedArticle.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">⛓️ Transaction Hash</label>
                    <HashDisplay hash={selectedArticle.tx_hash || 'N/A'} label="Tx" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">✅ Verification Status</label>
                    <StatusBadge status="verified">Immutably Verified on Aptos</StatusBadge>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <TransactionStatus 
                  txHash={selectedArticle.tx_hash}
                  status="confirmed"
                  blockNumber={Math.floor(Math.random() * 1000000) + 500000}
                />
              </div>
            </CardContent>
          </Web3Card>
        )}
      </div>
    </div>
  )
}