import { DocumentInfo } from '../DocumentInfo'
import { ProgressPanel } from '../ProgressPanel'
import { SidebarSection } from '../SidebarSection'
import type { DocumentData } from '@/components/reader/types'

interface ReadingStatsPanelProps {
  document: DocumentData
  currentPage: number
}

export function ReadingStatsPanel({ document, currentPage }: ReadingStatsPanelProps) {
  return (
    <div className="space-y-6">
      <SidebarSection title="Document Info">
        <DocumentInfo document={document} />
      </SidebarSection>

      <SidebarSection title="Reading Progress">
        <ProgressPanel
          currentPage={currentPage}
          totalPages={document.pageCount}
          progress={document.readingProgress}
        />
      </SidebarSection>
    </div>
  )
}