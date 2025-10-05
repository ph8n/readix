"use client"
import * as React from 'react'
import type { ReadingStreak } from '@/lib/dashboard-metrics'
import { StreakBadge } from './StreakBadge'
import { ActivitySummary } from './ActivitySummary'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ReadingActivityProps {
  streak?: ReadingStreak
  activeDays7: number
  activeDays30: number
  lastActiveAt: string | null
  weekMinutes: number
  className?: string
  layout?: 'horizontal' | 'vertical'
  isLoading?: boolean
  isRefreshing?: boolean
  isStale?: boolean
}

export function ReadingActivity({
  streak,
  activeDays7,
  activeDays30,
  lastActiveAt,
  weekMinutes,
  className,
  layout = 'horizontal',
  isLoading = false,
  isRefreshing = false,
  isStale = false,
}: ReadingActivityProps) {
  const content = (
    <div className={cn('flex gap-6', layout === 'vertical' && 'flex-col gap-4')}>
      <StreakBadge streak={streak} loading={isLoading} stale={isStale} />
      <ActivitySummary
        activeDays7={activeDays7}
        activeDays30={activeDays30}
        lastActiveAt={lastActiveAt}
        weekMinutes={weekMinutes}
        isLoading={isLoading}
        isStale={isStale}
      />
    </div>
  )

  return (
    <Card className={cn('p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">Activity</h3>
        {isRefreshing && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-indigo-500" aria-label="Refreshing" />
        )}
      </div>
      {content}
    </Card>
  )
}

export type { ReadingActivityProps }
