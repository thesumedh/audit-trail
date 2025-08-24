"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, X, TrendingUp, Shield, Database, 
  FileText, Activity, Zap, CheckCircle, AlertTriangle 
} from "lucide-react"

export function DemoWelcome() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="bg-gradient-to-r from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20 border-purple-200 dark:border-purple-800 relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-300/30">
            <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          Welcome to ImmutableFeed Demo
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🚀 Enterprise Compliance Platform
            </h3>
            <p className="text-muted-foreground">
              Experience a complete audit trail system designed for hospitals, banks, and public companies. 
              Every action is cryptographically secured on Aptos blockchain.
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Tamper-proof audit trails</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">SOX & HIPAA compliance ready</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Legal discovery tools</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" />
                <span className="text-sm">Real-time monitoring</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              🎯 Demo Features
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <Button
                variant="outline"
                onClick={() => window.open('/financial-news', '_blank')}
                className="justify-start h-auto p-3"
              >
                <TrendingUp className="w-4 h-4 mr-3 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Financial News Demo</div>
                  <div className="text-xs text-muted-foreground">Live blockchain publishing with audit trails</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  const complianceTab = document.querySelector('[value="compliance"]') as HTMLElement
                  complianceTab?.click()
                }}
                className="justify-start h-auto p-3"
              >
                <Database className="w-4 h-4 mr-3 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Compliance Timeline</div>
                  <div className="text-xs text-muted-foreground">Visual audit trail for investigators</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('/sdk', '_blank')}
                className="justify-start h-auto p-3"
              >
                <Zap className="w-4 h-4 mr-3 text-purple-500" />
                <div className="text-left">
                  <div className="font-medium">Developer SDK</div>
                  <div className="text-xs text-muted-foreground">Enterprise integration toolkit</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live Blockchain
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              Cryptographically Secured
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <FileText className="w-3 h-3 mr-1" />
              Legal Grade
            </Badge>
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Compliance Ready
            </Badge>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            💡 <strong>Pro Tip:</strong> Try editing articles in the Financial News demo to see real-time audit trails and compliance violations in action!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}