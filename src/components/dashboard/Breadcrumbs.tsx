"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Breadcrumbs() {
  const pathname = usePathname()
  const parts = pathname.split('/').filter(Boolean)

  const items = [] as { href: string; label: string }[]
  let acc = ''
  for (const part of parts) {
    acc += `/${part}`
    items.push({ href: acc, label: decodeURIComponent(part) })
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1
          return (
            <li key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-foreground/80 capitalize">{item.label}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground capitalize">
                  {item.label}
                </Link>
              )}
              {!isLast && <span className="opacity-60">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
