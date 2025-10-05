"use client"

import { useEffect, useState } from 'react'
import EmbedPDFDocument from './EmbedPDFDocument'
import { useReadingSession } from '@/hooks/useReadingSession'
import { getDocumentUrl } from '@/app/actions/upload-document'
import { syncDocumentPagination } from '@/app/actions/reading-session-actions'
import { saveLastPage, getLastPage } from '@/lib/pdf-page-storage'
import type { DocumentData } from './types'

interface ViewportOnlyReaderProps {
  document: DocumentData
}

export default function ViewportOnlyReader({ document }: ViewportOnlyReaderProps) {
  const localPage = getLastPage(document.id)
  const dbPage = document.currentPage ?? 1
  const initialPage = localPage ?? dbPage

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageCount, setPageCount] = useState(document.pageCount || 0)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const { sessionId, error: sessionError } = useReadingSession({
    documentId: document.id,
    currentPage,
    totalPages: pageCount,
    heartbeatIntervalMs: 60_000,
    quickSaveDebounceMs: 1_500
  })

  useEffect(() => {
    if (sessionId) {
      console.debug('[ViewportOnlyReader] Reading session active', { sessionId })
    }
  }, [sessionId])

  useEffect(() => {
    if (currentPage > 0 && pageCount > 0) {
      saveLastPage(document.id, currentPage)
    }
  }, [currentPage, document.id, pageCount])

  useEffect(() => {
    if (sessionError) {
      console.warn('[ViewportOnlyReader] Session error', sessionError)
    }
  }, [sessionError])

  useEffect(() => {
    const loadUrl = async () => {
      try {
        setLoading(true)
        const url = await getDocumentUrl(document.filePath)
        setPdfUrl(url)
      } catch (err) {
        console.error('❌ [ViewportReader] Failed to load PDF URL:', err)
        setError('Failed to load PDF.')
      } finally {
        setLoading(false)
      }
    }
    loadUrl()
  }, [document.filePath])

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading PDF...</div>
      </div>
    )
  }

  if (error || !pdfUrl) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-muted-foreground">{error ?? 'PDF unavailable'}</div>
      </div>
    )
  }

  return (
    <div className="w-full h-screen">
      <EmbedPDFDocument
        key={pdfUrl}
        fileUrl={pdfUrl}
        initialPage={currentPage}
         className="w-full h-full"
         showThumbnails={false}
          onDocumentLoad={(pc) => {
            setPageCount(pc)

            if (!document.pageCount || pc > document.pageCount) {
              void syncDocumentPagination(document.id, pc)
                .catch((e) => console.warn('[ViewportOnlyReader] Page count sync failed:', e))
            }
          }}
        onPageChange={(p) => {
          setCurrentPage(p)
        }}
      />
    </div>
  )
}
