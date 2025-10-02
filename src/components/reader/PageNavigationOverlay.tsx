"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PageNavigationOverlayProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
  scrollMode: 'paginated' | 'continuous'
}

export function PageNavigationOverlay({
  currentPage,
  pageCount,
  onPageChange,
  scrollMode
}: PageNavigationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [pageInput, setPageInput] = useState(currentPage.toString())
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)

  // Update page input when current page changes
  useEffect(() => {
    setPageInput(currentPage.toString())
  }, [currentPage])

  // Auto-hide after 3 seconds of no interaction
  const resetHideTimer = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }
    const timeout = setTimeout(() => {
      setIsVisible(false)
    }, 3000)
    setHideTimeout(timeout)
  }

  const handleMouseEnter = () => {
    setIsVisible(true)
    resetHideTimer()
  }

  const handleMouseLeave = () => {
    resetHideTimer()
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      onPageChange(newPage)
      setPageInput(newPage.toString())
    }
    resetHideTimer()
  }

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      const newPage = currentPage + 1
      onPageChange(newPage)
      setPageInput(newPage.toString())
    }
    resetHideTimer()
  }

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault()
    const page = Number.parseInt(pageInput)
    if (page >= 1 && page <= pageCount) {
      onPageChange(page)
    } else {
      setPageInput(currentPage.toString())
    }
    resetHideTimer()
  }

  // Don't show overlay in continuous scroll mode
  if (scrollMode === 'continuous') {
    return null
  }

  return (
    <div
      className={`
        absolute bottom-0 left-0 right-0 z-10
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full pointer-events-none'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Semi-transparent background */}
      <div className="bg-card/90 backdrop-blur-sm border-t border-border/50 p-4">
        <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {/* Page Counter */}
          <span className="text-sm font-medium min-w-[80px] text-center">
            {currentPage} / {pageCount}
          </span>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === pageCount}
            className="flex items-center gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Page Jump Form */}
          <form onSubmit={handlePageJump} className="flex gap-2 ml-4">
            <Input
              type="number"
              min="1"
              max={pageCount}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              placeholder="Page"
              className="w-16 h-8 text-xs"
            />
            <Button type="submit" variant="secondary" size="sm" className="h-8 px-2">
              Go
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
