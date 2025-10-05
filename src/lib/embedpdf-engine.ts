import { init } from '@embedpdf/pdfium'
import { PdfiumEngine } from '@embedpdf/engines/pdfium'

/**
 * Initialize PDFium WASM engine for EmbedPDF
 * This creates the engine instance needed by the <EmbedPDF> component
 */
export async function createPdfiumEngine() {
  try {
    console.log('1️⃣ Starting PDFium WASM initialization...')

    // Initialize PDFium WASM module with local file
    const wrappedModule = await init({
      locateFile: (path: string) => {
        if (path.endsWith('.wasm')) {
          return '/pdfium.wasm'
        }
        return path
      }
    })

    console.log('2️⃣ WASM module loaded:', {
      hasPdfium: !!wrappedModule.pdfium,
      moduleType: typeof wrappedModule
    })

    // Create and return the PDFium engine
    const engine = new PdfiumEngine(wrappedModule)

    console.log('3️⃣ PDFium engine created:', {
      hasInitialize: typeof engine.initialize === 'function',
      engineType: engine.constructor.name
    })

    return engine
  } catch (error) {
    console.error('❌ Failed to initialize PDFium engine:', error)
    throw new Error(`PDFium engine initialization failed: ${error}`)
  }
}

/**
 * Singleton engine instance for reuse across components
 */
let engineInstance: PdfiumEngine | null = null

export async function getPdfiumEngine() {
  if (!engineInstance) {
    engineInstance = await createPdfiumEngine()
  }
  return engineInstance
}
