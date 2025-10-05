import { createPluginRegistration } from '@embedpdf/core'
import { RenderPluginPackage } from '@embedpdf/plugin-render'
import { ViewportPluginPackage } from '@embedpdf/plugin-viewport'
import { ScrollPluginPackage } from '@embedpdf/plugin-scroll'
import { InteractionManagerPluginPackage } from '@embedpdf/plugin-interaction-manager'
import { PanPluginPackage } from '@embedpdf/plugin-pan'
import { TilingPluginPackage } from '@embedpdf/plugin-tiling'
import { ZoomPluginPackage, ZoomMode } from '@embedpdf/plugin-zoom'

import { ThumbnailPluginPackage } from '@embedpdf/plugin-thumbnail'

// TODO: Install and import missing plugins when available:
// import { SelectionPluginPackage } from '@embedpdf/plugin-selection'
// import { AnnotationsPluginPackage } from '@embedpdf/plugin-annotations'
// import { RotatePluginPackage } from '@embedpdf/plugin-rotate'
// import { ExportPluginPackage } from '@embedpdf/plugin-export'

export interface EmbedPdfFeatureFlags {
  enableSelection?: boolean
  enableAnnotations?: boolean
  enableThumbnails?: boolean
}

export interface CreatePluginsOptions {
  scroll?: { bufferSize?: number; pageGap?: number }
  zoom?: { defaultZoomLevel?: ZoomMode; minZoom?: number; maxZoom?: number; zoomStep?: number }
  rotate?: { defaultRotation?: 0 | 90 | 180 | 270 }
  thumbnails?: { width?: number; quality?: number; showPageNumbers?: boolean }
  export?: { formats?: Array<'png' | 'jpeg' | 'pdf'>; imageQuality?: number; dpi?: number }
  tiling?: object /* tileSize?: number; cacheSize?: number; reserved for future */
}

const DEFAULT_OPTIONS: Required<CreatePluginsOptions> = {
  scroll: { bufferSize: 1, pageGap: 16 },
  zoom: { defaultZoomLevel: ZoomMode.FitPage, minZoom: 0.25, maxZoom: 3.0, zoomStep: 0.1 },
  rotate: { defaultRotation: 0 },
  thumbnails: { width: 140, quality: 0.7, showPageNumbers: true },
  export: { formats: ['png', 'jpeg', 'pdf'], imageQuality: 0.92, dpi: 144 },
  tiling: {}
}

/**
 * Build EmbedPDF plugins with proper order and options.
 * Note: initialPage is 0-based.
 * LoaderPlugin is created per-document elsewhere and appended there.
 */
export function createEmbedPDFPlugins(
  initialPage = 0,
  options: Partial<CreatePluginsOptions> = {}
) {
  const opts: CreatePluginsOptions = {
    scroll: { ...DEFAULT_OPTIONS.scroll, ...options.scroll },
    zoom: { ...DEFAULT_OPTIONS.zoom, ...options.zoom },
    rotate: { ...DEFAULT_OPTIONS.rotate, ...options.rotate },
    thumbnails: { ...DEFAULT_OPTIONS.thumbnails, ...options.thumbnails },
    export: { ...DEFAULT_OPTIONS.export, ...options.export },
    tiling: DEFAULT_OPTIONS.tiling
  }

  return [
    // 1) Viewport
    createPluginRegistration(ViewportPluginPackage, {}),

    // 2) Scroll
    createPluginRegistration(ScrollPluginPackage, {
      bufferSize: opts.scroll?.bufferSize,
      pageGap: opts.scroll?.pageGap,
      initialPage
    }),

    // 3) Render
    createPluginRegistration(RenderPluginPackage, {}),

    // 4) Interaction Manager
    createPluginRegistration(InteractionManagerPluginPackage, {}),

    // 5) Zoom
    createPluginRegistration(ZoomPluginPackage, {
      defaultZoomLevel: opts.zoom?.defaultZoomLevel,
      minZoom: opts.zoom?.minZoom,
      maxZoom: opts.zoom?.maxZoom,
      zoomStep: opts.zoom?.zoomStep
    }),

    // 6) Pan
    createPluginRegistration(PanPluginPackage, {}),

    // TODO: 7) Selection (when plugin available)
    // ...(enabled.enableSelection ? [createPluginRegistration(SelectionPluginPackage, {})] : []),

    // TODO: 8) Annotations (when plugin available)
    // ...(enabled.enableAnnotations ? [createPluginRegistration(AnnotationsPluginPackage, {})] : []),

    // 7) Thumbnail
    createPluginRegistration(ThumbnailPluginPackage, {
      width: opts.thumbnails?.width
    }),

    // TODO: 9) Rotate (when plugin available)
    // createPluginRegistration(RotatePluginPackage, {
    //   defaultRotation: opts.rotate?.defaultRotation
    // }),

    // TODO: 10) Export (when plugin available)
    // createPluginRegistration(ExportPluginPackage, {
    //   formats: opts.export?.formats,
    //   imageQuality: opts.export?.imageQuality,
    //   dpi: opts.export?.dpi
    // }),

    // 11) Tiling (keep last)
    createPluginRegistration(TilingPluginPackage, {})
  ]
}


/**
 * Performance configuration (for future use)
 */
export const EMBEDPDF_PERFORMANCE = {
  enableWebGL: true,
  enableOffscreenCanvas: true,
  prefetchPages: 2
}
