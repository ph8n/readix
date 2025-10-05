import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getRecentDocuments, getFavoriteDocuments } from '@/app/actions/document-actions'
import DashboardClientNew from './DashboardClientNew'
import { DashboardErrorBoundary } from '@/components/dashboard/DashboardErrorBoundary'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  // Fetch recent and favorite documents
  const [recentResult, favoritesResult] = await Promise.all([
    getRecentDocuments(5),
    getFavoriteDocuments()
  ])

  const recentDocuments = recentResult.success ? recentResult.data : []
  const favoriteDocuments = favoritesResult.success ? favoritesResult.data : []

  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {data.user.email}</p>
          </div>
        </header>
        <DashboardErrorBoundary>
          <DashboardClientNew 
            recentDocuments={recentDocuments}
            favoriteDocuments={favoriteDocuments}
          />
        </DashboardErrorBoundary>
      </div>
    </div>
  )
}
