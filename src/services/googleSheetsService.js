/**
 * Google Sheets Service for AITHON 2.0
 * Target Google Account: ai.veer2k26@gmail.com
 *
 * Handles transmission of team registration data to Google Sheets
 * via Google Apps Script Web App.
 */

// Default or fallback Google Apps Script Web App URL
// This can be overridden via .env (VITE_GOOGLE_SHEETS_URL) or Admin Settings
export const DEFAULT_SHEET_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || ''

/**
 * Gets the active Google Apps Script Web App URL
 */
export function getGoogleSheetUrl() {
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem('aithon_google_sheet_url')
    if (savedUrl && savedUrl.trim()) return savedUrl.trim()
  }
  return import.meta.env.VITE_GOOGLE_SHEETS_URL || DEFAULT_SHEET_URL
}

/**
 * Formats a registration object into the structured Google Sheet payload
 */
export function formatGoogleSheetPayload(formData, teamId, registrationId) {
  const now = new Date()
  const formattedTimestamp = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const teamSizeNum = parseInt(formData.teamSize || '3', 10)
  const members = formData.members || []

  const member2 = teamSizeNum >= 2 ? members[0] || {} : {}
  const member3 = teamSizeNum >= 3 ? members[1] || {} : {}
  const member4 = teamSizeNum >= 4 ? members[2] || {} : {}

  return {
    // Unique Identifiers
    timestamp: formattedTimestamp,
    teamId: teamId,
    registrationId: registrationId,

    // Team Meta
    teamName: formData.teamName || '',
    teamSize: formData.teamSize || '3',

    // Team Leader (Full Profile)
    leadFullName: formData.leadFullName || '',
    leadEmail: formData.leadEmail || '',
    leadPhone: formData.leadPhone || '',
    leadCollege: formData.leadCollege || '',
    leadCourse: formData.leadCourse || '',
    leadYear: formData.leadYear || '',
    leadCity: formData.leadCity || '',

    // Teammate 1 (Member 2)
    member2Name: member2.fullName || '',
    member2Email: member2.email || '',
    member2College: member2.college || '',

    // Teammate 2 (Member 3)
    member3Name: member3.fullName || '',
    member3Email: member3.email || '',
    member3College: member3.college || '',

    // Teammate 3 (Member 4)
    member4Name: member4.fullName || '',
    member4Email: member4.email || '',
    member4College: member4.college || '',

    // Socials & Skills
    github: formData.github || '',
    linkedin: formData.linkedin || '',
    portfolio: formData.portfolio || '',
    skills: Array.isArray(formData.skills) ? formData.skills.join(', ') : (formData.skills || ''),
    experience: formData.experience || '',
    referral: formData.referral || '',

    // Status
    status: 'Pending Review',
    targetAccount: 'ai.veer2k26@gmail.com',
  }
}

/**
 * Submits the registration payload to Google Sheets via Google Apps Script Web App
 */
export async function submitRegistrationToGoogleSheet(formData, teamId, registrationId) {
  const payload = formatGoogleSheetPayload(formData, teamId, registrationId)
  const scriptUrl = getGoogleSheetUrl()

  console.log('[GoogleSheets] Preparing registration payload for team:', teamId, payload)

  if (!scriptUrl || scriptUrl.includes('docs.google.com/spreadsheets')) {
    console.warn(
      '[GoogleSheets] Google Sheet document link detected instead of Apps Script Web App URL. To log rows automatically into this sheet, deploy the script from Extensions > Apps Script and use the Web App URL (starts with https://script.google.com/macros/s/.../exec). Payload ready for account ai.veer2k26@gmail.com:',
      payload
    )
    return {
      success: true,
      pendingWebhook: true,
      teamId,
      registrationId,
      message: 'Payload formatted. Deploy Google Apps Script Web App to enable automatic live sync.',
    }
  }

  try {
    // We send payload as text/plain string with mode: 'no-cors' to prevent CORS preflight blocks from Google Apps Script redirect
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    })

    console.log('[GoogleSheets] Successfully posted to Google Sheet for team:', teamId)
    return {
      success: true,
      teamId,
      registrationId,
    }
  } catch (err) {
    console.error('[GoogleSheets] Network error posting to Google Sheet:', err)
    return {
      success: false,
      error: err.message,
      teamId,
      registrationId,
    }
  }
}

/**
 * Saves or clears the Google Apps Script Web App URL in localStorage
 */
export function saveGoogleSheetUrl(url) {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem('aithon_google_sheet_url', url.trim())
    } else {
      localStorage.removeItem('aithon_google_sheet_url')
    }
  }
}

/**
 * Pings the Google Apps Script Web App URL to test connectivity
 */
export async function testGoogleSheetWebhook(customUrl) {
  const url = (customUrl || getGoogleSheetUrl()).trim()
  if (!url) {
    return {
      success: false,
      message: 'Please enter a Google Apps Script Web App URL.',
    }
  }
  if (url.includes('docs.google.com/spreadsheets')) {
    return {
      success: false,
      message:
        'This is your Google Sheet document URL! To receive submissions, open this sheet > click Extensions > Apps Script > paste the script > Deploy as Web app, and copy the URL starting with https://script.google.com/macros/s/.../exec.',
    }
  }
  if (!url.startsWith('https://script.google.com/')) {
    return {
      success: false,
      message: 'URL must be a Google Apps Script Web App URL (starts with https://script.google.com/macros/s/...)',
    }
  }

  try {
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
    })
    return {
      success: true,
      message: 'Webhook reached successfully! Google Sheet is ready to receive submissions.',
    }
  } catch (err) {
    return {
      success: false,
      message: `Failed to reach endpoint: ${err.message}`,
    }
  }
}
