"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface DashboardErrorBoundaryProps {
  children: ReactNode
}

interface DashboardErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class DashboardErrorBoundary extends Component<
  DashboardErrorBoundaryProps,
  DashboardErrorBoundaryState
> {
  constructor(props: DashboardErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): DashboardErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (process.env.NODE_ENV !== "production") {
      console.error("DashboardErrorBoundary caught an error", error, info)
    }
  }

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded border border-destructive/40 bg-destructive/5 p-8 text-center space-y-4">
          <div className="text-sm font-medium text-destructive">
            {this.state.error?.message ?? "Something went wrong loading the dashboard"}
          </div>
          <Button size="sm" variant="outline" onClick={this.handleReload}>
            Reload page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
