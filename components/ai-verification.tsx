"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface VerificationResult {
  postId: string
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  factCheck: "verified" | "disputed" | "unverified"
  riskScore: number
  aiModel: string
  timestamp: string
}

export default function AIVerification() {
  const [isVerifying, setIsVerifying] = useState(false)
  const [results, setResults] = useState<VerificationResult[]>([
    {
      postId: "1",
      sentiment: "neutral",
      confidence: 0.87,
      factCheck: "verified",
      riskScore: 0.15,
      aiModel: "FinBERT-sentiment",
      timestamp: "2024-01-15 14:32:15",
    },
    {
      postId: "2",
      sentiment: "positive",
      confidence: 0.92,
      factCheck: "unverified",
      riskScore: 0.45,
      aiModel: "DistilBERT-fact-check",
      timestamp: "2024-01-15 13:47:22",
    },
  ])

  const runVerification = async () => {
    setIsVerifying(true)
    // Simulate AI verification process
    setTimeout(() => {
      setIsVerifying(false)
    }, 3000)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500"
      case "negative":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getFactCheckIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disputed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            AI Verification Engine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Hugging Face Integration</p>
              <p className="text-sm text-muted-foreground">Real-time sentiment analysis and fact-checking</p>
            </div>
            <Button onClick={runVerification} disabled={isVerifying} className="btn-primary">
              {isVerifying ? "Verifying..." : "Run Verification"}
            </Button>
          </div>

          {isVerifying && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Processing posts...</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.postId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Post #{result.postId}</h3>
                  <Badge variant="outline" className="font-mono">
                    {result.aiModel}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sentiment</p>
                    <p className={`font-semibold capitalize ${getSentimentColor(result.sentiment)}`}>
                      {result.sentiment}
                    </p>
                    <p className="text-xs text-muted-foreground">{(result.confidence * 100).toFixed(1)}% confidence</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Fact Check</p>
                    <div className="flex items-center space-x-1">
                      {getFactCheckIcon(result.factCheck)}
                      <span className="font-semibold capitalize">{result.factCheck}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Risk Score</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={result.riskScore * 100} className="w-16 h-2" />
                      <span className="text-sm font-semibold">{(result.riskScore * 100).toFixed(0)}%</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Verified</p>
                    <p className="text-xs font-mono">{result.timestamp}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
