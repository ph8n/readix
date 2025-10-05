"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search } from "lucide-react"
import Image from "next/image"

interface FileCardProps {
  title: string
  metadata: string
  thumbnail: string
  onClick?: () => void
}

export function FileCard({ title, metadata, thumbnail, onClick }: FileCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group relative overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md cursor-pointer"
    >
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={thumbnail || "/placeholder.svg"}
          alt={title}
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{metadata}</p>
      </div>
    </div>
  )
}

export default function FileManager() {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <div className="flex-1 flex justify-center">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search files..."
                className="pl-10 text-center bg-background border-border focus:ring-accent"
              />
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8 flex items-center gap-3">
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus className="h-4 w-4" />
              Create
            </Button>
            <Button variant="outline" className="gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Upload
            </Button>
          </div>

          <div className="mb-8">
            <Tabs defaultValue="recent">
              <TabsList className="bg-muted">
                <TabsTrigger value="recent" className="data-[state=active]:bg-background">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="starred" className="data-[state=active]:bg-background">
                  Starred
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full text-center text-muted-foreground py-12">
              No documents yet. This is a placeholder component for future file management.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
