"use client"

import { DocumentCard } from "./DocumentCard"

type Document = {
  id: string
  title: string
  file_size: number
  reading_progress: number
  last_read_at: string | null
  is_favorite: boolean
}

type DocumentGridProps = {
  documents: Document[]
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function DocumentGrid({
  documents,
  onToggleFavorite,
  onDelete
}: DocumentGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          {...doc}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}