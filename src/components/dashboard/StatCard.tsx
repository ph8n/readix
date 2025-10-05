"use client"

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'

interface TrendInfo {
  type: 'up' | 'down' | 'flat'
  value?: string
}

interface StatCardProps {
  label: string
  value?: React.ReactNode
  subValue?: React.ReactNode
  description?: string
  icon?: React.ReactNode
  variant?: 'default' | 'accent' | 'warn' | 'success' | 'neutral'
  trend?: TrendInfo
  compact?: boolean
  className?: string
  isLoading?: boolean
  isRefreshing?: boolean
  error?: string | null
  isStale?: boolean
}

const variantClasses: Record<NonNullable<StatCardProps['variant']>, string> = {
  default: 'bg-card',
  accent: 'bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border-indigo-500/30',
  warn: 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 border-amber-500/30',
  success: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/30',
  neutral: 'bg-muted/30',
}

function ArrowIcon({ type }: { type: TrendInfo['type'] }) {
  const base = 'inline-block h-3 w-3'
  switch (type) {
    case 'up':
      return <span aria-hidden className={cn(base, 'text-emerald-500')}>▲</span>
    case 'down':
      return <span aria-hidden className={cn(base, 'text-red-500')}>▼</span>
    default:
      return <span aria-hidden className={cn(base, 'text-muted-foreground')}>—</span>
  }
}

export function StatCard({
  label,
  value,
  subValue,
  description,
  icon,
  variant = 'default',
  trend,
  compact,
  className,
  isLoading = false,
  isRefreshing = false,
  error = null,
  isStale = false,
}: StatCardProps) {
  const loading = isLoading
  const showSkeleton = loading && !error && (value === undefined || value === null)
  const isBackgroundRefresh = isRefreshing && !showSkeleton

  return (
    <Card
      className={cn(
        'relative overflow-hidden p-4 transition-colors',
        compact ? 'py-3 px-4' : 'py-4',
        variantClasses[variant],
        error && 'border-destructive/50',
        className,
      )}
      aria-busy={loading || undefined}
    >
      <div className={cn('flex items-start justify-between gap-3')}>
        <div className="flex items-center gap-2 min-w-0">
          {icon && <div className="shrink-0 text-muted-foreground">{icon}</div>}
          <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase truncate" title={label}>{label}</div>
          {isStale && !error && (
            <span className="ml-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/15 text-amber-600">Stale</span>
          )}
          {isBackgroundRefresh && (
            <span className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-indigo-500" aria-label="Refreshing" />
          )}
        </div>
        {trend && !error && (
          <div className="flex items-center gap-1 text-xs font-medium">
            <ArrowIcon type={trend.type} />
            {trend.value && <span>{trend.value}</span>}
          </div>
        )}
      </div>

      {error ? (
        <div className="mt-4 flex flex-col items-start gap-2" role="alert">
          <div className="text-sm font-medium text-destructive truncate">{error}</div>
        </div>
      ) : showSkeleton ? (
        <div className="mt-4 space-y-3">
          <div className="h-7 w-24 rounded bg-muted/40 animate-pulse" />
          <div className="h-3 w-32 rounded bg-muted/30 animate-pulse" />
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-1">
          <div className={cn(
            'text-2xl font-semibold leading-none tracking-tight',
            value === '—' && 'text-muted-foreground'
          )}>
            {value ?? '—'}
          </div>
          {(subValue || description) && (
            <div className="text-xs text-muted-foreground truncate" title={(subValue || description)?.toString()}>
              {subValue || description}
            </div>
          )}
        </div>
      )}
    </Card>
  )
}

export type { StatCardProps }
