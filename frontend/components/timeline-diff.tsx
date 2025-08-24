"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  GitCompare, 
  Clock, 
  User, 
  Hash, 
  CheckCircle, 
  AlertTriangle,
  Eye,
  Download,
  ExternalLink
} from "lucide-react";

interface DiffEntry {
  id: string;
  timestamp: number;
  author: string;
  action: "create" | "modify" | "access";
  description: string;
  contentBefore?: string;
  contentAfter?: string;
  hash: string;
  txHash: string;
}

interface TimelineDiffProps {
  articleId: string;
  title: string;
  diffs: DiffEntry[];
}

export function TimelineDiff({ articleId, title, diffs }: TimelineDiffProps) {
  const [selectedDiff, setSelectedDiff] = useState<DiffEntry | null>(null);
  const [viewMode, setViewMode] = useState<"timeline" | "diff">("timeline");

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "create": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "modify": return <GitCompare className="w-4 h-4 text-blue-400" />;
      case "access": return <Eye className="w-4 h-4 text-purple-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "create": return "border-l-green-500 bg-green-500/5";
      case "modify": return "border-l-blue-500 bg-blue-500/5";
      case "access": return "border-l-purple-500 bg-purple-500/5";
      default: return "border-l-gray-500 bg-gray-500/5";
    }
  };

  const renderDiffView = (diff: DiffEntry) => {
    if (!diff.contentBefore || !diff.contentAfter) {
      return (
        <div className="bg-gray-950/50 rounded-lg p-4">
          <p className="text-gray-400">No content changes to display</p>
        </div>
      );
    }

    const beforeLines = diff.contentBefore.split('\n');
    const afterLines = diff.contentAfter.split('\n');
    const maxLines = Math.max(beforeLines.length, afterLines.length);

    return (
      <div className="bg-gray-950/50 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 divide-x divide-gray-800">
          {/* Before */}
          <div className="bg-red-900/10">
            <div className="px-4 py-2 bg-red-900/20 border-b border-red-800/30">
              <span className="text-red-300 font-medium">Before</span>
            </div>
            <div className="p-4 font-mono text-sm">
              {beforeLines.map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-500 w-8 text-right mr-4">{idx + 1}</span>
                  <span className="text-red-300">- {line}</span>
                </div>
              ))}
            </div>
          </div>

          {/* After */}
          <div className="bg-green-900/10">
            <div className="px-4 py-2 bg-green-900/20 border-b border-green-800/30">
              <span className="text-green-300 font-medium">After</span>
            </div>
            <div className="p-4 font-mono text-sm">
              {afterLines.map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-500 w-8 text-right mr-4">{idx + 1}</span>
                  <span className="text-green-300">+ {line}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Evidence Timeline: {title}
              </CardTitle>
              <p className="text-gray-400 mt-1">
                Complete audit trail with cryptographic verification
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "timeline" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("timeline")}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === "diff" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("diff")}
                disabled={!selectedDiff}
              >
                Diff View
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {viewMode === "timeline" ? (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-800"></div>
          
          <div className="space-y-6">
            {diffs.map((diff, index) => (
              <motion.div
                key={diff.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-white rounded-full border-4 border-black z-10"></div>
                
                <div className="ml-16">
                  <Card className={`border-l-4 ${getActionColor(diff.action)} hover:border-gray-700 transition-colors cursor-pointer`}
                        onClick={() => setSelectedDiff(diff)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getActionIcon(diff.action)}
                          <div>
                            <h4 className="text-white font-medium">{diff.description}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{diff.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimestamp(diff.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-gray-800 text-gray-300">
                          {diff.action.toUpperCase()}
                        </Badge>
                      </div>

                      {/* Blockchain Evidence */}
                      <div className="bg-gray-950/50 rounded p-3 mt-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-gray-400">Content Hash:</span>
                            <div className="font-mono text-gray-300 break-all">{diff.hash}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Transaction:</span>
                            <div className="font-mono text-gray-300 break-all flex items-center gap-2">
                              {diff.txHash.slice(0, 16)}...
                              <Button variant="ghost" size="sm" className="h-auto p-0 text-gray-400 hover:text-white">
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          {diff.contentBefore && diff.contentAfter && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-gray-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDiff(diff);
                                setViewMode("diff");
                              }}
                            >
                              <GitCompare className="w-3 h-3 mr-1" />
                              View Changes
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <Download className="w-3 h-3 mr-1" />
                            Export
                          </Button>
                        </div>
                        <span className="text-xs text-gray-500">
                          Click to view details
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        // Diff View
        selectedDiff && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Changes: {selectedDiff.description}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{selectedDiff.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimestamp(selectedDiff.timestamp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono">{selectedDiff.hash}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {renderDiffView(selectedDiff)}
              
              <div className="mt-4 flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  onClick={() => setViewMode("timeline")}
                  className="text-gray-400 hover:text-white"
                >
                  ← Back to Timeline
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <Download className="w-4 h-4 mr-1" />
                    Export Diff
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View on Explorer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}