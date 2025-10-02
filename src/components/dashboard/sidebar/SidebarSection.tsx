import type { ReactNode } from 'react'

interface SidebarSectionProps {
  title?: string
  children: ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="px-3 py-2">
      {title && (
        <div className="px-2 py-1 text-xs uppercase tracking-wider text-muted-foreground/80">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}