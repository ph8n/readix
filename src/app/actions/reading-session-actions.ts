'use server'

import { createClient } from '@/utils/supabase/server'
import { calculateReadingProgress } from '@/lib/document-utils'

export interface ActionResult<T = unknown> {
  success: boolean
  data?: T
  error?: string
  // Optional machine readable error code for diagnostics (not always present for legacy actions)
  code?: string
}

interface StartSessionResult {
  sessionId: string
  reused: boolean
}

interface DashboardStats {
  totalMinutes: number
  totalPages: number
  topDocuments: Array<{ id: string; title: string; minutes: number; progress: number }>
  lastReadAt: string | null
  activeDocumentsCount: number
}

// New dashboard metrics (Phase 4 expanded)
import type { DashboardMetricsContract, NormalizedSession, ReadingStatsOverview, TopDocumentStat } from '@/lib/dashboard-metrics'
import { COMPLETION_THRESHOLD } from '@/lib/dashboard-metrics'

/**
 * Starts (or reuses) a reading session for a user + document.
 * - Reuses an active session started in the last 2 minutes to avoid duplicates from rapid mounts.
 */
export async function startReadingSession(
  documentId: string,
  pageStart?: number
): Promise<ActionResult<StartSessionResult>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Authentication required', code: 'auth' }

    // Ensure document belongs to user
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('id, page_count, pages_read, reading_progress')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (docError || !doc) return { success: false, error: 'Document not found', code: 'document_not_found' }

    // Attempt to reuse existing active session (started within last 2 minutes)
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
    const { data: existingSessions, error: existingError } = await supabase
      .from('reading_sessions')
      .select('id, started_at, last_heartbeat_at')
      .eq('user_id', user.id)
      .eq('document_id', documentId)
      .is('ended_at', null)
      .gte('last_heartbeat_at', twoMinutesAgo)
      .limit(1)

    if (!existingError && existingSessions && existingSessions.length > 0) {
      return { success: true, data: { sessionId: existingSessions[0].id, reused: true } }
    }

    const { data: inserted, error: insertError } = await supabase
      .from('reading_sessions')
      .insert({
        user_id: user.id,
        document_id: documentId,
        page_start: pageStart ?? null,
        page_end: pageStart ?? null
      })
      .select('id')
      .single()

    if (insertError || !inserted) return { success: false, error: 'Failed to start session', code: 'session_start_failed' }

    return { success: true, data: { sessionId: inserted.id, reused: false } }
  } catch (e) {
    console.error('startReadingSession error', e)
    return { success: false, error: 'Unexpected error starting session', code: 'unexpected' }
  }
}

/**
 * Heartbeat updates last activity + optionally updates current page & document progress.
 */
export async function heartbeatReadingSession(
  sessionId: string,
  currentPage?: number,
  totalPagesOverride?: number
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Authentication required', code: 'auth' }

    // Fetch session to verify ownership & get document id
    const { data: session, error: sessionError } = await supabase
      .from('reading_sessions')
      .select('id, user_id, document_id, ended_at')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) return { success: false, error: 'Session not found', code: 'session_not_found' }
    if (session.ended_at) return { success: false, error: 'Session already ended', code: 'session_ended' }

    // Update session heartbeat & page
    const updatePayload: Record<string, unknown> = { last_heartbeat_at: new Date().toISOString() }
    if (typeof currentPage === 'number') {
      updatePayload.page_end = currentPage
    }

    const { error: updateSessionError } = await supabase
      .from('reading_sessions')
      .update(updatePayload)
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (updateSessionError) return { success: false, error: 'Failed to update session', code: 'session_update_failed' }

    // Optionally update document progress if page given
    if (typeof currentPage === 'number') {
      // Fetch document for total pages (only if we need it)
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('id, page_count, pages_read')
        .eq('id', session.document_id)
        .eq('user_id', user.id)
        .single()

      if (!docError && doc) {
        const totalPages = totalPagesOverride ?? doc.page_count ?? 0
        // Only advance if currentPage > stored pages_read to avoid regressions
        if (totalPages > 0 && currentPage > doc.pages_read) {
          const progressPercent = calculateReadingProgress(currentPage, totalPages)
          await supabase
            .from('documents')
            .update({
              pages_read: currentPage,
              reading_progress: progressPercent,
              last_read_at: new Date().toISOString()
            })
            .eq('id', doc.id)
            .eq('user_id', user.id)
        }
      }
    }

    return { success: true }
  } catch (e) {
    console.error('heartbeatReadingSession error', e)
    return { success: false, error: 'Unexpected error during heartbeat', code: 'unexpected' }
  }
}

