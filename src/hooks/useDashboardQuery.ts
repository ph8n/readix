import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import type { DashboardMetricsContract } from '@/lib/dashboard-metrics'

interface DashboardQueryError extends Error {
  status?: number
  code?: string
  cause?: { status?: number; code?: string }
}

async function fetchDashboardMetrics(): Promise<DashboardMetricsContract> {
  const res = await fetch('/api/reading-dashboard', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    },
  })

  if (!res.ok) {
    let errorData: { error?: string; code?: string } = {}
    try {
      errorData = await res.json()
    } catch {
      errorData = { error: `Request failed (${res.status})` }
    }

    const error = new Error(errorData.error || 'Failed to load metrics') as DashboardQueryError
    error.status = res.status
    error.code = errorData.code
    error.cause = { status: res.status, code: errorData.code }
    throw error
  }

  const json: { success?: boolean; data?: DashboardMetricsContract; error?: string; code?: string } =
    await res.json()

  if (!json.success || !json.data) {
    const error = new Error(json.error || 'Invalid response format') as DashboardQueryError
    error.code = json.code || 'invalid_response'
    throw error
  }

  return json.data
}

export function useDashboardQuery(
  options?: Partial<UseQueryOptions<DashboardMetricsContract, DashboardQueryError>>
) {
  return useQuery<DashboardMetricsContract, DashboardQueryError>({
    queryKey: ['dashboard-metrics'],
    queryFn: fetchDashboardMetrics,
    ...options,
  })
}
