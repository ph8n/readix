"use client"

import { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { createPluginRegistration } from '@embedpdf/core'
import { EmbedPDF } from '@embedpdf/core/react'
import { getPdfiumEngine } from '@/lib/embedpdf-engine'
import { createEmbedPDFPlugins } from '@/lib/embedpdf-config'

import { Viewport } from '@embedpdf/plugin-viewport/react'
import { Scroller } from '@embedpdf/plugin-scroll/react'
import { RenderLayer } from '@embedpdf/plugin-render/react'
import { LoaderPluginPackage } from '@embedpdf/plugin-loader'

import { useZoom } from '@embedpdf/plugin-zoom/react'
import { useScroll } from '@embedpdf/plugin-scroll/react'

import { ThumbnailsPane } from '@embedpdf/plugin-thumbnail/react'

// TODO: Uncomment when plugin packages are installed
// import { useSelection } from '@embedpdf/plugin-selection/react'
// import { useAnnotations } from '@embedpdf/plugin-annotations/react'
// import { useRotate } from '@embedpdf/plugin-rotate/react'
// import { useExport } from '@embedpdf/plugin-export/react'

interface EmbedPDFDocumentProps {
  fileUrl: string
  initialPage?: number
  onDocumentLoad?: (pageCount: number) => void
  onPageChange?: (page: number) => void
  onZoomChange?: (zoom: number) => void
  onError?: (error: string) => void
  className?: string

  // Phase 2 additions
  showThumbnails?: boolean
  onSelectionChange?: (payload: { text: string; ranges: unknown }) => void
  onAnnotationEvent?: (event: 'add' | 'update' | 'delete', payload: unknown) => void
}

export interface EmbedPDFDocumentRef {
  zoomIn: () => void
  zoomOut: () => void
  setZoom: (zoom: number) => void
  goToPage: (page: number) => void
  getCurrentPage: () => number
  getZoom: () => number

  // Phase 2 additions (safe no-ops until plugins are installed)
  rotateClockwise: () => void
  rotateCounterClockwise: () => void
  setRotation: (deg: 0 | 90 | 180 | 270) => void

  enableSelection: () => void
  disableSelection: () => void
  getSelectedText: () => string | null

  addHighlight: (input: unknown) => Promise<string>
  deleteAnnotation: (id: string) => Promise<void>
  listAnnotations: () => Promise<unknown[]>

  exportPage: (opts: { page: number; format: 'png' | 'jpeg' | 'pdf'; quality?: number; dpi?: number }) => Promise<Blob>
  exportRange: (opts: { from: number; to: number; format: 'pdf' | 'zip-images'; quality?: number; dpi?: number }) => Promise<Blob>

  // Phase 3 additions
  setThumbnailsOpen: (open: boolean) => void
  getThumbnailsOpen: () => boolean
  getCapabilities: () => {
    rotate: boolean
    selection: boolean
    export: boolean
    annotations: boolean
    thumbnails: boolean
  }
}

interface PDFViewerInnerProps {
  onDocumentLoad?: (pageCount: number) => void
  onPageChange?: (page: number) => void
  onZoomChange?: (zoom: number) => void
  forwardedRef: React.ForwardedRef<EmbedPDFDocumentRef>
  // Phase 2
  setSelectionEnabled: (enabled: boolean) => void
  onSelectionChange?: (payload: { text: string; ranges: unknown }) => void
  onAnnotationEvent?: (event: 'add' | 'update' | 'delete', payload: unknown) => void
  // Phase 3
  thumbnailsOpen: boolean
  setThumbnailsOpen: (open: boolean) => void
}

function PDFViewerInner({
  onDocumentLoad,
  onPageChange,
  onZoomChange,
  forwardedRef,
  // Phase 2
  setSelectionEnabled,
  onSelectionChange,
  onAnnotationEvent,
  // Phase 3
  thumbnailsOpen,
  setThumbnailsOpen
}: PDFViewerInnerProps) {
  const zoom = useZoom()
  const scroll = useScroll()

  useEffect(() => {
    if (scroll.state.totalPages > 0) {
      onDocumentLoad?.(scroll.state.totalPages)
    }
  }, [scroll.state.totalPages, onDocumentLoad])

  useEffect(() => {
    if (scroll.state.currentPage >= 0) {
      onPageChange?.(scroll.state.currentPage + 1)
    }
  }, [scroll.state.currentPage, onPageChange])

  useEffect(() => {
    if (zoom.state.currentZoomLevel) {
      onZoomChange?.(zoom.state.currentZoomLevel)
    }
  }, [zoom.state.currentZoomLevel, onZoomChange])

  // Phase 2: Selection change callback (debounced when using real hook)
  useEffect(() => {
    // Placeholder effect to keep hook dependency consistent
  }, [onSelectionChange])

  // Phase 2: Annotation events callback
  useEffect(() => {
    // Placeholder effect to keep hook dependency consistent
  }, [onAnnotationEvent])

  useImperativeHandle(forwardedRef, () => ({
    zoomIn: () => {
      zoom.provides?.zoomIn()
    },
    zoomOut: () => {
      zoom.provides?.zoomOut()
    },
    setZoom: (level: number) => {
      zoom.provides?.requestZoom(level)
    },
    getZoom: () => {
      return zoom.state.currentZoomLevel || 1.0
    },
    goToPage: (page: number) => {
      scroll.scrollToPage?.({ pageNumber: page - 1 })
    },
    getCurrentPage: () => {
      return (scroll.currentPage || 0) + 1
    },

    // Phase 2: rotate (no-ops until rotate hook is installed)
    rotateClockwise: () => { console.warn('[EmbedPDF] Rotate plugin not installed') },
    rotateCounterClockwise: () => { console.warn('[EmbedPDF] Rotate plugin not installed') },
    setRotation: () => { console.warn('[EmbedPDF] Rotate plugin not installed') },

    // Phase 2: selection (no-ops until selection hook is installed)
    enableSelection: () => { setSelectionEnabled(true) /* and later: selection.provides?.enable?.() */ },
    disableSelection: () => { setSelectionEnabled(false) /* and later: selection.provides?.disable?.() */ },
    getSelectedText: () => null /* later: selection.state?.selectedText ?? null */,

    // Phase 2: annotations (no-ops until hook is installed)
    addHighlight: async () => { console.warn('[EmbedPDF] Annotations plugin not installed'); return Promise.resolve('') },
    deleteAnnotation: async () => { console.warn('[EmbedPDF] Annotations plugin not installed') },
    listAnnotations: async () => { console.warn('[EmbedPDF] Annotations plugin not installed'); return Promise.resolve([]) },

    // Phase 2: export (no-ops until export hook is installed)
    exportPage: async () => { console.warn('[EmbedPDF] Export plugin not installed'); return new Blob() },
    exportRange: async () => { console.warn('[EmbedPDF] Export plugin not installed'); return new Blob() },

    // Phase 3: thumbnails control
    setThumbnailsOpen: (open: boolean) => {
      setThumbnailsOpen(open)
    },
    getThumbnailsOpen: () => thumbnailsOpen,

    // Phase 3: capabilities detection
    getCapabilities: () => ({
      rotate: false,        // Will be true when rotate plugin installed
      selection: false,     // Will be true when selection plugin installed
      export: false,        // Will be true when export plugin installed
      annotations: false,   // Will be true when annotations plugin installed
      thumbnails: true      // Functional with ThumbnailPlugin
    })
  }), [zoom, scroll, thumbnailsOpen, setSelectionEnabled, setThumbnailsOpen])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Viewport
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#f5f5f5',
          overflow: 'auto'
        }}
      >
        <Scroller
          renderPage={({ width, height, pageIndex, scale }) => {
            const safeScale = Number.isFinite(scale) ? Math.min(Math.max(scale as number, 0.1), 5.0) : 1.0
            const w = Number.isFinite(width) && (width as number) > 0 ? (width as number) : 800
            const h = Number.isFinite(height) && (height as number) > 0 ? (height as number) : Math.round(w * 1.294)

            return (
                   <div
                     key={pageIndex}
                     style={{
                       width: `${width}px`,
                       height: `${height}px`,
                       position: 'relative'
                     }}
              >
                <RenderLayer
                  pageIndex={pageIndex}
                  scale={safeScale}
                  style={{
                    width: '100%',
                    height: '100%'
                  }}
                />

                {/* Overlays (invisible until plugin components mount) */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 10
                  }}
                >
                  {/* TODO: <SelectionLayer pageIndex={pageIndex} /> */}
                </div>

                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    pointerEvents: 'none',
                    zIndex: 20
                  }}
                >
                  {/* TODO: <AnnotationLayer pageIndex={pageIndex} /> */}
                </div>
              </div>
            )
          }}
        />
      </Viewport>
    </div>
  )
}