/**
 * Ends a reading session and finalizes page_end & optional progress update.
 */
export async function endReadingSession(
  sessionId: string,
  finalPage?: number,
  totalPagesOverride?: number
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { success: false, error: 'Authentication required', code: 'auth' }

    const { data: session, error: sessionError } = await supabase
      .from('reading_sessions')
      .select('id, document_id, ended_at')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) return { success: false, error: 'Session not found', code: 'session_not_found' }
    if (session.ended_at) return { success: true }

    const endPayload: Record<string, unknown> = { ended_at: new Date().toISOString() }
    if (typeof finalPage === 'number') endPayload.page_end = finalPage

    const { error: endError } = await supabase
      .from('reading_sessions')
      .update(endPayload)
      .eq('id', sessionId)
      .eq('user_id', user.id)

    if (endError) return { success: false, error: 'Failed to end session', code: 'session_end_failed' }

    if (typeof finalPage === 'number') {
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('id, page_count, pages_read')
        .eq('id', session.document_id)
        .eq('user_id', user.id)
        .single()

      if (!docError && doc) {
        const totalPages = totalPagesOverride ?? doc.page_count ?? 0
        if (totalPages > 0 && finalPage > doc.pages_read) {
          const progressPercent = calculateReadingProgress(finalPage, totalPages)
          await supabase
            .from('documents')
            .update({
              pages_read: finalPage,
              reading_progress: progressPercent,
              last_read_at: new Date().toISOString()
            })
            .eq('id', doc.id)
            .eq('user_id', user.id)
        }
      }
    }

    return { success: true }
  } catch (e) {
    console.error('endReadingSession error', e)
    return { success: false, error: 'Unexpected error ending session', code: 'unexpected' }
  }
}

/**
 * Aggregates expanded dashboard metrics (Phase 4 contract).
 * Keeps legacy getDashboardStats separate for backward compatibility.
 */
