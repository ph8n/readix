'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Auto-closes stale reading sessions (older than 5 minutes with no heartbeat)
 * Should be called periodically (e.g., cron job or on dashboard load)
 */
export async function cleanupStaleSessions() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  // Find sessions that are still "active" but haven't sent heartbeat in 5+ minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()

  const { data: staleSessions } = await supabase
    .from('reading_sessions')
    .select('id, last_heartbeat_at')
    .eq('user_id', user.id)
    .is('ended_at', null)
    .lt('last_heartbeat_at', fiveMinutesAgo)

  if (!staleSessions || staleSessions.length === 0) {
    return { success: true, cleaned: 0 }
  }

  // Close all stale sessions
  const sessionIds = staleSessions.map(s => s.id)

  await supabase
    .from('reading_sessions')
    .update({ ended_at: new Date().toISOString() })
    .in('id', sessionIds)

  console.log(`[Cleanup] Closed ${sessionIds.length} stale sessions`)

  return { success: true, cleaned: sessionIds.length }
}