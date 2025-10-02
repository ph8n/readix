'use server'

import { createClient } from '@/utils/supabase/server'
import { transformDocumentForReader } from '@/lib/document-utils'
import type { DocumentData } from '@/components/reader/types'

interface FetchResult {
  success: boolean
  data?: DocumentData
  error?: string
}

/**
 * Fetches a document for the reading interface
 * - Authenticates user
 * - Verifies document ownership
 * - Transforms database fields to reader format
 */
export async function getDocumentForReading(documentId: string): Promise<FetchResult> {
  try {
    const supabase = await createClient()

    // 1. Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Authentication required' }
    }

    // 2. Fetch document with user verification
    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', user.id) // Verify ownership
      .single()

    if (fetchError) {
      return { success: false, error: 'Document not found' }
    }

    if (!doc) {
      return { success: false, error: 'Document not found or access denied' }
    }

    // 3. Transform to reader format
    const documentData = transformDocumentForReader(doc)

    return { success: true, data: documentData }

  } catch (error) {
    console.error('Error fetching document for reading:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load document'
    }
  }
}

/**
 * Updates reading progress for a document
 */
export async function updateReadingProgress(
  documentId: string,
  currentPage: number,
  totalPages: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient()

    // Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { success: false, error: 'Authentication required' }
    }

    // Calculate progress percentage
    const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0

    // Update database
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        pages_read: currentPage,
        reading_progress: Math.round(progress * 100) / 100, // 2 decimal places
        last_read_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .eq('user_id', user.id)

    if (updateError) {
      return { success: false, error: 'Failed to update progress' }
    }

    return { success: true }

  } catch (error) {
    console.error('Error updating reading progress:', error)
    return { success: false, error: 'Failed to update progress' }
  }
}