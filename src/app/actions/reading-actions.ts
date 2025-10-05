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
    const base = transformDocumentForReader(doc)

    // 4. Build breadcrumbs if folder present
    const crumbs: { id: string; name: string }[] = []
    if (doc.folder_id) {
      let currentId: string | null = doc.folder_id
      type FolderRow = { id: string; name: string; parent_id: string | null }
      while (currentId) {
        const { data, error } = await supabase
          .from('folders')
          .select('id,name,parent_id')
          .eq('id', currentId)
          .single<FolderRow>()
        if (error || !data) break
        crumbs.unshift({ id: data.id, name: data.name })
        currentId = data.parent_id
      }
    }

    return { success: true, data: { ...base, breadcrumbs: crumbs } }

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

    // Calculate progress percentage using shared helper
    const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0

    const rounded = Math.round(progress * 100) / 100

    // Update database
    const { error: updateError } = await supabase
      .from('documents')
      .update({
        pages_read: currentPage,
        reading_progress: rounded,
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
