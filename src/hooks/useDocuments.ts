"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface Document {
  id: string
  title: string
  file_name: string
  file_path: string
  file_size: number
  mime_type: string
  page_count: number | null
  upload_date: string
  updated_at: string
  is_favorite: boolean
  pages_read: number
  reading_progress: number
  last_read_at: string | null
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null)

  const supabase = createClient()

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required')
      }

      setCurrentUser(user)

      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      setDocuments(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents')
      console.error('Error fetching documents:', err)
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    fetchDocuments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set up real-time subscription when user is available
  useEffect(() => {
    if (!currentUser) return

    console.log('Setting up real-time subscription for user:', currentUser.id)

    const subscription = supabase
      .channel('user_documents')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `user_id=eq.${currentUser.id}`
        },
        (payload) => {
          console.log('🔴 Real-time update received:', payload.eventType, payload.new || payload.old)
          
          if (payload.eventType === 'INSERT') {
            const newDoc = payload.new as Document
            console.log('📄 Adding new document:', newDoc.title)
            setDocuments(prev => {
              // Avoid duplicates
              if (prev.some(doc => doc.id === newDoc.id)) {
                console.log('⚠️ Document already exists, skipping')
                return prev
              }
              console.log('✅ Document added to state')
              return [newDoc, ...prev]
            })
          } else if (payload.eventType === 'DELETE') {
            console.log('🗑️ Removing document:', payload.old?.id)
            setDocuments(prev => prev.filter(doc => doc.id !== payload.old?.id))
          } else if (payload.eventType === 'UPDATE') {
            console.log('📝 Updating document:', payload.new?.id)
            setDocuments(prev => prev.map(doc =>
              doc.id === payload.new?.id ? payload.new as Document : doc
            ))
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 Subscription status:', status)
      })

    return () => {
      console.log('🔌 Unsubscribing from real-time updates')
      subscription.unsubscribe()
    }
  }, [currentUser, supabase])

  const refetch = () => {
    fetchDocuments()
  }

  // Optimistic delete function
  const optimisticDelete = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  // Optimistic add function
  const optimisticAdd = (document: Document) => {
    setDocuments(prev => [document, ...prev])
  }

  return {
    documents,
    loading,
    error,
    refetch,
    optimisticDelete,
    optimisticAdd,
    setDocuments
  }
}

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}