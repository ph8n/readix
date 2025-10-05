'use client'

import { Suspense } from 'react'
import { SignupForm } from './SignupForm'

export function SignupPageContent() {
  return (
    <Suspense fallback={<div className="text-center">Loading signup form...</div>}>
      <SignupForm />
    </Suspense>
  )
}
