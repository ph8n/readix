import ViewportOnlyReader from '@/components/reader/ViewportOnlyReader'
import { getDocumentForReading } from '@/app/actions/reading-actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { headers } from 'next/headers'

interface ReadPageProps {
  params: Promise<{ id: string }>
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params

  // Detect navigation context for dynamic back button
  const headersList = await headers()
  const referer = headersList.get('referer') || ''
  const fromLibrary = referer.includes('/library')

  // Determine dynamic back navigation
  const backHref = fromLibrary ? '/library' : '/dashboard'
  const backLabel = fromLibrary ? 'Library' : 'Dashboard'

  // Fetch document data
  const result = await getDocumentForReading(id)

  // Handle errors
  if (!result.success || !result.data) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md border-2 border-border/40">
          <CardContent className="flex flex-col items-center space-y-6 py-12">
            {/* Error Icon */}
            <div className="rounded-full bg-red-100 p-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>

            {/* Error Message */}
            <div className="text-center space-y-2">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Document Not Found
              </h2>
              <p className="text-sm text-muted-foreground">
                {result.error || 'The document you\'re looking for doesn\'t exist or you don\'t have access to it.'}
              </p>
            </div>

            {/* Back Button - Dynamic */}
            <Link href={backHref}>
              <Button className="bg-accent hover:bg-accent/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {backLabel}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-screen w-full relative">
      {/* Floating Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href={backHref}>
          <Button variant="outline" size="sm" className="shadow-lg">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Button>
        </Link>
      </div>

      <ViewportOnlyReader key={result.data.id} document={result.data} />
    </div>
  )
}

// Optional: Generate metadata
export async function generateMetadata({ params }: ReadPageProps): Promise<Metadata> {
  const { id } = await params
  const result = await getDocumentForReading(id)

  return {
    title: result.success && result.data
      ? `${result.data.title} - Readix`
      : 'Document Not Found - Readix'
  }
}
