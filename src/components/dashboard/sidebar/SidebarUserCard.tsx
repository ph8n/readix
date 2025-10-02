"use client"

interface SidebarUserCardProps {
  email?: string
  collapsed?: boolean
}

export function SidebarUserCard({ email, collapsed }: SidebarUserCardProps) {
  const initial = email?.[0]?.toUpperCase()
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2">
      <div className="flex size-8 items-center justify-center rounded-full bg-accent/50 text-foreground">
        <span className="text-sm font-medium">{initial}</span>
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{email}</p>
          <p className="truncate text-xs text-muted-foreground">Reader</p>
        </div>
      )}
    </div>
  )
}
