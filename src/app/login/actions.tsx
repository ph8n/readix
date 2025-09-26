'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Return specific error messages instead of redirecting
    let errorMessage = 'An error occurred during sign in.'
    
    switch (error.message) {
      case 'Invalid login credentials':
        errorMessage = 'Invalid email or password. Please check your credentials and try again.'
        break
      case 'Email not confirmed':
        errorMessage = 'Please check your email and click the confirmation link before signing in.'
        break
      case 'Too many requests':
        errorMessage = 'Too many sign in attempts. Please wait a moment before trying again.'
        break
      default:
        errorMessage = error.message || 'Unable to sign in. Please try again.'
    }
    
    // Redirect to login with error message in URL params
    redirect(`/login?error=${encodeURIComponent(errorMessage)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
