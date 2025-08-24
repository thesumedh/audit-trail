"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar, FileText, Download, Shield, Clock, 
  Scale, AlertTriangle, CheckCircle, Hash, 
  Gavel, Building, User, Search
} from "lucide-react"
import { legalDiscoveryService, LegalDiscoveryRequest, LegalReport } from "../lib/legal-discovery"

export function EnhancedLegalDiscovery() {
  const [targetDate, setTargetDate] = useState("")
  const [requestor, setRequestor] = useState("")
  const [caseNumber, setCaseNumber] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reports, setReports] = useState<LegalReport[]>([])
  const [selectedReport, setSelectedReport] = useState<LegalReport | null>(null)

  const generateLegalReport = async () => {
    if (!targetDate || !requestor || !description) {
      alert("Please fill in all required fields")
      return
    }

    setIsGenerating(true)
    try {
      const request: LegalDiscoveryRequest = {
        targetDate: new Date(targetDate),
        requestor,
        caseNumber: caseNumber || undefined,
        description
      }

      const report = legalDiscoveryService.createLegalReport(request)
      setReports(prev => [report, ...prev])
      
      // Clear form
      setTargetDate("")
      setRequestor("")
      setCaseNumber("")
      setDescription("")
      
    } catch (error) {
      console.error("Failed to generate report:", error)
      alert("Failed to generate legal report")
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = (reportId: string) => {
    try {
      legalDiscoveryService.exportLegalReportPDF(reportId)
    } catch (error) {
      console.error("Failed to download report:", error)
      alert("Failed to download report")
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-lg border border-blue-300/30">
              <Scale className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            Legal Discovery & Point-in-Time Reconstruction
          </CardTitle>
          <p className="text-muted-foreground">
            Generate court-admissible reports showing exact data state at specific dates for legal proceedings
          </p>
        </CardHeader>
      </Card>

      {/* Legal Discovery Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            New Legal Discovery Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Target Date & Time *</label>
                <Input
                  type="datetime-local"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Specify the exact date/time for data reconstruction
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Requestor *</label>
                <Input
                  placeholder="Legal counsel, compliance officer, etc."
                  value={requestor}
                  onChange={(e) => setRequestor(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Case Number</label>
                <Input
                  placeholder="Optional case reference"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Legal Description *</label>
              <Textarea
                placeholder="Describe the legal basis for this discovery request..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground mt-1">
                This will be included in the legal attestation
              </p>
            </div>
          </div>
          
          <Button 
            onClick={generateLegalReport}
            disabled={isGenerating || !targetDate || !requestor || !description}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isGenerating ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Generating Legal Report...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Court-Admissible Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Legal Discovery Reports ({reports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No legal reports generated yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <FileText className="w-3 h-3 mr-1" />
                          Legal Report
                        </Badge>
                        <Badge variant="outline">
                          ID: {report.id.split('_')[2]}
                        </Badge>
                        {report.request.caseNumber && (
                          <Badge variant="outline">
                            Case: {report.request.caseNumber}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Target Date:</span>
                          <span className="ml-2">{formatDate(report.snapshot.timestamp)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Requestor:</span>
                          <span className="ml-2">{report.request.requestor}</span>
                        </div>
                        <div>
                          <span className="font-medium">Generated:</span>
                          <span className="ml-2">{formatDate(report.generatedAt)}</span>
                        </div>
                        <div>
                          <span className="font-medium">Entries Found:</span>
                          <span className="ml-2">{report.snapshot.totalEntries}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
                      >
                        <Search className="w-4 h-4 mr-1" />
                        {selectedReport?.id === report.id ? 'Hide' : 'View'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {report.request.description}
                  </p>
                  
                  {selectedReport?.id === report.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded border border-green-200 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-800 dark:text-green-200">Active Entries</span>
                          </div>
                          <div className="text-2xl font-bold text-green-600">{report.snapshot.activeEntries}</div>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded border border-red-200 dark:border-red-800">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-800 dark:text-red-200">Deleted Entries</span>
                          </div>
                          <div className="text-2xl font-bold text-red-600">{report.snapshot.deletedEntries}</div>
                        </div>
                        
                        <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded border border-orange-200 dark:border-orange-800">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-800 dark:text-orange-200">Modified Entries</span>
                          </div>
                          <div className="text-2xl font-bold text-orange-600">{report.snapshot.modifiedEntries}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <span className="font-medium">Merkle Root:</span>
                          <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{report.snapshot.merkleRoot}</code>
                        </div>
                        <div>
                          <span className="font-medium">Cryptographic Proof:</span>
                          <code className="ml-2 bg-muted px-2 py-1 rounded text-sm">{report.cryptographicProof.substring(0, 32)}...</code>
                        </div>
                        <div>
                          <span className="font-medium">Blockchain Height:</span>
                          <span className="ml-2">{report.snapshot.blockHeight.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded border border-blue-200 dark:border-blue-800">
                        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Legal Attestation</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {report.snapshot.legalAttestation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}