"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Download, Globe, TrendingUp, Lock, Database, Bot, Layers, Github, FileText } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 dark:from-purple-300 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent mb-6 font-mono">
            Audit Trail
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Enterprise-grade audit trails for ActivityPub posts using Aptos blockchain, AI verification, and
            zero-knowledge proofs
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 dark:from-purple-500 dark:to-indigo-500 dark:hover:from-purple-600 dark:hover:to-indigo-600 shadow-lg shadow-purple-500/25 dark:shadow-purple-400/25"
            >
              <Download className="h-5 w-5 mr-2" />
              Download SDK
            </Button>
            <Button size="lg" variant="outline" className="border-purple-300 dark:border-gray-600 bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-700/50 backdrop-blur-sm">
              <Github className="h-5 w-5 mr-2" />
              View on GitHub
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader>
              <Bot className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg">AI Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Advanced AI models verify content authenticity and detect potential manipulation attempts.
              </p>
              <Badge variant="secondary">
                95%+ Accuracy
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader>
              <Layers className="h-8 w-8 text-purple-500 mb-2" />
              <CardTitle className="text-lg">Zero-Knowledge Proofs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Verify compliance without revealing sensitive data using cutting-edge ZK technology.
              </p>
              <Badge variant="secondary">
                Privacy-First
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-green-500 mb-2" />
              <CardTitle className="text-lg">DeFi Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Automated trading triggers and $FEED token rewards for verified audit contributions.
              </p>
              <Badge variant="secondary">
                8.2% APY
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader>
              <Lock className="h-8 w-8 text-red-500 mb-2" />
              <CardTitle className="text-lg">Immutable Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Cryptographically secured hash chains ensure immutable audit trails.
              </p>
              <Badge variant="secondary">
                99.8% Integrity
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader>
              <FileText className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Legal Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Generate court-ready reports with cryptographic proofs and chain of custody.
              </p>
              <Badge variant="secondary">
                Court-Ready
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardHeader>
              <Globe className="h-8 w-8 text-indigo-500 mb-2" />
              <CardTitle className="text-lg">Enterprise Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Built for enterprise compliance with SOC2, GDPR, and financial regulations.
              </p>
              <Badge variant="secondary">
                Enterprise-Ready
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* User Personas Section */}
        <Card className="mb-12 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Built for Compliance Professionals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-muted/30 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Compliance Officer</h3>
                <p className="text-sm text-muted-foreground mb-4">Banking & Finance</p>
                <p className="text-xs text-muted-foreground">
                  "I need to prove our social media communications meet regulatory requirements and maintain audit
                  trails for examinations."
                </p>
              </div>
              <div className="text-center p-6 bg-muted/30 rounded-lg border border-border/50">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Risk Manager</h3>
                <p className="text-sm text-muted-foreground mb-4">Healthcare & Insurance</p>
                <p className="text-xs text-muted-foreground">
                  "I must track all content modifications and ensure our public communications maintain integrity for
                  liability protection."
                </p>
              </div>
              <div className="text-center p-6 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-purple-200 dark:border-gray-600">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Chief Technology Officer</h3>
                <p className="text-sm text-muted-foreground mb-4">Public Companies</p>
                <p className="text-xs text-muted-foreground">
                  "I need enterprise-grade solutions that scale with our business while meeting SOX compliance
                  requirements."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Use Cases */}
        <Card className="mb-12 border-2 border-purple-300/50 dark:border-gray-700 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Enterprise Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3 text-lg">
                    Financial Services Compliance
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Banks and financial institutions maintain regulatory compliance for social media communications,
                    market announcements, and customer interactions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      SOX Compliance
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      SEC Reporting
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                      FINRA Rules
                    </Badge>
                  </div>
                </div>
                <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3 text-lg">
                    Legal Discovery & Evidence
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Law firms create immutable evidence chains for social media posts in litigation, with cryptographic
                    proof of authenticity and timeline.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      Court-Ready
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      Chain of Custody
                    </Badge>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                      Forensic Audit
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 text-lg">
                    Corporate Governance
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Public companies maintain auditable records of executive communications, board announcements, and
                    investor relations content.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      Board Oversight
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      Investor Relations
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                      ESG Reporting
                    </Badge>
                  </div>
                </div>
                <div className="p-6 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-700 dark:text-orange-300 mb-3 text-lg">
                    Healthcare & Life Sciences
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Healthcare organizations track patient communication modifications, research announcements, and
                    regulatory submissions with HIPAA compliance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      HIPAA Compliant
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      FDA Submissions
                    </Badge>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">
                      Clinical Trials
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="mb-12 border-2 border-purple-300/50 dark:border-gray-700 bg-gradient-to-br from-purple-50/70 via-white/70 to-indigo-50/70 dark:from-purple-950/30 dark:via-gray-900/70 dark:to-indigo-950/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Technical Architecture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Aptos Blockchain</h3>
                <p className="text-sm text-muted-foreground">
                  High-performance blockchain with 100k+ TPS and formal verification capabilities
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">AI Verification Layer</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced ML models for content authenticity and manipulation detection
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">ZK Proof System</h3>
                <p className="text-sm text-muted-foreground">
                  Privacy-preserving compliance verification without data exposure
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Updated CTA Section */}
        <Card className="text-center border-4 border-gradient-to-r from-purple-300 to-indigo-300 dark:from-purple-700 dark:to-indigo-700 bg-gradient-to-br from-purple-50 via-purple-25 to-indigo-50 dark:from-purple-950/30 dark:via-gray-900/50 dark:to-indigo-950/30">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Enterprise-Ready Compliance Solution</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join leading enterprises in implementing blockchain-based audit trails. Our SDK integrates with existing
              compliance workflows in minutes, not months.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <Shield className="h-5 w-5 mr-2" />
                Request Enterprise Demo
              </Button>
              <Button size="lg" variant="outline" className="border-purple-200 dark:border-gray-700 bg-transparent">
                <FileText className="h-5 w-5 mr-2" />
                Compliance Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