export async function getReadingDashboardMetrics(): Promise<ActionResult<DashboardMetricsContract>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Authentication required', code: 'auth' }

    // Fetch sessions needed fields (only ended sessions to prevent time inflation)
    const { data: sessions, error: sessError } = await supabase
      .from('reading_sessions')
      .select('started_at, ended_at, document_id')
      .eq('user_id', user.id)
      .not('ended_at', 'is', null)

    if (sessError) return { success: false, error: 'Failed to load sessions', code: 'sessions' }

    // Fetch documents minimal fields
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id, title, reading_progress, pages_read, last_read_at')
      .eq('user_id', user.id)

    if (docsError) return { success: false, error: 'Failed to load documents', code: 'documents' }

    const now = Date.now()
    const normalized: NormalizedSession[] = []
    const perDocSeconds: Record<string, number> = {}
    let totalSeconds = 0

    sessions?.forEach(s => {
      const start = new Date(s.started_at).getTime()
      const end = s.ended_at ? new Date(s.ended_at).getTime() : now
      const cappedMs = Math.max(0, Math.min(end - start, 24 * 3600 * 1000))
      const durSec = cappedMs / 1000
      totalSeconds += durSec
      perDocSeconds[s.document_id] = (perDocSeconds[s.document_id] || 0) + durSec
      normalized.push({
        documentId: s.document_id,
        startedAt: s.started_at,
        endedAt: s.ended_at,
        durationSeconds: durSec
      })
    })

    // Active days sets
    const activeDaySetAll = new Set<string>()
    const activeDaySet7 = new Set<string>()
    const activeDaySet30 = new Set<string>()
    const msPerDay = 24 * 3600 * 1000
    const start7 = now - 7 * msPerDay
    const start30 = now - 30 * msPerDay

    normalized.forEach(s => {
      // Use start time for active day representation
      const day = s.startedAt.slice(0, 10) // YYYY-MM-DD
      const ts = new Date(s.startedAt).getTime()
      activeDaySetAll.add(day)
      if (ts >= start30) activeDaySet30.add(day)
      if (ts >= start7) activeDaySet7.add(day)
    })

    // weekMinutes counts overlap of sessions with last 7 days window
    const windowStart7 = start7
    let weekSeconds = 0
    normalized.forEach(s => {
      const sStart = new Date(s.startedAt).getTime()
      const sEnd = s.endedAt ? new Date(s.endedAt).getTime() : now
      if (sEnd < windowStart7) return
      const overlapStart = Math.max(sStart, windowStart7)
      const overlapEnd = sEnd
      if (overlapEnd > overlapStart) weekSeconds += (overlapEnd - overlapStart) / 1000
    })

    // Document classification
    const totalDocuments = docs?.length || 0
    let inProgressDocuments = 0
    let completedDocuments = 0
    docs?.forEach(d => {
      const prog = d.reading_progress ?? 0
      if (prog >= COMPLETION_THRESHOLD) completedDocuments += 1
      else if (prog > 0) inProgressDocuments += 1
    })

    // Top documents enriched
    const topDocuments: TopDocumentStat[] = (docs || [])
      .map(d => {
        const minutes = Math.round(((perDocSeconds[d.id] || 0) / 60) * 10) / 10
        return {
          id: d.id,
          title: d.title,
          minutes,
          progress: d.reading_progress ?? 0,
          pagesRead: d.pages_read ?? undefined,
          lastReadAt: d.last_read_at ?? null
        }
      })
      .filter(d => d.minutes > 0 || d.progress > 0)
      .sort((a, b) => {
        if (b.minutes === a.minutes) return b.progress - a.progress
        return b.minutes - a.minutes
      })
      .slice(0, 5)

    const lastActiveAt = (docs || [])
      .map(d => d.last_read_at)
      .filter(Boolean)
      .sort()
      .reverse()[0] || null

    // Streak calculation (current + longest)
    const orderedDays = Array.from(activeDaySetAll).sort().reverse() // newest first
    let current = 0
    let longest = 0
    let prevDate: Date | null = null
    // Traverse from newest backwards
    orderedDays.forEach(dayStr => {
      const dayDate = new Date(dayStr + 'T00:00:00Z')
      if (!prevDate) {
        // Initialize. Check if today is active
        // Initialize - we will determine activeToday after loop
      }
      if (!prevDate) {
        current = 1
        longest = Math.max(longest, current)
      } else {
        const diffDays = Math.round((prevDate.getTime() - dayDate.getTime()) / msPerDay)
        if (diffDays === 1) {
          current += 1
          longest = Math.max(longest, current)
        } else if (diffDays > 1) {
          // break in streak; we only update longest, current stops expanding
          current = current // no-op
        }
      }
      prevDate = dayDate
    })

    const todayStr = new Date().toISOString().slice(0,10)
    const activeToday = activeDaySetAll.has(todayStr)

    const streak = activeDaySetAll.size > 0 ? { current, longest: Math.max(longest, current), activeToday } : undefined

    const stats: ReadingStatsOverview = {
      totalMinutes: Math.round((totalSeconds / 60) * 10) / 10,
      weekMinutes: Math.round((weekSeconds / 60) * 10) / 10,
      activeDays7: activeDaySet7.size,
      activeDays30: activeDaySet30.size,
      totalDocuments,
      inProgressDocuments,
      completedDocuments,
      lastActiveAt,
      topDocuments,
      streak
    }

    return { success: true, data: { stats, sessions: normalized } }
  } catch (e) {
    console.error('getReadingDashboardMetrics error', e)
    return { success: false, error: 'Unexpected error loading dashboard metrics', code: 'unexpected' }
  }
}

/**
 * Syncs document pagination after PDF viewer loads.
 * - Persists page_count if missing or mismatched.
 * - Clamps pages_read to page_count and recomputes progress.
 * - Returns normalized values for client reconciliation.
 */
