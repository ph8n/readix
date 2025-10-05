# 📋 Complete EmbedPDF Integration Plan

## **Overview**
Transition from react-pdf to full EmbedPDF integration, leveraging all available plugins except rotate, print, and spread. This plan provides a comprehensive step-by-step guide to complete the migration.

## **Current State Analysis**

**Old Components to Remove:**
- ✅ `react-pdf` and `@types/react-pdf` npm packages (currently installed)
- ✅ No actual usage of react-pdf found (good!)
- ⚠️ `PageNavigationOverlay.tsx` - Separate navigation overlay (can be kept or integrated)

**EmbedPDF Components (Keep & Complete):**
- ✅ `EmbedPDFDocument.tsx` - Core wrapper (needs completion)
- ✅ `embedpdf-engine.ts` - PDFium engine singleton
- ✅ `embedpdf-config.ts` - Plugin config (currently unused)

**Main Reader Component:**
- ⚠️ `PDFReader.tsx` - Uses EmbedPDFDocument but has manual controls that need integration

## **Phase 1: Cleanup & Foundation**

### Task 1: Remove react-pdf dependencies
- **File:** `package.json`
- **Action:** Remove `react-pdf` and `@types/react-pdf` from dependencies
- **Why:** Eliminates old PDF library, prevents conflicts

### Task 2: Update embedpdf-config.ts with all plugins
- **File:** `src/lib/embedpdf-config.ts`
- **Action:**
  - Add ALL EmbedPDF plugins except rotate, print, spread
  - Include: Loader, Viewport, Scroll, Render, Zoom, Pan, InteractionManager, Tiling, Toolbar, Search, Thumbnails, Annotations
  - Verify plugin order matches dependency requirements
  - Export reusable plugin factory function
- **Why:** Centralize plugin configuration, avoid duplication

### Task 27: Install dependencies
- **Command:** `npm install`
- **Why:** Clean node_modules after removing react-pdf

---

## **Phase 2: Complete EmbedPDF Integration**

### Task 3: Add EmbedPDF hooks to EmbedPDFDocument.tsx
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:** Import and use:
  - `useZoom` from `@embedpdf/plugin-zoom/react`
  - `useScroll` from `@embedpdf/plugin-scroll/react`
  - `useDocument` from `@embedpdf/core/react`
  - `useToolbar` from `@embedpdf/plugin-toolbar/react` (if available)
  - `useSearch` from `@embedpdf/plugin-search/react` (if available)
- **Why:** Access EmbedPDF internal state for controls

### Task 4: Implement zoom ref methods
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:** In `useImperativeHandle`:
  - `zoomIn()` → call `zoom.zoomIn()`
  - `zoomOut()` → call `zoom.zoomOut()`
  - `setZoom(level)` → call `zoom.setZoom(level)`
  - `getZoom()` → return `zoom.currentZoom`
- **Why:** Enable PDFReader to control zoom via ref

### Task 5: Implement goToPage ref method
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:** In `useImperativeHandle`:
  - `goToPage(page)` → call `scroll.scrollToPage(page - 1)` (0-indexed)
  - `getCurrentPage()` → return `scroll.currentPage + 1`
- **Why:** Enable PDFReader to control navigation via ref

### Task 6: Fix onDocumentLoad page count
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:** In `handleDocumentLoad`:
  - Get page count from `document.pageCount`
  - Call `onDocumentLoad?.(pageCount)` with actual value
- **Why:** Parent component needs accurate page count

### Task 7: Wire up onPageChange callback
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:**
  - Add `useEffect` watching `scroll.currentPage`
  - Call `onPageChange?.(scroll.currentPage + 1)` on change
- **Why:** Notify parent when user scrolls to new page

### Task 8: Wire up onZoomChange callback
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:**
  - Add `useEffect` watching `zoom.currentZoom`
  - Call `onZoomChange?.(zoom.currentZoom)` on change
- **Why:** Notify parent when zoom level changes

### Task 9: Use centralized plugin config
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:**
  - Import `EMBEDPDF_PLUGINS` from `@/lib/embedpdf-config`
  - Remove inline plugin creation
  - Merge LoaderPlugin with config plugins (since it needs fileUrl)
- **Why:** DRY principle, easier to maintain

---

## **Phase 3: Refactor PDFReader**

