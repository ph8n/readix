"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import { startReadingSession, heartbeatReadingSession, endReadingSession } from '@/app/actions/reading-session-actions'

interface UseReadingSessionOptions {
  documentId: string
  currentPage: number
  totalPages: number
  heartbeatIntervalMs?: number
  quickSaveDebounceMs?: number
}

interface UseReadingSessionReturn {
  sessionId: string | null
  starting: boolean
  error: string | null
  lastHeartbeat: number | null
}

/**
 * useReadingSession
 * - Starts a reading session when mounted
 * - Sends heartbeats at a fixed interval
 * - Debounced page-change quick heartbeat for faster progress persistence
 * - Ends session on unmount, page hide, or unload
 */
export function useReadingSession({
  documentId,
  currentPage,
  totalPages,
  heartbeatIntervalMs = 60_000,
  quickSaveDebounceMs = 1_500
}: UseReadingSessionOptions): UseReadingSessionReturn {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [starting, setStarting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastHeartbeat, setLastHeartbeat] = useState<number | null>(null)

  const currentPageRef = useRef(currentPage)
  const totalPagesRef = useRef(totalPages)
  // Use ReturnType<typeof setTimeout> for cross-environment compatibility (browser vs Node types)
  const heartbeatTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const quickSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const endingRef = useRef(false)

  // Keep refs in sync
  useEffect(() => { currentPageRef.current = currentPage }, [currentPage])
  useEffect(() => { totalPagesRef.current = totalPages }, [totalPages])

  // Start session
  useEffect(() => {
    let cancelled = false
    async function start() {
      try {
        setStarting(true)
        setError(null)
        const result = await startReadingSession(documentId, currentPageRef.current)
        if (!result.success) {
          if (!cancelled) setError(result.error || 'Failed to start session')
          return
        }
        if (!cancelled) {
          setSessionId(result.data!.sessionId)
          setStarting(false)
          setLastHeartbeat(Date.now())
        }
      } catch {
        if (!cancelled) setError('Unexpected error starting session')
      } finally {
        if (!cancelled) setStarting(false)
      }
    }
    start()
    return () => { cancelled = true }
  }, [documentId])

  // Regular heartbeat loop
  useEffect(() => {
    if (!sessionId) return
    // Capture to maintain type narrowing inside nested callbacks
    const sid = sessionId

    function scheduleHeartbeat() {
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current)
      heartbeatTimerRef.current = setTimeout(async () => {
        try {
          const result = await heartbeatReadingSession(sid, currentPageRef.current, totalPagesRef.current)
          if (!result.success) {
            console.warn('[useReadingSession] Heartbeat failed:', result.error)
          } else {
            setLastHeartbeat(Date.now())
          }
        } finally {
          scheduleHeartbeat()
        }
      }, heartbeatIntervalMs)
    }

    scheduleHeartbeat()
    return () => {
      if (heartbeatTimerRef.current) clearTimeout(heartbeatTimerRef.current)
    }
  }, [sessionId, heartbeatIntervalMs])

  // Debounced quick save on page change (independent of main heartbeat)
  useEffect(() => {
    if (!sessionId) return
    if (quickSaveTimerRef.current) clearTimeout(quickSaveTimerRef.current)
    quickSaveTimerRef.current = setTimeout(async () => {
      try {
        const result = await heartbeatReadingSession(sessionId, currentPageRef.current, totalPagesRef.current)
        if (!result.success) {
          console.warn('[useReadingSession] Quick heartbeat failed:', result.error)
        } else {
          setLastHeartbeat(Date.now())
        }
      } catch (e) {
        console.warn('[useReadingSession] Quick heartbeat exception', e)
      }
    }, quickSaveDebounceMs)

    return () => {
      if (quickSaveTimerRef.current) clearTimeout(quickSaveTimerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, sessionId])

  // End session helper (memoized)
  const endSession = useCallback(async () => {
    if (endingRef.current) return
    const activeSessionId = sessionId
    if (!activeSessionId) return
    endingRef.current = true
    try {
      await endReadingSession(activeSessionId, currentPageRef.current, totalPagesRef.current)
    } catch (e) {
      console.warn('[useReadingSession] Error ending session', e)
    }
  }, [sessionId])

  // Visibility and unload handlers
  useEffect(() => {
    function handleVisibility() {
      if (document.visibilityState === 'hidden') {
        void endSession()
      }
    }
    function handleBeforeUnload() {
      void endSession()
    }

    // Detect SPA navigation (Next.js route changes)
    function handleNavigation() {
      console.log('[useReadingSession] Navigation detected, ending session')
      void endSession()
    }

    window.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handleNavigation) // Browser back/forward

    return () => {
      window.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handleNavigation)
    }
  }, [endSession])

  // End on unmount or document change (synchronous cleanup)
  useEffect(() => {
    return () => {
      // Synchronously mark session for ending to prevent race conditions
      if (sessionId && !endingRef.current) {
        endingRef.current = true
        // Fire-and-forget async end (don't await to avoid blocking navigation)
        endReadingSession(sessionId, currentPageRef.current, totalPagesRef.current).catch(e => {
          console.warn('[useReadingSession] Unmount cleanup error', e)
        })
      }
    }
  }, [sessionId]) // Depend on sessionId directly, not endSession callback

  return { sessionId, starting, error, lastHeartbeat }
}
