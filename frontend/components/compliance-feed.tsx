"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  FileText, 
  Eye, 
  Edit, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  ExternalLink,
  Download
} from "lucide-react";
import { complianceEvents, demoFinancialNews } from "../lib/demo-data";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function ComplianceFeed() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "create": return <FileText className="w-4 h-4 text-emerald-400" />;
      case "update": return <Edit className="w-4 h-4 text-blue-400" />;
      case "access": return <Eye className="w-4 h-4 text-purple-400" />;
      default: return <Shield className="w-4 h-4 text-gray-400" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "create": return "border-l-emerald-500 bg-emerald-500/5";
      case "update": return "border-l-blue-500 bg-blue-500/5";
      case "access": return "border-l-purple-500 bg-purple-500/5";
      default: return "border-l-gray-500 bg-gray-500/5";
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ago`;
    }
    return `${minutes}m ago`;
  };

  const getArticleTitle = (entityId: string) => {
    const article = demoFinancialNews.find(a => a.id === entityId);
    return article?.headline || "Unknown Article";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial="initial"
        animate="animate"
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold text-white mb-4">
          Compliance Feed
        </h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Visual chronological log displaying all anchored events for regulatory compliance. 
          Perfect for investigators and compliance officers.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total Events</p>
                  <p className="text-2xl font-bold text-white">{complianceEvents.length}</p>
                </div>
                <Shield className="w-8 h-8 text-teal-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Verified</p>
                  <p className="text-2xl font-bold text-emerald-400">100%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Last 24h</p>
                  <p className="text-2xl font-bold text-blue-400">{complianceEvents.length}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Compliance</p>
                  <p className="text-2xl font-bold text-purple-400">98.5%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Timeline */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Audit Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  variants={fadeInUp}
                  className={`border-l-4 pl-4 py-3 rounded-r-lg ${getEventColor(event.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getEventIcon(event.type)}
                        <Badge variant="outline" className="text-xs">
                          {event.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {formatTime(event.timestamp)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-white mb-1">
                        {getArticleTitle(event.entityId)}
                      </h4>
                      
                      <p className="text-sm text-slate-300 mb-2">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">TX:</span>
                        <code className="bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                          {event.txHash.slice(0, 20)}...
                        </code>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 text-teal-400 hover:text-teal-300"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {event.verified && (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-slate-400 hover:text-white"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Load More Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Options */}
      <motion.div 
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white">Export Compliance Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white">
                <Download className="w-4 h-4 mr-2" />
                PDF Report
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Download className="w-4 h-4 mr-2" />
                CSV Export
              </Button>
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <Download className="w-4 h-4 mr-2" />
                JSON Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}