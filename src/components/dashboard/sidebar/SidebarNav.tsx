"use client"

import type { NavItem } from './types'
import { SidebarNavItem } from './SidebarNavItem'

interface SidebarNavProps {
  items: NavItem[]
  collapsed?: boolean
}

export function SidebarNav({ items, collapsed }: SidebarNavProps) {
  return (
    <nav className="space-y-1 px-3 py-2">
      {items.map((item) => (
        <SidebarNavItem key={item.href} {...item} collapsed={collapsed} />
      ))}
    </nav>
  )
}
