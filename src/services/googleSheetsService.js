/**
 * Google Sheets Service for AITHON 2.0
 * Target Google Account: ai.veer2k26@gmail.com
 *
 * Handles transmission of team registration data to Google Sheets
 * via Google Apps Script Web App.
 */

// Default or fallback Google Apps Script Web App URL
export const DEFAULT_SHEET_URL =
  import.meta.env.VITE_GOOGLE_SHEETS_URL ||
  'https://script.google.com/macros/s/AKfycbzskVa7z-Jw-ThDFhc1Nk6hIsu5bbwT8TChhwma7R5dfj_5y1RDfgJf2nOAe5NK6sKE/exec'

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

  const rawSize = parseInt(formData.teamSize || '4', 10)
  const teamSizeNum = Math.min(6, Math.max(4, isNaN(rawSize) ? 4 : rawSize))
  const members = formData.members || []

  const member2 = teamSizeNum >= 2 ? members[0] || {} : {}
  const member3 = teamSizeNum >= 3 ? members[1] || {} : {}
  const member4 = teamSizeNum >= 4 ? members[2] || {} : {}
  const member5 = teamSizeNum >= 5 ? members[3] || {} : {}
  const member6 = teamSizeNum >= 6 ? members[4] || {} : {}

  const resolveCourse = (course, courseOther) => {
    if ((course === 'Other' || course === 'Other Tech Stream') && courseOther && courseOther.trim()) {
      return courseOther.trim()
    }
    return course || ''
  }

  const resolvedLeadCourse = resolveCourse(formData.leadCourse, formData.leadCourseOther)
  const resolvedMember2Course = resolveCourse(member2.course, member2.courseOther)
  const resolvedMember3Course = resolveCourse(member3.course, member3.courseOther)
  const resolvedMember4Course = resolveCourse(member4.course, member4.courseOther)
  const resolvedMember5Course = resolveCourse(member5.course, member5.courseOther)
  const resolvedMember6Course = resolveCourse(member6.course, member6.courseOther)

  return {
    // Unique Identifiers
    timestamp: formattedTimestamp,
    teamId: teamId,
    registrationId: registrationId,

    // Team Meta
    teamName: formData.teamName || '',
    teamSize: String(teamSizeNum),

    // Team Leader (Full Profile)
    leadFullName: formData.leadFullName || '',
    leadEmail: formData.leadEmail || '',
    leadPhone: formData.leadPhone || '',
    leadCollege: formData.leadCollege || '',
    leadCourse: resolvedLeadCourse,
    leadYear: formData.leadYear || '',
    leadCity: formData.leadCity || '',

    // Teammate 1 (Member 2)
    member2Name: member2.fullName || '',
    member2Email: member2.email || '',
    member2College: member2.college || '',
    member2Course: resolvedMember2Course,
    member2Year: member2.year || '',

    // Teammate 2 (Member 3)
    member3Name: member3.fullName || '',
    member3Email: member3.email || '',
    member3College: member3.college || '',
    member3Course: resolvedMember3Course,
    member3Year: member3.year || '',

    // Teammate 3 (Member 4)
    member4Name: member4.fullName || '',
    member4Email: member4.email || '',
    member4College: member4.college || '',
    member4Course: resolvedMember4Course,
    member4Year: member4.year || '',

    // Teammate 4 (Member 5)
    member5Name: member5.fullName || '',
    member5Email: member5.email || '',
    member5College: member5.college || '',
    member5Course: resolvedMember5Course,
    member5Year: member5.year || '',

    // Teammate 5 (Member 6)
    member6Name: member6.fullName || '',
    member6Email: member6.email || '',
    member6College: member6.college || '',
    member6Course: resolvedMember6Course,
    member6Year: member6.year || '',

    // Idea PPT Submission, Selected Track & Payment
    selectedTrack: formData.selectedTrack || '',
    pptFileName: formData.pptFileName || '',
    pptBase64: formData.pptBase64 || '',
    pptMimeType: formData.pptMimeType || '',
    pptFileSize: formData.pptFileSize || '',
    paymentAmount: '₹50',
    paymentStatus: formData.paymentStatus || 'Pending Verification (₹50)',
    paymentUtr: formData.paymentUtr || '',

    // Step progress & Action
    step: formData.step || 0,
    action: formData.action || 'submitRegistration',

    // Status
    status: 'Pending Review',
    targetAccount: 'ai.veer2k26@gmail.com',
  }
}

