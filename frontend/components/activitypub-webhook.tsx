"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Webhook, Copy, Check } from "lucide-react"

export function ActivityPubWebhook() {
  const [webhookUrl, setWebhookUrl] = useState("")
  const [copied, setCopied] = useState(false)

  const generateWebhookUrl = () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com"
    const url = `${baseUrl}/api/activitypub/webhook`
    setWebhookUrl(url)
  }

  const copyToClipboard = async () => {
    if (webhookUrl) {
      await navigator.clipboard.writeText(webhookUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Webhook className="h-5 w-5" />
          ActivityPub Webhook Setup
        </CardTitle>
        <CardDescription>Configure real-time notifications for ActivityPub events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Button onClick={generateWebhookUrl} className="mb-4">
            Generate Webhook URL
          </Button>

          {webhookUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Input value={webhookUrl} readOnly className="font-mono text-sm" />
                <Button size="sm" variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Configure this webhook URL in your ActivityPub server to receive:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>New post notifications</li>
                  <li>Post edit events</li>
                  <li>Post deletion events</li>
                  <li>User activity updates</li>
                </ul>
              </div>

              <div className="flex gap-2 mt-4">
                <Badge variant="outline">POST requests</Badge>
                <Badge variant="outline">JSON payload</Badge>
                <Badge variant="outline">ActivityStreams format</Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
