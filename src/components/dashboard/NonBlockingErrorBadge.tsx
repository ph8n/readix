"use client"
import { Button } from '@/components/ui/button'

interface NonBlockingErrorBadgeProps {
  error: string | null
  onRetry?: () => void
  isRefreshing?: boolean
  failureCount?: number
  nextRetryAt?: number | null
}

export function NonBlockingErrorBadge({
  error,
  onRetry,
  isRefreshing = false,
  failureCount = 0,
  nextRetryAt = null,
}: NonBlockingErrorBadgeProps) {
  if (!error) return null
  const retry = onRetry || (() => {})
  const disabled = isRefreshing
  const tooltip = nextRetryAt ? `${error}\nAttempts: ${failureCount}\nNext auto retry: ${new Date(nextRetryAt).toLocaleTimeString()}` : error
  return (
    <span className="inline-flex items-center gap-1 rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-600" title={tooltip} role="alert">
      Refresh failed
      <Button type="button" size="sm" variant="outline" onClick={retry} disabled={disabled} className="h-4 px-1 text-[10px]">Retry</Button>
    </span>
  )
}
