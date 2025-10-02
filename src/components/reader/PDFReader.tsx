"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'

import {
  ZoomIn, ZoomOut,
  ChevronLeft, ChevronRight, Eye, ArrowUpDown, List,
  Download, Share2, SkipBack, SkipForward, PanelLeft
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReadingSidebar from './ReadingSidebar'
const PDFDocument = dynamic(() => import('./PDFDocument'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  )
})
import { updateReadingProgress } from '@/app/actions/reading-actions'
import { getDocumentUrl } from '@/app/actions/upload-document'
import type { PDFReaderProps } from './types'

export default function PDFReader({ document }: PDFReaderProps) {
  const scrollRef = useRef<HTMLElement>(null)
  const [currentPage, setCurrentPage] = useState(document.currentPage || 1)
  const [pageCount, setPageCount] = useState(document.pageCount)
  const [zoom, setZoom] = useState(100)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const [isLoadingPdf, setIsLoadingPdf] = useState(true)
  const [isZenMode, setIsZenMode] = useState(false)
  const [scrollMode, setScrollMode] = useState<'paginated' | 'continuous'>('continuous')

  // Handle page navigation
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > pageCount) return
    setCurrentPage(newPage)
  }, [pageCount])

  // Previous page
  const goToPreviousPage = useCallback(() => {
    handlePageChange(currentPage - 1)
  }, [currentPage, handlePageChange])

  // Next page
  const goToNextPage = useCallback(() => {
    handlePageChange(currentPage + 1)
  }, [currentPage, handlePageChange])

  // Zoom controls
  const zoomIn = () => setZoom(prev => Math.min(prev + 10, 200))
  const zoomOut = () => setZoom(prev => Math.max(prev - 10, 50))
  const resetZoom = () => setZoom(100)

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

  // Load sidebar collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('readerSidebarCollapsed')
    if (saved === 'true' || saved === 'false') {
      setIsSidebarCollapsed(saved === 'true')
    }
  }, [])

  // Save sidebar collapsed state
  useEffect(() => {
    localStorage.setItem('readerSidebarCollapsed', String(isSidebarCollapsed))
  }, [isSidebarCollapsed])

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
        case 's':
        case 'S':
          if (!e.ctrlKey && !e.metaKey) {
            e.preventDefault()
            setIsSidebarCollapsed(prev => !prev)
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
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentPage, goToNextPage, goToPreviousPage, isZenMode, scrollMode])

  // Save reading progress periodically
  useEffect(() => {
    const saveProgress = async () => {
      await updateReadingProgress(document.id, currentPage, pageCount)
    }

    const timer = setTimeout(saveProgress, 2000)
    return () => clearTimeout(timer)
  }, [currentPage, document.id, pageCount])

  // Fetch PDF URL on mount
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
              {zoom}%
            </span>
            <Button variant="ghost" size="sm" onClick={zoomIn}>
              <ZoomIn className="h-4 w-4" />
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
            <PDFDocument
              fileUrl={pdfUrl}
              currentPage={currentPage}
              zoom={zoom}
              scrollMode={scrollMode}
              pageCount={pageCount}
              scrollContainerRef={scrollRef}
              onLoadSuccess={(numPages) => {
                setPageCount(numPages)
                if (currentPage > numPages) {
                  setCurrentPage(numPages)
                }
                console.log('PDF loaded with', numPages, 'pages')
              }}
              onLoadError={(error) => {
                setPdfError(error.message)
              }}
              onPageChange={setCurrentPage}
            />
          ) : null}

          {/* Bottom Navigation & Sidebar Dock */}
          {!isZenMode && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
              <div className="bg-card/90 backdrop-blur-sm border border-border/50 rounded-full shadow-lg px-3 py-1 flex items-center gap-2 opacity-60 sm:opacity-30 hover:opacity-100 transition-opacity duration-300">
                <Button
                  onClick={() => setIsSidebarCollapsed(prev => !prev)}
                  className="bg-transparent hover:bg-accent/20 rounded-full p-2 h-10 w-10"
                  size="sm"
                  aria-label={isSidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
                >
                  <PanelLeft className="h-5 w-5 text-foreground" />
                </Button>
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
        {!isZenMode && (
          <ReadingSidebar
            document={{ ...document, pageCount }}
            currentPage={currentPage}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          />
        )}
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

      {/* Keyboard Shortcuts Hint (bottom-left) */}
      {!isZenMode && (
        <div className="fixed bottom-24 left-6 text-xs text-muted-foreground bg-card/90 backdrop-blur-sm border border-border/50 rounded-md px-3 py-2">
          <div className="space-y-1">
            <div><kbd className="font-mono">←→</kbd> Navigate{scrollMode === 'paginated' ? ' Pages' : ''}</div>
            <div><kbd className="font-mono">Z</kbd> Zen Mode</div>
            <div><kbd className="font-mono">S</kbd> Toggle Sidebar</div>
          </div>
        </div>
      )}
    </div>
  )
}
