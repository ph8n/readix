'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, BookOpen, Home, ArrowLeft } from 'lucide-react'

export default function ErrorPage() {
  const [errorMessage, setErrorMessage] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    // Get error message from URL params or use default
    const error = searchParams.get('error')
    setErrorMessage(error || 'An unexpected error occurred')
  }, [searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-lg bg-accent/50">
              <BookOpen className="h-8 w-8 text-foreground" />
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Readix</h1>
          </div>
        </div>

        {/* Error Card */}
        <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-serif text-center">
              Oops! Something went wrong
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              We encountered an issue while processing your request
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Message */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-800 text-center">{errorMessage}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                asChild
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground border border-border/20 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Link href="/login">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Try Again
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="w-full border-border/60 hover:bg-accent/20 hover:border-accent/40 transition-all duration-200 bg-transparent"
              >
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center text-sm text-muted-foreground">
              <p>If this problem persists, please contact our support team.</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <div className="flex justify-center space-x-4">
            <button className="hover:text-foreground transition-colors">Support</button>
            <button className="hover:text-foreground transition-colors">Status</button>
            <button className="hover:text-foreground transition-colors">Help</button>
          </div>
        </div>
      </div>
    </div>
  )
}
