'use server'

import { createClient } from '@/utils/supabase/server'
import crypto from 'crypto'

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient()

  // 1. Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Authentication required')
  }

  // 2. Extract and validate file
  const file = formData.get('file') as File
  if (!file) {
    throw new Error('No file provided')
  }

  // File validation
  if (file.type !== 'application/pdf') {
    throw new Error('Only PDF files are allowed')
  }

  if (file.size > 50 * 1024 * 1024) { // 50MB
    throw new Error('File size must be less than 50MB')
  }

  // 3. Generate unique file path
  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const fileName = `${sanitizedName.split('.')[0]}-${timestamp}.pdf`
  const filePath = `${user.id}/${fileName}`

  try {
    // 4. Upload to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file)

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // 5. Calculate file hash for duplicate detection
    const arrayBuffer = await file.arrayBuffer()
    const hash = crypto.createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex')

    // 6. Prepare document metadata
    const fileInfo = {
      title: file.name.replace('.pdf', ''),
      file_name: file.name,
      file_path: uploadData.path,
      file_size: file.size,
      mime_type: file.type,
      file_hash: hash,
      user_id: user.id
    }

    // 7. Insert record into documents table
    const { data: docData, error: dbError } = await supabase
      .from('documents')
      .insert(fileInfo)
      .select()
      .single()

    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('documents').remove([filePath])
      throw new Error(`Database error: ${dbError.message}`)
    }

    // 8. Return success - real-time subscription will handle UI updates
    return { success: true, document: docData }

  } catch (error) {
    // Clean up on any error
    try {
      await supabase.storage.from('documents').remove([filePath])
    } catch (cleanupError) {
      console.error('Cleanup failed:', cleanupError)
    }

    throw error
  }
}

// Helper function for getting signed URL for file access
export async function getDocumentUrl(filePath: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, 3600) // 1 hour expiry

  if (error) {
    throw new Error(`Failed to get document URL: ${error.message}`)
  }

  return data.signedUrl
}

// Helper function for deleting documents
export async function deleteDocument(documentId: string) {
  const supabase = await createClient()

  // Get user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Authentication required')
  }

  // Get document info first
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_path')
    .eq('id', documentId)
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    throw new Error('Document not found')
  }

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('documents')
    .remove([document.file_path])

  if (storageError) {
    console.error('Storage deletion failed:', storageError)
  }

  // Delete from database
  const { error: dbError } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', user.id)

  if (dbError) {
    throw new Error(`Failed to delete document: ${dbError.message}`)
  }

  // The real-time subscription will handle the update
  return { success: true }
}
