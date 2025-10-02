"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from './types'

interface SidebarNavItemProps extends NavItem {
  collapsed?: boolean
}

export function SidebarNavItem({ href, label, icon: Icon, collapsed }: SidebarNavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={
        `group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors ` +
        (isActive
          ? 'bg-accent/20 text-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/10')
      }
      title={collapsed ? label : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  )
}
