"use client"
import * as React from 'react'
import type { ReadingStreak } from '@/lib/dashboard-metrics'
import { formatStreak } from '@/lib/metrics-format'
import { cn } from '@/lib/utils'

interface StreakBadgeProps {
  streak?: ReadingStreak
  loading?: boolean
  stale?: boolean
  className?: string
}

export function StreakBadge({ streak, loading, stale, className }: StreakBadgeProps) {
  if (loading) {
    return (
      <div className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1.5', className)}>
        <div className="h-4 w-4 rounded-full bg-muted/40 animate-pulse" />
        <div className="h-3 w-24 rounded bg-muted/40 animate-pulse" />
      </div>
    )
  }

  const hasStreak = !!streak && streak.current > 0
  const label = formatStreak(streak)

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
        hasStreak ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' : 'border-muted bg-muted/20 text-muted-foreground',
        className,
      )}
      aria-label={streak ? `Current streak ${streak.current} days; longest ${streak.longest} days` : 'No active streak'}
    >
      <div className={cn('h-2.5 w-2.5 rounded-full', hasStreak ? 'bg-indigo-500 animate-pulse' : 'bg-muted-foreground/50')} />
      <span className="font-medium tabular-nums">{streak?.current ?? 0}</span>
      <span className="text-xs font-normal leading-none">days</span>
      {streak && streak.longest > streak.current && (
        <span className="text-[10px] font-medium text-muted-foreground/70">best {streak.longest}</span>
      )}
      {!hasStreak && <span className="text-[10px] font-medium">start reading</span>}
      {stale && <span className="ml-1 rounded bg-amber-500/20 px-1 text-[10px] font-medium text-amber-600">stale</span>}
      <span className="sr-only">{label}</span>
    </div>
  )
}

export type { StreakBadgeProps }
