import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar/Sidebar'
import { Breadcrumbs } from '@/components/dashboard/Breadcrumbs'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar email={data.user.email ?? undefined} />
      <div className="transition-[padding]" style={{ paddingLeft: 'var(--sidebar-w, 280px)' }}>
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex h-full items-center px-6">
            <Breadcrumbs />
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
