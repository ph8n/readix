import { Progress } from "@/components/ui/progress"

import { ProgressPanelProps } from "../types"

export function ProgressPanel({ currentPage, totalPages, progress }: ProgressPanelProps) {
  const progressPercentage = Math.round(progress)
  
  const pagesRemaining = Math.max(0, totalPages - currentPage)
  const estimatedTimeRemaining = totalPages > 0 && pagesRemaining > 0
    ? Math.ceil(pagesRemaining * 1.5)
    : 0

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg font-semibold">Reading Progress</h2>
      <div className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Estimated time remaining</p>
              <p className="mt-1 text-lg font-semibold">{estimatedTimeRemaining} minutes</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
              <span className="text-sm font-semibold">{progressPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
