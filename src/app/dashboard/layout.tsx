import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { BookOpen, FileText, Search, Star, BarChart3, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

async function DashboardSidebar({ user }: { user: { email?: string } }) {
  return (
    <div className="fixed left-0 top-0 z-30 h-full w-64 border-r border-border/50 bg-card/80 backdrop-blur-sm">
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-center border-b border-border/50 px-6">
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-accent/50 p-2">
            <BookOpen className="h-6 w-6 text-foreground" />
          </div>
          <h1 className="font-serif text-xl font-bold text-foreground">Readix</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        <Link href="/dashboard/documents">
          <Button variant="ghost" className="w-full justify-start space-x-3 text-left">
            <FileText className="h-4 w-4" />
            <span>Documents</span>
          </Button>
        </Link>
        
        <Link href="/dashboard/search">
          <Button variant="ghost" className="w-full justify-start space-x-3 text-left">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </Link>
        
        <Link href="/dashboard/favorites">
          <Button variant="ghost" className="w-full justify-start space-x-3 text-left">
            <Star className="h-4 w-4" />
            <span>Favorites</span>
          </Button>
        </Link>
        
        <Link href="/dashboard/analytics">
          <Button variant="ghost" className="w-full justify-start space-x-3 text-left">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </Button>
        </Link>
        
        <Link href="/dashboard/settings">
          <Button variant="ghost" className="w-full justify-start space-x-3 text-left">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </Link>
      </nav>

      {/* User Section */}
      <div className="border-t border-border/50 p-4">
        <div className="mb-3 rounded-lg bg-accent/20 p-3">
          <p className="text-sm font-medium text-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">Reader</p>
        </div>
        
        <form action="/auth/signout" method="post">
          <Button variant="ghost" type="submit" className="w-full justify-start space-x-3 text-left text-red-600 hover:bg-red-50 hover:text-red-700">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

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
      <DashboardSidebar user={data.user} />
      <div className="pl-64">
        {/* Header */}
        <header className="h-16 border-b border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex h-full items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <h2 className="font-serif text-lg font-semibold text-foreground">Dashboard</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-full bg-accent/50 flex items-center justify-center">
                <span className="text-sm font-medium text-foreground">
                  {data.user.email?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
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