"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wallet, Shield, Zap, Hash, CheckCircle, AlertTriangle, 
  Download, Copy, ExternalLink, Sparkles, Hexagon, 
  Activity, TrendingUp, Lock, Eye, FileText
} from "lucide-react"

interface Web3ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Web3Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  onClick, 
  disabled, 
  loading, 
  icon 
}: Web3ButtonProps) {
  const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 rounded-xl border-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white border-transparent shadow-lg shadow-purple-500/25",
    secondary: "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-gray-600 shadow-lg shadow-gray-500/25",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-transparent shadow-lg shadow-green-500/25",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white border-transparent shadow-lg shadow-yellow-500/25",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-transparent shadow-lg shadow-red-500/25"
  }
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <Button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      <div className="relative flex items-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        ) : icon}
        {children}
      </div>
    </Button>
  )
}

interface Web3CardProps {
  children: React.ReactNode;
  className?: string;
  glowing?: boolean;
}

export function Web3Card({ children, className = "", glowing = false }: Web3CardProps) {
  return (
    <Card className={`
      relative overflow-hidden backdrop-blur-xl 
      bg-gradient-to-br from-white/90 via-white/80 to-white/70 
      dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/70
      border border-gray-200/50 dark:border-gray-700/50 
      shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-400/20 
      transition-all duration-500
      ${glowing ? 'shadow-purple-500/30 dark:shadow-purple-400/30 border-purple-400/50 dark:border-purple-500/50' : ''}
      ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 dark:from-purple-400/10 dark:via-transparent dark:to-cyan-400/10"></div>
      <div className="relative z-10">
        {children}
      </div>
    </Card>
  )
}

interface HashDisplayProps {
  hash: string;
  label?: string;
  copyable?: boolean;
}

export function HashDisplay({ hash, label = "Hash", copyable = true }: HashDisplayProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-gray-100/80 dark:bg-black/30 rounded-lg border border-gray-200 dark:border-white/10 backdrop-blur-sm">
      <Hash className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}:</span>
      <code className="font-mono text-sm text-cyan-600 dark:text-cyan-300 flex-1">{hash}</code>
      {copyable && (
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 hover:bg-gray-200/50 dark:hover:bg-white/10"
        >
          {copied ? (
            <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400" />
          ) : (
            <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          )}
        </Button>
      )}
    </div>
  )
}

interface StatusBadgeProps {
  status: "verified" | "pending" | "modified" | "error";
  children: React.ReactNode;
}

export function StatusBadge({ status, children }: StatusBadgeProps) {
  const variants = {
    verified: "bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-500/20 dark:to-emerald-500/20 text-green-700 dark:text-green-300 border-green-300 dark:border-green-400/50",
    pending: "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-500/20 dark:to-orange-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-400/50",
    modified: "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/20 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-400/50",
    error: "bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-500/20 dark:to-pink-500/20 text-red-700 dark:text-red-300 border-red-300 dark:border-red-400/50"
  }

  const icons = {
    verified: <CheckCircle className="w-3 h-3" />,
    pending: <Activity className="w-3 h-3 animate-pulse" />,
    modified: <AlertTriangle className="w-3 h-3" />,
    error: <AlertTriangle className="w-3 h-3" />
  }

  return (
    <Badge className={`${variants[status]} border backdrop-blur-sm`}>
      {icons[status]}
      <span className="ml-1">{children}</span>
    </Badge>
  )
}

interface WalletConnectProps {
  address?: string;
  connected: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ address, connected, onConnect, onDisconnect }: WalletConnectProps) {
  return (
    <div className="flex items-center gap-3">
      {connected && address ? (
        <div className="flex items-center gap-3">
          <StatusBadge status="verified">Connected</StatusBadge>
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-black/20 rounded-lg border border-green-200 dark:border-green-400/30">
            <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
            <code className="font-mono text-sm text-green-700 dark:text-green-300">
              {address.slice(0, 6)}...{address.slice(-4)}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(address)}
              className="h-6 w-6 p-0 hover:bg-green-100 dark:hover:bg-white/10"
            >
              <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
            </Button>
          </div>
          {onDisconnect && (
            <Web3Button variant="secondary" size="sm" onClick={onDisconnect}>
              Disconnect
            </Web3Button>
          )}
        </div>
      ) : (
        <Web3Button 
          variant="primary" 
          onClick={onConnect}
          icon={<Wallet className="w-4 h-4" />}
        >
          Connect Wallet
        </Web3Button>
      )}
    </div>
  )
}

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function MetricCard({ title, value, change, icon, trend = "neutral" }: MetricCardProps) {
  const trendColors = {
    up: "text-green-400",
    down: "text-red-400", 
    neutral: "text-gray-400"
  }

  return (
    <Web3Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-lg border border-white/10">
          {icon}
        </div>
        {change && (
          <div className={`text-sm ${trendColors[trend]} flex items-center gap-1`}>
            <TrendingUp className="w-3 h-3" />
            {change}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      </div>
    </Web3Card>
  )
}

interface TransactionStatusProps {
  txHash?: string;
  status: "pending" | "confirmed" | "failed";
  blockNumber?: number;
}

export function TransactionStatus({ txHash, status, blockNumber }: TransactionStatusProps) {
  const statusConfig = {
    pending: {
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
      border: "border-yellow-400/50",
      icon: <Activity className="w-4 h-4 animate-pulse" />
    },
    confirmed: {
      color: "text-green-400", 
      bg: "bg-green-500/20",
      border: "border-green-400/50",
      icon: <CheckCircle className="w-4 h-4" />
    },
    failed: {
      color: "text-red-400",
      bg: "bg-red-500/20", 
      border: "border-red-400/50",
      icon: <AlertTriangle className="w-4 h-4" />
    }
  }

  const config = statusConfig[status]

  return (
    <div className={`p-4 rounded-lg border ${config.bg} ${config.border} backdrop-blur-sm`}>
      <div className="flex items-center gap-3 mb-2">
        {config.icon}
        <span className={`font-semibold ${config.color}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      {txHash && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Tx:</span>
          <code className="font-mono text-cyan-300">{txHash.slice(0, 10)}...{txHash.slice(-6)}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(txHash)}
            className="h-6 w-6 p-0 hover:bg-white/10"
          >
            <Copy className="w-3 h-3 text-gray-400" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/10"
          >
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </Button>
        </div>
      )}
      {blockNumber && (
        <div className="text-sm text-gray-400 mt-1">
          Block: #{blockNumber.toLocaleString()}
        </div>
      )}
    </div>
  )
}