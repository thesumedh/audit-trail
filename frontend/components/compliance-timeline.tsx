"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Clock, Shield, Eye, Edit, FileText, AlertTriangle, 
  CheckCircle, Hash, User, Calendar, Download, Filter,
  Search, Activity, Database, Zap, TrendingUp
} from "lucide-react"
import { auditStore } from "../lib/audit-store"

interface ComplianceEvent {
  id: string;
  entityId: string;
  entityType: 'article' | 'document' | 'record';
  eventType: 'create' | 'update' | 'access' | 'delete' | 'restore';
  timestamp: number;
  actor: string;
  description: string;
  hash: string;
  txHash: string;
  metadata: any;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceFlags: string[];
}

export function ComplianceTimeline() {
  const [events, setEvents] = useState<ComplianceEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<ComplianceEvent[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterRisk, setFilterRisk] = useState<string>("all")

  useEffect(() => {
    loadComplianceEvents()
    const unsubscribe = auditStore.subscribe(() => {
      loadComplianceEvents()
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, selectedEntity, searchQuery, filterType, filterRisk])

  const loadComplianceEvents = () => {
    const auditEntries = auditStore.getAllEntries()
    const complianceEvents: ComplianceEvent[] = []

    auditEntries.forEach(entry => {
      // Create event
      complianceEvents.push({
        id: `create_${entry.id}`,
        entityId: entry.id,
        entityType: 'article',
        eventType: 'create',
        timestamp: entry.timestamp,
        actor: entry.author,
        description: `Article created: "${entry.originalContent.substring(0, 50)}..."`,
        hash: entry.originalHash,
        txHash: entry.txHash,
        metadata: { contentLength: entry.originalContent.length },
        riskLevel: 'low',
        complianceFlags: ['initial-creation']
      })

      // Modification events
      entry.modifications.forEach((mod, index) => {
        const riskLevel = entry.modifications.length > 3 ? 'high' : 
                         entry.modifications.length > 1 ? 'medium' : 'low'
        
        complianceEvents.push({
          id: mod.id,
          entityId: entry.id,
          entityType: 'article',
          eventType: 'update',
          timestamp: mod.timestamp,
          actor: entry.author,
          description: `Content modified: ${mod.diff}`,
          hash: mod.newHash,
          txHash: mod.txHash,
          metadata: { 
            changeType: mod.changeType,
            previousHash: mod.previousHash,
            modificationIndex: index + 1
          },
          riskLevel,
          complianceFlags: [
            'content-modification',
            ...(entry.modifications.length > 2 ? ['frequent-changes'] : []),
            ...(riskLevel === 'high' ? ['high-risk-pattern'] : [])
          ]
        })
      })

      // Simulated access events
      if (Math.random() > 0.7) {
        complianceEvents.push({
          id: `access_${entry.id}_${Date.now()}`,
          entityId: entry.id,
          entityType: 'article',
          eventType: 'access',
          timestamp: Date.now() - Math.random() * 86400000,
          actor: 'compliance@company.com',
          description: 'Document accessed for compliance review',
          hash: entry.currentHash,
          txHash: '',
          metadata: { accessType: 'compliance-review' },
          riskLevel: 'low',
          complianceFlags: ['compliance-access']
        })
      }
    })

    // Sort by timestamp (newest first)
    complianceEvents.sort((a, b) => b.timestamp - a.timestamp)
    setEvents(complianceEvents)
  }

  const filterEvents = () => {
    let filtered = events

    if (selectedEntity) {
      filtered = filtered.filter(event => event.entityId === selectedEntity)
    }

    if (searchQuery) {
      filtered = filtered.filter(event => 
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.entityId.includes(searchQuery)
      )
    }

    if (filterType !== "all") {
      filtered = filtered.filter(event => event.eventType === filterType)
    }

    if (filterRisk !== "all") {
      filtered = filtered.filter(event => event.riskLevel === filterRisk)
    }

    setFilteredEvents(filtered)
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'create': return <FileText className="w-4 h-4 text-green-500" />
      case 'update': return <Edit className="w-4 h-4 text-orange-500" />
      case 'access': return <Eye className="w-4 h-4 text-blue-500" />
      case 'delete': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getUniqueEntities = () => {
    const entities = new Set(events.map(e => e.entityId))
    return Array.from(entities)
  }

  const exportComplianceReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalEvents: filteredEvents.length,
      riskDistribution: {
        critical: filteredEvents.filter(e => e.riskLevel === 'critical').length,
        high: filteredEvents.filter(e => e.riskLevel === 'high').length,
        medium: filteredEvents.filter(e => e.riskLevel === 'medium').length,
        low: filteredEvents.filter(e => e.riskLevel === 'low').length,
      },
      events: filteredEvents
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `compliance-report-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-300/30">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            Compliance Feed & Audit Timeline
          </CardTitle>
          <p className="text-muted-foreground">
            Visual chronological log of all anchored events for compliance and investigation purposes
          </p>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search Events</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search descriptions, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Entity Filter</label>
              <select 
                value={selectedEntity}
                onChange={(e) => setSelectedEntity(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="">All Entities</option>
                {getUniqueEntities().map(entityId => (
                  <option key={entityId} value={entityId}>Entity #{entityId}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Event Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="access">Access</option>
                <option value="delete">Delete</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Risk Level</label>
              <select 
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
                className="w-full p-2 border rounded-md bg-background"
              >
                <option value="all">All Levels</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button onClick={exportComplianceReport} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{filteredEvents.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold text-orange-600">
                  {filteredEvents.filter(e => e.riskLevel === 'high' || e.riskLevel === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Modifications</p>
                <p className="text-2xl font-bold text-purple-600">
                  {filteredEvents.filter(e => e.eventType === 'update').length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Entities</p>
                <p className="text-2xl font-bold text-green-600">{getUniqueEntities().length}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Compliance Timeline ({filteredEvents.length} events)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No events match your current filters</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredEvents.map((event, index) => (
                <div key={event.id} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getEventIcon(event.eventType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {event.eventType.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${getRiskColor(event.riskLevel)}`}>
                        {event.riskLevel.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        Entity #{event.entityId}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium mb-1">{event.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {event.actor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(event.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {event.hash.substring(0, 8)}...
                      </div>
                    </div>

                    {event.complianceFlags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.complianceFlags.map(flag => (
                          <Badge key={flag} variant="secondary" className="text-xs">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-xs text-muted-foreground">
                    {index === 0 && <Badge variant="outline" className="text-xs">Latest</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}