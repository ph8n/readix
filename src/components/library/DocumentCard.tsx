"use client"

import { FileText, Star, Trash2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

type DocumentCardProps = {
  id: string
  title: string
  file_size: number
  reading_progress: number
  last_read_at: string | null
  is_favorite: boolean
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function DocumentCard({
  id,
  title,
  file_size,
  reading_progress,
  last_read_at,
  is_favorite,
  onToggleFavorite,
  onDelete
}: DocumentCardProps) {
  const fileSizeMB = (file_size / (1024 * 1024)).toFixed(2)
  const lastRead = last_read_at
    ? new Date(last_read_at).toLocaleDateString()
    : "Never"

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="rounded-md bg-muted p-2">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate" title={title}>
              {title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {fileSizeMB} MB · Last read: {lastRead}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{reading_progress.toFixed(0)}%</span>
          </div>
          <Progress value={reading_progress} className="h-1.5" />
        </div>
      </CardContent>
      <CardFooter className="flex items-center gap-2 pt-4 border-t">
        <Button
          size="sm"
          variant={is_favorite ? "default" : "ghost"}
          onClick={() => onToggleFavorite(id)}
          title={is_favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Star className={`h-4 w-4 ${is_favorite ? 'fill-current' : ''}`} />
        </Button>
        <Link href={`/read/${id}`} className="flex-1">
          <Button size="sm" variant="outline" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Open
          </Button>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(id)}
          title="Delete document"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}