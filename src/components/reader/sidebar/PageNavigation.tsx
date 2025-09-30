import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { PageNavigationProps } from "../types"

export function PageNavigation({ currentPage, pageCount, onPageChange }: PageNavigationProps) {
  const [pageInput, setPageInput] = useState(currentPage.toString())

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      onPageChange(newPage)
      setPageInput(newPage.toString())
    }
  }

  const handleNextPage = () => {
    if (currentPage < pageCount) {
      const newPage = currentPage + 1
      onPageChange(newPage)
      setPageInput(newPage.toString())
    }
  }

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault()
    const page = Number.parseInt(pageInput)
    if (page >= 1 && page <= pageCount) {
      onPageChange(page)
    } else {
      setPageInput(currentPage.toString())
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg font-semibold">Page Navigation</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex-1 bg-transparent"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="px-4 text-sm font-medium">
            {currentPage} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === pageCount}
            className="flex-1 bg-transparent"
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <form onSubmit={handlePageJump} className="flex gap-2">
          <Input
            type="number"
            min="1"
            max={pageCount}
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            placeholder="Jump to page"
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            Go
          </Button>
        </form>
      </div>
    </div>
  )
}