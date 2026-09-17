/**
 * Form Draft Storage Utility for AITHON 2.0 Registration
 *
 * Persistently stores user progress across browser sessions (even after days or browser restarts).
 * Uses localStorage for form fields & metadata, and IndexedDB for large presentation files (PPT/PPTX)
 * to prevent browser quota limit crashes.
 */

const STORAGE_KEY = 'aithon_registration_progress_v2'
const IDB_NAME = 'aithon_draft_db'
const IDB_STORE = 'ppt_drafts'
const IDB_KEY = 'latest_ppt_file'

/**
 * Open or initialize IndexedDB for draft files
 */
function openDraftDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null)
      return
    }
    try {
      const request = window.indexedDB.open(IDB_NAME, 1)
      request.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE)
        }
      }
      request.onsuccess = (e) => resolve(e.target.result)
      request.onerror = () => resolve(null) // Gracefully fallback to null
    } catch (e) {
      resolve(null)
    }
  })
}

/**
 * Save PPT binary/base64 file data safely in IndexedDB
 */
export async function savePptFileToDraft(pptData) {
  if (!pptData || !pptData.pptBase64) return
  const db = await openDraftDB()
  if (!db) return
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite')
      const store = tx.objectStore(IDB_STORE)
      store.put(pptData, IDB_KEY)
      tx.oncomplete = () => resolve(true)
      tx.onerror = () => resolve(false)
    } catch (e) {
      resolve(false)
    }
  })
}

/**
 * Retrieve PPT file data from IndexedDB
 */
export async function loadPptFileFromDraft() {
  const db = await openDraftDB()
  if (!db) return null
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly')
      const store = tx.objectStore(IDB_STORE)
      const req = store.get(IDB_KEY)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    } catch (e) {
      resolve(null)
    }
  })
}

/**
 * Delete PPT file data from IndexedDB
 */
export async function clearPptFileFromDraft() {
  const db = await openDraftDB()
  if (!db) return
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite')
      const store = tx.objectStore(IDB_STORE)
      store.delete(IDB_KEY)
      tx.oncomplete = () => resolve(true)
      tx.onerror = () => resolve(false)
    } catch (e) {
      resolve(false)
    }
  })
}

/**
 * Save registration progress to persistent storage.
 * Automatically separates large PPT base64 data to IndexedDB.
 */
export async function saveRegistrationDraft({
  formData,
  currentStep,
  maxStepReached,
  step4View,
  teamId,
  registrationId,
  drivePptUrl,
  paymentConfirmed,
}) {
  if (typeof window === 'undefined') return

  try {
    // If PPT has large base64 data, store it in IndexedDB and omit huge payload from localStorage
    let pptBase64Payload = formData.pptBase64 || ''
    let formDataToSave = { ...formData }

    if (pptBase64Payload) {
      // Save full file info to IndexedDB
      savePptFileToDraft({
        pptBase64: pptBase64Payload,
        pptFileName: formData.pptFileName,
        pptFileSize: formData.pptFileSize,
        pptMimeType: formData.pptMimeType,
        pptUploadedAt: formData.pptUploadedAt,
      }).catch(() => {})

      // Keep small preview/status in formDataToSave, but don't blow localStorage quota
      if (pptBase64Payload.length > 500000) {
        formDataToSave.pptBase64 = '' // Will be rehydrated from IndexedDB on load
        formDataToSave.pptHasStoredPayload = true
      }
    }

    const payload = {
      formData: formDataToSave,
      currentStep: currentStep || 1,
      maxStepReached: Math.max(maxStepReached || 1, currentStep || 1),
      step4View: step4View || 'review',
      teamId: teamId || '',
      registrationId: registrationId || '',
      drivePptUrl: drivePptUrl || '',
      paymentConfirmed: Boolean(paymentConfirmed),
      savedAt: Date.now(),
      version: 2,
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    return true
  } catch (err) {
    console.warn('[formDraftStorage] Error saving draft to localStorage:', err)
    // If localStorage quota was exceeded, try saving without any file strings
    try {
      const trimmedFormData = {
        ...formData,
        pptBase64: '',
      }
      const fallbackPayload = {
        formData: trimmedFormData,
        currentStep: currentStep || 1,
        maxStepReached: Math.max(maxStepReached || 1, currentStep || 1),
        step4View: step4View || 'review',
        teamId: teamId || '',
        registrationId: registrationId || '',
        drivePptUrl: drivePptUrl || '',
        paymentConfirmed: Boolean(paymentConfirmed),
        savedAt: Date.now(),
        version: 2,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackPayload))
      return true
    } catch (fallbackErr) {
      console.error('[formDraftStorage] Critical draft save failure:', fallbackErr)
      return false
    }
  }
}

/**
 * Load saved registration progress.
 * Asynchronously rehydrates PPT base64 from IndexedDB if needed.
 */
export async function loadRegistrationDraft() {
  if (typeof window === 'undefined') return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const draft = JSON.parse(raw)
    if (!draft || !draft.formData) return null

    // If there was a file stored in IndexedDB, rehydrate it
    if (draft.formData.pptHasStoredPayload || (!draft.formData.pptBase64 && draft.formData.pptFileName)) {
      try {
        const pptData = await loadPptFileFromDraft()
        if (pptData && pptData.pptBase64) {
          draft.formData.pptBase64 = pptData.pptBase64
          if (!draft.formData.pptFileName) draft.formData.pptFileName = pptData.pptFileName
          if (!draft.formData.pptFileSize) draft.formData.pptFileSize = pptData.pptFileSize
          if (!draft.formData.pptMimeType) draft.formData.pptMimeType = pptData.pptMimeType
          if (!draft.formData.pptUploadedAt) draft.formData.pptUploadedAt = pptData.pptUploadedAt
        }
      } catch (e) {
        console.warn('[formDraftStorage] Could not rehydrate PPT file from IndexedDB:', e)
      }
    }

    return draft
  } catch (err) {
    console.warn('[formDraftStorage] Error parsing draft:', err)
    return null
  }
}

/**
 * Clear saved registration progress completely (e.g. upon form completion or reset)
 */
export async function clearRegistrationDraft() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem('aithon_allocated_team_id')
    sessionStorage.removeItem('aithon_allocated_reg_id')
  } catch (e) {}

  try {
    await clearPptFileFromDraft()
  } catch (e) {}
}

/**
 * Formats a saved timestamp into an intuitive relative or date string
 */
export function formatSavedTime(timestamp) {
  if (!timestamp) return 'Just now'
  const diffMs = Date.now() - timestamp
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 10) return 'Just now'
  if (diffSec < 60) return `${diffSec}s ago`
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay === 1) return 'Yesterday'
  if (diffDay < 7) return `${diffDay} days ago`

  return new Date(timestamp).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  })
}
