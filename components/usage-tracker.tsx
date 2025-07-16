"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, Zap } from "lucide-react"
import Link from "next/link"

interface UsageTrackerProps {
  userId: string
}

interface UsageData {
  generationsUsed: number
  isPro: boolean
  maxGenerations: number
}

export function UsageTracker({ userId }: UsageTrackerProps) {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [userId])

  const fetchUsage = async () => {
    try {
      const response = await fetch(`/api/usage?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setUsage(data)
      }
    } catch (error) {
      console.error("Failed to fetch usage:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!usage) return null

  const progressPercentage = usage.isPro ? 100 : (usage.generationsUsed / usage.maxGenerations) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Usage
          </CardTitle>
          {usage.isPro ? (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
              <Crown className="h-3 w-3 mr-1" />
              Pro
            </Badge>
          ) : (
            <Badge variant="secondary">Free</Badge>
          )}
        </div>
        <CardDescription>
          {usage.isPro
            ? "Unlimited workflow generations"
            : `${usage.generationsUsed} of ${usage.maxGenerations} generations used`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!usage.isPro && (
          <>
            <Progress value={progressPercentage} className="w-full" />
            {usage.generationsUsed >= usage.maxGenerations && (
              <div className="text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">You've reached your free limit</p>
                <Link href="/pricing">
                  <Button size="sm" className="w-full">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Pro
                  </Button>
                </Link>
              </div>
            )}
          </>
        )}

        {usage.isPro && (
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">Enjoying unlimited generations</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
