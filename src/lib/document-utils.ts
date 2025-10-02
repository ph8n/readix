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
  return {
    id: dbDoc.id,
    title: dbDoc.title,
    pageCount: dbDoc.page_count ?? 0,
    fileSize: formatFileSize(dbDoc.file_size),
    uploadDate: new Date(dbDoc.upload_date).toLocaleDateString(),
    readingProgress: dbDoc.reading_progress,
    currentPage: dbDoc.pages_read + 1,
    filePath: dbDoc.file_path
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
