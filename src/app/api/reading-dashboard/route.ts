import { NextResponse } from 'next/server'
import { getReadingDashboardMetrics } from '@/app/actions/reading-session-actions'
import { cleanupStaleSessions } from '@/app/actions/cleanup-sessions'

export async function GET() {
  // Clean up any stale sessions before fetching metrics
  await cleanupStaleSessions()

  const result = await getReadingDashboardMetrics()
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error, code: result.code }, { status: result.code === 'auth' ? 401 : 400 })
  }
  return NextResponse.json({ success: true, data: result.data })
}
