"use client"

import { useState, useEffect, useCallback, useRef } from 'react'

import {
  ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, Eye, ArrowUpDown, List,
  Download, Share2, SkipBack, SkipForward,
  // Phase 3 additions
  RotateCcw, RotateCw, MousePointerClick, Sidebar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
// 
import EmbedPDFDocument, { EmbedPDFDocumentRef } from './EmbedPDFDocument'
// (Legacy) updateReadingProgress no longer needed with session heartbeats
// import { updateReadingProgress } from '@/app/actions/reading-actions'
import { getDocumentUrl } from '@/app/actions/upload-document'
import { syncDocumentPagination } from '@/app/actions/reading-session-actions'
import { useReadingSession } from '@/hooks/useReadingSession'
import { saveLastPage, getLastPage } from '@/lib/pdf-page-storage'
import type { PDFReaderProps } from './types'

export default function PDFReader({ document }: PDFReaderProps) {
  const scrollRef = useRef<HTMLElement>(null)
  const embedPdfRef = useRef<EmbedPDFDocumentRef>(null)
  const [currentPage, setCurrentPage] = useState(1) // Will be updated in useEffect
  const [pageCount, setPageCount] = useState(document.pageCount)
  const [zoom, setZoom] = useState(1.0)

  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(true)
  const [isZenMode, setIsZenMode] = useState(false)
  const [scrollMode, setScrollMode] = useState<'paginated' | 'continuous'>('continuous')
  const [scrollY, setScrollY] = useState(0)

  // Phase 3 state
  const [showThumbnails, setShowThumbnails] = useState(false)
  const [selectionEnabled, setSelectionEnabled] = useState(false)
  const [capabilities, setCapabilities] = useState({
    rotate: false,
    selection: false,
    export: false,
    annotations: false,
    thumbnails: true
  })

  // Handle page navigation
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return
    if (embedPdfRef.current) {
      embedPdfRef.current.goToPage(newPage)
    } else {
      setCurrentPage(newPage)
    }
  }, [pageCount])

  // Previous page
  const goToPreviousPage = useCallback(() => {
    handlePageChange(currentPage - 1)
  }, [currentPage, handlePageChange])

  // Next page
  const goToNextPage = useCallback(() => {
    handlePageChange(currentPage + 1)
  }, [currentPage, handlePageChange])

   // Zoom controls (decimal scale for EmbedPDF)
   const zoomIn = useCallback(() => {
     if (embedPdfRef.current) {
       embedPdfRef.current.zoomIn()
     } else {
       setZoom(prev => Math.min(prev + 0.1, 3.0))
     }
   }, [])

   const zoomOut = useCallback(() => {
     if (embedPdfRef.current) {
       embedPdfRef.current.zoomOut()
     } else {
       setZoom(prev => Math.max(prev - 0.1, 0.5))
     }
   }, [])

   const resetZoom = useCallback(() => {
     if (embedPdfRef.current) {
       embedPdfRef.current.setZoom(1.0)
     } else {
       setZoom(1.0)
     }
   }, [])

  // Zen mode toggle
  const toggleZenMode = () => setIsZenMode(prev => !prev)

  // Scroll mode toggle
  const toggleScrollMode = () => {
    const newMode = scrollMode === 'paginated' ? 'continuous' : 'paginated'
    setScrollMode(newMode)
    localStorage.setItem('scrollMode', newMode)
  }

  // Load scroll mode preference
  useEffect(() => {
    const saved = localStorage.getItem('scrollMode')
    if (saved === 'paginated' || saved === 'continuous') {
      setScrollMode(saved)
    }
  }, [])

  // Phase 3: Detect available features from EmbedPDF
  useEffect(() => {
    if (embedPdfRef.current && pdfUrl) {
      const caps = embedPdfRef.current.getCapabilities?.()
      if (caps) {
        setCapabilities(caps)
      }
    }
  }, [pdfUrl])

  // Track scroll position for floating elements
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setScrollY(scrollRef.current.scrollTop)
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll)
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Reading session integration (replaces legacy manual progress saver)
  const { sessionId } = useReadingSession({
    documentId: document.id,
    currentPage,
    totalPages: pageCount,
    heartbeatIntervalMs: 60_000,
    quickSaveDebounceMs: 1_500
  })



  // Optionally log session lifecycle (can be removed later for noise reduction)
  useEffect(() => {
    if (sessionId) {
      console.debug('[PDFReader] Reading session active', { sessionId })
    }
  }, [sessionId])

  // Reset reader state when document changes
  useEffect(() => {

    // PRIORITY: localStorage > database > page 1
    const localPage = getLastPage(document.id)
    const dbPage = document.currentPage ?? 1

    // Use localStorage if available, otherwise use database
    const initialPage = localPage ?? dbPage

    console.log('[PDFReader] Page restoration', {
      documentId: document.id,
      localStorage: localPage,
      database: dbPage,
      using: initialPage
    })

    setCurrentPage(initialPage)
    setPageCount(document.pageCount)
    setZoom(1.0)

    // If database had a higher page (cross-device sync), update localStorage
    if (dbPage > (localPage ?? 0)) {
      console.log('[PDFReader] Cross-device sync: updating localStorage', {
        from: localPage,
        to: dbPage
      })
      saveLastPage(document.id, dbPage)
    }
  }, [document.id]) // Re-run when document or its page data changes

  // Save current page to localStorage on every change
  useEffect(() => {
    if (currentPage > 0 && pageCount > 0) {
      saveLastPage(document.id, currentPage)
    }
  }, [currentPage, document.id, pageCount])

  // Fetch PDF URL on mount or file change
  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        setIsLoadingPdf(true)
        const url = await getDocumentUrl(document.filePath)
        setPdfUrl(url)
      } catch (error) {
        console.error('Failed to fetch PDF URL:', error)
        setPdfError('Failed to load PDF. Please try again.')
      } finally {
        setIsLoadingPdf(false)
      }
    }

    fetchPdfUrl()
  }, [document.filePath])

  // Quick actions
  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download document:', document.id)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share document:', document.id)
  }

  // Phase 3: Feature toggles
  const toggleThumbnails = useCallback(() => {
    const newState = !showThumbnails
    setShowThumbnails(newState)
    embedPdfRef.current?.setThumbnailsOpen?.(newState)
  }, [showThumbnails])

  const toggleSelection = useCallback(() => {
    if (!capabilities.selection) return

    const newState = !selectionEnabled
    setSelectionEnabled(newState)

    if (newState) {
      embedPdfRef.current?.enableSelection?.()
    } else {
      embedPdfRef.current?.disableSelection?.()
    }
  }, [capabilities.selection, selectionEnabled])

  const rotateLeft = useCallback(() => {
    if (!capabilities.rotate) return
    embedPdfRef.current?.rotateCounterClockwise?.()
  }, [capabilities.rotate])

  const rotateRight = useCallback(() => {
    if (!capabilities.rotate) return
    embedPdfRef.current?.rotateClockwise?.()
  }, [capabilities.rotate])

  const exportCurrentPage = useCallback(async () => {
    if (!capabilities.export || !embedPdfRef.current) return

    try {
      const blob = await embedPdfRef.current.exportPage({
        page: currentPage,
        format: 'png',
        quality: 0.92,
        dpi: 144
      })

      const url = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = `${document.title.replace(/[^a-z0-9]/gi, '_')}-page-${currentPage}.png`
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }, [capabilities.export, currentPage, document.title])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement) return

      switch (e.key) {
        case 'ArrowLeft':
          if (scrollMode === 'paginated') {
            e.preventDefault()
            goToPreviousPage()
          }
          break
        case 'ArrowRight':
          if (scrollMode === 'paginated') {
            e.preventDefault()
            goToNextPage()
          }
          break

        case 'z':
        case 'Z':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            toggleZenMode()
          }
          break
        case 'Escape':
          if (isZenMode) {
            e.preventDefault()
            setIsZenMode(false)
          }
          break
        case '+':
        case '=':
          e.preventDefault()
          zoomIn()
          break
        case '-':
          e.preventDefault()
          zoomOut()
          break
        case '0':
          e.preventDefault()
          resetZoom()
          break

        // Phase 3 shortcuts:
        case 't':
        case 'T':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            toggleThumbnails()
          }
          break
        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            toggleSelection()
          }
          break
        case '[':
          e.preventDefault()
          rotateLeft()
          break
        case ']':
          e.preventDefault()
          rotateRight()
          break
        case 'e':
        case 'E':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            exportCurrentPage()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, goToNextPage, goToPreviousPage, isZenMode, scrollMode, resetZoom, zoomIn, zoomOut, toggleThumbnails, toggleSelection, rotateLeft, rotateRight, exportCurrentPage])

  return (
    <div
      className={`
        flex flex-col h-screen bg-background
        ${isZenMode ? 'fixed inset-0 z-50' : ''}
      `}
    >
      {/* Header */}
      {!isZenMode && (
        <header className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/80 backdrop-blur-sm">
          {/* Title */}
          <div className="flex items-center">
            <h1 className="font-serif text-lg font-semibold text-foreground truncate max-w-md">
              {document.title}
            </h1>
          </div>

          {/* Center: Page navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage <= 1 || scrollMode === 'continuous'}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[80px] text-center">
              Page {currentPage} of {pageCount}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= pageCount || scrollMode === 'continuous'}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleScrollMode}
              title={scrollMode === 'paginated' ? 'Switch to continuous scroll' : 'Switch to paginated'}
              className="gap-1"
            >
              {scrollMode === 'paginated' ? (
                <>
                  <List className="h-4 w-4" />
                  <span className="text-xs">Pages</span>
                </>
              ) : (
                <>
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="text-xs">Scroll</span>
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={zoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button variant="ghost" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="h-6 w-px bg-border mx-2" />

            {/* Phase 3 Controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleThumbnails}
              title="Toggle Thumbnails (T)"
              className={showThumbnails ? 'text-primary' : ''}
            >
              <Sidebar className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSelection}
              disabled={!capabilities.selection}
              title={capabilities.selection ? "Toggle Selection (S)" : "Selection not available"}
              className={selectionEnabled ? 'text-primary' : ''}
            >
              <MousePointerClick className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={rotateLeft}
              disabled={!capabilities.rotate}
              title={capabilities.rotate ? "Rotate Left ([)" : "Rotation not available"}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={rotateRight}
              disabled={!capabilities.rotate}
              title={capabilities.rotate ? "Rotate Right (])" : "Rotation not available"}
            >
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={exportCurrentPage}
              disabled={!capabilities.export}
              title={capabilities.export ? "Export current page (E)" : "Export not available"}
            >
              <Download className="h-4 w-4" />
              <span className="text-xs hidden sm:inline">Export</span>
            </Button>

            <div className="h-6 w-px bg-border mx-2" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              title="Download PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              title="Share Document"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleZenMode}
              title="Zen Mode (Z)"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* PDF Viewer Area */}
        <main
          ref={scrollRef}
          className={`relative flex ${scrollMode === 'continuous' ? 'items-start' : 'items-center'} justify-center bg-muted/20 overflow-auto ${
            isZenMode ? 'flex-1 p-0' : 'flex-1 p-8'
          }`}
        >
          {isLoadingPdf ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-muted-foreground">Loading PDF...</p>
            </div>
          ) : pdfError ? (
            <div className="text-center space-y-4">
              <div className="text-6xl">⚠️</div>
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  PDF Load Error
                </h2>
                <p className="text-muted-foreground">{pdfError}</p>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          ) : pdfUrl ? (
            <EmbedPDFDocument
              key={pdfUrl}
              ref={embedPdfRef}
              fileUrl={pdfUrl}
              initialPage={currentPage}
              showThumbnails={showThumbnails}
                onDocumentLoad={(pageCount) => {
                  console.log('[PDFReader:onDocumentLoad]', {
                    documentId: document.id,
                    reportedPageCount: pageCount
                  })

                  setPageCount(pageCount)

                 // Simple fire-and-forget: update page_count in DB if needed
                 // (No complex sync, no response handling, just background update)
                 if (!document.pageCount || pageCount > document.pageCount) {
                   void syncDocumentPagination(document.id, pageCount)
                     .catch((e) => console.warn('[PDFReader] Page count sync failed:', e))
                 }
               }}
               onPageChange={(page) => {
                 setCurrentPage(page)
               }}
               onZoomChange={(zoom) => {
                setZoom(zoom)
              }}
              onError={(error) => {
                setPdfError(error)
              }}
              className="max-w-full max-h-full"
            />
          ) : null}

          {/* Bottom Navigation & Sidebar Dock */}
          {!isZenMode && (
            <div
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3"
              style={{ transform: `translate(-50%, ${scrollY}px)` }}
            >
              <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg px-3 py-1 flex items-center gap-2 opacity-60 sm:opacity-30 hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={goToPreviousPage}
                  disabled={currentPage <= 1 || scrollMode === 'continuous'}
                  className="bg-transparent hover:bg-accent/20 rounded-full p-2 h-10 w-10"
                  size="sm"
                  aria-label="Previous page"
                >
                  <SkipBack className="h-4 w-4 text-foreground" />
                </Button>
                <span className="text-sm text-foreground font-medium min-w-[60px] text-center">
                  {currentPage} / {pageCount}
                </span>
                <Button
                  onClick={goToNextPage}
                  disabled={currentPage >= pageCount || scrollMode === 'continuous'}
                  className="bg-transparent hover:bg-accent/20 rounded-full p-2 h-10 w-10"
                  size="sm"
                  aria-label="Next page"
                >
                  <SkipForward className="h-4 w-4 text-foreground" />
                </Button>
              </div>
            </div>
          )}

        </main>

        {/* Reading Sidebar (30%) */}
        {/* Sidebar removed for viewport-only refactor */}
      </div>



      {/* Zen Mode Exit Button (hover to show) */}
      {isZenMode && (
        <div className="fixed top-4 right-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleZenMode}
            className="bg-card/90 backdrop-blur-sm border border-border/50"
          >
            Exit Zen (Z)
          </Button>
        </div>
      )}


    </div>
  )
}
