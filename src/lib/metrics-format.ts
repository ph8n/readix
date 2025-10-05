// Formatting helpers for dashboard metrics (Phase 4-03)
// Focus: terse, allocation-light, no external deps

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function safeNumber(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n)
  return Number.isFinite(v) ? v : 0
}

export function pluralize(count: number, singular: string, plural?: string) {
  const c = safeNumber(count)
  if (c === 1) return `${c} ${singular}`
  return `${c} ${plural || singular + 's'}`
}

// 75 -> 1h 15m, 1.2 -> 1.2m, 0 -> 0m
export function formatMinutes(minsInput: number): string {
  const mins = Math.max(0, safeNumber(minsInput))
  if (mins < 60) {
    if (mins < 10 && mins % 1 !== 0) return `${mins.toFixed(1)}m`
    return `${Math.round(mins)}m`
  }
  const hours = Math.floor(mins / 60)
  const rem = Math.round(mins - hours * 60)
  if (rem === 0) return `${hours}h`
  return `${hours}h ${rem}m`
}

// Compact: 75 -> 1h, 125 -> 2h, <60 same as rounded m
export function formatMinutesCompact(minsInput: number): string {
  const mins = Math.max(0, safeNumber(minsInput))
  if (mins < 60) return `${Math.round(mins)}m`
  const hours = Math.round(mins / 60)
  return `${hours}h`
}

export function formatPercent(value: number, digits = 0): string {
  const v = clamp(safeNumber(value), 0, 100)
  return `${v.toFixed(digits)}%`
}

export function formatPages(pages: number): string {
  const p = Math.max(0, Math.floor(safeNumber(pages)))
  return p.toLocaleString()
}

export function timeAgo(iso: string | null): string {
  if (!iso) return '—'
  const ts = Date.parse(iso)
  if (Number.isNaN(ts)) return '—'
  const now = Date.now()
  const diffMs = now - ts
  if (diffMs < 0) return 'Just now'
  const sec = Math.floor(diffMs / 1000)
  if (sec < 30) return 'Just now'
  if (sec < 60) return `${sec}s ago`
  const min = Math.floor(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  if (day < 30) return `${day}d ago`
  // Fallback to date (UTC slice)
  return iso.slice(0, 10)
}

export function formatStreak(streak?: { current: number; longest: number }): string {
  if (!streak) return 'No activity yet'
  const cur = safeNumber(streak.current)
  const longest = safeNumber(streak.longest)
  if (cur <= 0) return 'No active streak'
  if (longest <= 0 || longest === cur) return `${cur} day streak`
  return `${cur} day streak (best ${longest})`
}

export function formatActiveDaysSummary(active7: number, active30: number): string {
  const a7 = safeNumber(active7)
  const a30 = safeNumber(active30)
  return `${a7}/7 days · ${a30}/30`
}

// Optional future: abbreviation, duration seconds etc.
export function formatDurationSeconds(secondsInput: number): string {
  const s = Math.max(0, Math.floor(safeNumber(secondsInput)))
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  const remM = m - h * 60
  if (h < 24) return remM ? `${h}h ${remM}m` : `${h}h`
  const d = Math.floor(h / 24)
  const remH = h - d * 24
  return remH ? `${d}d ${remH}h` : `${d}d`
}
