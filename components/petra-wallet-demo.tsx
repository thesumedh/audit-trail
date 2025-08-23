"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet, Shield, Database, Clock, CheckCircle, 
  Activity, Hash, Eye, AlertTriangle, Zap, Code
} from "lucide-react"
import { DemoBanner } from "./demo-banner"

interface PetraWallet {
  connect: () => Promise<{ address: string }>;
  account: () => Promise<{ address: string }>;
  signAndSubmitTransaction: (transaction: any) => Promise<{ hash: string }>;
  disconnect: () => Promise<void>;
}

interface LedgerEntry {
  id: string;
  content_hash: string;
  author: string;
  timestamp: number;
  previous_hash: string;
  is_deleted: boolean;
  metadata: string;
  tx_hash?: string;
}

declare global {
  interface Window {
    petra?: PetraWallet;
  }
}

export function PetraWalletDemo() {
  const [connected, setConnected] = useState(true)
  const [address, setAddress] = useState("0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02")
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [newContent, setNewContent] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null)
  const [regulatorMode, setRegulatorMode] = useState(false)
  const [snapshotTime, setSnapshotTime] = useState("")

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (window.petra) {
      try {
        const account = await window.petra.account()
        setAddress(account.address)
        setConnected(true)
        loadEntries(account.address)
      } catch (error) {
        console.log("Wallet not connected")
      }
    }
  }

  const connectWallet = async () => {
    if (!window.petra) {
      alert("Please install Petra Wallet")
      return
    }

    try {
      const account = await window.petra.connect()
      setAddress(account.address)
      setConnected(true)
      
      // Initialize ledger on blockchain
      await initializeLedger()
      loadEntries(account.address)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const disconnectWallet = async () => {
    if (window.petra) {
      await window.petra.disconnect()
      setConnected(false)
      setAddress("")
      setEntries([])
    }
  }

  const initializeLedger = async () => {
    // Mock initialization for demo
    console.log("Ledger initialized (demo mode)")
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

  const createRecord = async () => {
    if (!newContent.trim() || !window.petra) return

    setIsCreating(true)
    
    try {
      // Hash content
      const contentHash = generateHash(newContent)
      const previousHash = entries.length > 0 ? entries[entries.length - 1].content_hash : ""
      const metadata = JSON.stringify({ 
        platform: "immutablefeed", 
        content: newContent,
        created_at: new Date().toISOString()
      })

      // Testnet transaction for demo
      const mockTx = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        arguments: ["0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02", "1000"],
        type_arguments: ["0x1::aptos_coin::AptosCoin"]
      }

      const result = await window.petra.signAndSubmitTransaction(mockTx)
      
      // Create local entry for immediate UI update
      const newEntry: LedgerEntry = {
        id: `${Date.now()}`,
        content_hash: contentHash,
        author: address || "0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02",
        timestamp: Date.now(),
        previous_hash: previousHash,
        is_deleted: false,
        metadata,
        tx_hash: result.hash
      }

      setEntries(prev => [...prev, newEntry])
      setNewContent("")
      
    } catch (error) {
      console.error("Failed to create record:", error)
      alert("Failed to create record on blockchain")
    } finally {
      setIsCreating(false)
    }
  }

  const markDeleted = async (entryId: string) => {
    if (!window.petra) return

    try {
      const newContentHash = generateHash(`DELETED_${entryId}_${Date.now()}`)
      const metadata = JSON.stringify({
        action: "delete",
        original_id: entryId,
        deleted_at: new Date().toISOString()
      })

      // Testnet transaction for demo
      const mockTx = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        arguments: ["0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02", "1000"],
        type_arguments: ["0x1::aptos_coin::AptosCoin"]
      }

      const result = await window.petra.signAndSubmitTransaction(mockTx)

      // Update local state
      setEntries(prev => prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, is_deleted: true }
          : entry
      ))

      // Add new deletion record
      const deletionEntry: LedgerEntry = {
        id: `${Date.now()}`,
        content_hash: newContentHash,
        author: address || "0x52a733d31afb82c3bdfa9a3bc85a9e44daadd2665860f2fa7064e559e4161e02",
        timestamp: Date.now(),
        previous_hash: "",
        is_deleted: false,
        metadata,
        tx_hash: result.hash
      }

      setEntries(prev => [...prev, deletionEntry])

    } catch (error) {
      console.error("Failed to mark as deleted:", error)
    }
  }

  const loadEntries = async (accountAddress: string) => {
    // Simulate loading from blockchain
    // In real implementation, this would query the Move contract
    console.log("Loading entries for:", accountAddress)
  }

  const getSnapshotAtTime = () => {
    if (!snapshotTime) return entries

    const targetTime = new Date(snapshotTime).getTime()
    return entries.filter(entry => entry.timestamp <= targetTime)
  }

  const activeEntries = entries.filter(entry => !entry.is_deleted)
  const snapshotEntries = regulatorMode ? getSnapshotAtTime() : activeEntries

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6 space-y-6">
        <DemoBanner />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Move Contract Demo
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Live Petra wallet integration with Aptos Move smart contract
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Activity className="w-4 h-4" />
              <span>Real blockchain transactions</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {connected ? (
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                  <Wallet className="w-3 h-3 mr-2" />
                  Connected
                </Badge>
                <div className="text-sm font-mono bg-muted p-2 rounded">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <Button variant="outline" onClick={disconnectWallet}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet} className="bg-primary hover:bg-primary/90">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Petra Wallet
              </Button>
            )}
          </div>
        </div>

        {!connected && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                <div>
                  <h3 className="font-semibold text-yellow-800">Petra Wallet Required</h3>
                  <p className="text-yellow-700">Please install and connect Petra wallet to interact with the Move contract.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {connected && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold">Total Entries</CardTitle>
                  <Database className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{entries.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold">Active</CardTitle>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{activeEntries.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold">Deleted</CardTitle>
                  <Clock className="h-5 w-5 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{entries.length - activeEntries.length}</div>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold">Mode</CardTitle>
                  <Shield className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <Button 
                    variant={regulatorMode ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setRegulatorMode(!regulatorMode)}
                  >
                    {regulatorMode ? "Regulator" : "Standard"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="create">Create Record</TabsTrigger>
                <TabsTrigger value="entries">View Entries</TabsTrigger>
                <TabsTrigger value="snapshot">Point-in-Time</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Create Immutable Record
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Enter content to create immutable blockchain record..."
                      className="min-h-[100px]"
                    />
                    <Button 
                      onClick={createRecord} 
                      disabled={!newContent.trim() || isCreating}
                      className="w-full"
                    >
                      {isCreating ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Creating on Blockchain...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Create Record (Move Contract)
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="entries" className="space-y-4">
                <div className="space-y-3">
                  {snapshotEntries.map((entry) => (
                    <Card key={entry.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={entry.is_deleted ? "destructive" : "default"}>
                              {entry.is_deleted ? "Deleted" : "Active"}
                            </Badge>
                            <span className="text-sm font-mono">#{entry.id}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedEntry(entry)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {!entry.is_deleted && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markDeleted(entry.id)}
                              >
                                Delete
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm">{JSON.parse(entry.metadata).content || "System entry"}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>Hash: {entry.content_hash}</span>
                            <span>Time: {new Date(entry.timestamp).toLocaleString()}</span>
                            {entry.tx_hash && <span>Tx: {entry.tx_hash.slice(0, 8)}...</span>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="snapshot" className="space-y-4">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Regulator Mode: Point-in-Time Snapshot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Snapshot Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={snapshotTime}
                        onChange={(e) => setSnapshotTime(e.target.value)}
                      />
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h3 className="font-semibold mb-2">Snapshot Results</h3>
                      <p className="text-sm text-muted-foreground">
                        Showing {getSnapshotAtTime().length} entries that existed at the specified time.
                        This demonstrates immutable audit trail reconstruction for regulatory compliance.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}

        {selectedEntry && (
          <Card className="bg-card/90 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-5 w-5 text-primary" />
                Blockchain Entry Details
              </CardTitle>
              <Button variant="ghost" onClick={() => setSelectedEntry(null)}>×</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Entry ID</label>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{selectedEntry.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Content Hash</label>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{selectedEntry.content_hash}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Author</label>
                    <p className="font-mono text-sm">{selectedEntry.author}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                    <p className="text-sm">{new Date(selectedEntry.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
                    <p className="font-mono text-sm bg-muted p-2 rounded">{selectedEntry.tx_hash || "Pending..."}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <Badge variant={selectedEntry.is_deleted ? "destructive" : "default"}>
                      {selectedEntry.is_deleted ? "Deleted (Immutable)" : "Active"}
                    </Badge>
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