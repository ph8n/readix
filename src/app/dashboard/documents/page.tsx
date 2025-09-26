import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Upload, Plus, MoreHorizontal } from 'lucide-react'

export default async function DocumentsPage() {
  // For now, we'll show placeholder data since we haven't set up the documents table yet
  const mockDocuments = [
    { id: 1, title: "Research Paper 2024", uploadDate: "2024-01-15", size: "2.4 MB", pages: 45 },
    { id: 2, title: "Product Specification", uploadDate: "2024-01-10", size: "1.8 MB", pages: 23 },
    { id: 3, title: "User Manual", uploadDate: "2024-01-08", size: "5.2 MB", pages: 78 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Manage your PDF library and reading materials</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Upload className="mr-2 h-4 w-4" />
          Upload PDF
        </Button>
      </div>

      {/* Document Grid */}
      {mockDocuments.length === 0 ? (
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
                  Upload your first PDF to start reading and reflecting
                </p>
              </div>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Document
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        // Document Grid
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockDocuments.map((doc) => (
            <Card key={doc.id} className="group cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm transition-all hover:shadow-md hover:shadow-accent/10">
              <CardContent className="p-4 space-y-3">
                {/* Document Icon */}
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-accent/20 p-3">
                    <FileText className="h-8 w-8 text-accent" />
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
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
                    <span>Size: {doc.size}</span>
                    <span>{doc.pages} pages</span>
                  </div>
                  <div>
                    <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity space-y-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-accent/40 hover:bg-accent/20"
                  >
                    Open Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Upload Card */}
          <Card className="group cursor-pointer border-2 border-dashed border-border/40 bg-card/30 transition-all hover:border-accent/60 hover:bg-accent/10">
            <CardContent className="flex min-h-[200px] flex-col items-center justify-center space-y-3 p-4">
              <div className="rounded-full bg-accent/20 p-4 group-hover:bg-accent/30 transition-colors">
                <Plus className="h-8 w-8 text-accent" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-medium text-foreground">Upload PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Add a new document to your library
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}