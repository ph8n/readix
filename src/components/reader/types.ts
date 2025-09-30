// Shared types for PDF Reader components

export interface DocumentData {
  id: string
  title: string
  pageCount: number
  fileSize: string
  uploadDate: string
  readingProgress: number
  currentPage: number
}

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
  document: DocumentData
  currentPage: number
}

export interface PageNavigationProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

export interface QuickActionsProps {
  document: DocumentData
}

export interface ReadingSidebarProps {
  document: DocumentData
  currentPage: number
  onPageChange: (page: number) => void
  isCollapsed: boolean
}

export interface PDFReaderProps {
  document: DocumentData
}