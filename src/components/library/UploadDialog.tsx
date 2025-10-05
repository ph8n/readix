"use client"

import { useState, useRef } from "react"
import { Upload, X, FileText, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { saveDocumentRecord } from "@/app/actions/document-actions"
import { createClient } from "@/utils/supabase/client"

type UploadDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadSuccess: () => void
}

export function UploadDialog({ open, onOpenChange, onUploadSuccess }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File | null) => {
    setError(null)
    if (!selectedFile) {
      setFile(null)
      return
    }

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      return
    }

    // Validate file size (50MB limit)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError('File size must be less than 50MB')
      return
    }

    setFile(selectedFile)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    handleFileSelect(droppedFile)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        setError('Authentication required')
        setUploading(false)
        return
      }

      // Generate unique file path
      const timestamp = Date.now()
      const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filePath = `${user.id}/${fileName}-${timestamp}.pdf`

      // Upload to storage (client-side)
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          contentType: 'application/pdf',
          upsert: false
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        setError('Failed to upload file to storage')
        setUploading(false)
        return
      }

      // Save document record (server-side)
      const result = await saveDocumentRecord(filePath, file)

      if (result.success) {
        setFile(null)
        onOpenChange(false)
        onUploadSuccess()
      } else {
        // Clean up uploaded file on database error
        await supabase.storage.from('documents').remove([filePath])
        setError(result.error || 'Failed to save document')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload failed')
    }

    setUploading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload PDF Document</DialogTitle>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging ? 'border-accent bg-accent/5' : 'border-muted-foreground/25'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FileText className="h-12 w-12 text-accent" />
              </div>
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={uploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">Drop PDF here or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Maximum file size: 50MB
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose File
              </Button>
            </div>
          )}
        </div>

        {error && (
          <div className="text-sm text-destructive text-center">
            {error}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          className="hidden"
        />
      </DialogContent>
    </Dialog>
  )
}
