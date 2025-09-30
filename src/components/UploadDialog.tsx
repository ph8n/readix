"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { uploadDocument } from '@/app/actions/upload-document'
import { Document as DocumentType } from '@/hooks/useDocuments'

interface UploadDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (document?: DocumentType) => void
}

interface UploadState {
  file: File | null
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
  progress?: number
}

export default function UploadDialog({ isOpen, onClose, onSuccess }: UploadDialogProps) {
  const [uploadState, setUploadState] = useState<UploadState>({ file: null, status: 'idle' })
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed'
    }
    if (file.size > 50 * 1024 * 1024) {
      return 'File size must be less than 50MB'
    }
    return null
  }

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const error = validateFile(file)

    if (error) {
      setUploadState({ file: null, status: 'error', error })
      return
    }

    setUploadState({ file, status: 'idle', error: undefined })
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleUpload = async () => {
    if (!uploadState.file) return

    setUploadState(prev => ({ ...prev, status: 'uploading', progress: 0 }))

    try {
      const formData = new FormData()
      formData.append('file', uploadState.file)

      const result = await uploadDocument(formData)

      if (result.success) {
        setUploadState(prev => ({ ...prev, status: 'success' }))
        setTimeout(() => {
          onSuccess?.(result.document)
          onClose()
          setUploadState({ file: null, status: 'idle' })
        }, 1500)
      }
    } catch (error) {
      setUploadState(prev => ({
        ...prev,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      }))
    }
  }

  const resetUpload = () => {
    setUploadState({ file: null, status: 'idle' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-border/50 shadow-lg bg-card/95 backdrop-blur-sm">
        <CardContent className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold text-foreground">Upload Document</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
              ${isDragOver || uploadState.status === 'uploading'
                ? 'border-accent bg-accent/10'
                : uploadState.status === 'error'
                ? 'border-red-300 bg-red-50'
                : 'border-border/40 hover:border-accent/60 hover:bg-accent/5'
              }
            `}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />

            {uploadState.status === 'idle' && !uploadState.file && (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Drop your PDF here</p>
                  <p className="text-sm text-muted-foreground">or click to browse files</p>
                  <p className="text-xs text-muted-foreground">Maximum file size: 50MB</p>
                </div>
              </div>
            )}

            {uploadState.file && uploadState.status === 'idle' && (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground line-clamp-1">{uploadState.file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(uploadState.file.size)}</p>
                </div>
              </div>
            )}

            {uploadState.status === 'uploading' && (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Uploading...</p>
                  <p className="text-sm text-muted-foreground">Please wait</p>
                </div>
              </div>
            )}

            {uploadState.status === 'success' && (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Upload successful!</p>
                  <p className="text-sm text-muted-foreground">Your document has been added</p>
                </div>
              </div>
            )}

            {uploadState.status === 'error' && (
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Upload failed</p>
                  <p className="text-sm text-red-600">{uploadState.error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {uploadState.status === 'idle' && uploadState.file && (
              <>
                <Button
                  variant="outline"
                  onClick={resetUpload}
                  className="flex-1"
                >
                  Remove
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Upload
                </Button>
              </>
            )}

            {uploadState.status === 'error' && (
              <>
                <Button
                  variant="outline"
                  onClick={resetUpload}
                  className="flex-1"
                >
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            )}

            {(uploadState.status === 'idle' && !uploadState.file) && (
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}