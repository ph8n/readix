// Shared types for PDF Reader components

export interface DocumentData {
  id: string
  title: string
  pageCount: number
  fileSize: string
  uploadDate: string
  readingProgress: number
  currentPage: number
  filePath: string
  folderId?: string | null
  breadcrumbs?: { id: string; name: string }[]
}

// (legacy) ReadingActions, ReaderState retained for compatibility
export interface ReadingActions {
  onPageChange: (page: number) => void
  onZoomChange: (zoom: number) => void
  onFullscreenToggle: () => void
  onSidebarToggle: () => void
}

export interface ReaderState {
  currentPage: number
  zoom: number
  isFullscreen: boolean
  isSidebarCollapsed: boolean
}

// Component-specific prop interfaces
export interface DocumentInfoProps {
  document: DocumentData
}

export interface ProgressPanelProps {
  currentPage: number
  totalPages: number
  progress: number
}



// (removed) ReadingSidebarProps no longer used

export interface PDFReaderProps {
  document: DocumentData
}

// EmbedPDF specific types
export interface EmbedPDFDocumentProps {
  fileUrl: string
  onDocumentLoad?: (pageCount: number) => void
  onPageChange?: (page: number) => void
  onZoomChange?: (zoom: number) => void
  onError?: (error: string) => void
  className?: string
}

export interface EmbedPDFPluginConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  package: any // Plugin package
  config?: Record<string, unknown>
}

export interface EmbedPDFEngine {
  // PDFium engine interface
  loadDocument: (url: string) => Promise<void>
  getDocumentInfo: () => Promise<{ pageCount: number }>
}
