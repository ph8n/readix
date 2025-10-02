"use client"

import { useState } from 'react'
import { PanelLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarTabs } from './sidebar/SidebarTabs'
import { ReadingStatsPanel } from './sidebar/stats/ReadingStatsPanel'
import { AIChatPanel } from './sidebar/chat/AIChatPanel'
import type { ReadingSidebarProps } from './types'

export default function ReadingSidebar({
  document,
  currentPage,
  isCollapsed,
  onToggleCollapse
}: ReadingSidebarProps) {
  const [activeTab, setActiveTab] = useState<'reading-stats' | 'ai-chat'>('reading-stats')
  const [isHovering, setIsHovering] = useState(false)

  return (
    <>
      {/* Hover Hub for Sidebar */}
      <div
        className={`fixed top-1/2 -translate-y-1/2 z-20 ${isCollapsed ? 'left-[calc(50%-24px)]' : 'left-[calc(35%-24px)]'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className={`
          transition-all duration-300 ease-in-out
          ${isHovering ? 'opacity-100 scale-100' : 'opacity-60 sm:opacity-30 scale-95'}
        `}>
          <Button
            onClick={onToggleCollapse}
            className="bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg hover:bg-accent/20 rounded-full p-3 h-12 w-12"
            size="sm"
            aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
          >
            <PanelLeft className="h-5 w-5 text-foreground" />
          </Button>
        </div>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`
          flex flex-col h-full bg-background border-l border-border/50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-0 opacity-0' : 'w-[30%] min-w-[320px] opacity-100'}
        `}
        style={{
          transform: isCollapsed ? 'translateX(100%)' : 'translateX(0)'
        }}
      >
        {!isCollapsed && (
          <div className="flex flex-col h-full">
            <SidebarTabs activeTab={activeTab} onChange={setActiveTab} />

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'reading-stats' && (
                <ReadingStatsPanel document={document} currentPage={currentPage} />
              )}

              {activeTab === 'ai-chat' && (
                <AIChatPanel documentId={document.id} />
              )}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
