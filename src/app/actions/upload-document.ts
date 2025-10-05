'use server'

import { createClient } from '@/utils/supabase/server'

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
