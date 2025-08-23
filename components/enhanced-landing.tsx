"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, Download, Github, ArrowRight, Zap, 
  Database, Lock, Bot, Globe, CheckCircle,
  TrendingUp, Activity, Code, Star, Users
} from "lucide-react"

export function EnhancedLanding() {
  const [stats, setStats] = useState({
    records: 0,
    enterprises: 0,
    uptime: 0
  })

  useEffect(() => {
    // Animate counters
    const interval = setInterval(() => {
      setStats(prev => ({
        records: Math.min(prev.records + 1247, 2847392),
        enterprises: Math.min(prev.enterprises + 1, 127),
        uptime: Math.min(prev.uptime + 0.1, 99.9)
      }))
    }, 50)

    setTimeout(() => clearInterval(interval), 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          <div className="space-y-4">
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2 text-sm">
              <Star className="w-4 h-4 mr-2" />
              Aptos Web3 Hackathon 2024
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
              ImmutableFeed
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Enterprise-grade audit trails for ActivityPub posts using Aptos blockchain, 
              AI verification, and zero-knowledge proofs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Download className="h-6 w-6 mr-3" />
              Install SDK
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
            >
              <Github className="h-6 w-6 mr-3" />
              View Source
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-blue-400/50 text-blue-300 hover:bg-blue-500/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              onClick={() => window.open('/sdk-demo', '_blank')}
            >
              <Code className="h-6 w-6 mr-3" />
              Live Demo
            </Button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {stats.records.toLocaleString()}
              </div>
              <p className="text-gray-300">Immutable Records</p>
              <div className="flex items-center justify-center mt-2">
                <Activity className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Live</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-purple-400 mb-2">
                {stats.enterprises}+
              </div>
              <p className="text-gray-300">Enterprise Clients</p>
              <div className="flex items-center justify-center mt-2">
                <Users className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-xs text-blue-400">Growing</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10 text-center">
            <CardContent className="pt-8">
              <div className="text-4xl font-bold text-green-400 mb-2">
                {stats.uptime.toFixed(1)}%
              </div>
              <p className="text-gray-300">Uptime SLA</p>
              <div className="flex items-center justify-center mt-2">
                <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-xs text-green-400">Verified</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardHeader>
              <Bot className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-xl text-white">AI Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Advanced AI models verify content authenticity and detect manipulation attempts with 95%+ accuracy.
              </p>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Machine Learning
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
            <CardHeader>
              <Shield className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-xl text-white">Zero-Knowledge Proofs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Verify compliance without revealing sensitive data using cutting-edge ZK technology.
              </p>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Privacy-First
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border-green-500/20 hover:border-green-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
              <CardTitle className="text-xl text-white">DeFi Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Automated trading triggers and $FEED token rewards for verified audit contributions.
              </p>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                8.2% APY
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border-red-500/20 hover:border-red-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
            <CardHeader>
              <Lock className="h-12 w-12 text-red-400 mb-4" />
              <CardTitle className="text-xl text-white">Immutable Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Cryptographically secured hash chains ensure 99.8% integrity for audit trails.
              </p>
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
                Tamper-Proof
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-yellow-500/10 backdrop-blur-sm border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20">
            <CardHeader>
              <Database className="h-12 w-12 text-orange-400 mb-4" />
              <CardTitle className="text-xl text-white">Legal Discovery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Generate court-ready reports with cryptographic proofs and chain of custody.
              </p>
              <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">
                Court-Ready
              </Badge>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500/10 to-blue-500/10 backdrop-blur-sm border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20">
            <CardHeader>
              <Globe className="h-12 w-12 text-indigo-400 mb-4" />
              <CardTitle className="text-xl text-white">Enterprise Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Built for enterprise compliance with SOC2, GDPR, and financial regulations.
              </p>
              <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
                Enterprise-Ready
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Ready to Build?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join the future of enterprise compliance with our comprehensive SDK and real-time dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={() => window.open('/sdk-demo', '_blank')}
            >
              <Zap className="h-6 w-6 mr-3" />
              Try Live Demo
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
              onClick={() => window.open('/dashboard', '_blank')}
            >
              <Activity className="h-6 w-6 mr-3" />
              View Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}