"use client"

import { useCallback } from "react"
import Link from "next/link"
import { FolderOpen } from "lucide-react"
import { useDashboardQuery } from "@/hooks/useDashboardQuery"
import { StatCard } from "@/components/dashboard/StatCard"
import { ReadingActivity } from "@/components/dashboard/ReadingActivity"
import { TopDocumentsList } from "@/components/dashboard/TopDocumentsList"
import { RecentlyRead } from "@/components/dashboard/RecentlyRead"
import { FavoriteDocuments } from "@/components/dashboard/FavoriteDocuments"
import { formatMinutes, formatPercent } from "@/lib/metrics-format"
import { Button } from "@/components/ui/button"

// Simplified types for dashboard components
interface RecentDocument {
  id: string
  title: string
  last_read_at: string | null
}

interface FavoriteDocument {
  id: string
  title: string
  is_favorite: boolean
}

interface DashboardClientNewProps {
  recentDocuments?: RecentDocument[]
  favoriteDocuments?: FavoriteDocument[]
}

function SkeletonGrid() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-md border bg-muted/20 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-48 rounded-md border bg-muted/20 animate-pulse lg:col-span-2" />
        <div className="h-48 rounded-md border bg-muted/20 animate-pulse" />
      </div>
    </div>
  )
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="rounded border border-destructive/40 bg-destructive/5 p-8 text-center space-y-4">
      <div className="text-sm font-medium text-destructive">
        {error.message || "Failed to load metrics"}
      </div>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  )
}

export default function DashboardClientNew({
  recentDocuments,
  favoriteDocuments
}: DashboardClientNewProps) {
  const { data, error, isLoading, isFetching, dataUpdatedAt, refetch } = useDashboardQuery()

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  // Common state for all child components
  const sharedState = {
    isLoading: isLoading && !data,
    isRefreshing: isFetching,
    error: error?.message ?? null,
    isStale: false, // TanStack Query manages staleness internally
  }

  if (isLoading && !data) {
    return <SkeletonGrid />
  }

  if (error && !data) {
    return <ErrorState error={error} onRetry={handleRefresh} />
  }

  const stats = data?.stats
  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—"

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>Last updated: {lastUpdated}</span>
          {isFetching && (
            <span
              className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-indigo-500"
              aria-label="Refreshing"
            />
          )}
          {error && data ? (
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600">
              Background refresh failed
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/library">
            <Button type="button" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <FolderOpen className="mr-2 h-4 w-4" />
              Library
            </Button>
          </Link>
          <Button type="button" size="sm" variant="outline" onClick={handleRefresh} disabled={isFetching}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Time"
          value={stats ? formatMinutes(stats.totalMinutes) : undefined}
          description="All-time reading"
          variant="accent"
          {...sharedState}
        />
        <StatCard
          label="This Week"
          value={stats ? formatMinutes(stats.weekMinutes) : undefined}
          description={`${stats?.activeDays7 ?? 0}/7 active days`}
          {...sharedState}
        />
        <StatCard
          label="Documents"
          value={stats ? stats.totalDocuments : undefined}
          description={
            stats ? `${stats.inProgressDocuments} in progress · ${stats.completedDocuments} done` : undefined
          }
          {...sharedState}
        />
        <StatCard
          label="Avg Progress"
          value={
            stats && stats.topDocuments.length > 0
              ? formatPercent(
                  stats.topDocuments.reduce((acc, doc) => acc + doc.progress, 0) / stats.topDocuments.length,
                  0,
                )
              : undefined
          }
          description={stats ? `${stats.topDocuments.length} active tops` : undefined}
          variant="neutral"
          {...sharedState}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ReadingActivity
            streak={stats?.streak}
            activeDays7={stats?.activeDays7 || 0}
            activeDays30={stats?.activeDays30 || 0}
            lastActiveAt={stats?.lastActiveAt || null}
            weekMinutes={stats?.weekMinutes || 0}
            {...sharedState}
          />
        </div>
        <div className="space-y-6">
          <TopDocumentsList documents={stats?.topDocuments} limit={5} {...sharedState} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentlyRead
          documents={recentDocuments}
          {...sharedState}
        />
        <FavoriteDocuments
          documents={favoriteDocuments}
          {...sharedState}
        />
      </div>
    </div>
  )
}
