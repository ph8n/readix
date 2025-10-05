'use client'

import { Suspense } from 'react'
import { LoginPageContent } from './pageContent'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-lg bg-accent/50">
              <svg className="h-8 w-8 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M8 17V4h9a2 2 0 0 1 2 2v11" />
              </svg>
            </div>
            <h1 className="text-4xl font-serif font-bold text-foreground">Readix</h1>
          </div>

          <div className="space-y-2">
            <p className="text-xl font-serif text-muted-foreground italic text-balance">Read. Reflect. Remember.</p>
            <p className="text-sm text-muted-foreground text-pretty">
              Your intelligent reading companion
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-center">Loading login form...</div>}>
          <LoginPageContent />
        </Suspense>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground space-y-2">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <div className="flex justify-center space-x-4">
            <button className="hover:text-foreground transition-colors">Terms</button>
            <button className="hover:text-foreground transition-colors">Privacy</button>
            <button className="hover:text-foreground transition-colors">Support</button>
          </div>
        </div>
      </div>
    </div>
  )
}
