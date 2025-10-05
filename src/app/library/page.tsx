import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3 } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { getAllDocuments } from '@/app/actions/document-actions'
import { Button } from '@/components/ui/button'
import LibraryClient from './LibraryClient'
import type { Document } from '@/hooks/useDocuments'

export default async function LibraryPage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const result = await getAllDocuments()

  return (
    <div className="min-h-screen w-full px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Library</h1>
            <p className="text-sm text-muted-foreground">
              Manage your documents and reading materials
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </header>

        <LibraryClient
          error={result.success ? null : (result.error || null)}
        />
      </div>
    </div>
  )
}