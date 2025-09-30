import { DocumentInfoProps } from "../types"

export function DocumentInfo({ document }: DocumentInfoProps) {
  return (
    <div>
      <h2 className="mb-4 font-serif text-lg font-semibold">Document Information</h2>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Title</p>
          <p className="font-medium">{document.title}</p>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="text-muted-foreground">Pages</p>
            <p className="font-medium">{document.pageCount}</p>
          </div>
          <div>
            <p className="text-muted-foreground">File Size</p>
            <p className="font-medium">{document.fileSize}</p>
          </div>
        </div>
        <div>
          <p className="text-muted-foreground">Uploaded</p>
          <p className="font-medium">{document.uploadDate}</p>
        </div>
      </div>
    </div>
  )
}