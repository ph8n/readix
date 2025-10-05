import { QueryClient } from '@tanstack/react-query'

const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      retry: (failureCount: number, error: unknown) => {
        const err = error as { cause?: { status?: number; code?: string } } | undefined
        if (err?.cause?.status === 401 || err?.cause?.code === 'auth') {
          return false
        }
        return failureCount < 3
      },
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10_000),
      networkMode: 'online',
    },
    mutations: {
      retry: 1,
      networkMode: 'online',
    },
  },
} as const

export function createQueryClient() {
  return new QueryClient(queryClientConfig)
}

export type QueryClientConfig = typeof queryClientConfig
