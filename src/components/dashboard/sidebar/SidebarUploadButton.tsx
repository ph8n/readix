"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import UploadDialog from '@/components/UploadDialog'

export function SidebarUploadButton() {
  const [open, setOpen] = useState(false)
  return (
    <div className="px-3 py-2">
      <Button
        variant="outline"
        className="w-full justify-center"
        onClick={() => setOpen(true)}
      >
        <Upload className="h-4 w-4" />
        <span>Upload</span>
      </Button>
      <UploadDialog isOpen={open} onClose={() => setOpen(false)} />
    </div>
  )
}
