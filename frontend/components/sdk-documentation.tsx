"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Shield, Database, Code, Download, Copy, 
  FileText, Book, Zap, CheckCircle, Terminal,
  Package, Settings, Key, Globe, ArrowRight
} from "lucide-react"

export function SDKDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const installCode = `npm install @immutablefeed/sdk`

  const quickStartCode = `import { createLedger } from '@immutablefeed/sdk';

// Initialize the ledger
const ledger = createLedger({
  aptosClient: 'https://fullnode.testnet.aptoslabs.com/v1'
});

// Create an audit record
const record = await ledger.createRecord(
  "Patient file accessed by Dr. Smith",
  "dr.smith@hospital.com",
  { 
    patientId: "12345", 
    action: "view",
    department: "cardiology"
  }
);

console.log('Record created:', record.id);
console.log('Transaction hash:', record.transactionHash);`

  const verificationCode = `// Verify record integrity
const verification = await ledger.verifyRecord(record.id);

if (verification.isValid) {
  console.log('✅ Record is valid and tamper-proof');
  console.log('Hash chain integrity:', verification.chainIntegrity);
} else {
  console.log('❌ Record has been tampered with');
}`

  const snapshotCode = `// Create point-in-time snapshot for compliance
const snapshot = ledger.createSnapshot();

console.log('Snapshot created at:', snapshot.timestamp);
console.log('Total records:', snapshot.recordCount);
console.log('Merkle root:', snapshot.merkleRoot);

// Export for regulatory compliance
const complianceReport = ledger.generateComplianceReport({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  format: 'pdf'
});`

  const enterpriseCode = `// Enterprise configuration
const ledger = createLedger({
  aptosClient: 'https://fullnode.mainnet.aptoslabs.com/v1',
  privateKey: process.env.APTOS_PRIVATE_KEY,
  contractAddress: '0x1234...abcd',
  enableEncryption: true,
  complianceMode: 'SOX', // SOX, HIPAA, or GDPR
  retentionPolicy: {
    years: 7,
    autoArchive: true
  }
});

// Batch operations for high-volume scenarios
const batchRecords = await ledger.createBatch([
  { content: "Transaction 1", author: "system" },
  { content: "Transaction 2", author: "system" },
  { content: "Transaction 3", author: "system" }
]);`

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 py-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-300/30">
              <Package className="h-12 w-12 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
            ImmutableFeed SDK
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enterprise-grade audit trail SDK for building tamper-proof compliance systems. 
            Integrate immutable record keeping into your applications with just a few lines of code.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2">
              <CheckCircle className="w-4 h-4 mr-2" />
              Production Ready
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              Enterprise Security
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 border-purple-200 px-4 py-2">
              <Database className="w-4 h-4 mr-2" />
              Aptos Blockchain
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Download className="w-5 h-5 mr-2" />
            Install SDK
          </Button>
          <Button variant="outline" size="lg">
            <Book className="w-5 h-5 mr-2" />
            View Documentation
          </Button>
          <Button variant="outline" size="lg">
            <Globe className="w-5 h-5 mr-2" />
            API Reference
          </Button>
        </div>

        {/* Installation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-6 w-6 text-green-600" />
              Installation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono relative">
              <code>{installCode}</code>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                onClick={() => copyToClipboard(installCode, 'install')}
              >
                {copiedCode === 'install' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Documentation */}
        <Tabs defaultValue="quickstart" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get started with ImmutableFeed SDK in minutes. Create your first audit record and verify its integrity.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                  <pre className="whitespace-pre-wrap">{quickStartCode}</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                    onClick={() => copyToClipboard(quickStartCode, 'quickstart')}
                  >
                    {copiedCode === 'quickstart' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    Create Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Store immutable audit records with cryptographic hashing and blockchain anchoring.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Verify Integrity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cryptographically verify that records haven't been tampered with using hash chains.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-600" />
                    Generate Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Create compliance reports and point-in-time snapshots for regulatory requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-green-600" />
                  Record Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Verify the integrity and authenticity of audit records using cryptographic proofs.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                  <pre className="whitespace-pre-wrap">{verificationCode}</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                    onClick={() => copyToClipboard(verificationCode, 'verification')}
                  >
                    {copiedCode === 'verification' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hash Chain Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      SHA-256 cryptographic hashing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Merkle tree verification
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Blockchain anchoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Tamper detection
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>isValid:</strong> Boolean integrity status</li>
                    <li><strong>chainIntegrity:</strong> Hash chain validation</li>
                    <li><strong>proofHash:</strong> Cryptographic proof</li>
                    <li><strong>timestamp:</strong> Verification time</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-purple-600" />
                  Compliance & Reporting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Generate compliance reports and point-in-time snapshots for regulatory requirements.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                  <pre className="whitespace-pre-wrap">{snapshotCode}</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                    onClick={() => copyToClipboard(snapshotCode, 'snapshot')}
                  >
                    {copiedCode === 'snapshot' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SOX Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Financial record integrity</li>
                    <li>• Audit trail requirements</li>
                    <li>• Point-in-time reconstruction</li>
                    <li>• Immutable transaction logs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">HIPAA Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Patient data access logs</li>
                    <li>• Healthcare audit trails</li>
                    <li>• Privacy breach detection</li>
                    <li>• Regulatory reporting</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Data processing records</li>
                    <li>• Consent management</li>
                    <li>• Right to be forgotten</li>
                    <li>• Data breach notifications</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="enterprise" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-6 w-6 text-blue-600" />
                  Enterprise Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Advanced configuration options for enterprise deployments with high-volume requirements.
                </p>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm relative">
                  <pre className="whitespace-pre-wrap">{enterpriseCode}</pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-green-400 hover:text-green-300"
                    onClick={() => copyToClipboard(enterpriseCode, 'enterprise')}
                  >
                    {copiedCode === 'enterprise' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Enterprise Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      High-volume batch processing
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      End-to-end encryption
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Custom retention policies
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Multi-tenant architecture
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      Role-based access control
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Support & SLA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      99.9% uptime guarantee
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      24/7 enterprise support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Custom integration support
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Compliance consulting
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
          <CardContent className="text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of enterprises using ImmutableFeed SDK to build tamper-proof audit systems 
              and ensure regulatory compliance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Download className="w-5 h-5 mr-2" />
                Install SDK Now
              </Button>
              <Button variant="outline" size="lg">
                <Key className="w-5 h-5 mr-2" />
                Get API Key
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}