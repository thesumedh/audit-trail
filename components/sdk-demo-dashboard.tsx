"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Shield, Database, Clock, Search, Hash, CheckCircle, 
  Activity, TrendingUp, Zap, Code, Download, Copy,
  FileText, Eye, AlertTriangle, Verified
} from "lucide-react"

interface DemoRecord {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  hash: string;
  verified: boolean;
  blockHeight: number;
}

interface LiveMetrics {
  totalRecords: number;
  verifiedRecords: number;
  hashRate: number;
  chainIntegrity: number;
  lastBlockHeight: number;
}

export function SDKDemosDashboard() {
  const [records, setRecords] = useState<DemoRecord[]>([])
  const [metrics, setMetrics] = useState<LiveMetrics>({
    totalRecords: 0,
    verifiedRecords: 0,
    hashRate: 0,
    chainIntegrity: 100,
    lastBlockHeight: 847392
  })
  
  const [newContent, setNewContent] = useState("")
  const [newAuthor, setNewAuthor] = useState("demo-user")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState<DemoRecord | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showCode, setShowCode] = useState(false)
  
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Simulate real-time updates
    intervalRef.current = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        hashRate: Math.floor(Math.random() * 50) + 150,
        lastBlockHeight: prev.lastBlockHeight + Math.floor(Math.random() * 3),
        chainIntegrity: Math.max(99.5, prev.chainIntegrity + (Math.random() - 0.5) * 0.1)
      }))
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const generateHash = (data: string): string => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  const createRecord = async () => {
    if (!newContent.trim()) return;
    
    setIsCreating(true);
    
    // Simulate SDK processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const record: DemoRecord = {
      id: `rec_${Date.now()}`,
      content: newContent,
      author: newAuthor,
      timestamp: Date.now(),
      hash: generateHash(newContent + newAuthor + Date.now()),
      verified: true,
      blockHeight: metrics.lastBlockHeight + 1
    };
    
    setRecords(prev => [record, ...prev]);
    setMetrics(prev => ({
      ...prev,
      totalRecords: prev.totalRecords + 1,
      verifiedRecords: prev.verifiedRecords + 1,
      lastBlockHeight: prev.lastBlockHeight + 1
    }));
    
    setNewContent("");
    setIsCreating(false);
  }

  const verifyRecord = (record: DemoRecord) => {
    setSelectedRecord(record);
  }

  const filteredRecords = records.filter(record =>
    record.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.hash.includes(searchQuery.toLowerCase())
  );

  const sdkCode = `import { createLedger } from '@immutablefeed/sdk';

// Initialize the ledger
const ledger = createLedger();

// Create an audit record
const record = await ledger.createRecord(
  "Hello, immutable world!",
  "alice@company.com",
  { platform: "mastodon", postId: "123" }
);

// Verify the record
const verification = await ledger.verifyRecord(record.id);
console.log('Valid:', verification.isValid);

// Create point-in-time snapshot
const snapshot = ledger.createSnapshot();
console.log('Merkle Root:', snapshot.merkleRoot);`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ImmutableFeed SDK Demo
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Live demonstration of enterprise audit trail capabilities
            </p>
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="w-3 h-3 mr-1" />
                SDK v1.0.0 Active
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Processing
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowCode(!showCode)}
              className="bg-white/50 dark:bg-gray-800/50"
            >
              <Code className="w-4 h-4 mr-2" />
              {showCode ? 'Hide' : 'Show'} Code
            </Button>
            <Button className="bg-primary hover:bg-primary/90 font-medium px-6">
              <Download className="w-4 h-4 mr-2" />
              Install SDK
            </Button>
          </div>
        </div>

        {/* Code Example */}
        {showCode && (
          <Card className="bg-gray-900 text-green-400 font-mono text-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-green-400">SDK Usage Example</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigator.clipboard.writeText(sdkCode)}
                className="text-green-400 hover:text-green-300"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap">{sdkCode}</pre>
            </CardContent>
          </Card>
        )}

        {/* Live Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Total Records</CardTitle>
              <Database className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metrics.totalRecords}</div>
              <p className="text-xs text-muted-foreground mt-1">Immutable entries</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Verified</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.verifiedRecords}</div>
              <p className="text-xs text-muted-foreground mt-1">Hash verified</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Hash Rate</CardTitle>
              <Hash className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.hashRate}/s</div>
              <p className="text-xs text-muted-foreground mt-1">Processing speed</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Chain Integrity</CardTitle>
              <Shield className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{metrics.chainIntegrity.toFixed(1)}%</div>
              <Progress value={metrics.chainIntegrity} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold">Block Height</CardTitle>
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-indigo-600">{metrics.lastBlockHeight.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current Aptos block</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Record */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-slate-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Create Audit Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Author</label>
                <Input
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="Enter author name"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Content</label>
                <Textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter content to create immutable record..."
                  className="bg-white/50 dark:bg-gray-800/50 min-h-[100px]"
                />
              </div>
              <Button 
                onClick={createRecord} 
                disabled={!newContent.trim() || isCreating}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isCreating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Creating Record...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Create Immutable Record
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Search & Verify */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-slate-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5 text-green-500" />
                Search & Verify
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search records by content, author, or hash..."
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {filteredRecords.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="p-3 border border-slate-200 dark:border-gray-600 rounded-lg bg-slate-50/50 dark:bg-gray-800/50 hover:bg-slate-100/50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => verifyRecord(record)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{record.author}</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        <Verified className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{record.content}</p>
                    <p className="text-xs font-mono text-slate-500 mt-1">#{record.hash}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Record Details Modal */}
        {selectedRecord && (
          <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-slate-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-500" />
                Record Verification Details
              </CardTitle>
              <Button variant="ghost" onClick={() => setSelectedRecord(null)}>×</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Record ID</label>
                    <p className="font-mono text-sm bg-slate-100 dark:bg-gray-800 p-2 rounded">{selectedRecord.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Content Hash</label>
                    <p className="font-mono text-sm bg-slate-100 dark:bg-gray-800 p-2 rounded">{selectedRecord.hash}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Author</label>
                    <p className="text-sm">{selectedRecord.author}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <p className="text-sm">{new Date(selectedRecord.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Block Height</label>
                    <p className="text-sm">{selectedRecord.blockHeight.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Verification Status</label>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Hash Verified</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Chain Integrity</label>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Chain Valid</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Content</label>
                    <p className="text-sm bg-slate-100 dark:bg-gray-800 p-2 rounded">{selectedRecord.content}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}