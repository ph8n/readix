import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()

  // Sign out the user
  await supabase.auth.signOut()

  // Redirect to login page
  redirect('/login')
}
