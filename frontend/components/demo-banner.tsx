"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Info, Zap } from "lucide-react"

export function DemoBanner() {
  return (
    <Card className="bg-blue-50 border-blue-200 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                <Zap className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
              <span className="text-sm font-medium text-blue-800">Hackathon Demonstration</span>
            </div>
            <p className="text-sm text-blue-700">
              This demo uses mock Aptos transactions for demonstration. In production, it would use deployed Move contracts for full immutable ledger functionality.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}