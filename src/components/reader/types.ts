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
  currentPage: number
  totalPages: number
  progress: number
}



export interface ReadingSidebarProps {
  document: DocumentData
  currentPage: number
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export interface PDFReaderProps {
  document: DocumentData
}