### Task 10: Remove manual zoom state
- **File:** `src/components/reader/PDFReader.tsx`
- **Action:**
  - Remove `const [zoom, setZoom] = useState(1.0)`
  - Get zoom from `onZoomChange` callback only for display
  - Remove manual `setZoom` in zoom handlers
- **Why:** EmbedPDF manages zoom state internally

### Task 11: Remove manual page state
- **File:** `src/components/reader/PDFReader.tsx`
- **Action:**
  - Keep `currentPage` for display, but as derived state
  - Remove manual `setCurrentPage` in navigation handlers
  - Let `onPageChange` callback update display state
- **Why:** EmbedPDF manages page state internally

### Task 12: Simplify navigation controls
- **File:** `src/components/reader/PDFReader.tsx`
- **Action:**
  - `goToPreviousPage` → just call `embedPdfRef.current?.goToPage(currentPage - 1)`
  - `goToNextPage` → just call `embedPdfRef.current?.goToPage(currentPage + 1)`
  - `handlePageChange` → just call `embedPdfRef.current?.goToPage(newPage)`
  - Remove conditional logic (EmbedPDF handles bounds)
- **Why:** Single source of truth for navigation

### Task 13: Integrate EmbedPDF Toolbar plugin
- **File:** `src/components/reader/PDFReader.tsx`
- **Action:**
  - Replace custom header controls with EmbedPDF Toolbar
  - Configure toolbar with zoom, navigation, and other controls
  - Remove duplicate UI elements
- **Why:** Use native, consistent UI components

### Task 14: Evaluate scroll mode toggle
- **Action:**
  - Check if EmbedPDF ScrollPlugin has mode switching API
  - Check for continuous vs paginated scroll options
- **Why:** Determine if custom toggle needed or can use native

### Task 15: Integrate EmbedPDF scroll modes
- **File:** `src/components/reader/PDFReader.tsx` (if available)
- **Action:**
  - Replace `scrollMode` state with EmbedPDF scroll mode API
  - Update `toggleScrollMode` to use EmbedPDF API
- **Why:** Use native functionality instead of custom logic

---

## **Phase 4: Add Advanced Features**

### Task 31: Integrate Search plugin
- **File:** `src/components/reader/ReadingSidebar.tsx`
- **Action:**
  - Add search input to sidebar
  - Use EmbedPDF Search plugin hooks
  - Display search results with highlighting
- **Why:** Enable text search within PDFs

### Task 32: Integrate Thumbnails plugin
- **File:** `src/components/reader/ReadingSidebar.tsx`
- **Action:**
  - Add thumbnails panel to sidebar
  - Use EmbedPDF Thumbnails plugin
  - Enable click-to-navigate
- **Why:** Provide page preview navigation

### Task 33: Integrate Annotations plugin
- **File:** `src/components/reader/EmbedPDFDocument.tsx`
- **Action:**
  - Add annotations support
  - Enable highlighting and notes
  - Persist annotations to database
- **Why:** Allow users to annotate PDFs

---

## **Phase 5: Testing**

### Task 16: Test zoom functionality
- **Actions:**
  - Click zoom in/out buttons
  - Use +/- keyboard shortcuts
  - Verify zoom display updates correctly
  - Test reset zoom (0 key)
- **Expected:** Smooth zoom with accurate percentage display

### Task 17: Test page navigation
- **Actions:**
  - Click prev/next buttons
  - Use arrow keys (paginated mode)
  - Jump to specific page
  - Scroll through document (continuous mode)
- **Expected:** Page counter updates, navigation is smooth

### Task 18: Test reading progress tracking
- **Actions:**
  - Navigate to different pages
  - Wait 2 seconds for auto-save
  - Refresh page or navigate away and back
- **Expected:** Returns to last read page

### Task 19: Test keyboard shortcuts
- **Actions:**
  - Test all keyboard shortcuts: arrows, s, z, +, -, 0, Escape
  - Verify no conflicts with EmbedPDF defaults
- **Expected:** All shortcuts work as intended

### Task 34: Test search functionality
- **Actions:**
  - Search for text in PDF
  - Navigate to search results
  - Verify highlighting works
- **Expected:** Accurate search results with proper highlighting

### Task 35: Test thumbnails navigation
- **Actions:**
  - Click thumbnail to navigate to page
  - Verify current page highlighting