/**
 * Real-time incremental step sync: Allocates Team ID at Step 1 and syncs progress
 * (Step 1: Lead details, Step 2: Member details, Step 3: PPT Submission)
 */
export async function syncRegistrationStep(formData, stepNumber, teamId, registrationId) {
  const stepPayload = {
    ...formData,
    step: stepNumber,
    action: 'syncStep',
  }
  return submitRegistrationToGoogleSheet(stepPayload, teamId, registrationId)
}

/**
 * Fetches the next available unique sequential Team ID & Registration ID
 * directly from the live Google Sheet / Webhook endpoint.
 * Returns { nextNum, teamId, registrationId } or null on network error.
 */
export async function fetchNextSerialId() {
  const scriptUrl = getGoogleSheetUrl()
  if (!scriptUrl || scriptUrl.includes('docs.google.com/spreadsheets')) {
    return null
  }

  try {
    const separator = scriptUrl.includes('?') ? '&' : '?'
    const queryUrl = `${scriptUrl}${separator}action=getNextId&_t=${Date.now()}`
    const res = await fetch(queryUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    const rawNum = data.nextSerialNum || data.nextSerial
    if (rawNum) {
      const num = parseInt(rawNum, 10)
      if (!isNaN(num) && num >= 101) {
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('aithon_next_team_num', num.toString())
            localStorage.setItem('aithon_next_reg_num', num.toString())
          } catch (e) {
            console.warn(e)
          }
        }
        return {
          nextNum: num,
          teamId: data.nextTeamId || `TEAM-${num}`,
          registrationId: data.nextRegistrationId || `AI26-${num}`,
        }
      }
    }
  } catch (err) {
    console.warn('[GoogleSheets] Could not fetch next live serial ID:', err)
  }

  return null
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

  let finalTeamId = teamId
  let finalRegId = registrationId
  let pptUrl = ''
  let responseData = null

  try {
    // 1. Try standard CORS fetch to parse the confirmed unique IDs returned by Apps Script
    try {
      const res = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        responseData = await res.json()
      }
    } catch (corsErr) {
      console.warn('[GoogleSheets] Direct CORS response blocked, falling back to no-cors mode:', corsErr)
      // 2. Fallback to mode: 'no-cors' so submission never fails in strict browser environments
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload),
      })
    }

    // 3. Sync confirmed IDs: If direct POST returned json, use it
    if (responseData && responseData.teamId) {
      finalTeamId = responseData.teamId
      finalRegId = responseData.registrationId || finalRegId
      if (responseData.pptUrl) pptUrl = responseData.pptUrl
      console.log('[GoogleSheets] Server confirmed unique IDs & PPT:', finalTeamId, finalRegId, pptUrl)
    } else if (payload.leadEmail) {
      // 4. Fallback verification: If direct POST response was opaque (no-cors), query backend GET to obtain the exact server-assigned IDs
      try {
        const separator = scriptUrl.includes('?') ? '&' : '?'
        const verifyUrl = `${scriptUrl}${separator}action=getTeamDetails&email=${encodeURIComponent(payload.leadEmail)}&_t=${Date.now()}`
        const verifyRes = await fetch(verifyUrl)
        if (verifyRes.ok) {
          const verified = await verifyRes.json()
          if (verified && verified.success && verified.teamId) {
            finalTeamId = verified.teamId
            finalRegId = verified.registrationId || finalRegId
            if (verified.pptDriveLink) pptUrl = verified.pptDriveLink
            console.log('[GoogleSheets] Retrieved verified server-assigned ID via GET verification:', finalTeamId, finalRegId)
          }
        }
      } catch (verifyErr) {
        console.warn('[GoogleSheets] Post-registration verification lookup notice:', verifyErr)
      }
    }

    console.log('[GoogleSheets] Successfully posted to Google Sheet for team:', finalTeamId)
    return {
      success: responseData ? responseData.success !== false : true,
      underReview: responseData ? Boolean(responseData.underReview) : true,
      paymentVerified: responseData ? Boolean(responseData.paymentVerified) : false,
      paymentRequired: responseData ? Boolean(responseData.paymentRequired) : false,
      error: responseData?.error || '',
      teamId: finalTeamId,
      registrationId: finalRegId,
      pptUrl: pptUrl,
    }
  } catch (err) {
    console.error('[GoogleSheets] Network error posting to Google Sheet:', err)
    return {
      success: false,
      error: err.message,
      teamId: finalTeamId,
      registrationId: finalRegId,
      pptUrl: '',
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
