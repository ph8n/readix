"use client"

import { useEffect, useState } from 'react'
import { BookOpen, FileText, Settings, LogOut } from 'lucide-react'
import { SidebarToggle } from './SidebarToggle'
import { SidebarNav } from './SidebarNav'
import { SidebarSection } from './SidebarSection'
import { SidebarUserCard } from './SidebarUserCard'
import type { NavItem } from './types'

interface SidebarProps {
  email?: string
}

const EXPANDED_WIDTH = 280
const COLLAPSED_WIDTH = 72

export function Sidebar({ email }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('dashboard:sidebar-collapsed')
    setCollapsed(stored === '1')
  }, [])

  useEffect(() => {
    localStorage.setItem('dashboard:sidebar-collapsed', collapsed ? '1' : '0')
    const width = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
    document.documentElement.style.setProperty('--sidebar-w', `${width}px`)
  }, [collapsed])

  const navItems: NavItem[] = [
    { href: '/dashboard/documents', label: 'Documents', icon: FileText },
    { href: '/dashboard/favorites', label: 'Favorites', icon: BookOpen },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside
      className="fixed left-0 top-0 z-30 h-full border-r border-border/50 bg-card/80 backdrop-blur-sm"
      style={{ width: `var(--sidebar-w, ${EXPANDED_WIDTH}px)` }}
      aria-label="Dashboard navigation sidebar"
    >
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-3">
        <div className="rounded-lg bg-accent/50 p-2">
          <BookOpen className="h-6 w-6 text-foreground" />
        </div>
        {!collapsed && (
          <h1 className="font-serif text-xl font-bold text-foreground">Readix</h1>
        )}
      </div>

      <div className="flex h-[calc(100%-4rem)] flex-col">
        <div className="flex-1 overflow-auto py-2">
          <SidebarSection>
            <SidebarNav items={navItems} collapsed={collapsed} />
          </SidebarSection>
        </div>

        <div className="border-t border-border/50">
          <SidebarSection>
            <SidebarUserCard email={email} collapsed={collapsed} />
          </SidebarSection>
          <SidebarSection>
            <form action="/auth/signout" method="post" className="px-3 pb-3">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Sign Out</span>}
                {collapsed && <span className="sr-only">Sign Out</span>}
              </button>
            </form>
          </SidebarSection>
        </div>

        <div className="border-t border-border/30">
          <SidebarToggle collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
        </div>
      </div>
    </aside>
  )
}