- **Expected:** Smooth navigation via thumbnails

### Task 28: Run build
- **Command:** `npm run build`
- **Expected:** No TypeScript errors, successful build

### Task 29: Run lint
- **Command:** `npm run lint`
- **Expected:** No linting errors

### Task 30: End-to-end test
- **Actions:**
  - Upload new PDF
  - Open for reading
  - Test all features: zoom, navigation, sidebar, zen mode, search, thumbnails
  - Test on mobile viewport
  - Test performance with large PDF
- **Expected:** Smooth, bug-free experience

---

## **Phase 6: Optimization & Cleanup**

### Task 20: Evaluate PageNavigationOverlay
- **File:** `src/components/reader/PageNavigationOverlay.tsx`
- **Decision options:**
  1. **Keep** if it provides unique UX value
  2. **Remove** if redundant with header controls
  3. **Integrate** into EmbedPDF toolbar if using native UI
- **Recommendation:** Remove (redundant with bottom dock controls)

### Task 21: Evaluate read layout
- **File:** `src/app/dashboard/read/layout.tsx`
- **Current:** Just wraps children in `<div className="min-h-screen bg-background">`
- **Decision:** Remove if PDFReader handles its own layout
- **Alternative:** Keep if needed for future layout features

---

## **Phase 7: Documentation & Future**

### Task 25: Add comprehensive comments
- **Files:**
  - `src/components/reader/EmbedPDFDocument.tsx`
  - `src/lib/embedpdf-config.ts`
  - `src/lib/embedpdf-engine.ts`
- **Action:** Add JSDoc comments explaining architecture

### Task 26: Update design docs
- **File:** `DESIGN_PLAN.md`
- **Action:** Document EmbedPDF integration approach and plugin usage

### Task 36: Research additional plugins
- **Action:** Monitor EmbedPDF releases for new plugins
- **Future:** Bookmarks, outline, layers, etc.

---

## **EmbedPDF Plugins to Include**

**Core Plugins (Required):**
- ✅ LoaderPlugin - Document loading
- ✅ ViewportPlugin - Viewport management
- ✅ ScrollPlugin - Scrolling behavior
- ✅ RenderPlugin - PDF rendering
- ✅ InteractionManagerPlugin - User interactions

**UI/UX Plugins:**
- ✅ ZoomPlugin - Zoom controls
- ✅ PanPlugin - Pan/drag functionality
- ✅ TilingPlugin - Performance optimization
- ✅ ToolbarPlugin - Native UI controls

**Advanced Features:**
- ✅ SearchPlugin - Text search
- ✅ ThumbnailsPlugin - Page previews
- ✅ AnnotationsPlugin - Highlighting/notes

**Excluded (as requested):**
- ❌ RotatePlugin
- ❌ PrintPlugin
- ❌ SpreadPlugin

---

## **Execution Order Summary**

```
Phase 1: Foundation
  └─ Tasks 1, 2, 27 (remove deps, config, install)

Phase 2: Core Integration
  └─ Tasks 3-9 (hooks, ref methods, callbacks, config)

Phase 3: Refactor
  └─ Tasks 10-15 (simplify PDFReader, remove duplicate state)

Phase 4: Advanced Features
  └─ Tasks 31-33 (search, thumbnails, annotations)

Phase 5: Quality Assurance
  └─ Tasks 16-19, 34-35, 28-30 (test everything thoroughly)

Phase 6: Cleanup
  └─ Tasks 20-21 (remove redundant components)

Phase 7: Future (Optional)
  └─ Tasks 25-26, 36 (research plugins, document)
```

---

## **Critical Success Criteria**

✅ **No TypeScript errors** after refactoring
✅ **All zoom controls work** (UI buttons + keyboard)
✅ **All navigation works** (buttons + keyboard + scroll)
✅ **Page tracking accurate** (display + progress save)
✅ **No react-pdf dependency** remains
✅ **Build succeeds** without errors
✅ **Reading experience smooth** and performant
✅ **All plugins integrated** except rotate/print/spread
✅ **Search, thumbnails, annotations** working

---

**Ready to execute when you disable plan mode!** 🚀</content>
</xai:function_call/>
<xai:function_call name="read">
<parameter name="filePath">/Users/dp/Public/readix/src/lib/embedpdf-config.ts