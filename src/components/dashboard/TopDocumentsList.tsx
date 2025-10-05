"use client"

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { timeAgo, formatMinutes, formatPercent } from '@/lib/metrics-format'
import type { TopDocumentStat } from '@/lib/dashboard-metrics'

interface TopDocumentsListProps {
  documents: TopDocumentStat[] | undefined
  limit?: number
  showPages?: boolean
  showLastRead?: boolean
  className?: string
  heading?: string
  dense?: boolean
  isLoading?: boolean
  isRefreshing?: boolean
  error?: string | null
}

export function TopDocumentsList({
  documents,
  limit = 5,
  showPages = true,
  showLastRead = true,
  className,
  heading = 'Top Documents',
  dense,
  isLoading = false,
  isRefreshing = false,
  error = null,
}: TopDocumentsListProps) {
  const showSkeleton = isLoading && !error && (!documents || documents.length === 0)
  const items = (documents || []).slice(0, limit)

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">{heading}</h3>
        {isRefreshing && !showSkeleton && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-indigo-500" aria-label="Refreshing" />
        )}
      </div>

      {error ? (
        <div className="text-sm text-destructive flex flex-col gap-2" role="alert">
          <span className="font-medium">{error}</span>
        </div>
      ) : showSkeleton ? (
        <SkeletonRows count={limit} />
      ) : items.length === 0 ? (
        <div className="text-sm text-muted-foreground">No reading activity yet.</div>
      ) : (
        <ul className={cn('space-y-2', dense && 'space-y-1.5')}>
          {items.map(doc => (
            <li key={doc.id}>
              <Link
                href={`/read/${doc.id}`}
                className={cn(
                  'group block rounded-md px-2 py-2 -mx-2 transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70',
                  dense && 'py-1.5'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium text-sm" title={doc.title}>{doc.title}</span>
                    </div>
                    <MetaLine
                      minutes={doc.minutes}
                      progress={doc.progress}
                      pagesRead={doc.pagesRead}
                      lastReadAt={doc.lastReadAt}
                      showPages={showPages}
                      showLastRead={showLastRead}
                    />
                  </div>
                  <div className="flex flex-col items-end gap-1 w-20 shrink-0">
                    <div
                      className="text-xs font-medium tabular-nums"
                      aria-label="Reading progress"
                      role="progressbar"
                      aria-valuenow={Math.round(doc.progress)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {formatPercent(doc.progress, 0)}
                    </div>
                    <ProgressBar percent={doc.progress} />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function MetaLine({
  minutes,
  progress,
  pagesRead,
  lastReadAt,
  showPages,
  showLastRead,
}: {
  minutes: number
  progress: number
  pagesRead?: number
  lastReadAt?: string | null
  showPages: boolean
  showLastRead: boolean
}) {
  const parts: string[] = []
  parts.push(formatMinutes(minutes))
  parts.push(formatPercent(progress, 0))
  if (showPages && typeof pagesRead === 'number') parts.push(`${pagesRead}p`)
  if (showLastRead) parts.push(lastReadAt ? timeAgo(lastReadAt) : '—')
  return (
    <div className="text-xs text-muted-foreground truncate" title={parts.join(' · ')}>
      {parts.join(' · ')}
    </div>
  )
}

function ProgressBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, percent || 0))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded bg-muted/30">
      <div
        className="h-full rounded bg-indigo-500 transition-all duration-300"
        style={{ width: `${p}%` }}
      />
    </div>
  )
}

function SkeletonRows({ count }: { count: number }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="-mx-2 px-2 py-2">
          <div className="space-y-2">
            <div className="h-4 w-40 rounded bg-muted/30 animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="h-3 w-32 rounded bg-muted/20 animate-pulse" />
              </div>
              <div className="w-20 space-y-1">
                <div className="h-3 w-10 rounded bg-muted/20 animate-pulse" />
                <div className="h-1.5 w-full rounded bg-muted/20 animate-pulse" />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export type { TopDocumentsListProps }
