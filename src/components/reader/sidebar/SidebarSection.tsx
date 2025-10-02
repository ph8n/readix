import type { ReactNode } from 'react'

interface SidebarSectionProps {
  title: string
  children: ReactNode
}

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section>
      <h3 className="font-serif text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </section>
  )
}