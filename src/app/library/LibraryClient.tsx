"use client"

import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/library/EmptyState"
import { DocumentGrid } from "@/components/library/DocumentGrid"
import { UploadDialog } from "@/components/library/UploadDialog"
import { DeleteConfirmDialog } from "@/components/library/DeleteConfirmDialog"
import { useDocuments, Document } from "@/hooks/useDocuments"
import { deleteDocument, toggleFavorite, getAllDocuments } from "@/app/actions/document-actions"

type LibraryClientProps = {
  error: string | null
}

export default function LibraryClient({ error }: LibraryClientProps) {
  const { documents, setDocuments } = useDocuments()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; title: string } | null>(null)

  const handleToggleFavorite = async (id: string) => {
    const result = await toggleFavorite(id)
    if (result.success && result.data) {
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === id ? { ...doc, is_favorite: result.data.is_favorite } : doc
        )
      )
    }
  }

  const handleDeleteClick = (id: string) => {
    const doc = documents.find((d) => d.id === id)
    if (doc) {
      setDocumentToDelete({ id, title: doc.title })
      setDeleteDialogOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return

    const result = await deleteDocument(documentToDelete.id)
    if (result.success) {
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentToDelete.id))
    }

    setDeleteDialogOpen(false)
    setDocumentToDelete(null)
  }

  const handleUploadSuccess = async () => {
    const result = await getAllDocuments()
    if (result.success && result.data) {
      setDocuments(result.data as Document[])
    }
  }

  if (error) {
    return (
      <div className="rounded border border-destructive/40 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-medium text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {documents.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={() => setUploadDialogOpen(true)}
            className="bg-accent hover:bg-accent/90"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload PDF
          </Button>
        </div>
      )}

      {documents.length === 0 ? (
        <EmptyState onUploadClick={() => setUploadDialogOpen(true)} />
      ) : (
        <DocumentGrid
          documents={documents}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDeleteClick}
        />
      )}

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadSuccess={handleUploadSuccess}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        documentTitle={documentToDelete?.title || ''}
      />
    </div>
  )
}