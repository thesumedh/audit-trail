"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Coins, TrendingUp, Lock, Gift } from "lucide-react"

interface StakingPool {
  id: string
  name: string
  apy: number
  totalStaked: number
  userStaked: number
  lockPeriod: string
  rewards: number
}

export default function TokenomicsPanel() {
  const [feedBalance, setFeedBalance] = useState(1250.75)
  const [stakeAmount, setStakeAmount] = useState("")
  const [stakingPools] = useState<StakingPool[]>([
    {
      id: "1",
      name: "News Verification Pool",
      apy: 12.5,
      totalStaked: 2500000,
      userStaked: 500,
      lockPeriod: "30 days",
      rewards: 15.2,
    },
    {
      id: "2",
      name: "Premium Feed Access",
      apy: 8.3,
      totalStaked: 1800000,
      userStaked: 250,
      lockPeriod: "7 days",
      rewards: 8.7,
    },
  ])

  const totalStaked = stakingPools.reduce((sum, pool) => sum + pool.userStaked, 0)
  const totalRewards = stakingPools.reduce((sum, pool) => sum + pool.rewards, 0)

  return (
    <div className="space-y-6">
      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{feedBalance.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">$FEED Balance</p>
              </div>
              <Coins className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-500">{totalStaked.toFixed(0)}</p>
                <p className="text-sm text-muted-foreground">Total Staked</p>
              </div>
              <Lock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-500">{totalRewards.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">Pending Rewards</p>
              </div>
              <Gift className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staking Pools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Staking Pools
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {stakingPools.map((pool) => (
            <div key={pool.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{pool.name}</h3>
                <Badge variant="secondary">{pool.apy}% APY</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Staked</p>
                  <p className="font-semibold">{pool.totalStaked.toLocaleString()} $FEED</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Your Stake</p>
                  <p className="font-semibold">{pool.userStaked} $FEED</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Lock Period</p>
                  <p className="font-semibold">{pool.lockPeriod}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rewards</p>
                  <p className="font-semibold text-green-500">{pool.rewards} $FEED</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Amount to stake"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="max-w-xs"
                />
                <Button size="sm" className="btn-primary">
                  Stake
                </Button>
                <Button size="sm" variant="outline">
                  Claim Rewards
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
