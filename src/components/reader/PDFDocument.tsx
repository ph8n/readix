"use client"

import { useState, useCallback, useEffect, useRef } from 'react'
import { Document, Page } from 'react-pdf'
import { PDF_OPTIONS } from '@/lib/pdf-config'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface PDFDocumentProps {
  fileUrl: string
  currentPage: number
  zoom: number
  scrollMode?: 'paginated' | 'continuous'
  pageCount?: number
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  onLoadSuccess: (numPages: number) => void
  onLoadError: (error: Error) => void
  onPageLoadSuccess?: () => void
  onPageChange?: (page: number) => void
}

export default function PDFDocument({
  fileUrl,
  currentPage,
  zoom,
  scrollMode = 'paginated',
  pageCount = 0,
  scrollContainerRef,
  onLoadSuccess,
  onLoadError,
  onPageLoadSuccess,
  onPageChange
}: PDFDocumentProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [numPages, setNumPages] = useState(pageCount)
  const containerRef = useRef<HTMLDivElement>(null)
  const pageRefs = useRef<(HTMLDivElement | null)[]>([])

  const handleDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setIsLoading(false)
      setNumPages(numPages)
      onLoadSuccess(numPages)
    },
    [onLoadSuccess]
  )

  const handleDocumentLoadError = useCallback(
    (error: Error) => {
      setIsLoading(false)
      console.error('PDF loading error:', error)
      onLoadError(error)
    },
    [onLoadError]
  )

  const handlePageLoadSuccess = useCallback(() => {
    onPageLoadSuccess?.()
  }, [onPageLoadSuccess])

  useEffect(() => {
    if (scrollMode !== 'continuous' || !onPageChange) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with the highest intersection ratio to avoid bouncing
        let maxRatio = 0
        let bestPageNum = 1

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            bestPageNum = parseInt(entry.target.getAttribute('data-page-number') || '1')
          }
        })

        if (maxRatio > 0) {
          onPageChange(bestPageNum)
        }
      },
      {
        root: scrollContainerRef?.current,
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    pageRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [scrollMode, numPages, onPageChange, scrollContainerRef])

  // Scroll to top when entering continuous mode or when PDF loads
  useEffect(() => {
    if (scrollMode === 'continuous' && scrollContainerRef?.current && numPages > 0) {
      scrollContainerRef.current.scrollTop = 0
    }
  }, [scrollMode, numPages, scrollContainerRef])

  return (
    <div ref={containerRef} className="relative w-full flex justify-center min-h-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading PDF...</p>
          </div>
        </div>
      )}

      <Document
        file={fileUrl}
        onLoadSuccess={handleDocumentLoadSuccess}
        onLoadError={handleDocumentLoadError}
        options={PDF_OPTIONS}
        loading={
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }
        error={
          <div className="flex items-center justify-center p-8">
            <div className="text-center space-y-2">
              <p className="text-red-600 font-semibold">Failed to load PDF</p>
              <p className="text-sm text-muted-foreground">
                Please try refreshing the page
              </p>
            </div>
          </div>
        }
      >
        {scrollMode === 'continuous' ? (
          <div className="space-y-4 w-full flex flex-col items-center">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
               <div
                 key={pageNum}
                 ref={(el) => {
                   pageRefs.current[pageNum - 1] = el
                 }}
                 data-page-number={pageNum}
                 className="mb-4"
               >
                 <Page
                   pageNumber={pageNum}
                   width={Math.min(window.innerWidth * 0.5, 900) * (zoom / 100)}
                   renderTextLayer={true}
                   renderAnnotationLayer={true}
                   loading={
                     <div className="w-full aspect-[8.5/11] flex items-center justify-center border border-border/20 bg-muted/10">
                       <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                     </div>
                   }
                   error={
                     <div className="w-full aspect-[8.5/11] flex items-center justify-center border border-border/20">
                       <p className="text-xs text-red-600">Failed to load page {pageNum}</p>
                     </div>
                   }
                   className="shadow-lg overflow-visible"
                 />
               </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center">
                <Page
              pageNumber={currentPage}
              width={Math.min(window.innerWidth * 0.5, 900) * (zoom / 100)}
              onLoadSuccess={handlePageLoadSuccess}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              loading={
                <div className="w-full aspect-[8.5/11] flex items-center justify-center border border-border/20">
                  <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
              }
              error={
                <div className="w-full aspect-[8.5/11] flex items-center justify-center border border-border/20">
                  <p className="text-sm text-red-600">Failed to load page</p>
                </div>
              }
              className="shadow-2xl overflow-visible"
            />
          </div>
        )}
      </Document>
    </div>
  )
}
