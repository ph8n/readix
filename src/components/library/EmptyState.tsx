"use client"

import { FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState({ onUploadClick }: { onUploadClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        Upload your first PDF document to start reading and tracking your progress
      </p>
      <Button onClick={onUploadClick} className="bg-accent hover:bg-accent/90">
        <Upload className="mr-2 h-4 w-4" />
        Upload PDF
      </Button>
    </div>
  )
}