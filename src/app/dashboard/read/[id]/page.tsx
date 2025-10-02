
import PDFReader from '@/components/reader/PDFReader'
import { PDFErrorBoundary } from '@/components/reader/PDFErrorBoundary'
import { getDocumentForReading } from '@/app/actions/reading-actions'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

interface ReadPageProps {
  params: Promise<{ id: string }>
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { id } = await params

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

            {/* Back Button */}
            <Link href="/dashboard/documents">
              <Button className="bg-accent hover:bg-accent/90">
                <Home className="mr-2 h-4 w-4" />
                Back to Documents
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render PDF Reader
  return (
    <PDFErrorBoundary>
      <PDFReader document={result.data} />
    </PDFErrorBoundary>
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