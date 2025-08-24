"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Clock, Shield, AlertCircle, Search, Gavel, CheckCircle2, FileCheck } from "lucide-react"

interface LegalRequest {
  id: string
  case_number: string
  requested_date: string
  status: "pending" | "processing" | "completed" | "failed"
  created_at: string
  completed_at?: string
  result_hash?: string
}

interface IntegrityCheck {
  post_id: string
  content_hash: string
  blockchain_verified: boolean
  verification_timestamp: string
  integrity_status: "verified" | "compromised" | "pending"
}

export function LegalDiscoveryTools() {
  const [activeRequests, setActiveRequests] = useState<LegalRequest[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [integrityChecks, setIntegrityChecks] = useState<IntegrityCheck[]>([])
  const [formData, setFormData] = useState({
    case_number: "",
    requested_date: "",
    date_range_start: "",
    date_range_end: "",
    export_reason: "",
    format: "json",
    include_modifications: true,
    include_blockchain_data: true,
    include_chain_of_custody: true,
    attorney_name: "",
    court_jurisdiction: "",
  })

  const [advancedFilters, setAdvancedFilters] = useState({
    author_filter: "",
    instance_filter: "",
    content_keywords: "",
    modification_type: "",
    blockchain_status: "",
    date_precision: "day", // day, hour, minute
  })

  useEffect(() => {
    loadActiveRequests()
    performIntegrityChecks()
  }, [])

  const handleGenerateReport = async () => {
    if (!formData.case_number || !formData.requested_date) {
      alert("Please fill in required fields")
      return
    }

    setIsGenerating(true)
    try {
      const exportPayload = {
        ...formData,
        date_range: {
          start: formData.date_range_start || "1970-01-01T00:00:00.000Z",
          end: formData.requested_date,
        },
        advanced_filters: advancedFilters,
        legal_metadata: {
          attorney_name: formData.attorney_name,
          court_jurisdiction: formData.court_jurisdiction,
          export_timestamp: new Date().toISOString(),
          chain_of_custody_required: formData.include_chain_of_custody,
        },
      }

      const response = await fetch("/api/audit/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(exportPayload),
      })

      if (formData.format === "csv") {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `legal-discovery-${formData.case_number}-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.json()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `legal-discovery-${formData.case_number}-${new Date().toISOString().split("T")[0]}.json`
        a.click()
        window.URL.revokeObjectURL(url)
      }

      loadActiveRequests()
    } catch (error) {
      console.error("[v0] Error generating report:", error)
      alert("Error generating report. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const loadActiveRequests = async () => {
    try {
      const response = await fetch("/api/audit/legal-discovery")
      const data = await response.json()
      setActiveRequests(data.requests || [])
    } catch (error) {
      console.error("[v0] Error loading requests:", error)
    }
  }

  const performIntegrityChecks = async () => {
    try {
      const response = await fetch("/api/audit/posts")
      const data = await response.json()

      const checks: IntegrityCheck[] = (data.posts || []).slice(0, 10).map((post: any) => ({
        post_id: post.id,
        content_hash: post.content_hash,
        blockchain_verified: post.blockchain_verified,
        verification_timestamp: new Date().toISOString(),
        integrity_status: post.blockchain_verified ? "verified" : "pending",
      }))

      setIntegrityChecks(checks)
    } catch (error) {
      console.error("[v0] Error performing integrity checks:", error)
    }
  }

  const generateChainOfCustody = async (requestId: string) => {
    try {
      const response = await fetch(`/api/audit/chain-of-custody/${requestId}`)
      const data = await response.json()

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `chain-of-custody-${requestId}.json`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error generating chain of custody:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-primary" />
      case "processing":
        return <Clock className="w-4 w-4 text-secondary animate-spin" />
      case "failed":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="requests">Active Requests</TabsTrigger>
          <TabsTrigger value="integrity">Integrity Checks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Reconstruction</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="w-5 h-5" />
                  Legal Discovery Report
                </CardTitle>
                <CardDescription>Generate comprehensive audit trail reports for legal proceedings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="case_number">Case Number *</Label>
                    <Input
                      id="case_number"
                      placeholder="e.g., CV-2024-001234"
                      value={formData.case_number}
                      onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requested_date">Discovery Date *</Label>
                    <Input
                      id="requested_date"
                      type="datetime-local"
                      value={formData.requested_date}
                      onChange={(e) => setFormData({ ...formData, requested_date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attorney_name">Attorney Name</Label>
                    <Input
                      id="attorney_name"
                      placeholder="Lead counsel name"
                      value={formData.attorney_name}
                      onChange={(e) => setFormData({ ...formData, attorney_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="court_jurisdiction">Court Jurisdiction</Label>
                    <Input
                      id="court_jurisdiction"
                      placeholder="e.g., Superior Court of California"
                      value={formData.court_jurisdiction}
                      onChange={(e) => setFormData({ ...formData, court_jurisdiction: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="export_reason">Legal Basis / Discovery Request</Label>
                  <Textarea
                    id="export_reason"
                    placeholder="Detailed description of the legal basis for this discovery request..."
                    value={formData.export_reason}
                    onChange={(e) => setFormData({ ...formData, export_reason: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select
                      value={formData.format}
                      onValueChange={(value) => setFormData({ ...formData, format: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="json">JSON (Legal Archive)</SelectItem>
                        <SelectItem value="csv">CSV (Evidence Summary)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Include Options</Label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.include_chain_of_custody}
                          onChange={(e) => setFormData({ ...formData, include_chain_of_custody: e.target.checked })}
                        />
                        <span>Chain of custody documentation</span>
                      </label>
                      <label className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.include_blockchain_data}
                          onChange={(e) => setFormData({ ...formData, include_blockchain_data: e.target.checked })}
                        />
                        <span>Blockchain verification proofs</span>
                      </label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
                  <FileCheck className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating Legal Report..." : "Generate Discovery Report"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Advanced Filters
                </CardTitle>
                <CardDescription>Refine discovery scope with precise filtering</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="author_filter">Author Filter</Label>
                  <Input
                    id="author_filter"
                    placeholder="Filter by specific authors"
                    value={advancedFilters.author_filter}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, author_filter: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content_keywords">Content Keywords</Label>
                  <Input
                    id="content_keywords"
                    placeholder="Search within post content"
                    value={advancedFilters.content_keywords}
                    onChange={(e) => setAdvancedFilters({ ...advancedFilters, content_keywords: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modification_type">Modification Type</Label>
                  <Select
                    value={advancedFilters.modification_type}
                    onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, modification_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All modifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All modifications</SelectItem>
                      <SelectItem value="edit">Edits only</SelectItem>
                      <SelectItem value="delete">Deletions only</SelectItem>
                      <SelectItem value="restore">Restorations only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blockchain_status">Blockchain Status</Label>
                  <Select
                    value={advancedFilters.blockchain_status}
                    onValueChange={(value) => setAdvancedFilters({ ...advancedFilters, blockchain_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All posts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All posts</SelectItem>
                      <SelectItem value="verified">Verified only</SelectItem>
                      <SelectItem value="pending">Pending verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>Legal Discovery Request Tracking</CardTitle>
              <CardDescription>Monitor status and manage legal discovery requests</CardDescription>
            </CardHeader>
            <CardContent>
              {activeRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No active legal discovery requests</p>
                  <p className="text-sm">Generate a report to see requests here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <div key={request.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(request.status)}
                          <div>
                            <span className="font-medium">{request.case_number}</span>
                            <Badge variant={request.status === "completed" ? "default" : "secondary"} className="ml-2">
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {request.status === "completed" && (
                            <Button size="sm" variant="outline" onClick={() => generateChainOfCustody(request.id)}>
                              <Download className="w-3 h-3 mr-1" />
                              Chain of Custody
                            </Button>
                          )}
                          <span className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div>Discovery Date: {new Date(request.requested_date).toLocaleDateString()}</div>
                        {request.completed_at && (
                          <div>Completed: {new Date(request.completed_at).toLocaleDateString()}</div>
                        )}
                        {request.result_hash && (
                          <div className="font-mono text-xs">
                            Integrity Hash: {request.result_hash.substring(0, 16)}...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Data Integrity Verification
              </CardTitle>
              <CardDescription>Verify blockchain integrity and detect modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Recent Integrity Checks</span>
                  <Button size="sm" onClick={performIntegrityChecks}>
                    <Shield className="w-3 h-3 mr-1" />
                    Run Check
                  </Button>
                </div>

                {integrityChecks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No integrity checks performed</p>
                    <p className="text-sm">Click "Run Check" to verify data integrity</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {integrityChecks.map((check) => (
                      <div key={check.post_id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              check.integrity_status === "verified"
                                ? "bg-primary"
                                : check.integrity_status === "pending"
                                  ? "bg-secondary"
                                  : "bg-destructive"
                            }`}
                          />
                          <span className="font-mono text-sm">{check.post_id.substring(0, 12)}...</span>
                          <Badge variant={check.integrity_status === "verified" ? "default" : "secondary"}>
                            {check.integrity_status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(check.verification_timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline Reconstruction
              </CardTitle>
              <CardDescription>Reconstruct chronological sequence of events for legal analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timeline_start">Timeline Start</Label>
                    <Input id="timeline_start" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline_end">Timeline End</Label>
                    <Input id="timeline_end" type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline_focus">Focus Entity</Label>
                    <Input id="timeline_focus" placeholder="Author, post ID, or keyword" />
                  </div>
                </div>

                <Button className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Generate Timeline Report
                </Button>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Timeline Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Chronological sequence of all post modifications</li>
                    <li>• Cross-reference with blockchain verification timestamps</li>
                    <li>• Identify patterns of suspicious activity</li>
                    <li>• Export timeline as evidence-ready documentation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