const EmbedPDFDocument = forwardRef<EmbedPDFDocumentRef, EmbedPDFDocumentProps>(({
  fileUrl,
  initialPage,
  onDocumentLoad,
  onPageChange,
  onZoomChange,
  onError,
  className = "",
  // Phase 2 defaults
  showThumbnails = false,
  onSelectionChange,
  onAnnotationEvent
}, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [engine, setEngine] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plugins, setPlugins] = useState<any[]>([])
  const [isReady, setIsReady] = useState(false)

  // Phase 2 state
  const [thumbnailsOpen, setThumbnailsOpen] = useState<boolean>(showThumbnails)
  const [, setSelectionEnabled] = useState<boolean>(false)

  // Capture initialPage on first mount to prevent re-initialization
  const initialPageRef = useRef(initialPage)

  // Phase 3: Sync showThumbnails prop to internal state
  useEffect(() => {
    setThumbnailsOpen(showThumbnails)
  }, [showThumbnails])

  useEffect(() => {
    const initEngine = async () => {
      try {
        setIsReady(false)
        setLoading(true)
        setError(null)

        const pdfiumEngine = await getPdfiumEngine()
        setEngine(pdfiumEngine)

        const loaderPlugin = createPluginRegistration(LoaderPluginPackage, {
          loadingOptions: {
            type: 'url',
            pdfFile: {
              id: `doc:${fileUrl}`,
              url: fileUrl,
            },
          },
        })

        const startPageZeroBased = Math.max(0, ((initialPageRef.current ?? 1) - 1))
        const pdfPlugins = [
          loaderPlugin,
          ...createEmbedPDFPlugins(startPageZeroBased)
        ]

        setPlugins(pdfPlugins)
        setLoading(false)
      } catch (err) {
        console.error('❌ [EmbedPDF] Initialization failed:', err)
        const errorMsg = err instanceof Error ? err.message : 'Failed to initialize PDF engine'
        setError(errorMsg)
        onError?.(errorMsg)
        setLoading(false)
      }
    }

    initEngine()
  }, [fileUrl, onError])

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading PDF engine...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center space-y-2">
          <div className="text-6xl">⚠️</div>
          <h3 className="font-bold text-lg">PDF Load Error</h3>
          <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        </div>
      </div>
    )
  }

  if (!engine || plugins.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-sm text-muted-foreground">PDF engine not available</p>
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <EmbedPDF
        key={fileUrl}
        engine={engine}
        plugins={plugins}
        onInitialized={async () => {
          setIsReady(true)
        }}
      >
        <div className="w-full h-full flex">
          {thumbnailsOpen && (
            <div className="hidden md:block w-[220px] shrink-0 border-r border-border/50 bg-card/60 backdrop-blur-sm overflow-auto">
               <ThumbnailsPane>
                 {({ pageIndex, width, height }) => (
                   <div
                     key={pageIndex}
                     style={{
                       width: `${width}px`,
                       height: `${height}px`,
                       position: 'relative'
                     }}
                   >
                     <RenderLayer
                       pageIndex={pageIndex}
                       scale={0.2}
                       style={{ width: '100%', height: '100%' }}
                     />
                  </div>
                )}
              </ThumbnailsPane>
            </div>
          )}

          <div className="flex-1 relative">
             {isReady && (
               <PDFViewerInner
                 forwardedRef={ref}
                 onDocumentLoad={onDocumentLoad}
                 onPageChange={onPageChange}
                 onZoomChange={onZoomChange}
                 setSelectionEnabled={setSelectionEnabled}
                 onSelectionChange={onSelectionChange}
                 onAnnotationEvent={onAnnotationEvent}
                 thumbnailsOpen={thumbnailsOpen}
                 setThumbnailsOpen={setThumbnailsOpen}
               />
             )}
          </div>
        </div>
      </EmbedPDF>
    </div>
  )
})

EmbedPDFDocument.displayName = 'EmbedPDFDocument'

export default EmbedPDFDocument
