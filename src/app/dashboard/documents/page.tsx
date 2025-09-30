"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Plus, Trash2, Download } from 'lucide-react'
import { useDocuments, formatFileSize, Document as DocumentType } from '@/hooks/useDocuments'
import UploadDialog from '@/components/UploadDialog'
import { deleteDocument, getDocumentUrl } from '@/app/actions/upload-document'

export default function DocumentsPage() {
  const { documents, loading, error, refetch, optimisticDelete, optimisticAdd, setDocuments } = useDocuments()
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (documentId: string) => {
    if (deletingId) return
    
    setDeletingId(documentId)
    
    // Store original documents for rollback
    const originalDocuments = documents
    
    // Optimistically remove document from UI immediately
    optimisticDelete(documentId)
    
    try {
      await deleteDocument(documentId)
      // Success - the optimistic update was correct
    } catch (error) {
      // Error - rollback the optimistic update
      console.error('Delete failed:', error)
      setDocuments(originalDocuments)
      alert(error instanceof Error ? error.message : 'Delete failed')
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (doc: { file_path: string; file_name: string }) => {
    try {
      const url = await getDocumentUrl(doc.file_path)
      const link = document.createElement('a')
      link.href = url
      link.download = doc.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground">Loading your documents...</p>
          </div>
        </div>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground">Error loading documents</p>
          </div>
        </div>
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl opacity-20">😞</div>
            <div className="space-y-2">
              <h3 className="font-serif text-lg font-semibold text-foreground">Something went wrong</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={refetch} variant="outline">Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">
            {documents.length > 0 
              ? `${documents.length} document${documents.length > 1 ? 's' : ''} in your library`
              : 'Manage your document library and reading materials'
            }
          </p>
        </div>
        <Button 
          onClick={() => setUploadDialogOpen(true)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Documents
        </Button>
      </div>

      {/* Document Grid */}
      {documents.length === 0 ? (
        // Empty State
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md border-2 border-dashed border-border/40 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="rounded-full bg-accent/20 p-6">
                <FileText className="h-12 w-12 text-accent" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-serif text-lg font-semibold text-foreground">No documents yet</h3>
                <p className="text-sm text-muted-foreground">
                  Upload your first Documents to start reading and reflecting
                </p>
              </div>
              <Button 
                onClick={() => setUploadDialogOpen(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Document
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Document Grid
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc) => (
            <Card key={doc.id} className="group cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:shadow-accent/10">
              <CardContent className="p-4 space-y-3">
                {/* Document Icon */}
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-accent/20 p-3">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload(doc)
                      }}
                      title="Download"
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (confirm('Are you sure you want to delete this document?')) {
                          handleDelete(doc.id)
                        }
                      }}
                      disabled={deletingId === doc.id}
                      title="Delete"
                    >
                      {deletingId === doc.id ? (
                        <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <h3 className="font-medium text-foreground line-clamp-2 leading-snug">
                    {doc.title}
                  </h3>
                </div>

                {/* Document Metadata */}
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Size: {formatFileSize(doc.file_size)}</span>
                    {doc.page_count && <span>{doc.page_count} pages</span>}
                  </div>
                  <div>
                    <span>Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</span>
                  </div>
                  {doc.reading_progress > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-1">
                        <div 
                          className="bg-accent h-1 rounded-full transition-all" 
                          style={{ width: `${doc.reading_progress}%` }}
                        />
                      </div>
                      <span>{Math.round(doc.reading_progress)}%</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity space-y-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-accent/40 hover:bg-accent/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(`/dashboard/read/${doc.id}`)
                    }}
                  >
                    Open Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload Card */}
          <Card 
            className="group cursor-pointer border-2 border-dashed border-border/40 bg-card/30 transition-all hover:border-accent/60 hover:bg-accent/10"
            onClick={() => setUploadDialogOpen(true)}
          >
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center space-y-3 p-4">
              <div className="rounded-full bg-accent/20 p-4 group-hover:bg-accent/30 transition-colors">
                <Plus className="h-8 w-8 text-accent" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-medium text-foreground">Upload Documents</h3>
                <p className="text-sm text-muted-foreground">
                  Add a new document to your library
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSuccess={(uploadedDocument?: DocumentType) => {
          console.log('📤 Upload success callback triggered')
          // Fallback: Add document immediately if real-time doesn't work
          if (uploadedDocument) {
            console.log('📄 Adding document via fallback:', uploadedDocument)
            optimisticAdd(uploadedDocument)
          } else {
            // If no document passed, refetch as backup
            console.log('🔄 No document passed, refetching')
            setTimeout(() => refetch(), 100)
          }
        }}
      />
    </div>
  )
}
