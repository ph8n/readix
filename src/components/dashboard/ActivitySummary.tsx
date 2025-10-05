"use client"
import * as React from 'react'
import { formatActiveDaysSummary, timeAgo, formatMinutesCompact } from '@/lib/metrics-format'

interface ActivitySummaryProps {
  activeDays7: number
  activeDays30: number
  lastActiveAt: string | null
  weekMinutes: number
  className?: string
  isLoading?: boolean
  error?: string | null
  isStale?: boolean
}

export function ActivitySummary({
  activeDays7,
  activeDays30,
  lastActiveAt,
  weekMinutes,
  className,
  isLoading = false,
  error = null,
  isStale = false,
}: ActivitySummaryProps) {
  const loading = isLoading
  if (error) {
    return (
      <div className={className} role="alert">
        <div className="text-sm font-medium text-destructive">{error}</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="h-3 w-32 rounded bg-muted/40 animate-pulse mb-2" />
        <div className="h-3 w-40 rounded bg-muted/30 animate-pulse mb-2" />
        <div className="h-3 w-24 rounded bg-muted/20 animate-pulse" />
      </div>
    )
  }

  const activeSummary = formatActiveDaysSummary(activeDays7, activeDays30)
  const lastActive = timeAgo(lastActiveAt)
  const week = formatMinutesCompact(weekMinutes)

  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-sm font-medium">
        <span className="tabular-nums">{activeSummary}</span>
        {isStale && <span className="rounded bg-amber-500/20 px-1 text-[10px] font-medium text-amber-600">stale</span>}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">Last active: {lastActive}</div>
      <div className="mt-1 text-xs text-muted-foreground">This week: {week}</div>
    </div>
  )
}

export type { ActivitySummaryProps }
