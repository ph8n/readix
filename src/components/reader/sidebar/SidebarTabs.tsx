"use client"

import { BarChart3, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarTabsProps {
  activeTab: 'reading-stats' | 'ai-chat'
  onChange: (tab: 'reading-stats' | 'ai-chat') => void
}

export function SidebarTabs({ activeTab, onChange }: SidebarTabsProps) {
  return (
    <div className="flex border-b border-border/50">
      <Button
        variant={activeTab === 'reading-stats' ? 'secondary' : 'ghost'}
        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        onClick={() => onChange('reading-stats')}
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Reading Stats
      </Button>
      <Button
        variant={activeTab === 'ai-chat' ? 'secondary' : 'ghost'}
        className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
        onClick={() => onChange('ai-chat')}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        AI Chat
      </Button>
    </div>
  )
}