/**
 * Sync document page count when PDF loads
 * NOTE: Only updates page_count (total pages in PDF)
 * Does NOT touch pages_read - that's handled by reading session heartbeat
 */
export async function syncDocumentPagination(
  documentId: string,
  detectedPageCount: number
): Promise<ActionResult<{ pageCount: number }>> {
  console.log('[syncDocumentPagination]', { documentId, detectedPageCount })

  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Authentication required', code: 'auth' }
    }

    // Get current page_count from DB
    const { data: doc, error: docError } = await supabase
      .from('documents')
      .select('id, page_count')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (docError || !doc) {
      return { success: false, error: 'Document not found', code: 'document_not_found' }
    }

    // SIMPLE RULE: Only update if page_count is null OR new count is higher
    // This handles initial PDF load and PDF file replacements
    const needsUpdate = doc.page_count === null || detectedPageCount > doc.page_count

    if (needsUpdate) {
      const { error: updateError } = await supabase
        .from('documents')
        .update({ page_count: detectedPageCount })
        .eq('id', documentId)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('[syncDocumentPagination] Update failed:', updateError)
        return { success: false, error: 'Failed to update page count', code: 'update_failed' }
      }

      console.log('[syncDocumentPagination] Updated page_count', {
        documentId,
        from: doc.page_count,
        to: detectedPageCount
      })
    } else {
      console.log('[syncDocumentPagination] No update needed', {
        documentId,
        storedCount: doc.page_count,
        detectedCount: detectedPageCount
      })
    }

    return { success: true, data: { pageCount: detectedPageCount } }
  } catch (e) {
    console.error('[syncDocumentPagination] Error:', e)
    return { success: false, error: 'Unexpected error', code: 'unexpected' }
  }
}

/**
 * Aggregates dashboard statistics.
 * NOTE: For large datasets consider moving to a SQL view or RPC.
 */
export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { success: false, error: 'Authentication required', code: 'auth' }

    // Fetch all sessions (could paginate / range later)
    const { data: sessions, error: sessError } = await supabase
      .from('reading_sessions')
      .select('started_at, ended_at, document_id')
      .eq('user_id', user.id)

    if (sessError) return { success: false, error: 'Failed to load sessions', code: 'sessions' }

    // Fetch documents with minimal fields
    const { data: docs, error: docsError } = await supabase
      .from('documents')
      .select('id, title, reading_progress, pages_read, last_read_at')
      .eq('user_id', user.id)

    if (docsError) return { success: false, error: 'Failed to load documents', code: 'documents' }

    // Compute durations (seconds)
    const now = Date.now()
    const perDocSeconds: Record<string, number> = {}
    let totalSeconds = 0

    sessions?.forEach(s => {
      const start = new Date(s.started_at).getTime()
      const end = s.ended_at ? new Date(s.ended_at).getTime() : now
      // Ignore obviously negative or >24h sessions (data guard)
      const raw = Math.max(0, Math.min(end - start, 24 * 3600 * 1000))
      totalSeconds += raw / 1000
      perDocSeconds[s.document_id] = (perDocSeconds[s.document_id] || 0) + raw / 1000
    })

    const totalMinutes = Math.round((totalSeconds / 60) * 10) / 10
    const totalPages = docs?.reduce((acc, d) => acc + (d.pages_read || 0), 0) || 0

    const topDocuments = (docs || [])
      .map(d => ({
        id: d.id,
        title: d.title,
        minutes: Math.round(((perDocSeconds[d.id] || 0) / 60) * 10) / 10,
        progress: d.reading_progress
      }))
      .filter(d => d.minutes > 0 || d.progress > 0)
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5)

    const lastReadAt = (docs || [])
      .map(d => d.last_read_at)
      .filter(Boolean)
      .sort()
      .reverse()[0] || null

    const activeDocumentsCount = Object.keys(perDocSeconds).length

    return {
      success: true,
      data: {
        totalMinutes,
        totalPages,
        topDocuments,
        lastReadAt,
        activeDocumentsCount
      }
    }
  } catch (e) {
    console.error('getDashboardStats error', e)
    return { success: false, error: 'Unexpected error loading stats', code: 'unexpected' }
  }
}
