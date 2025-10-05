'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// saveDocumentRecord - Server action for saving document metadata after client-side upload
export async function saveDocumentRecord(filePath: string, file: File) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  // Validate file type
  if (file.type !== 'application/pdf') {
    return { success: false, error: 'Only PDF files are allowed' }
  }

  // Validate file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    return { success: false, error: 'File size must be less than 50MB' }
  }

  try {
    // Insert document record
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: file.name,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        upload_date: new Date().toISOString(),
        is_favorite: false,
        reading_progress: 0,
        pages_read: 0
      })
      .select()
      .single()

    if (insertError) {
      console.error('Insert error:', insertError)
      return { success: false, error: 'Failed to save document record' }
    }

    revalidatePath('/library')
    return { success: true, data: document }
  } catch (error) {
    console.error('Save error:', error)
    return { success: false, error: 'Save failed' }
  }
}

// 2. getAllDocuments()
//    - Fetch all docs for current user
//    - Order by upload_date DESC
//    - Include: id, title, file_name, file_path, file_size,
//              pages_read, reading_progress, last_read_at,
//              upload_date, is_favorite, folder_id
//    - Return { success: true, data: Document[] }
export async function getAllDocuments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, title, file_name, file_path, file_size, pages_read, reading_progress, last_read_at, upload_date, is_favorite, folder_id')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false })

    if (error) {
      console.error('Get documents error:', error)
      return { success: false, error: 'Failed to fetch documents' }
    }

    return { success: true, data: documents || [] }
  } catch (error) {
    console.error('Get documents error:', error)
    return { success: false, error: 'Failed to fetch documents' }
  }
}

// 3. getRecentDocuments(limit = 5)
//    - Fetch docs ordered by last_read_at DESC
//    - Filter: last_read_at IS NOT NULL
//    - Return { success: true, data: Document[] }
export async function getRecentDocuments(limit = 5) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, title, file_name, file_path, file_size, pages_read, reading_progress, last_read_at, upload_date, is_favorite, folder_id')
      .eq('user_id', user.id)
      .not('last_read_at', 'is', null)
      .order('last_read_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Get recent documents error:', error)
      return { success: false, error: 'Failed to fetch recent documents' }
    }

    return { success: true, data: documents || [] }
  } catch (error) {
    console.error('Get recent documents error:', error)
    return { success: false, error: 'Failed to fetch recent documents' }
  }
}

// 4. getFavoriteDocuments()
//    - Fetch docs where is_favorite = true
//    - Order by title ASC
//    - Return { success: true, data: Document[] }
export async function getFavoriteDocuments() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, title, file_name, file_path, file_size, pages_read, reading_progress, last_read_at, upload_date, is_favorite, folder_id')
      .eq('user_id', user.id)
      .eq('is_favorite', true)
      .order('title', { ascending: true })

    if (error) {
      console.error('Get favorite documents error:', error)
      return { success: false, error: 'Failed to fetch favorite documents' }
    }

    return { success: true, data: documents || [] }
  } catch (error) {
    console.error('Get favorite documents error:', error)
    return { success: false, error: 'Failed to fetch favorite documents' }
  }
}

// 5. deleteDocument(documentId: string)
//    - Auth check
//    - Fetch document to get file_path
//    - Delete from storage bucket
//    - Delete from documents table (CASCADE deletes sessions)
//    - Return { success: true }
export async function deleteDocument(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    // Get document to find file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !document) {
      return { success: false, error: 'Document not found' }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
      // Continue with database delete even if storage delete fails
    }

    // Delete from database (CASCADE will delete reading sessions)
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', documentId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return { success: false, error: 'Failed to delete document' }
    }

    revalidatePath('/library')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Delete document error:', error)
    return { success: false, error: 'Failed to delete document' }
  }
}

// 6. toggleFavorite(documentId: string)
//    - Auth check
//    - Toggle is_favorite boolean
//    - Return { success: true, data: { is_favorite: boolean } }
export async function toggleFavorite(documentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Authentication required' }
  }

  try {
    // Get current favorite status
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('is_favorite')
      .eq('id', documentId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !document) {
      return { success: false, error: 'Document not found' }
    }

    // Toggle favorite status
    const newFavoriteStatus = !document.is_favorite

    const { error: updateError } = await supabase
      .from('documents')
      .update({ is_favorite: newFavoriteStatus })
      .eq('id', documentId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Toggle favorite error:', updateError)
      return { success: false, error: 'Failed to update favorite status' }
    }

    revalidatePath('/library')
    revalidatePath('/dashboard')
    return { success: true, data: { is_favorite: newFavoriteStatus } }
  } catch (error) {
    console.error('Toggle favorite error:', error)
    return { success: false, error: 'Failed to update favorite status' }
  }
}

// 7. getDocumentUrl(filePath: string)
//    - KEEP EXISTING (already implemented)
export async function getDocumentUrl(filePath: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 43200)

  if (error) {
    throw new Error(`Failed to get document URL: ${error.message}`)
  }

  return data.signedUrl
}
