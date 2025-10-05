// Central definitions for dashboard metrics (Phase 4)
// These types define the shape of data returned by dashboard aggregation actions
// and consumed by dashboard UI components / hooks.

export interface TopDocumentStat {
  id: string
  title: string
  minutes: number // Total reading time spent on this document (rounded 0.1m)
  progress: number // Percentage 0-100
  currentPage?: number // Optional current page (if needed in UI)
  pagesRead?: number // Raw pages read for secondary display
  lastReadAt?: string | null
}

export interface ReadingStreak {
  current: number // Current consecutive active-day count
  longest: number // Longest historical streak
  activeToday: boolean
}

export interface ReadingStatsOverview {
  totalMinutes: number
  weekMinutes: number
  activeDays7: number
  activeDays30: number
  totalDocuments: number
  inProgressDocuments: number
  completedDocuments: number
  lastActiveAt: string | null
  topDocuments: TopDocumentStat[]
  streak?: ReadingStreak
}

// Raw session shape (minimal) after normalization.
export interface NormalizedSession {
  documentId: string
  startedAt: string
  endedAt: string | null
  durationSeconds: number // Capped & sanitized
}

export interface DashboardMetricsContract {
  stats: ReadingStatsOverview
  sessions: NormalizedSession[] // Optionally returned for client-side derived visuals (sparklines)
}

/**
 * Notes / Derivation Rules:
 * - Sessions longer than 24h are capped at 24h (guard against bad heartbeats).
 * - Active days are counted by distinct UTC date of any session activity.
 * - weekMinutes counts only sessions whose overlap intersects last 7 *full* days.
 * - completedDocuments: reading_progress >= 99.5 (tolerate rounding).
 * - inProgressDocuments: 0 < progress < 99.5.
 * - streak: computed from ordered set of active days (UTC) with no gaps.
 * - topDocuments: sort by minutes desc, tie-break by progress desc.
 */

export const COMPLETION_THRESHOLD = 99.5
