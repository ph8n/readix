"use client"

import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface FavoriteDocument {
  id: string
  title: string
  is_favorite: boolean
}

interface FavoriteDocumentsProps {
  documents: FavoriteDocument[] | undefined
  isLoading?: boolean
  isRefreshing?: boolean
  error?: string | null
  className?: string
}

function SkeletonRows({ count = 3 }: { count?: number }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i} className="-mx-2 px-2 py-2">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rounded bg-muted/30 animate-pulse shrink-0" />
            <div className="flex-1">
              <div className="h-4 w-40 rounded bg-muted/30 animate-pulse" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export function FavoriteDocuments({
  documents,
  isLoading = false,
  isRefreshing = false,
  error = null,
  className,
}: FavoriteDocumentsProps) {
  const showSkeleton = isLoading && !error && (!documents || documents.length === 0)
  const items = (documents || [])

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          Favorites
        </CardTitle>
        {isRefreshing && !showSkeleton && (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent border-indigo-500" aria-label="Refreshing" />
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {error ? (
          <div className="text-sm text-destructive flex flex-col gap-2" role="alert">
            <span className="font-medium">{error}</span>
          </div>
        ) : showSkeleton ? (
          <SkeletonRows count={3} />
        ) : items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No favorites yet. Star documents in your library!</div>
        ) : (
          <ul className="space-y-2">
            {items.map(doc => (
              <li key={doc.id}>
                <Link
                  href={`/read/${doc.id}`}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-2 py-2 -mx-2 transition hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70',
                  )}
                >
                  <Star className="h-4 w-4 text-yellow-500 shrink-0 fill-current" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate" title={doc.title}>
                      {doc.title}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
