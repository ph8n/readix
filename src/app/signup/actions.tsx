'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
      }
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // Return specific error messages instead of redirecting
    let errorMessage = 'An error occurred during sign up.'
    
    switch (error.message) {
      case 'User already registered':
        errorMessage = 'An account with this email already exists. Please try signing in instead.'
        break
      case 'Password should be at least 6 characters':
        errorMessage = 'Password must be at least 6 characters long.'
        break
      case 'Signup is disabled':
        errorMessage = 'Account registration is currently disabled. Please contact support.'
        break
      case 'Invalid email':
        errorMessage = 'Please enter a valid email address.'
        break
      default:
        errorMessage = error.message || 'Unable to create account. Please try again.'
    }
    
    // Redirect to signup with error message in URL params
    redirect(`/signup?error=${encodeURIComponent(errorMessage)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}