"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, DollarSign, Clock, CheckCircle, Building2, Users, Scale, Lock, Eye, FileText } from "lucide-react"
import { ThreeDBackground } from "../../components/3d-background"

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <ThreeDBackground />
      <div className="container mx-auto px-4 py-16 relative z-10">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center mb-8">
            <div className="p-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl">
              <Shield className="h-16 w-16 text-blue-400" />
            </div>
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            Audit Trail
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Enterprise-grade compliance infrastructure built for the modern enterprise
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
              Request Proposal
            </Button>
            <Button size="lg" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4">
              Schedule Demo
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-red-500/10 rounded-lg w-fit mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-3xl font-bold text-red-500 mb-2">$4.2B</div>
              <div className="text-sm text-muted-foreground">Risk Eliminated</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-500/10 rounded-lg w-fit mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-3xl font-bold text-green-500 mb-2">2 sec</div>
              <div className="text-sm text-muted-foreground">Audit Speed</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-500/10 rounded-lg w-fit mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-500" />
              </div>
              <div className="text-3xl font-bold text-blue-500 mb-2">100%</div>
              <div className="text-sm text-muted-foreground">Court Ready</div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-card/90 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-500/10 rounded-lg w-fit mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
              <div className="text-3xl font-bold text-purple-500 mb-2">$1.8M</div>
              <div className="text-sm text-muted-foreground">Annual ROI</div>
            </CardContent>
          </Card>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all">
            <CardHeader className="pb-4">
              <div className="p-3 bg-green-500/10 rounded-lg w-fit mb-4">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <CardTitle className="text-white text-xl">Immutable Evidence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Cryptographically secured records that stand up in court. Every audit trail is tamper-proof and legally admissible.
              </p>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Legal Grade
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all">
            <CardHeader className="pb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg w-fit mb-4">
                <Eye className="h-10 w-10 text-blue-400" />
              </div>
              <CardTitle className="text-white text-xl">Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Continuous compliance monitoring with instant alerts. Know about violations before regulators do.
              </p>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                24/7 Active
              </Badge>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all">
            <CardHeader className="pb-4">
              <div className="p-3 bg-purple-500/10 rounded-lg w-fit mb-4">
                <Lock className="h-10 w-10 text-purple-400" />
              </div>
              <CardTitle className="text-white text-xl">Enterprise Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">
                Military-grade encryption with zero-trust architecture. Your data remains private and secure.
              </p>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                SOC2 Type II
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Industry Solutions */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Trusted by Regulated Industries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="p-4 bg-blue-500/10 rounded-xl w-fit mb-4">
                  <Building2 className="h-12 w-12 text-blue-400" />
                </div>
                <CardTitle className="text-white text-xl">Financial Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    SOX compliance automation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    SEC audit trail management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Anti-money laundering tracking
                  </li>
                </ul>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                  SEC Compliant
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="p-4 bg-green-500/10 rounded-xl w-fit mb-4">
                  <Users className="h-12 w-12 text-green-400" />
                </div>
                <CardTitle className="text-white text-xl">Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    HIPAA compliance monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Patient record integrity
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    Clinical trial documentation
                  </li>
                </ul>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                  HIPAA Ready
                </Badge>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:bg-slate-800/70 transition-all">
              <CardHeader>
                <div className="p-4 bg-purple-500/10 rounded-xl w-fit mb-4">
                  <Scale className="h-12 w-12 text-purple-400" />
                </div>
                <CardTitle className="text-white text-xl">Enterprise</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-slate-300 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Corporate governance
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Board meeting records
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    Executive communications
                  </li>
                </ul>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  SOX Certified
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
          <CardContent className="p-12 text-center">
            <div className="p-4 bg-blue-500/10 rounded-2xl w-fit mx-auto mb-6">
              <FileText className="h-16 w-16 text-blue-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready for Enterprise Compliance?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join Fortune 500 companies using Audit Trail to eliminate compliance risk and reduce audit costs.
            </p>
            <div className="flex gap-4 justify-center mb-8">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Request Enterprise Proposal
              </Button>
              <Button size="lg" variant="outline" className="border-slate-500 text-slate-300 hover:bg-slate-700 px-8 py-4">
                Schedule Executive Demo
              </Button>
            </div>
            <div className="flex justify-center gap-6 text-sm text-slate-400">
              <span>• SOC2 Type II Certified</span>
              <span>• 99.9% Uptime SLA</span>
              <span>• 24/7 Enterprise Support</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}