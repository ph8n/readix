/**
 * Simple localStorage utility for PDF page restoration
 * Industry-standard pattern for resume-reading feature
 */

const STORAGE_KEY_PREFIX = 'pdf_last_page_'
const STORAGE_KEY_VERSION = 'v1_' // For future migrations if needed

interface PageStorageEntry {
  page: number
  timestamp: number
  documentId: string
}

/**
 * Save last read page to localStorage
 * @param documentId - Unique document identifier
 * @param page - Current page number (1-indexed)
 */
export function saveLastPage(documentId: string, page: number): void {
  if (typeof window === 'undefined') return // SSR safety

  try {
    const key = `${STORAGE_KEY_PREFIX}${STORAGE_KEY_VERSION}${documentId}`
    const entry: PageStorageEntry = {
      page,
      timestamp: Date.now(),
      documentId
    }
    localStorage.setItem(key, JSON.stringify(entry))
    console.debug('[PageStorage] Saved page', { documentId, page })
  } catch (e) {
    console.warn('[PageStorage] Failed to save:', e)
    // Fail silently - localStorage might be disabled
  }
}

/**
 * Get last read page from localStorage
 * @param documentId - Unique document identifier
 * @returns Page number or null if not found
 */
export function getLastPage(documentId: string): number | null {
  if (typeof window === 'undefined') return null // SSR safety

  try {
    const key = `${STORAGE_KEY_PREFIX}${STORAGE_KEY_VERSION}${documentId}`
    const stored = localStorage.getItem(key)

    if (!stored) {
      console.debug('[PageStorage] No stored page for', documentId)
      return null
    }

    const entry: PageStorageEntry = JSON.parse(stored)

    // Validate entry
    if (!entry.page || entry.page < 1) {
      console.warn('[PageStorage] Invalid stored page:', entry)
      return null
    }

    console.debug('[PageStorage] Retrieved page', { documentId, page: entry.page })
    return entry.page
  } catch (e) {
    console.warn('[PageStorage] Failed to read:', e)
    return null
  }
}

/**
 * Clear stored page for a document
 * @param documentId - Unique document identifier
 */
export function clearLastPage(documentId: string): void {
  if (typeof window === 'undefined') return

  try {
    const key = `${STORAGE_KEY_PREFIX}${STORAGE_KEY_VERSION}${documentId}`
    localStorage.removeItem(key)
    console.debug('[PageStorage] Cleared page for', documentId)
  } catch (e) {
    console.warn('[PageStorage] Failed to clear:', e)
  }
}

/**
 * Get all stored PDF pages (for debugging/admin)
 */
export function getAllStoredPages(): Record<string, number> {
  if (typeof window === 'undefined') return {}

  try {
    const result: Record<string, number> = {}
    const prefix = `${STORAGE_KEY_PREFIX}${STORAGE_KEY_VERSION}`

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(prefix)) {
        const stored = localStorage.getItem(key)
        if (stored) {
          const entry: PageStorageEntry = JSON.parse(stored)
          result[entry.documentId] = entry.page
        }
      }
    }

    return result
  } catch (e) {
    console.warn('[PageStorage] Failed to get all:', e)
    return {}
  }
}