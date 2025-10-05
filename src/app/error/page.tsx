'use client'

import { Suspense } from 'react'
import { ErrorPageContent } from './pageContent'

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ErrorPageContent />
    </Suspense>
  )
}
