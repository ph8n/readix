'use client'

import { Suspense } from 'react'
import { LoginForm } from './LoginForm'

export function LoginPageContent() {
  return (
    <Suspense fallback={<div className="text-center">Loading login form...</div>}>
      <LoginForm />
    </Suspense>
  )
}