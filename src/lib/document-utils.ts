import type { Document } from '@/hooks/useDocuments'
import type { DocumentData } from '@/components/reader/types'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function transformDocumentForReader(dbDoc: Document): DocumentData {
  // Smart page restoration logic:
  // - If never read (pages_read = 0), start at page 1
  // - If partially read, resume at last page read
  // - Cap at total pages if available to prevent overflow
  const currentPage = dbDoc.pages_read === 0
    ? 1
    : dbDoc.page_count
      ? Math.min(dbDoc.pages_read, dbDoc.page_count)
      : Math.max(1, dbDoc.pages_read || 1)  // Fallback when page_count is null

  // Debug logging (can be removed after testing)
  if (process.env.NODE_ENV === 'development') {
    console.log('[PageRestore]', {
      document: dbDoc.title,
      pages_read: dbDoc.pages_read,
      page_count: dbDoc.page_count,
      calculated_currentPage: currentPage
    })
  }

  return {
    id: dbDoc.id,
    title: dbDoc.title,
    pageCount: dbDoc.page_count ?? 0,
    fileSize: formatFileSize(dbDoc.file_size),
    uploadDate: new Date(dbDoc.upload_date).toLocaleDateString(),
    readingProgress: dbDoc.reading_progress,
    currentPage: currentPage,
    filePath: dbDoc.file_path,
    folderId: dbDoc.folder_id ?? null,
  }
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function calculateReadingProgress(pagesRead: number, totalPages: number): number {
  if (totalPages === 0) return 0
  return Math.round((pagesRead / totalPages) * 100)
}
