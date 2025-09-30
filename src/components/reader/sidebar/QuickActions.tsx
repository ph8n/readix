import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"

import { QuickActionsProps } from "../types"

export function QuickActions({ document }: QuickActionsProps) {
  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download document:', document.id)
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share document:', document.id)
  }

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg font-semibold">Quick Actions</h2>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent"
          onClick={handleShare}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Document
        </Button>
      </div>
    </div>
  )
}