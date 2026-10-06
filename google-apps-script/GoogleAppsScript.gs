/**
 * ============================================================================
 * AITHON 2.0 — Google Sheets Registration Sync, Drive PPT Storage & Email Dispatch
 * Target Google Account: shivaji.wathore@avcoe.org
 * ============================================================================
 * 
 * PPT FOLDER LINK:
 * https://drive.google.com/drive/folders/1vSfgU8HnOmDrt9we13ZnHAktIqeQ8os1pzXRvKw3PDxMREplpa8l6FBLspayXfynJiqJAw7R?usp=drive_link
 * 
 * FEATURES IN THIS VERSION:
 * 1. 📁 PPT Upload: Automatically saved to Google Drive and renamed as Team ID (TEAM-XXX.pptx).
 * 2. 📊 47-Column Google Sheet Structure with Column 43 "PPT Status" (Accepted / Rejected / Pending Review).
 * 3. 📧 Automated Evaluation Emails:
 *    - ACCEPTED: Sends Round 2 confirmation email with NON-EDITABLE payment link
 *      calculated strictly as Team Members × ₹200 (4 = ₹800, 5 = ₹1000, 6 = ₹1200).
 *    - REJECTED: Sends encouraging evaluation feedback & participation certificate email.
 * 4. 🚀 Spreadsheet Menu: "🚀 AITHON 2.0" added directly to Google Sheets toolbar for 1-click
 *    header setup, dropdown validation, and batch email processing!
 * ============================================================================
 */

// Target Google Drive Folder where accepted PPTs are stored
var PPT_FOLDER_ID = "1vSfgU8HnOmDrt9we13ZnHAktIqeQ8os1pzXRvKw3PDxMREplpa8l6FBLspayXfynJiqJAw7R";

// Target Google Spreadsheet ID (Active Sheet)
var SPREADSHEET_ID = "1wV96WZBPiKUyA08BrL9d8dqwXcxRFDDQKHUdXvhx-rM";

// Official WhatsApp Community Group link for Team Leaders
var WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/HRvMvxxB2NUIvw5zMiTsQ9";

// UPI VPA for Direct Payments & QR Codes
var UPI_VPA = "9404665180@centralbank";

// Official Website Domain (used to generate private Grand Finale payment portal link in acceptance emails)
// Update this to your deployed domain (e.g. "https://aithon2026.vercel.app") or custom domain
var WEBSITE_URL = "https://aithon2-0.xyz";

// Official AITHON 2.0 Brand Logo for Email Headers
var LOGO_IMAGE_URL = "https://aithon2-0.xyz/aithon-hero-logo.png";

/**
 * ROUND 2 / GRAND FINALE FINAL PAYMENT FORM & FEE STRUCTURE:
 * - 4 Members = ₹800 (4 × ₹200)
 * - 5 Members = ₹1,000 (5 × ₹200)
 * - 6 Members = ₹1,200 (6 × ₹200)
 * UPI VPA: 9404665180@centralbank
 * Official Final Payment Google Form URL:
 */
var ROUND_2_PAYMENT_FORM_URL = "https://forms.gle/4dNxoKjjRLjti7og7";
var ROUND_2_PAYMENT_LINKS = {
  4: ROUND_2_PAYMENT_FORM_URL,
  5: ROUND_2_PAYMENT_FORM_URL,
  6: ROUND_2_PAYMENT_FORM_URL
};

/**
 * ============================================================================
 * 🛡️ SECURITY & ANTI-HACK SUITE (CWE-1236, Anti-Hijack, Anti-Scraping, Anti-Fraud)
 * ============================================================================
 */

// 1. Sanitize text for Google Sheets to prevent CSV / Formula Injection
function sanitizeForSheet(val) {
  if (val === null || val === undefined) return "-";
  var s = String(val).trim();
  if (s === "") return "-";
  // Strip control characters & null bytes
  s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Prefix formula trigger characters (=, +, -, @, tab, cr) with apostrophe
  var first = s.charAt(0);
  if (first === "=" || first === "+" || first === "-" || first === "@" || first === "\t" || first === "\r") {
    // Preserve valid numbers or solo hyphen
    if (s === "-" || /^-?\d+(\.\d+)?$/.test(s)) {
      return s;
    }
    return "'" + s;
  }
  return s;
}

// 2. Validate email structure server-side
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

// 3. Mask PII for public querying (Prevents scraping attacks)
function maskPhone(phone) {
  var p = String(phone || "").replace(/[^0-9]/g, "");
  if (p.length < 4) return "******";
  return "******" + p.slice(-4);
}

function maskEmail(email) {
  var e = String(email || "").trim().toLowerCase();
  var atIdx = e.indexOf("@");
  if (atIdx <= 1) return "***@***";
  var user = e.substring(0, atIdx);
  var domain = e.substring(atIdx + 1);
  var maskedUser = user.length <= 2 ? user.charAt(0) + "*" : user.substring(0, 2) + "***";
  return maskedUser + "@" + domain;
}

// 4. Check for duplicate UPI UTR reference number across all teams
function isDuplicateUtr(sheet, utr, currentRowNum, utrColIndex) {
  if (!sheet || !utr) return false;
  var clean = String(utr).replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (clean.length < 6 || clean === "-" || clean.indexOf("PENDING") !== -1) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  var vals = sheet.getRange(2, utrColIndex, lastRow - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) {
    var row = i + 2;
    if (row === currentRowNum) continue;
    var existing = String(vals[i][0] || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (existing === clean) {
      return true;
    }
  }
  return false;
}

// Comprehensive 50-Column Header Structure for AITHON 2.0
var HEADERS = [
  "Timestamp",                 // Col 1 (A)
  "Team ID",                   // Col 2 (B) - Serial ID (e.g. TEAM-101)
  "Registration ID",           // Col 3 (C) - Serial ID (e.g. AI25-101)
  "Team Name",                 // Col 4 (D)
  "Team Size",                 // Col 5 (E) - 4 to 6 members
  "Leader Full Name",          // Col 6 (F)
  "Leader Email",              // Col 7 (G)
  "Leader Phone",              // Col 8 (H)
  "Leader College",            // Col 9 (I)
  "Leader Course / Branch",    // Col 10 (J)
  "Leader Year",               // Col 11 (K)
  "Leader City",               // Col 12 (L)
  "Member 2 Name",             // Col 13 (M)
  "Member 2 Email",            // Col 14 (N)
  "Member 2 College",          // Col 15 (O)
  "Member 2 Course",           // Col 16 (P)
  "Member 2 Year",             // Col 17 (Q)
  "Member 3 Name",             // Col 18 (R)
  "Member 3 Email",            // Col 19 (S)
  "Member 3 College",          // Col 20 (T)
  "Member 3 Course",           // Col 21 (U)
  "Member 3 Year",             // Col 22 (V)
  "Member 4 Name",             // Col 23 (W)
  "Member 4 Email",            // Col 24 (X)
  "Member 4 College",          // Col 25 (Y)
  "Member 4 Course",           // Col 26 (Z)
  "Member 4 Year",             // Col 27 (AA)
  "Member 5 Name",             // Col 28 (AB)
  "Member 5 Email",            // Col 29 (AC)
  "Member 5 College",          // Col 30 (AD)
  "Member 5 Course",           // Col 31 (AE)
  "Member 5 Year",             // Col 32 (AF)
  "Member 6 Name",             // Col 33 (AG)
  "Member 6 Email",            // Col 34 (AH)
  "Member 6 College",          // Col 35 (AI)
  "Member 6 Course",           // Col 36 (AJ)
  "Member 6 Year",             // Col 37 (AK)
  "Selected Domain",           // Col 38 (AL) - 1. Software / 2. Hardware
  "Selected Track",            // Col 39 (AM) - Competition Track (1 of 23 Tracks)
  "PPT Drive Link",            // Col 40 (AN) - Direct Google Drive URL (Named as Team ID)
  "Original PPT File Name",    // Col 41 (AO)
  "Evaluation Fee (₹50)",      // Col 42 (AP) - ₹50
  "Eval Fee Status",           // Col 43 (AQ) - Dropdown: Pending Verification / Verified / Rejected
  "Eval Payment UTR",          // Col 44 (AR) - Only Payment ID / UTR, No Dropdown
  "PPT Status",                // Col 45 (AS) - Selection / Rejection (Accepted / Rejected / Pending Review)
  "Round 2 Fee Amount",        // Col 46 (AT) - Calculated: Team Size × 200 (₹800, ₹1000, ₹1200)
  "Round 2 Payment Link",      // Col 47 (AU) - Non-Editable Payment Link
  "Round 2 Payment Status",    // Col 48 (AV) - Dropdown: Pending Verification / Verified / Rejected
  "Round 2 Payment UTR",       // Col 49 (AW) - Only Payment ID / UTR, No Dropdown
  "Email Notification Status"  // Col 50 (AX) - Tracks email sent date/time to prevent duplicate emails
];

/**
/**
 * Helper to identify if a sheet is the registration submissions sheet
 * Matches 'Registrations', 'Sheet1', or checks headers in Row 1
 */
function isRegistrationSheet(sheet) {
  if (!sheet) return false;
  var name = sheet.getName().toLowerCase().trim();
  // Filter out non-registration auxiliary sheets
  if (name.indexOf("unmatched") !== -1 || name.indexOf("summary") !== -1 || name.indexOf("analytic") !== -1 || name.indexOf("log") !== -1) {
    return false;
  }
  if (name === "registrations" || name === "sheet1" || name.indexOf("registration") !== -1 || name.indexOf("response") !== -1) {
    return true;
  }
  // Check headers in row 1
  try {
    var lastCol = Math.min(sheet.getLastColumn(), 50);
    if (lastCol > 0) {
      var headerText = sheet.getRange(1, 1, 1, lastCol).getValues()[0].join(" ").toLowerCase();
      if (headerText.indexOf("ppt status") !== -1 || headerText.indexOf("eval fee status") !== -1 || headerText.indexOf("team id") !== -1) {
        return true;
      }
    }
  } catch (e) {}
  // Default fallback: first tab in workbook
  return sheet.getIndex() === 1;
}

/**
 * Robust Dynamic Column Resolver:
 * Scans Row 1 headers to dynamically match column positions regardless of shifts or tab naming.
 */
function getSheetColumnIndexes(sheet) {
  var lastCol = Math.max(sheet.getLastColumn(), 50);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  function findCol(keywords, fallback) {
    for (var i = 0; i < headers.length; i++) {
      var h = String(headers[i] || "").trim().toLowerCase();
      for (var k = 0; k < keywords.length; k++) {
        var key = keywords[k].toLowerCase();
        if (h === key || h.indexOf(key) !== -1) {
          return i + 1; // 1-based index
        }
      }
    }
    return fallback;
  }

  var evalFeeStatusCol = findCol(["eval fee status", "fee status", "registration payment status", "eval status"], 43);
  var evalUtrCol = findCol(["eval payment utr", "eval utr", "payment utr"], 44);
  var pptStatusCol = findCol(["ppt status", "presentation status", "selection status", "round 1 status"], 45);
  var round2FeeCol = findCol(["round 2 fee amount", "round 2 fee", "finale fee"], 46);
  var round2LinkCol = findCol(["round 2 payment link", "round 2 link", "finale link"], 47);
  var round2StatusCol = findCol(["round 2 payment status", "round 2 status", "finale payment status", "finale status"], 48);
  var round2UtrCol = findCol(["round 2 payment utr", "round 2 utr", "finale utr"], 49);
  var emailStatusCol = findCol(["email notification status", "email status", "notification status"], 50);

  var domainCol = findCol(["selected domain", "domain"], 38);
  var trackCol = findCol(["selected track", "track"], 39);
  var pptLinkCol = findCol(["ppt drive link", "ppt link", "drive link"], 40);
  var pptFileNameCol = findCol(["original ppt file name", "ppt file name"], 41);
  var evalFeeCol = findCol(["evaluation fee (₹50)", "evaluation fee", "eval fee"], 42);

  var teamIdCol = findCol(["team id"], 2);
  var regIdCol = findCol(["registration id", "reg id"], 3);
  var teamNameCol = findCol(["team name"], 4);
  var teamSizeCol = findCol(["team size", "size"], 5);
  var leadNameCol = findCol(["leader full name", "lead name", "leader name"], 6);
  var leadEmailCol = findCol(["leader email", "lead email", "email"], 7);
  var leadPhoneCol = findCol(["leader phone", "lead phone", "phone", "contact"], 8);
  var leadCollegeCol = findCol(["leader college", "lead college", "college"], 9);

  return {
    hasDomain: domainCol > 0,
    totalCols: Math.max(lastCol, 50),
    domainCol: domainCol,
    domainIdx: domainCol - 1,
    trackCol: trackCol,
    trackIdx: trackCol - 1,
    pptLinkCol: pptLinkCol,
    pptLinkIdx: pptLinkCol - 1,
    pptFileNameCol: pptFileNameCol,
    pptFileNameIdx: pptFileNameCol - 1,
    evalFeeCol: evalFeeCol,
    evalFeeIdx: evalFeeCol - 1,
    evalFeeStatusCol: evalFeeStatusCol,
    evalFeeStatusIdx: evalFeeStatusCol - 1,
    evalUtrCol: evalUtrCol,
    evalUtrIdx: evalUtrCol - 1,
    pptStatusCol: pptStatusCol,
    pptStatusIdx: pptStatusCol - 1,
    round2FeeCol: round2FeeCol,
    round2FeeIdx: round2FeeCol - 1,
    round2LinkCol: round2LinkCol,
    round2LinkIdx: round2LinkCol - 1,
    round2StatusCol: round2StatusCol,
    round2StatusIdx: round2StatusCol - 1,
    round2UtrCol: round2UtrCol,
    round2UtrIdx: round2UtrCol - 1,
    emailStatusCol: emailStatusCol,
    emailStatusIdx: emailStatusCol - 1,
    teamIdCol: teamIdCol,
    teamIdIdx: teamIdCol - 1,
    regIdCol: regIdCol,
    regIdIdx: regIdCol - 1,
    teamNameCol: teamNameCol,
    teamNameIdx: teamNameCol - 1,
    teamSizeCol: teamSizeCol,
    teamSizeIdx: teamSizeCol - 1,
    leadNameCol: leadNameCol,
    leadNameIdx: leadNameCol - 1,
    leadEmailCol: leadEmailCol,
    leadEmailIdx: leadEmailCol - 1,
    leadPhoneCol: leadPhoneCol,
    leadPhoneIdx: leadPhoneCol - 1,
    leadCollegeCol: leadCollegeCol,
    leadCollegeIdx: leadCollegeCol - 1
  };
}

function getTargetSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }
  } catch (err) {
    Logger.log("Fallback to active spreadsheet: " + err.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Returns the official Google Form link for Round 2 / Grand Finale Final Payment
 * Dispatched inside the Acceptance Email and recorded in Sheet Column 46
 */
function getRound2PaymentLink(teamSize, teamId, leadEmail, teamName, leadName, selectedTrack, phone) {
  return ROUND_2_PAYMENT_FORM_URL;
}

/**
 * Generates non-editable UPI URI where 'am' strictly locks amount in Google Pay / PhonePe / Paytm
 */
function getRound2UpiUri(teamSize, teamId) {
  var size = parseInt(teamSize, 10) || 4;
  var amount = size * 200;
  var note = (teamId || "AITHON") + " Round 2 Entry Fee";
  return "upi://pay?pa=" + encodeURIComponent(UPI_VPA) +
         "&pn=" + encodeURIComponent("AITHON 2.0 AVCOE") +
         "&am=" + amount +
         "&cu=INR" +
         "&tn=" + encodeURIComponent(note);
}

/**
 * Handles incoming POST requests from the Registration Form
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for concurrent requests
    lock.waitLock(30000);
  } catch (lockErr) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Server busy. Please try again in a few seconds."
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    if (!e || !e.postData || !e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "No POST payload received"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(e.postData.contents);
    var ss = getTargetSpreadsheet();
    if (!ss) {
      throw new Error("Target Google Spreadsheet could not be opened.");
    }

    var sheet = ss.getSheetByName("Registrations");
    if (!sheet) {
      sheet = ss.getActiveSheet();
      if (sheet.getName() === "Sheet1") {
        sheet.setName("Registrations");
      }
    }

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      setupSheet(sheet);
    }

    // =========================================================================
    // ⚡ 1. MANUAL / DIRECT ROUND 2 PAYMENT CONFIRMATION (via UTR / Form Action)
    // =========================================================================
    if (data.action === "confirmRound2Payment") {
      return handleDirectRound2Confirmation(data, sheet);
    }

    // =========================================================================
    // 🛡️ 2. ATOMIC REAL-TIME REGISTRATION ALLOCATION & ROW SYNC
    // =========================================================================
    // Check if this team has already started registration / drafting in the sheet
    var existingRow = findTeamRow(sheet, data.teamId, data.leadEmail);

    if (existingRow !== -1) {
      // Team already exists in the sheet - preserve their allocated IDs!
      var sheetTeamId = String(sheet.getRange(existingRow, 2).getValue() || "").trim();
      var sheetRegId = String(sheet.getRange(existingRow, 3).getValue() || "").trim();
      if (sheetTeamId && sheetTeamId !== "-" && sheetTeamId.indexOf("HOLD") === -1) {
        data.teamId = sheetTeamId;
      }
      if (sheetRegId && sheetRegId !== "-" && sheetRegId.indexOf("HOLD") === -1) {
        data.registrationId = sheetRegId;
      }
      Logger.log("✓ Real-time updating existing row " + existingRow + " for " + data.teamId);
    } else {
      // First time starting registration: Atomically allocate the next serial ID under ScriptLock!
      var nextSerial = getLiveNextSerial(sheet);
      data.teamId = "TEAM-" + nextSerial;
      data.registrationId = "AI26-" + nextSerial;
      Logger.log("🛡️ Atomically allocated new Team ID: " + data.teamId + " (" + data.registrationId + ")");
    }

    // 🛡️ SECURITY: Server-side email format validation
    if (data.leadEmail && !isValidEmail(data.leadEmail)) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Invalid email format for Team Leader."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 📁 STORE PPT IN GOOGLE DRIVE & RENAME AUTOMATICALLY AS TEAM ID
    var pptDriveUrl = "-";
    if (data.pptBase64 && String(data.pptBase64).trim() !== "") {
      try {
        var folder;
        try {
          folder = DriveApp.getFolderById(PPT_FOLDER_ID);
        } catch (fErr) {
          Logger.log("Could not open PPT_FOLDER_ID (" + PPT_FOLDER_ID + "): " + fErr.toString() + ". Falling back to AITHON 2.0 PPT Submissions folder.");
          var folders = DriveApp.getFoldersByName("AITHON 2.0 PPT Submissions");
          if (folders.hasNext()) {
            folder = folders.next();
          } else {
            folder = DriveApp.createFolder("AITHON 2.0 PPT Submissions");
            try {
              folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
            } catch (shareFolderErr) {}
          }
        }
        var base64Data = String(data.pptBase64);
        
        if (base64Data.indexOf("base64,") !== -1) {
          base64Data = base64Data.split("base64,")[1];
        }

        // 🛡️ SECURITY: Restrict file upload size to 25MB
        if (base64Data.length > 35 * 1024 * 1024) {
          throw new Error("File size exceeds 25MB limit.");
        }

        // 🛡️ SECURITY: Whitelist ONLY presentation & document extensions
        var ext = ".pptx";
        if (data.pptFileName) {
          var dotIdx = data.pptFileName.lastIndexOf(".");
          if (dotIdx !== -1) {
            var rawExt = data.pptFileName.substring(dotIdx).toLowerCase();
            if (rawExt === ".pptx" || rawExt === ".ppt" || rawExt === ".pdf") {
              ext = rawExt;
            }
          }
        }

        var driveFileName = data.teamId + ext;
        var mimeType = ext === ".pdf" ? "application/pdf" : (data.pptMimeType || "application/vnd.openxmlformats-officedocument.presentationml.presentation");

        var decodedBytes = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decodedBytes, mimeType, driveFileName);
        var driveFile = folder.createFile(blob);

        try {
          driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        } catch (shareErr) {
          Logger.log("Sharing permission warning: " + shareErr.toString());
        }

        pptDriveUrl = driveFile.getUrl();
        data.pptDriveUrl = pptDriveUrl;
        Logger.log("✓ Saved PPT to Drive: " + driveFileName + " -> " + pptDriveUrl);

      } catch (driveErr) {
        Logger.log("Google Drive upload error: " + driveErr.toString());
        pptDriveUrl = "Upload error: " + driveErr.toString();
      }
    } else if (existingRow !== -1) {
      // If PPT was already uploaded previously, preserve existing Drive link & filename
      var existingPpt = String(sheet.getRange(existingRow, 39).getValue() || "").trim();
      var existingFileName = String(sheet.getRange(existingRow, 40).getValue() || "").trim();
      if (existingPpt && existingPpt !== "-") {
        pptDriveUrl = existingPpt;
        if (!data.pptFileName && existingFileName) {
          data.pptFileName = existingFileName;
        }
      }
    }

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");
    var cleanPhone = data.leadPhone ? String(data.leadPhone).replace(/[^0-9]/g, "") : "";
    var phone = cleanPhone ? "'" + cleanPhone : "";

    // Automatically resolve specified course/branch if 'Other' was selected
    var leadCourse = (data.leadCourse === "Other" && data.leadCourseOther) ? data.leadCourseOther : (data.leadCourse || "N/A");
    var member2Course = (data.member2Course === "Other" && data.member2CourseOther) ? data.member2CourseOther : (data.member2Course || "-");
    var member3Course = (data.member3Course === "Other" && data.member3CourseOther) ? data.member3CourseOther : (data.member3Course || "-");
    var member4Course = (data.member4Course === "Other" && data.member4CourseOther) ? data.member4CourseOther : (data.member4Course || "-");
    var member5Course = (data.member5Course === "Other" && data.member5CourseOther) ? data.member5CourseOther : (data.member5Course || "-");
    var member6Course = (data.member6Course === "Other" && data.member6CourseOther) ? data.member6CourseOther : (data.member6Course || "-");

    // 🛡️ SECURITY: Server-side strictly clamped team size (4 to 6)
    var rawSize = parseInt(data.teamSize, 10) || 4;
    var teamSizeNum = Math.min(6, Math.max(4, rawSize));
    var round2FeeAmount = "₹" + (teamSizeNum * 200);
    var round2Link = getRound2PaymentLink(
      teamSizeNum,
      data.teamId,
      data.leadEmail,
      data.teamName,
      data.leadFullName,
      data.selectedTrack,
      data.leadPhone
    );

    // Auto-migrate sheet if it was a 49-column sheet missing "Selected Domain"
    var cols = getSheetColumnIndexes(sheet);
    if (!cols.hasDomain) {
      sheet.insertColumnBefore(38);
      sheet.getRange(1, 38).setValue("Selected Domain");
      sheet.setColumnWidth(38, 140);
      cols = getSheetColumnIndexes(sheet);
    }

    var rawDomain = String(data.selectedDomain || "Software").trim();
    var selectedDomain = (rawDomain.toLowerCase().indexOf("hard") !== -1) ? "Hardware" : "Software";

    // 🛡️ SUBMISSION & REAL-TIME STATUS RECORDING
    var utrStr = data.paymentUtr ? String(data.paymentUtr).trim() : "";
    if (!utrStr && existingRow !== -1) {
      var prevUtr = String(sheet.getRange(existingRow, cols.evalUtrCol).getValue() || "").trim().replace(/^'/, "");
      if (prevUtr && prevUtr !== "-") {
        utrStr = prevUtr;
      }
    }

    // 🛡️ SECURITY: Prevent duplicate UPI UTR reference numbers across teams
    if (utrStr && utrStr.length >= 6) {
      if (isDuplicateUtr(sheet, utrStr, existingRow, cols.evalUtrCol)) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "SECURITY ALERT: The UPI UTR '" + utrStr + "' has already been registered by another team. Duplicate transactions are not accepted."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    var stepNum = parseInt(data.step, 10) || 0;
    var evalFeeStatus = "Pending Verification";
    if (utrStr && utrStr.length >= 6) {
      evalFeeStatus = "Pending Verification";
    } else if (stepNum > 0 && stepNum < 4) {
      evalFeeStatus = "In Progress (Step " + stepNum + ")";
    }

    var pptStatusCol = "Pending Review";
    if (existingRow !== -1) {
      var prevPptStatus = String(sheet.getRange(existingRow, cols.pptStatusCol).getValue() || "").trim();
      if (prevPptStatus && prevPptStatus !== "-") {
        pptStatusCol = prevPptStatus;
      }
    }

    var emailSentCol = "Not Sent (Pending Manual Verification)";
    if (existingRow !== -1) {
      var prevEmailStatus = String(sheet.getRange(existingRow, cols.emailStatusCol).getValue() || "").trim();
      if (prevEmailStatus && prevEmailStatus.indexOf("Verified") !== -1) {
        emailSentCol = prevEmailStatus;
      }
    }

    // 50-column row with Formula Injection (CWE-1236) defense applied to every cell
    var row = [
      timestamp,                                       // Col 1: Timestamp
      sanitizeForSheet(data.teamId),                   // Col 2: Team ID
      sanitizeForSheet(data.registrationId),           // Col 3: Registration ID
      sanitizeForSheet(data.teamName),                 // Col 4: Team Name
      teamSizeNum,                                     // Col 5: Team Size (strictly 4-6)
      sanitizeForSheet(data.leadFullName),             // Col 6: Leader Full Name
      sanitizeForSheet(data.leadEmail),                // Col 7: Leader Email
      phone,                                           // Col 8: Leader Phone
      sanitizeForSheet(data.leadCollege),              // Col 9: Leader College
      sanitizeForSheet(leadCourse),                    // Col 10: Leader Course
      sanitizeForSheet(data.leadYear),                 // Col 11: Leader Year
      sanitizeForSheet(data.leadCity),                 // Col 12: Leader City
      sanitizeForSheet(data.member2Name),              // Col 13: Member 2 Name
      sanitizeForSheet(data.member2Email),             // Col 14: Member 2 Email
      sanitizeForSheet(data.member2College),           // Col 15: Member 2 College
      sanitizeForSheet(member2Course),                 // Col 16: Member 2 Course
      sanitizeForSheet(data.member2Year),              // Col 17: Member 2 Year
      sanitizeForSheet(data.member3Name),              // Col 18: Member 3 Name
      sanitizeForSheet(data.member3Email),             // Col 19: Member 3 Email
      sanitizeForSheet(data.member3College),           // Col 20: Member 3 College
      sanitizeForSheet(member3Course),                 // Col 21: Member 3 Course
      sanitizeForSheet(data.member3Year),              // Col 22: Member 3 Year
      sanitizeForSheet(data.member4Name),              // Col 23: Member 4 Name
      sanitizeForSheet(data.member4Email),             // Col 24: Member 4 Email
      sanitizeForSheet(data.member4College),           // Col 25: Member 4 College
      sanitizeForSheet(member4Course),                 // Col 26: Member 4 Course
      sanitizeForSheet(data.member4Year),              // Col 27: Member 4 Year
      sanitizeForSheet(data.member5Name),              // Col 28: Member 5 Name
      sanitizeForSheet(data.member5Email),             // Col 29: Member 5 Email
      sanitizeForSheet(data.member5College),           // Col 30: Member 5 College
      sanitizeForSheet(member5Course),                 // Col 31: Member 5 Course
      sanitizeForSheet(data.member5Year),              // Col 32: Member 5 Year
      sanitizeForSheet(data.member6Name),              // Col 33: Member 6 Name
      sanitizeForSheet(data.member6Email),             // Col 34: Member 6 Email
      sanitizeForSheet(data.member6College),           // Col 35: Member 6 College
      sanitizeForSheet(member6Course),                 // Col 36: Member 6 Course
      sanitizeForSheet(data.member6Year),              // Col 37: Member 6 Year
      sanitizeForSheet(selectedDomain),                // Col 38: Selected Domain
      sanitizeForSheet(data.selectedTrack || "General AI Track"), // Col 39: Selected Track
      pptDriveUrl,                                     // Col 40: PPT Drive Link
      sanitizeForSheet(data.pptFileName),              // Col 41: Original PPT File Name
      "₹50",                                           // Col 42: Evaluation Fee (₹50)
      evalFeeStatus,                                   // Col 43: Eval Fee Status
      utrStr ? ("'" + utrStr) : "-",                   // Col 44: Eval Payment UTR
      pptStatusCol,                                    // Col 45: PPT Status
      round2FeeAmount,                                 // Col 46: Round 2 Fee Amount
      round2Link,                                      // Col 47: Round 2 Payment Link
      "Pending Verification",                          // Col 48: Round 2 Payment Status
      "-",                                             // Col 49: Round 2 Payment UTR
      emailSentCol                                     // Col 50: Email Notification Status
    ];

    var targetRow = existingRow !== -1 ? existingRow : getNextAvailableRow(sheet);
    sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);

    if (existingRow !== -1) {
      Logger.log("✓ Real-time updated row " + existingRow + " for " + data.teamId);
    } else {
      Logger.log("✓ Real-time allocated & wrote row " + targetRow + " for " + data.teamId);
    }

    var rowRange = sheet.getRange(targetRow, 1, 1, row.length);
    rowRange.setVerticalAlignment("middle");
    rowRange.setFontFamily("Plus Jakarta Sans");
    rowRange.setFontSize(10);

    // Style and apply dropdown validations
    try {
      if (cols.domainCol !== -1) {
        var domainRule = SpreadsheetApp.newDataValidation()
          .requireValueInList(["Software", "Hardware"], true)
          .setAllowInvalid(true)
          .setHelpText("Select 'Software' or 'Hardware'.")
          .build();
        sheet.getRange(targetRow, cols.domainCol).setDataValidation(domainRule);
      }

      var evalRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
        .setAllowInvalid(true)
        .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
        .build();
      sheet.getRange(targetRow, cols.evalFeeStatusCol).setDataValidation(evalRule);
      if (evalFeeStatus === "Pending Verification") {
        sheet.getRange(targetRow, cols.evalFeeStatusCol).setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");
      } else {
        sheet.getRange(targetRow, cols.evalFeeStatusCol).setBackground("#f1f5f9").setFontColor("#475569").setFontWeight("normal");
      }

      // Strictly ensure Eval Payment UTR has NO dropdown and is formatted as Plain Text
      sheet.getRange(targetRow, cols.evalUtrCol).clearDataValidations();
      sheet.getRange(targetRow, cols.evalUtrCol).setNumberFormat("@");

      // Set Round 2 Payment Status dropdown
      var r2Rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
        .setAllowInvalid(true)
        .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
        .build();
      sheet.getRange(targetRow, cols.round2StatusCol).setDataValidation(r2Rule);

      // Strictly ensure Round 2 Payment UTR has NO dropdown and is formatted as Plain Text
      sheet.getRange(targetRow, cols.round2UtrCol).clearDataValidations();
      sheet.getRange(targetRow, cols.round2UtrCol).setNumberFormat("@");
    } catch (styleErr) {}

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      allocated: existingRow === -1,
      updated: existingRow !== -1,
      underReview: evalFeeStatus === "Pending Verification",
      paymentVerified: false,
      message: existingRow === -1
        ? "Team ID allocated successfully and synced to sheet."
        : "Registration details updated in real time.",
      teamId: data.teamId,
      registrationId: data.registrationId,
      pptUrl: pptDriveUrl,
      round2Fee: round2FeeAmount
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("doPost critical error: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Handles GET requests to check health and fetch live next serial IDs
 */
function doGet(e) {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss ? ss.getSheetByName("Registrations") : null;

    // ⚡ 1. Direct GET-based Round 2 payment submission (High-reliability fallback)
    if (e && e.parameter && e.parameter.action === "confirmRound2Payment") {
      return handleDirectRound2Confirmation(e.parameter, sheet);
    }

    // ⚡ 2. Sheet Compactor & Blank Row Cleaner (Requires secret token to prevent unauthenticated triggering)
    if (e && e.parameter && (e.parameter.action === "compactSheet" || e.parameter.action === "cleanSheet")) {
      var token = String(e.parameter.token || "").trim();
      if (token !== "AITHON26_ADMIN_SECURE_TOKEN") {
        return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Unauthorized access: maintenance token required" })).setMimeType(ContentService.MimeType.JSON);
      }
      var compactResult = compactAndCleanSheet(sheet);
      return ContentService.createTextOutput(JSON.stringify(compactResult)).setMimeType(ContentService.MimeType.JSON);
    }

    // ⚡ 3. Check for next available serial ID query (e.g. action=getNextId)
    if (e && e.parameter && (e.parameter.action === "getNextId" || e.parameter.action === "nextSerial")) {
      var nextSerial = sheet ? getLiveNextSerial(sheet) : 101;
      return ContentService.createTextOutput(JSON.stringify({
        status: "active",
        nextSerial: nextSerial,
        nextSerialNum: nextSerial,
        nextTeamId: "TEAM-" + nextSerial,
        nextRegistrationId: "AI26-" + nextSerial,
        timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a")
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Check if client is looking up team details for the Grand Finale Payment Portal
    // 🛡️ SECURITY: Sensitive PII (phone, email, drive link, raw UTR) is masked to prevent bulk scraping
    if (e && e.parameter && (e.parameter.action === "getTeamDetails" || e.parameter.teamId || e.parameter.email || e.parameter.utr)) {
      var queryTeamId = String(e.parameter.teamId || e.parameter.id || "").trim().toUpperCase();
      var queryEmail = String(e.parameter.email || e.parameter.leadEmail || "").trim().toLowerCase();
      var queryUtr = String(e.parameter.utr || e.parameter.paymentUtr || "").trim().replace(/[^A-Za-z0-9]/g, "");
      var cleanQuery = queryTeamId.replace(/[^A-Z0-9]/gi, "");

      if (sheet && (queryTeamId || queryEmail || queryUtr || cleanQuery)) {
        var lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          var cols = getSheetColumnIndexes(sheet);
          var rows = sheet.getRange(2, 1, lastRow - 1, cols.totalCols).getValues();
          for (var i = rows.length - 1; i >= 0; i--) {
            var r = rows[i];
            var rTeamId = String(r[1] || "").trim().toUpperCase();
            var rRegId = String(r[2] || "").trim().toUpperCase();
            var rEmail = String(r[6] || "").trim().toLowerCase();
            var rUtr = String(r[cols.evalUtrIdx] || "").trim().replace(/[^A-Za-z0-9]/g, "");
            var cleanRTeam = rTeamId.replace(/[^A-Z0-9]/gi, "");
            var cleanRReg = rRegId.replace(/[^A-Z0-9]/gi, "");

            var isMatch = false;
            if (queryEmail && rEmail === queryEmail) {
              isMatch = true;
            } else if (queryTeamId) {
              if (rTeamId === queryTeamId || rRegId === queryTeamId) {
                isMatch = true;
              } else if (cleanQuery && (cleanRTeam === cleanQuery || cleanRReg === cleanQuery)) {
                isMatch = true;
              }
            } else if (queryUtr && rUtr && rUtr === queryUtr) {
              isMatch = true;
            }

            if (isMatch) {
              var size = parseInt(r[4], 10) || 4;
              if (size < 4) size = 4;
              if (size > 6) size = 6;
              var finaleFee = size * 200;
              return ContentService.createTextOutput(JSON.stringify({
                success: true,
                teamId: r[1],
                registrationId: r[2],
                teamName: r[3],
                teamSize: size,
                leadFullName: r[5],
                leadEmail: maskEmail(r[6]),
                leadPhone: maskPhone(r[7]),
                leadCollege: r[8] || "",
                selectedDomain: cols.hasDomain ? (r[cols.domainIdx] || "Software") : "Software",
                selectedTrack: r[cols.trackIdx] || "General AI Track",
                evalFee: r[cols.evalFeeIdx] || "₹50",
                evalFeeStatus: r[cols.evalFeeStatusIdx] || "Pending Verification",
                pptStatus: r[cols.pptStatusIdx] || "Pending Review",
                round2FeeAmount: finaleFee,
                round2PaymentLink: r[cols.round2LinkIdx] || "",
                round2PaymentStatus: r[cols.round2StatusIdx] || "Pending Verification",
                round2PaymentUtr: r[cols.round2UtrIdx] && String(r[cols.round2UtrIdx]).trim() !== "-" ? "SUBMITTED" : "-",
                ticketSent: String(r[cols.emailStatusIdx] || "").indexOf("Finale Ticket Sent") !== -1
              })).setMimeType(ContentService.MimeType.JSON);
            }
          }
        }
      }
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Team not found"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var nextSerial = sheet ? getLiveNextSerial(sheet) : 101;

    return ContentService.createTextOutput(JSON.stringify({
      status: "active",
      service: "AITHON 2.0 Registration & PPT Drive Webhook",
      account: "shivaji.wathore@avcoe.org",
      nextSerial: nextSerial,
      nextSerialNum: nextSerial,
      nextTeamId: "TEAM-" + nextSerial,
      nextRegistrationId: "AI26-" + nextSerial,
      pptFolderId: PPT_FOLDER_ID,
      columnsCount: HEADERS.length,
      timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a")
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Finds existing row number (1-indexed) for a team by Team ID or Leader Email.
 * Prioritizes matching BOTH Team ID and Email, then Team ID, then Email.
 */
function findTeamRow(sheet, teamId, email) {
  if (!sheet) return -1;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return -1;

  var targetTeamId = teamId ? String(teamId).trim().toUpperCase() : "";
  var targetEmail = email ? String(email).trim().toLowerCase() : "";

  if (targetTeamId.indexOf("HOLD") !== -1 || targetTeamId.indexOf("XXX") !== -1) {
    targetTeamId = "";
  }

  if (!targetTeamId && !targetEmail) return -1;

  var values = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  // 1. Highest priority: Match BOTH Team ID and Leader Email (100% exact authorized match)
  if (targetTeamId && targetEmail) {
    for (var i = values.length - 1; i >= 0; i--) {
      var rTeam = String(values[i][1] || "").trim().toUpperCase();
      var rEmail = String(values[i][6] || "").trim().toLowerCase();
      if (rTeam === targetTeamId && rEmail === targetEmail) {
        return i + 2;
      }
    }
  }

  // 2. Second priority: Match by Leader Email alone (preserves original Team ID allocated to this leader)
  if (targetEmail) {
    for (var i = values.length - 1; i >= 0; i--) {
      var rEmail = String(values[i][6] || "").trim().toLowerCase();
      if (rEmail === targetEmail) {
        return i + 2;
      }
    }
  }

  // 3. Third priority: Match by Team ID ONLY IF the existing row does NOT already have an email registered
  // (Prevents an unauthenticated actor from taking over an already registered team)
  if (targetTeamId) {
    for (var i = values.length - 1; i >= 0; i--) {
      var rTeam = String(values[i][1] || "").trim().toUpperCase();
      var rEmail = String(values[i][6] || "").trim().toLowerCase();
      if (rTeam === targetTeamId) {
        if (rEmail && rEmail !== "-" && rEmail !== "n/a") {
          // Security Alert: Mismatched actor attempting to modify an existing team's row!
          Logger.log("⚠️ Security Alert: Attempt to update " + targetTeamId + " without matching registered leader email!");
          return -1;
        }
        return i + 2;
      }
    }
  }

  return -1;
}

/**
 * Checks if a Team ID is already registered in the sheet
 */
function isTeamIdTaken(sheet, teamId) {
  if (!sheet || !teamId) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return false;
  var target = String(teamId).trim().toUpperCase();
  var teamCol = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  for (var i = 0; i < teamCol.length; i++) {
    if (String(teamCol[i][0]).trim().toUpperCase() === target) {
      return true;
    }
  }
  return false;
}

/**
 * Calculates live next serial ID from sheet rows (scans both Col 2 and Col 3)
 * Guarantees atomic strictly sequential serial numbering (starting at 101)
 */
function getLiveNextSerial(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 101;

  var idColValues = sheet.getRange(2, 2, lastRow - 1, 2).getValues();
  var maxSerial = 100;

  for (var i = 0; i < idColValues.length; i++) {
    var teamVal = String(idColValues[i][0] || "").trim();
    var regVal = String(idColValues[i][1] || "").trim();

    var match1 = teamVal.match(/(?:TEAM-?|AI2[56]-?|AI\d{2}-?)(\d+)/i);
    if (match1 && match1[1]) {
      var n1 = parseInt(match1[1], 10);
      if (!isNaN(n1) && n1 > maxSerial) maxSerial = n1;
    }

    var match2 = regVal.match(/(?:TEAM-?|AI2[56]-?|AI\d{2}-?)(\d+)/i);
    if (match2 && match2[1]) {
      var n2 = parseInt(match2[1], 10);
      if (!isNaN(n2) && n2 > maxSerial) maxSerial = n2;
    }
  }

  return maxSerial + 1;
}

/**
 * Finds the exact next consecutive row for a new registration.
 * Scans downwards from Row 2 to find the first row without actual registration data,
 * preventing blank-row gaps where submissions get pushed hundreds of rows down.
 */
function getNextAvailableRow(sheet) {
  if (!sheet) return 2;
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 2;

  var idData = sheet.getRange(2, 2, lastRow - 1, 1).getValues(); // Column 2: Team ID
  var trueLastRow = 1;
  for (var i = 0; i < idData.length; i++) {
    var val = String(idData[i][0] || "").trim();
    if (val && val !== "-" && val !== "N/A" && val !== "") {
      trueLastRow = i + 2;
    }
  }
  return trueLastRow + 1;
}

/**
 * 🧹 Cleans up blank rows and compacts all registrations consecutively starting at Row 2.
 * Eliminates large gaps between registrations caused by empty formatted rows.
 */
function compactAndCleanSheet(sheet) {
  try {
    if (!sheet) {
      var ss = getTargetSpreadsheet();
      sheet = ss ? ss.getSheetByName("Registrations") : null;
      if (!sheet && ss) sheet = ss.getActiveSheet();
    }
    if (!sheet) return { success: false, message: "Sheet not found" };

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) return { success: true, count: 0, message: "No data rows to compact." };

    var totalCols = Math.max(sheet.getLastColumn(), HEADERS.length);
    var allValues = sheet.getRange(2, 1, lastRow - 1, totalCols).getValues();
    var validRows = [];

    for (var i = 0; i < allValues.length; i++) {
      var r = allValues[i];
      var ts = String(r[0] || "").trim();
      var teamId = String(r[1] || "").trim();
      var regId = String(r[2] || "").trim();
      var teamName = String(r[3] || "").trim();
      var leadName = String(r[5] || "").trim();
      var email = String(r[6] || "").trim();

      // Check if this row has actual registration data
      if ((teamId && teamId !== "-" && teamId !== "N/A") || email || teamName || leadName || ts) {
        validRows.push(r);
      }
    }

    if (validRows.length === 0) {
      return { success: true, count: 0, message: "No active registrations found." };
    }

    // Clear content of current data range
    sheet.getRange(2, 1, lastRow - 1, totalCols).clearContent();

    // Write valid rows starting cleanly from row 2
    sheet.getRange(2, 1, validRows.length, totalCols).setValues(validRows);

    // Format all active data rows
    var activeRange = sheet.getRange(2, 1, validRows.length, totalCols);
    activeRange.setVerticalAlignment("middle");
    activeRange.setFontFamily("Plus Jakarta Sans");
    activeRange.setFontSize(10);

    // Trim excess empty rows if sheet exceeds validRows.length + 30
    var maxRows = sheet.getMaxRows();
    var desiredMax = Math.max(validRows.length + 30, 50);
    if (maxRows > desiredMax) {
      sheet.deleteRows(desiredMax + 1, maxRows - desiredMax);
    }

    Logger.log("✓ Sheet successfully compacted: " + validRows.length + " teams arranged consecutively from Row 2.");
    return {
      success: true,
      count: validRows.length,
      message: "Successfully compacted sheet! " + validRows.length + " registrations are now consecutive from Row 2."
    };
  } catch (err) {
    Logger.log("Error in compactAndCleanSheet: " + err.toString());
    return { success: false, error: err.toString() };
  }
}

/**
 * Sets up sheet headers and formatting
 */
function setupSheet(sheet) {
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  formatHeaderRow(sheet);
}

function formatHeaderRow(sheet) {
  var cols = getSheetColumnIndexes(sheet);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground("#062b59");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Plus Jakarta Sans");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  try {
    sheet.setColumnWidth(1, 160);  // Timestamp
    sheet.setColumnWidth(2, 110);  // Team ID
    sheet.setColumnWidth(3, 120);  // Reg ID
    sheet.setColumnWidth(4, 160);  // Team Name
    sheet.setColumnWidth(5, 90);   // Team Size
    sheet.setColumnWidth(6, 170);  // Leader Name
    sheet.setColumnWidth(7, 200);  // Leader Email
    sheet.setColumnWidth(8, 130);  // Phone
    sheet.setColumnWidth(9, 240);  // College
    if (cols.hasDomain) {
      sheet.setColumnWidth(cols.domainCol, 140); // Selected Domain (Software / Hardware)
    }
    sheet.setColumnWidth(cols.trackCol, 250); // Selected Track (1 of 23 Tracks)
    sheet.setColumnWidth(cols.pptLinkCol, 280); // PPT Drive Link
    sheet.setColumnWidth(cols.pptFileNameCol, 200); // Original PPT File Name
    sheet.setColumnWidth(cols.evalFeeCol, 120); // Evaluation Fee (₹50)
    sheet.setColumnWidth(cols.evalFeeStatusCol, 160); // Eval Fee Status
    sheet.setColumnWidth(cols.evalUtrCol, 160); // Eval Payment UTR
    sheet.setColumnWidth(cols.pptStatusCol, 170); // PPT Status (Selection/Rejection)
    sheet.setColumnWidth(cols.round2FeeCol, 150); // Round 2 Fee Amount
    sheet.setColumnWidth(cols.round2LinkCol, 300); // Round 2 Payment Link
    sheet.setColumnWidth(cols.round2StatusCol, 160); // Round 2 Payment Status
    sheet.setColumnWidth(cols.round2UtrCol, 160); // Round 2 Payment UTR
    sheet.setColumnWidth(cols.emailStatusCol, 260); // Email Notification Status

    var maxRows = Math.max(sheet.getMaxRows(), 100);

    // Apply Dropdown Data Validation to Domain Column if present
    if (cols.hasDomain) {
      var domainRange = sheet.getRange(2, cols.domainCol, maxRows - 1, 1);
      var domainRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Software", "Hardware"], true)
        .setAllowInvalid(true)
        .setHelpText("Select 'Software' or 'Hardware'.")
        .build();
      domainRange.setDataValidation(domainRule);
    }

    // Apply Dropdown Data Validation to Column for PPT Status for all data rows
    var statusRange = sheet.getRange(2, cols.pptStatusCol, maxRows - 1, 1);
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Accepted", "Rejected", "Pending Review"], true)
      .setAllowInvalid(false)
      .setHelpText("Select 'Accepted' or 'Rejected' to evaluate team PPT.")
      .build();
    statusRange.setDataValidation(rule);

    // Apply Dropdown Data Validation to Eval Fee Status for all data rows: ONLY Pending Verification, Verified, Rejected
    var evalStatusRange = sheet.getRange(2, cols.evalFeeStatusCol, maxRows - 1, 1);
    var evalRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
      .build();
    evalStatusRange.setDataValidation(evalRule);

    // Strictly remove any dropdown data validation from Eval Payment UTR - ONLY payment ID occurs
    var utrRange = sheet.getRange(2, cols.evalUtrCol, maxRows - 1, 1);
    utrRange.clearDataValidations();
    utrRange.setNumberFormat("@");

    // Apply Dropdown Data Validation to Round 2 Payment Status for all data rows: ONLY Pending Verification, Verified, Rejected
    var r2StatusRange = sheet.getRange(2, cols.round2StatusCol, maxRows - 1, 1);
    var r2Rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
      .build();
    r2StatusRange.setDataValidation(r2Rule);

    // Strictly remove any dropdown data validation from Round 2 Payment UTR - ONLY payment ID occurs
    var r2UtrRange = sheet.getRange(2, cols.round2UtrCol, maxRows - 1, 1);
    r2UtrRange.clearDataValidations();
    r2UtrRange.setNumberFormat("@");

  } catch (e) {
    Logger.log("Column formatting notice: " + e.toString());
  }
}

/**
 * 🛠️ ONE-CLICK SHEET STRUCTURE UPDATER:
 * Run this function once to update your Google Sheet to the comprehensive 50 columns with Selected Domain,
 * add dropdowns for "Accepted / Rejected / Pending Review", and apply formatting.
 */
function updateSheetStructure() {
  var ss = getTargetSpreadsheet();
  if (!ss) {
    throw new Error("Could not access spreadsheet ID: " + SPREADSHEET_ID);
  }
  var sheet = ss.getSheetByName("Registrations");
  if (!sheet) {
    sheet = ss.getActiveSheet();
    if (sheet.getName() === "Sheet1") {
      sheet.setName("Registrations");
    }
  }

  // Ensure "Selected Domain" column exists at Col 38 if previously "Selected Track" was at Col 38
  var headerRow = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 38)).getValues()[0];
  if (headerRow[37] === "Selected Track") {
    sheet.insertColumnBefore(38);
  }

  // Ensure sheet has at least 50 columns
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }

  // Update row 1 with new comprehensive headers
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  formatHeaderRow(sheet);

  // Automatically clean up blank rows and compact registrations
  compactAndCleanSheet(sheet);

  Logger.log("✓ Google Sheet headers successfully updated to 50 columns with Selected Domain (Software / Hardware)!");
  return "Sheet structure updated successfully to 50 columns and compacted!";
}

/**
 * Adds Top Menu "🚀 AITHON 2.0" directly in Google Sheets toolbar
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("🚀 AITHON 2.0")
      .addItem("⚡ Enable Instant Email Trigger (Verified / Accepted / Rejected)", "installEditTrigger")
      .addItem("🧪 Test Email on Selected Row", "testSelectedRowDispatch")
      .addSeparator()
      .addItem("🚀 Send ALL Pending Emails (Registration + PPT + Finale)", "processAllPendingNotifications")
      .addSeparator()
      .addItem("✅ Verify Registration Payment & Send Email", "processAllVerifiedRegistrations")
      .addItem("⚡ Quick Verify Registration Payment (1-Click)", "quickVerifyRegistrationPaymentPrompt")
      .addSeparator()
      .addItem("⚡ Quick Mark Team as Paid (Finale)", "quickMarkTeamPaidPrompt")
      .addItem("🎟️ Dispatch Finale Tickets to Paid Teams", "processAllPaidFinaleTeams")
      .addItem("📧 Process PPT Evaluations (Send Emails)", "processAllPptEvaluations")
      .addSeparator()
      .addItem("🧹 Clean Up Blank Rows & Compact Sheet", "compactAndCleanSheet")
      .addItem("🔄 Fix Sheet Dropdowns & Payment UTRs", "fixEvalColumnsDropdownAndUtr")
      .addItem("🛠️ Setup Sheet Columns & Dropdowns (50 Cols)", "updateSheetStructure")
      .addItem("⏰ Enable 5-Minute Auto-Email Trigger (All Stages)", "installAutomatic5MinTrigger")
      .addToUi();
  } catch (e) {
    Logger.log("onOpen UI notice: " + e.toString());
  }
}

/**
 * 🛠️ Fix Column Dropdowns, and Remove Dropdowns from Payment UTRs
 */
function fixEvalColumnsDropdownAndUtr() {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss ? ss.getSheetByName("Registrations") : null;
    if (!sheet) sheet = ss.getActiveSheet();
    var maxRows = Math.max(sheet.getMaxRows(), 100);
    var cols = getSheetColumnIndexes(sheet);

    // 1. Domain dropdown if present
    if (cols.hasDomain) {
      var domainRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Software", "Hardware"], true)
        .setAllowInvalid(true)
        .setHelpText("Select 'Software' or 'Hardware'.")
        .build();
      sheet.getRange(2, cols.domainCol, maxRows - 1, 1).setDataValidation(domainRule);
    }

    // 2. Eval Fee Status dropdown: [Pending Verification, Verified, Rejected]
    var evalRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
      .build();
    sheet.getRange(2, cols.evalFeeStatusCol, maxRows - 1, 1).setDataValidation(evalRule);

    // 3. Clear all dropdown data validations from Eval Payment UTR
    sheet.getRange(2, cols.evalUtrCol, maxRows - 1, 1).clearDataValidations();
    sheet.getRange(2, cols.evalUtrCol, maxRows - 1, 1).setNumberFormat("@");

    // 4. PPT Status dropdown with [Accepted, Rejected, Pending Review]
    var pptRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Accepted", "Rejected", "Pending Review"], true)
      .setAllowInvalid(false)
      .setHelpText("Select 'Accepted' or 'Rejected' to evaluate team PPT.")
      .build();
    sheet.getRange(2, cols.pptStatusCol, maxRows - 1, 1).setDataValidation(pptRule);

    // 5. Round 2 Payment Status dropdown with [Pending Verification, Verified, Rejected]
    var r2Rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
      .build();
    sheet.getRange(2, cols.round2StatusCol, maxRows - 1, 1).setDataValidation(r2Rule);

    // 6. Clear all dropdown data validations from Round 2 Payment UTR
    sheet.getRange(2, cols.round2UtrCol, maxRows - 1, 1).clearDataValidations();
    sheet.getRange(2, cols.round2UtrCol, maxRows - 1, 1).setNumberFormat("@");

    Logger.log("✓ Updated dropdowns and cleared UTR validations.");
    try {
      SpreadsheetApp.getUi().alert("✓ Updated successfully!\n\n• Fee & PPT Status: Dropdowns correctly applied.\n• Payment UTR Columns: Formatted as plain text with no dropdowns.");
    } catch (uiErr) {}
  } catch (err) {
    Logger.log("fixEvalColumnsDropdownAndUtr error: " + err.toString());
  }
}

/**
 * ⚡ Quick 1-Click prompt to verify a team's ₹50 registration payment & send confirmation email
 */
function quickVerifyRegistrationPaymentPrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    "⚡ Quick Verify Registration Payment (Col 42)",
    "Enter Team ID (e.g. TEAM-101), Registration ID (e.g. AI25-101), or Leader Email to verify ₹50 payment & dispatch Confirmation Email:",
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;
  var input = String(response.getResponseText()).trim();
  if (!input) {
    ui.alert("No Team ID or email entered.");
    return;
  }

  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    ui.alert("No registration rows found.");
    return;
  }

  var cols = getSheetColumnIndexes(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, cols.totalCols).getValues();
  var matchRow = -1;
  var upperInput = input.toUpperCase();
  var lowerInput = input.toLowerCase();

  for (var i = 0; i < values.length; i++) {
    var rTeamId = String(values[i][1] || "").trim().toUpperCase();
    var rRegId = String(values[i][2] || "").trim().toUpperCase();
    var rEmail = String(values[i][6] || "").trim().toLowerCase();
    if (rTeamId === upperInput || rRegId === upperInput || rEmail === lowerInput || rTeamId.indexOf(upperInput) !== -1) {
      matchRow = i + 2;
      break;
    }
  }

  if (matchRow === -1) {
    ui.alert("Team '" + input + "' was not found in the Registrations sheet.");
    return;
  }

  var rowData = sheet.getRange(matchRow, 1, 1, cols.totalCols).getValues()[0];
  var teamId = rowData[1];
  var teamName = rowData[3];

  sheet.getRange(matchRow, cols.evalFeeStatusCol)
    .setValue("Verified")
    .setBackground("#dcfce7")
    .setFontColor("#166534")
    .setFontWeight("bold");

  var dispatched = processEvalFeeStatusRow(sheet, matchRow);
  if (dispatched) {
    ui.alert("✓ Success!\n\nTeam " + teamId + " (" + teamName + ") payment verified.\nOfficial Registration Confirmation Email sent to: " + rowData[6]);
  } else {
    ui.alert("Team " + teamId + " payment marked as Verified in Column " + cols.evalFeeStatusCol + ".");
  }
}

/**
 * ⚡ Quick 1-Click prompt to mark a team as Paid directly from the toolbar
 */
function quickMarkTeamPaidPrompt() {
  var ui = SpreadsheetApp.getUi();
  var response = ui.prompt(
    "⚡ Quick Confirm Round 2 Payment",
    "Enter Team ID (e.g. TEAM-101) or Leader Email to mark as Paid & dispatch Finale Pass:",
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;
  var input = String(response.getResponseText()).trim();
  if (!input) {
    ui.alert("No Team ID or email entered.");
    return;
  }

  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    ui.alert("No registration rows found.");
    return;
  }

  var cols = getSheetColumnIndexes(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, cols.totalCols).getValues();
  var matchRow = -1;
  var upperInput = input.toUpperCase();
  var lowerInput = input.toLowerCase();

  for (var i = 0; i < values.length; i++) {
    var rTeamId = String(values[i][1] || "").trim().toUpperCase();
    var rEmail = String(values[i][6] || "").trim().toLowerCase();
    if (rTeamId === upperInput || rEmail === lowerInput || rTeamId.indexOf(upperInput) !== -1) {
      matchRow = i + 2;
      break;
    }
  }

  if (matchRow === -1) {
    ui.alert("Team '" + input + "' was not found in the Registrations sheet.");
    return;
  }

  var rowData = sheet.getRange(matchRow, 1, 1, cols.totalCols).getValues()[0];
  var teamId = rowData[1];
  var teamName = rowData[3];
  var teamSize = parseInt(rowData[4], 10) || 4;
  if (teamSize < 4) teamSize = 4;
  if (teamSize > 6) teamSize = 6;
  var fee = teamSize * 200;

  sheet.getRange(matchRow, cols.round2FeeCol).setValue("₹" + fee);
  sheet.getRange(matchRow, cols.round2StatusCol)
    .setValue("Verified")
    .setBackground("#dcfce7")
    .setFontColor("#166534")
    .setFontWeight("bold");

  var dispatched = processRound2PaymentRow(sheet, matchRow, "MANUAL_CONFIRMED", fee);
  if (dispatched) {
    ui.alert("✓ Success!\n\nTeam " + teamId + " (" + teamName + ") marked as Paid.\nOfficial Grand Finale Ticket has been emailed to: " + rowData[6]);
  } else {
    ui.alert("Team " + teamId + " marked as Paid in Column " + cols.round2StatusCol + ".");
  }
}

/**
 * Focuses or creates the Unmatched_Payments sheet tab
 */
function openUnmatchedPaymentsSheet() {
  var ss = getTargetSpreadsheet();
  var unSheet = ss.getSheetByName("Unmatched_Payments");
  if (!unSheet) {
    unSheet = ss.insertSheet("Unmatched_Payments");
    var unHeaders = [
      "Timestamp", "Payment ID", "Amount", "Payer Email", "Payer Phone",
      "Payer Name", "Method / VPA", "Notes / Description", "Status", "Manual Team Assigned"
    ];
    unSheet.appendRow(unHeaders);
    unSheet.getRange(1, 1, 1, unHeaders.length).setBackground("#991b1b").setFontColor("#ffffff").setFontWeight("bold");
    unSheet.setFrozenRows(1);
  }
  ss.setActiveSheet(unSheet);
}

/**
 * ⚡ Installable Trigger on Edit:
 * Activates instant real-time email dispatch on cell edits:
 * 1. Sends confirmation email when Eval Fee Status is set to 'Verified' / 'Paid',
 * 2. Sends acceptance/rejection email when PPT Status is set to 'Accepted' / 'Rejected',
 * 3. Sends Grand Finale Hall Ticket when Round 2 Payment Status is set to 'Paid' / 'Verified'!
 */
function installEditTrigger() {
  var ss = getTargetSpreadsheet();
  if (!ss) ss = SpreadsheetApp.getActiveSpreadsheet();

  // Delete any existing installable triggers for installedOnEdit to avoid duplicate calls
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    var fn = triggers[i].getHandlerFunction();
    if (fn === "installedOnEdit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new installable onEdit trigger bound to this spreadsheet
  ScriptApp.newTrigger("installedOnEdit")
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  Logger.log("✓ Real-time onEdit trigger successfully installed for: " + ss.getName());
  var alertMsg =
    "⚡ REAL-TIME INSTANT EMAIL TRIGGER IS NOW ACTIVE!\n\n" +
    "Emails will now dispatch IMMEDIATELY whenever you click/select in your sheet:\n\n" +
    "1. 'Verified' in Eval Fee Status (Col 43)\n" +
    "   → Instantly dispatches Registration Confirmation Email\n\n" +
    "2. 'Accepted' in PPT Status (Col 45)\n" +
    "   → Instantly dispatches Round 2 Acceptance & Final Payment Email\n\n" +
    "3. 'Rejected' in PPT Status (Col 45)\n" +
    "   → Instantly dispatches Evaluation Feedback & Certificate Email\n\n" +
    "4. 'Verified' / 'Paid' in Round 2 Status (Col 48)\n" +
    "   → Instantly dispatches Grand Finale Hall Ticket Pass\n\n" +
    "All emails send immediately from: shivaji.wathore@avcoe.org";

  try {
    SpreadsheetApp.getUi().alert("Trigger Activated", alertMsg, SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (uiErr) {
    try {
      ss.toast("⚡ Instant email trigger is now ACTIVE!", "AITHON 2.0", 8);
    } catch (tErr) {}
  }
}

/**
 * 🧪 Test Email Dispatch on the Currently Selected Row in Google Sheets:
 */
function testSelectedRowDispatch() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var row = sheet.getActiveCell().getRow();
  if (row < 2) {
    SpreadsheetApp.getUi().alert("Please click on a row with team data (Row 2 or below) first, then run this test.");
    return;
  }
  var cols = getSheetColumnIndexes(sheet);
  var pptVal = String(sheet.getRange(row, cols.pptStatusCol).getValue() || "").trim();
  var evalVal = String(sheet.getRange(row, cols.evalFeeStatusCol).getValue() || "").trim();
  var r2Val = String(sheet.getRange(row, cols.round2StatusCol).getValue() || "").trim();

  sheet.getParent().toast("🧪 Testing email dispatch on Row " + row + "...", "AITHON 2.0", 4);

  var sent = false;
  if (evalVal.toLowerCase() === "verified" || evalVal.toLowerCase() === "paid") {
    sent = processEvalFeeStatusRow(sheet, row, true) || sent;
  }
  if (pptVal.toLowerCase() === "accepted" || pptVal.toLowerCase() === "selected") {
    sent = processPptEvaluationRow(sheet, row, true) || sent;
  } else if (pptVal.toLowerCase() === "rejected") {
    sent = processPptEvaluationRow(sheet, row, true) || sent;
  }
  if (r2Val.toLowerCase() === "verified" || r2Val.toLowerCase() === "paid") {
    sent = processRound2PaymentRow(sheet, row, null, null, true) || sent;
  }

  if (sent) {
    SpreadsheetApp.getUi().alert("✓ Email dispatched successfully for Row " + row + "!");
  } else {
    SpreadsheetApp.getUi().alert("Row " + row + " Statuses:\n• Eval Fee: " + (evalVal || "Empty") + "\n• PPT Status: " + (pptVal || "Empty") + "\n• Round 2 Payment: " + (r2Val || "Empty") + "\n\nTo trigger an email, set one of the above to 'Verified', 'Accepted', or 'Rejected'.");
  }
}

/**
 * ⚡ Installs a 5-minute automated background trigger:
 * Automatically checks and sends all pending emails (Eval Fee + PPT + Finale)
 * every 5 minutes from this account without any manual intervention!
 */
function installAutomatic5MinTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "processAllPendingNotifications") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger("processAllPendingNotifications")
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log("✓ Automated 5-minute background email trigger successfully installed!");
  try {
    SpreadsheetApp.getUi().alert(
      "✓ 5-Minute Auto-Email Trigger Installed!\n\n" +
      "Every 5 minutes, this script will automatically check your active sheet and dispatch:\n" +
      "• Registration Confirmation Emails (Col 42/43 Verified)\n" +
      "• PPT Acceptance & Rejection Emails (Col 44/45)\n" +
      "• Grand Finale Hall Tickets (Col 47/48 Paid)"
    );
  } catch (e) {}
}

/**
 * ⚡ Real-Time On-Edit Trigger Handler:
 * Dispatches emails IMMEDIATELY when a cell is changed to Verified, Accepted, or Rejected!
 */
function installedOnEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheet = e.range.getSheet();
    if (!isRegistrationSheet(sheet)) return;

    var startRow = e.range.getRow();
    var numRows = e.range.getNumRows();
    var col = e.range.getColumn();
    var cols = getSheetColumnIndexes(sheet);

    for (var r = startRow; r < startRow + numRows; r++) {
      if (r < 2) continue; // Skip header row

      var cellVal = String(sheet.getRange(r, col).getValue() || "").trim();
      var lowerVal = cellVal.toLowerCase();

      // 1. Eval Fee Status edited
      if (col === cols.evalFeeStatusCol) {
        if (lowerVal === "verified" || lowerVal === "paid" || lowerVal === "approved" || lowerVal === "successful") {
          try { sheet.getParent().toast("📧 Dispatching Registration Confirmation email for Row " + r + "...", "AITHON 2.0", 4); } catch(t){}
          var sent = processEvalFeeStatusRow(sheet, r, true);
          if (sent) {
            try { sheet.getParent().toast("✅ Registration Confirmation Email sent!", "AITHON 2.0", 5); } catch(t){}
          }
        } else if (lowerVal === "rejected") {
          try { sheet.getParent().toast("📧 Dispatching Payment Verification Issue email for Row " + r + "...", "AITHON 2.0", 4); } catch(t){}
          var sentRej = processEvalFeeStatusRow(sheet, r, true);
          if (sentRej) {
            try { sheet.getParent().toast("❌ Payment Rejection Email sent!", "AITHON 2.0", 5); } catch(t){}
          }
        }
      }

      // 2. PPT Status edited (Accepted / Rejected)
      if (col === cols.pptStatusCol) {
        if (lowerVal === "accepted" || lowerVal === "selected") {
          try { sheet.getParent().toast("📧 Dispatching Round 2 Acceptance email & Finale link for Row " + r + "...", "AITHON 2.0", 4); } catch(t){}
          var sentAcc = processPptEvaluationRow(sheet, r, true);
          if (sentAcc) {
            try { sheet.getParent().toast("🎉 Round 2 Acceptance Email dispatched!", "AITHON 2.0", 5); } catch(t){}
          }
        } else if (lowerVal === "rejected") {
          try { sheet.getParent().toast("📧 Dispatching Evaluation Feedback & Certificate email for Row " + r + "...", "AITHON 2.0", 4); } catch(t){}
          var sentPptRej = processPptEvaluationRow(sheet, r, true);
          if (sentPptRej) {
            try { sheet.getParent().toast("✉️ Rejection Feedback Email dispatched!", "AITHON 2.0", 5); } catch(t){}
          }
        }
      }

      // 3. Round 2 Payment Status edited (Verified / Paid)
      if (col === cols.round2StatusCol) {
        if (lowerVal === "verified" || lowerVal === "paid" || lowerVal === "approved") {
          try { sheet.getParent().toast("📧 Dispatching Grand Finale Hall Ticket for Row " + r + "...", "AITHON 2.0", 4); } catch(t){}
          var sentTik = processRound2PaymentRow(sheet, r, null, null, true);
          if (sentTik) {
            try { sheet.getParent().toast("🎟️ Grand Finale Hall Ticket dispatched!", "AITHON 2.0", 5); } catch(t){}
          }
        } else if (lowerVal === "rejected") {
          sheet.getRange(r, cols.round2StatusCol).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");
          var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
          recordEmailStatus(sheet, r, cols.emailStatusCol, "❌ Finale Payment Rejected", nowStr);
          try { sheet.getParent().toast("❌ Round 2 Payment marked as Rejected.", "AITHON 2.0", 5); } catch(t){}
        }
      }
    }
  } catch (err) {
    Logger.log("installedOnEdit error: " + err.toString());
  }
}

/**
 * 🔒 Safely appends or updates an email status tag into Column 50 (Email Notification Status)
 * without overwriting previously recorded email statuses (e.g. Confirmation, Acceptance, Ticket)
 */
function recordEmailStatus(sheet, rowNum, colIdx, tag, nowStr) {
  var cell = sheet.getRange(rowNum, colIdx);
  var existing = String(cell.getValue() || "").trim();
  var fullTag = tag + " (" + nowStr + ")";

  if (existing.indexOf(tag) !== -1) {
    // Update timestamp on existing tag
    var parts = existing.split("|").map(function(s) { return s.trim(); });
    for (var i = 0; i < parts.length; i++) {
      if (parts[i].indexOf(tag) !== -1) {
        parts[i] = fullTag;
        break;
      }
    }
    cell.setValue(parts.join(" | "));
  } else {
    var updated = existing ? (existing + " | " + fullTag) : fullTag;
    cell.setValue(updated);
  }
  SpreadsheetApp.flush();
}

/**
 * SENDS PAYMENT REJECTION / VERIFICATION ISSUE EMAIL
 */
function sendPaymentRejectionEmail(data) {
  var recipient = data.leadEmail;
  if (!recipient || recipient.indexOf("@") === -1) return;

  var teamName = data.teamName || "Team";
  var teamId = data.teamId || "N/A";
  var regId = data.registrationId || "N/A";
  var leadName = data.leadFullName || "Team Leader";
  var utr = data.utr || "Not provided";

  var subject = "[ACTION REQUIRED] AITHON 2.0 Evaluation Fee Verification Issue — " + teamName + " [" + teamId + "]";

  var plainText =
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + ",\n\n" +
    "We reviewed the Round 1 Evaluation Fee details submitted for your team (" + teamName + " [" + teamId + "]).\n\n" +
    "Unfortunately, our finance verification desk was UNABLE to verify your ₹50 payment using the provided UTR reference number: " + utr + ".\n\n" +
    "POSSIBLE REASONS:\n" +
    "1. UTR number entered incorrectly or incomplete.\n" +
    "2. Payment failed or transaction was reversed by bank.\n" +
    "3. Transaction not found in the official receiver account.\n\n" +
    "ACTION REQUIRED:\n" +
    "Please reply directly to this email (or contact shivaji.wathore@avcoe.org) with your valid UPI payment screenshot showing the 12-digit UTR and timestamp so we can manually verify and confirm your team.\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head><meta charset="utf-8"><title>Payment Verification Issue</title></head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #fee2e2; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">' +
    '    <tr><td style="background-color: #ffffff; padding: 22px 20px 16px; text-align: center; border-bottom: 2px solid #991b1b;"><img src="' + LOGO_IMAGE_URL + '" alt="AITHON 2.0" width="260" style="width: 260px; max-width: 85%; height: auto; display: block; margin: 0 auto;" /></td></tr>' +
    '    <tr><td style="background-color: #991b1b; padding: 22px; text-align: center; color: #ffffff;"><div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #fecaca; margin-bottom: 4px;">Payment Verification Notice</div><div style="font-size: 18px; font-weight: bold; color: #ffffff;">EVALUATION FEE PAYMENT ISSUE</div></td></tr>' +
    '    <tr><td style="padding: 28px 24px;">' +
    '      <p style="font-size: 15px; margin: 0 0 14px;">Dear <strong>' + leadName + '</strong> (' + teamName + '),</p>' +
    '      <p style="font-size: 14px; color: #334155; margin: 0 0 16px;">Our verification desk was unable to validate your ₹50 Evaluation Fee payment with the submitted reference number (<strong>' + utr + '</strong>).</p>' +
    '      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">' +
    '        <div style="font-size: 13px; font-weight: bold; color: #991b1b; margin-bottom: 6px;">Next Step:</div>' +
    '        <p style="font-size: 13px; color: #7f1d1d; margin: 0;">Please reply to this email or write to <strong>shivaji.wathore@avcoe.org</strong> with your UPI payment screenshot displaying the 12-digit UTR so we can confirm your registration.</p>' +
    '      </div>' +
    '      <p style="font-size: 13px; color: #64748b; margin: 0;">Team ID: <strong>' + teamId + '</strong> | Reg ID: <strong>' + regId + '</strong></p>' +
    '    </td></tr>' +
    '  </table>' +
    '</body></html>';

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: plainText,
    htmlBody: htmlBody,
    name: SENDER_NAME
  });
}

/**
 * 📧 MANUAL EVALUATION FEE PROCESSOR:
 * Processes a single row for Column 42/43 ("Eval Fee Status") manual payment verification & confirmation email dispatch.
 * Confirmation emails will be sent when status is 'Verified', 'Paid', 'Approved', or 'Successful'.
 */
function processEvalFeeStatusRow(sheet, rowNum, forceSend) {
  var cols = getSheetColumnIndexes(sheet);
  var rowData = sheet.getRange(rowNum, 1, 1, cols.totalCols).getValues()[0];

  var teamId = String(rowData[cols.teamIdCol - 1] || rowData[1] || "").trim();
  var regId = String(rowData[cols.regIdCol - 1] || rowData[2] || "").trim();
  var teamName = String(rowData[cols.teamNameCol - 1] || rowData[3] || "").trim();
  var rawSize = rowData[cols.teamSizeCol - 1] || rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  var leadName = String(rowData[cols.leadNameCol - 1] || rowData[5] || "").trim();
  var leadEmail = String(rowData[cols.leadEmailCol - 1] || rowData[6] || "").trim().toLowerCase();
  var leadPhone = String(rowData[cols.leadPhoneCol - 1] || rowData[7] || "").replace("'", "").trim();
  var leadCollege = String(rowData[cols.leadCollegeCol - 1] || rowData[8] || "").trim();
  var selectedDomain = cols.hasDomain ? String(rowData[cols.domainIdx] || "Software").trim() : "Software";
  var selectedTrack = String(rowData[cols.trackIdx] || "").trim();
  var pptLink = String(rowData[cols.pptLinkIdx] || "").trim();
  var evalFeeStatus = String(rowData[cols.evalFeeStatusIdx] || "").trim();
  var utr = String(rowData[cols.evalUtrIdx] || "").replace("'", "").trim();
  var emailSentStatus = String(sheet.getRange(rowNum, cols.emailStatusCol).getValue() || "").trim();

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
  var lowerStatus = evalFeeStatus.toLowerCase().trim();

  // If status is "Rejected"
  if (lowerStatus === "rejected" || lowerStatus.indexOf("rejected") !== -1) {
    sheet.getRange(rowNum, cols.evalFeeStatusCol).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");

    if (forceSend || emailSentStatus.indexOf("Payment Rejection Sent") === -1) {
      sendPaymentRejectionEmail({
        teamId: teamId,
        registrationId: regId,
        teamName: teamName,
        leadFullName: leadName,
        leadEmail: leadEmail,
        utr: utr
      });
      recordEmailStatus(sheet, rowNum, cols.emailStatusCol, "❌ Payment Rejection Sent", nowStr);
      Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee payment rejection email sent to " + leadEmail);
      return true;
    }
    return false;
  }

  // If status is "Pending Verification", style as amber
  if (lowerStatus === "pending verification" || lowerStatus.indexOf("pending") !== -1) {
    sheet.getRange(rowNum, cols.evalFeeStatusCol).setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");
    Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee status is Pending Verification.");
    return false;
  }

  // Check if status is "Verified"
  var isVerified = lowerStatus === "verified" || lowerStatus.indexOf("verified") !== -1 ||
                   lowerStatus === "paid" || lowerStatus.indexOf("paid") !== -1 ||
                   lowerStatus === "approved" || lowerStatus.indexOf("approved") !== -1;

  if (!isVerified) {
    Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee status is '" + evalFeeStatus + "'. Awaiting manual verification.");
    return false;
  }

  // Check if confirmation email already sent (unless forceSend from real-time click)
  if (!forceSend && emailSentStatus.indexOf("Confirmation Email Sent") !== -1) {
    Logger.log("Row " + rowNum + " (" + teamId + "): Confirmation email already sent. Skipping.");
    return false;
  }

  // Extract registered team members
  var membersList = [];
  if (rowData[12] && String(rowData[12]).trim() !== "-" && String(rowData[12]).trim() !== "") membersList.push(String(rowData[12]).trim());
  if (rowData[17] && String(rowData[17]).trim() !== "-" && String(rowData[17]).trim() !== "") membersList.push(String(rowData[17]).trim());
  if (rowData[22] && String(rowData[22]).trim() !== "-" && String(rowData[22]).trim() !== "") membersList.push(String(rowData[22]).trim());
  if (rowData[27] && String(rowData[27]).trim() !== "-" && String(rowData[27]).trim() !== "") membersList.push(String(rowData[27]).trim());
  if (rowData[32] && String(rowData[32]).trim() !== "-" && String(rowData[32]).trim() !== "") membersList.push(String(rowData[32]).trim());

  var teamData = {
    teamId: teamId,
    registrationId: regId,
    teamName: teamName,
    teamSize: teamSize,
    leadFullName: leadName,
    leadEmail: leadEmail,
    leadPhone: leadPhone,
    leadCollege: leadCollege,
    members: membersList,
    selectedDomain: selectedDomain || "Software",
    selectedTrack: selectedTrack || "General AI Track",
    pptDriveUrl: pptLink,
    evalFeeStatus: "Verified",
    utr: utr
  };

  sendConfirmationEmail(teamData);

  // Update Email Notification Status safely
  recordEmailStatus(sheet, rowNum, cols.emailStatusCol, "✓ Confirmation Email Sent", nowStr);
  // Style Eval Fee Status with verified green
  sheet.getRange(rowNum, cols.evalFeeStatusCol).setValue("Verified").setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");

  Logger.log("✓ Manual payment verified & confirmation email sent to: " + leadEmail + " for " + teamId);
  return true;
}

/**
 * 📧 BATCH PROCESSOR FOR REGISTRATION PAYMENT VERIFICATION:
 * Scans all rows in the sheet. For any row where Eval Fee Status is 'Verified'/'Paid'/'Approved'/'Successful'
 * and confirmation email has not been sent yet, dispatches the confirmation email!
 */
function processAllVerifiedRegistrations() {
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log("No registration rows to process.");
    return;
  }

  var processedCount = 0;
  for (var r = 2; r <= lastRow; r++) {
    var handled = processEvalFeeStatusRow(sheet, r);
    if (handled) processedCount++;
  }

  Logger.log("Processed " + processedCount + " verified registration payment(s).");
  try {
    SpreadsheetApp.getUi().alert("AITHON 2.0 Registration Payment Processing Complete!\n\nDispatched confirmation emails to " + processedCount + " team(s).");
  } catch (e) {}
}

/**
 * 📧 BATCH PROCESSOR:
 * Scans all rows in the sheet. For any row where PPT Status is 'Accepted' or 'Rejected'
 * and email has not been sent yet, dispatches the email!
 */
function processAllPptEvaluations() {
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations");
  if (!sheet) {
    sheet = ss.getActiveSheet();
  }

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log("No registration rows to process.");
    return;
  }

  var processedCount = 0;
  for (var r = 2; r <= lastRow; r++) {
    var handled = processPptEvaluationRow(sheet, r);
    if (handled) processedCount++;
  }

  Logger.log("Processed " + processedCount + " pending PPT evaluations.");
  try {
    SpreadsheetApp.getUi().alert("AITHON 2.0 Evaluation Processing Complete!\n\nDispatched evaluation emails to " + processedCount + " team(s).");
  } catch (e) {}
}

/**
 * 🚀 ALL-IN-ONE AUTOMATED NOTIFICATION DISPATCHER:
 * Runs on a 5-minute timer (or 1-click manual trigger) to automatically check
 * and dispatch ALL pending emails across every stage:
 * 1. 📧 Registration Payment Verification (Col 42) -> Confirmation Email
 * 2. 📊 PPT Status Evaluations (Col 43) -> Acceptance / Rejection Email
 * 3. 🎟️ Grand Finale Payment Status (Col 45) -> Official Entry Ticket & Pass
 */
function processAllPendingNotifications() {
  Logger.log("=== 🚀 Starting All-in-One Automated Email Dispatch ===");
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log("No registration rows found to process.");
    return;
  }

  var regEmailCount = 0;
  var pptEmailCount = 0;
  var finaleEmailCount = 0;

  // Single pass through all rows for maximum efficiency
  for (var r = 2; r <= lastRow; r++) {
    try {
      // 1. Check Registration Fee Verification
      if (processEvalFeeStatusRow(sheet, r)) {
        regEmailCount++;
      }
    } catch (e1) {
      Logger.log("Row " + r + " Eval Fee check error: " + e1.toString());
    }

    try {
      // 2. Check PPT Evaluation (Accepted / Rejected)
      if (processPptEvaluationRow(sheet, r)) {
        pptEmailCount++;
      }
    } catch (e2) {
      Logger.log("Row " + r + " PPT Evaluation check error: " + e2.toString());
    }

    try {
      // 3. Check Grand Finale Payment (Paid -> Ticket)
      if (processRound2PaymentRow(sheet, r)) {
        finaleEmailCount++;
      }
    } catch (e3) {
      Logger.log("Row " + r + " Finale Payment check error: " + e3.toString());
    }
  }

  var totalSent = regEmailCount + pptEmailCount + finaleEmailCount;
  Logger.log("=== 🏁 Automated Dispatch Completed! Total Sent: " + totalSent + 
             " (Registration: " + regEmailCount + ", PPT: " + pptEmailCount + ", Finale Tickets: " + finaleEmailCount + ") ===");

  try {
    SpreadsheetApp.getUi().alert(
      "🚀 All-in-One Notification Dispatch Complete!\n\n" +
      "• Registration Confirmation Emails: " + regEmailCount + "\n" +
      "• PPT Acceptance / Rejection Emails: " + pptEmailCount + "\n" +
      "• Grand Finale Hall Tickets: " + finaleEmailCount + "\n\n" +
      "Total Emails Dispatched: " + totalSent
    );
  } catch (uiErr) {}
}

/**
 * Processes a single row for PPT Status evaluation & email dispatch
 */
function processPptEvaluationRow(sheet, rowNum, forceSend) {
  var cols = getSheetColumnIndexes(sheet);
  var rowData = sheet.getRange(rowNum, 1, 1, cols.totalCols).getValues()[0];

  var teamId = String(rowData[cols.teamIdCol - 1] || rowData[1] || "").trim();
  var regId = String(rowData[cols.regIdCol - 1] || rowData[2] || "").trim();
  var teamName = String(rowData[cols.teamNameCol - 1] || rowData[3] || "").trim();
  var rawSize = rowData[cols.teamSizeCol - 1] || rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  if (teamSize < 4) teamSize = 4;
  if (teamSize > 6) teamSize = 6;
  var leadName = String(rowData[cols.leadNameCol - 1] || rowData[5] || "").trim();
  var leadEmail = String(rowData[cols.leadEmailCol - 1] || rowData[6] || "").trim().toLowerCase();
  var leadPhone = String(rowData[cols.leadPhoneCol - 1] || rowData[7] || "").replace("'", "").trim();
  var leadCollege = String(rowData[cols.leadCollegeCol - 1] || rowData[8] || "").trim();
  var selectedDomain = cols.hasDomain ? String(rowData[cols.domainIdx] || "Software").trim() : "Software";
  var selectedTrack = String(rowData[cols.trackIdx] || "").trim();
  var pptStatus = String(rowData[cols.pptStatusIdx] || "").trim();
  var emailSentStatus = String(sheet.getRange(rowNum, cols.emailStatusCol).getValue() || "").trim();

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
  var lowerStatus = pptStatus.toLowerCase().trim();

  // Extract registered team members
  var membersList = [];
  if (rowData[12] && String(rowData[12]).trim() !== "-" && String(rowData[12]).trim() !== "") membersList.push(String(rowData[12]).trim());
  if (rowData[17] && String(rowData[17]).trim() !== "-" && String(rowData[17]).trim() !== "") membersList.push(String(rowData[17]).trim());
  if (rowData[22] && String(rowData[22]).trim() !== "-" && String(rowData[22]).trim() !== "") membersList.push(String(rowData[22]).trim());
  if (rowData[27] && String(rowData[27]).trim() !== "-" && String(rowData[27]).trim() !== "") membersList.push(String(rowData[27]).trim());
  if (rowData[32] && String(rowData[32]).trim() !== "-" && String(rowData[32]).trim() !== "") membersList.push(String(rowData[32]).trim());

  // CASE 1: PPT ACCEPTED
  if (lowerStatus === "accepted" || lowerStatus === "selected") {
    // If not forceSend, prevent duplicate email spam
    if (!forceSend && emailSentStatus.indexOf("Accepted Email Sent") !== -1) {
      Logger.log("Row " + rowNum + " (" + teamId + "): Acceptance email already sent. Skipping.");
      return false;
    }

    var feeAmount = teamSize * 200;
    var paymentLink = getRound2PaymentLink(teamSize, teamId, leadEmail, teamName, leadName, selectedTrack, leadPhone);

    var teamData = {
      teamId: teamId,
      registrationId: regId,
      teamName: teamName,
      teamSize: teamSize,
      leadFullName: leadName,
      leadEmail: leadEmail,
      leadPhone: leadPhone,
      leadCollege: leadCollege,
      members: membersList,
      selectedDomain: selectedDomain || "Software",
      selectedTrack: selectedTrack || "General AI Track",
      feeAmount: feeAmount,
      paymentLink: paymentLink
    };

    sendPptAcceptanceEmail(teamData);

    // Update Sheet: Fee, Link, Payment Status, Email Status
    sheet.getRange(rowNum, cols.round2FeeCol).setValue("₹" + feeAmount);
    sheet.getRange(rowNum, cols.round2LinkCol).setValue(paymentLink);
    sheet.getRange(rowNum, cols.round2StatusCol).setValue("Pending Verification");
    recordEmailStatus(sheet, rowNum, cols.emailStatusCol, "✓ Accepted Email Sent", nowStr);
    sheet.getRange(rowNum, cols.pptStatusCol).setValue("Accepted").setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");

    Logger.log("✓ Acceptance email sent to: " + leadEmail + " for " + teamId + " (Track: " + (selectedTrack || "N/A") + ", Fee: ₹" + feeAmount + ")");
    return true;
  }

  // CASE 2: PPT REJECTED
  if (lowerStatus === "rejected") {
    if (!forceSend && emailSentStatus.indexOf("Rejection Email Sent") !== -1) {
      Logger.log("Row " + rowNum + " (" + teamId + "): Rejection email already sent. Skipping.");
      return false;
    }

    var teamDataReject = {
      teamId: teamId,
      registrationId: regId,
      teamName: teamName,
      teamSize: teamSize,
      leadFullName: leadName,
      leadEmail: leadEmail,
      selectedDomain: selectedDomain || "Software",
      selectedTrack: selectedTrack || "General AI Track"
    };

    sendPptRejectionEmail(teamDataReject);

    // Update Sheet: Email Status and highlight
    recordEmailStatus(sheet, rowNum, cols.emailStatusCol, "✓ Rejection Email Sent", nowStr);
    sheet.getRange(rowNum, cols.pptStatusCol).setValue("Rejected").setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");

    Logger.log("✓ Rejection feedback email sent to: " + leadEmail + " for " + teamId);
    return true;
  }

  return false;
}

/**
 * SENDS ROUND 2 ACCEPTANCE EMAIL WITH NON-EDITABLE PAYMENT LINK
 */
function sendPptAcceptanceEmail(data) {
  var recipient = data.leadEmail;
  var teamName = data.teamName || "Team";
  var teamId = data.teamId || "N/A";
  var regId = data.registrationId || "N/A";
  var leadName = data.leadFullName || "Team Leader";
  var teamSize = data.teamSize || 4;
  if (teamSize < 4) teamSize = 4;
  if (teamSize > 6) teamSize = 6;
  var feeAmount = data.feeAmount || (teamSize * 200);
  var paymentFormUrl = ROUND_2_PAYMENT_FORM_URL;
  var upiVpa = UPI_VPA || "9404665180@centralbank";

  var subject = "[ACCEPTED] Qualified for AITHON 2.0 Finale - " + teamName + " [" + teamId + "]";

  // Plain Text Version
  var plainText =
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "ROUND 1 EVALUATION RESULT: ACCEPTED / SHORTLISTED\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + " and Members of " + teamName + ",\n\n" +
    "Heartiest Congratulations! The Expert Evaluation Committee has reviewed your idea presentation and shortlisted your team for the GRAND FINALE of AITHON 2.0!\n\n" +
    "----------------------------------------------------------\n" +
    "QUALIFIED TEAM SUMMARY\n" +
    "----------------------------------------------------------\n" +
    "• Team Name         : " + teamName + "\n" +
    "• Team ID           : " + teamId + "\n" +
    "• Registration ID   : " + regId + "\n" +
    "• Team Leader       : " + leadName + (data.leadCollege ? " (" + data.leadCollege + ")" : "") + "\n" +
    "• Leader Email      : " + recipient + "\n" +
    (data.members && data.members.length > 0 ? ("• Team Members      : " + data.members.join(", ") + "\n") : "") +
    "• Project Domain   : " + (data.selectedDomain || "Software") + "\n" +
    "• Competition Track : " + (data.selectedTrack || "General AI Track") + "\n" +
    "• Team Size         : " + teamSize + " Members\n" +
    "• Status            : SHORTLISTED FOR FINALE (ROUND 2)\n" +
    "• Submission Cutoff : 15 October, 12:00 AM (Midnight) [STRICT DEADLINE]\n\n" +
    "----------------------------------------------------------\n" +
    "MANDATORY STEP: FINAL PAYMENT & SEAT CONFIRMATION\n" +
    "----------------------------------------------------------\n" +
    "To officially reserve and lock your team's physical seat & workstation at AVCOE Sangamner, your team must complete the Round 2 registration fee and submit the payment proof & team data on our official Google Form.\n\n" +
    "⚠️ STRICT DEADLINE & REGISTRATION CUTOFF:\n" +
    "• Deadline: 15 October, 12:00 AM (Midnight)\n" +
    "• Final payment and data submission on the Google Form must be completed on or before 15 October, 12:00 AM.\n" +
    "• After 15 October, the form will close and STRICTLY NO TEAMS will be allowed for second round registration under any circumstances. Unconfirmed seats will be forfeited.\n\n" +
    "• Fee Calculation   : " + teamSize + " Members × ₹200/member\n" +
    "• Total Team Fee    : ₹" + feeAmount + " (Fixed for entire team)\n" +
    "• Payment Mode      : UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)\n" +
    "• Official UPI ID   : " + upiVpa + "\n" +
    "• Beneficiary Name  : Mr Shri Avinash Ugale\n" +
    "• Payment Remark    : " + teamId + " Finale Fee\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL FINAL PAYMENT FORM LINK (SUBMIT PAYMENT PROOF):\n" +
    "----------------------------------------------------------\n" +
    paymentFormUrl + "\n\n" +
    "HOW TO COMPLETE FINAL PAYMENT CONFIRMATION:\n" +
    "1. Pay the exact fee of ₹" + feeAmount + " via UPI to: " + upiVpa + "\n" +
    "2. Copy the 12-digit UPI Reference / UTR Number and take a screenshot of the successful transaction.\n" +
    "3. Open the Official Final Payment Google Form:\n" +
    "   " + paymentFormUrl + "\n" +
    "4. Fill in your Team ID (" + teamId + "), Registration ID (" + regId + "), Leader details, UTR Number, and upload payment screenshot.\n" +
    "5. Submit the form on or before 15 October, 12:00 AM. After 15 October, no submissions will be accepted!\n" +
    "6. Our organizing team will verify your payment and confirm your team's physical workstation and entry passes.\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL WHATSAPP COMMUNITY FOR FINALISTS:\n" +
    "----------------------------------------------------------\n" +
    WHATSAPP_COMMUNITY_URL + "\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Department of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering, Sangamner";

  // Highly Professional Institutional HTML Email in Times New Roman
  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 - Official Selection &amp; Grand Finale Notification</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 28px 12px; background-color: #f4f6f9; font-family: \'Times New Roman\', Times, Georgia, serif; color: #1e293b; line-height: 1.65;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 660px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #cbd5e1; font-family: \'Times New Roman\', Times, Georgia, serif;">' +
    '    <!-- Brand Logo Header -->' +
    '    <tr>' +
    '      <td style="background-color: #ffffff; padding: 24px 20px 18px 20px; text-align: center; border-bottom: 2px solid #062b59;">' +
    '        <a href="' + WEBSITE_URL + '" target="_blank" style="text-decoration: none; display: inline-block;">' +
    '          <img src="' + LOGO_IMAGE_URL + '" alt="AITHON 2.0 - National Level AI Hackathon" width="280" style="width: 280px; max-width: 85%; height: auto; border: 0; display: block; margin: 0 auto;" />' +
    '        </a>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Institutional Header -->' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 26px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #93c5fd; margin-bottom: 6px;">' +
    '          National Level AI Hackathon' +
    '        </div>' +
    '        <div style="font-size: 22px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 6px; color: #ffffff;">' +
    '          ROUND 1 EVALUATION: SELECTED FOR GRAND FINALE' +
    '        </div>' +
    '        <div style="font-size: 14px; color: #e2e8f0; font-style: italic;">' +
    '          Department of Artificial Intelligence &amp; Data Science<br>Amrutvahini College of Engineering (AVCOE), Sangamner' +
    '        </div>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Main Body Content -->' +
    '    <tr>' +
    '      <td style="padding: 34px 30px;">' +
    '        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 22px;">' +
    '          <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #059669; color: #065f46; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 4px; margin-bottom: 12px;">' +
    '            Official Notification of Selection' +
    '          </div>' +
    '          <p style="font-size: 16px; margin: 0; color: #0f172a;">' +
    '            Dear <strong>' + leadName + '</strong> and Respected Members of <strong>' + teamName + '</strong>,' +
    '          </p>' +
    '        </div>' +
    '        <p style="font-size: 15px; color: #1e293b; margin: 0 0 20px 0; text-align: justify; line-height: 1.7;">' +
    '          We are pleased to inform you that following a comprehensive review of problem innovation, practical feasibility, technical architecture, and impact by our Expert Evaluation Committee, your team has been <strong>OFFICIALLY SHORTLISTED</strong> to compete in the offline Grand Finale of <strong>AITHON 2.0</strong> at Amrutvahini College of Engineering, Sangamner.' +
    '        </p>' +

    '        <!-- STRICT DEADLINE WARNING BOX -->' +
    '        <div style="background-color: #fef2f2; border: 2px solid #b91c1c; border-left: 6px solid #991b1b; border-radius: 8px; padding: 18px 20px; margin-bottom: 26px;">' +
    '          <div style="font-size: 13.5px; font-weight: bold; color: #991b1b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">' +
    '            ⚠️ CRITICAL DEADLINE: 15 OCTOBER, 12:00 AM (MIDNIGHT)' +
    '          </div>' +
    '          <div style="font-size: 17px; font-weight: bold; color: #7f1d1d; margin-bottom: 8px;">' +
    '            Final Payment &amp; Form Submission Cutoff' +
    '          </div>' +
    '          <p style="margin: 0; font-size: 14.5px; color: #7f1d1d; line-height: 1.6; text-align: justify;">' +
    '            Final payment and submission of team details on the official Google Form must be completed on or before <strong>15 October, 12:00 AM</strong>. After 15 October, the registration portal will close permanently and <u>strictly no teams will be allowed for second round registration</u> under any circumstances. Unconfirmed seats will be allocated to waitlisted candidates.' +
    '          </p>' +
    '        </div>' +

    '        <!-- Summary Table -->' +
    '        <div style="font-size: 15px; font-weight: bold; color: #062b59; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #062b59; padding-bottom: 4px;">' +
    '          I. Qualified Team Credentials' +
    '        </div>' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fafbfc; border: 1px solid #cbd5e1; border-radius: 6px; margin-bottom: 28px; font-family: \'Times New Roman\', Times, Georgia, serif;">' +
    '          <tr>' +
    '            <td style="padding: 16px 20px;">' +
    '              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" style="font-size: 14px; border-collapse: collapse;">' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; width: 36%; font-weight: bold;">Team Identifier:</td>' +
    '                  <td><strong style="color: #c2410c; font-size: 15px;">' + teamId + '</strong></td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Registration ID:</td>' +
    '                  <td><strong style="color: #062b59; font-size: 15px;">' + regId + '</strong></td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Team Name:</td>' +
    '                  <td style="font-weight: bold; color: #0f172a; font-size: 15px;">' + teamName + '</td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Team Leader:</td>' +
    '                  <td style="color: #0f172a;"><strong>' + leadName + '</strong>' + (data.leadCollege ? (' (' + data.leadCollege + ')') : '') + '</td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Leader Email:</td>' +
    '                  <td style="color: #334155;">' + recipient + '</td>' +
    '                </tr>' +
    (data.members && data.members.length > 0 ? ('                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Registered Members:</td>' +
    '                  <td style="color: #1e293b;">' + data.members.join(', ') + '</td>' +
    '                </tr>') : '') +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Domain:</td>' +
    '                  <td style="font-weight: bold; color: #0f172a;">' + (data.selectedDomain || 'Software') + '</td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Competition Track:</td>' +
    '                  <td style="font-weight: bold; color: #1d4ed8;">' + (data.selectedTrack || 'General AI Track') + '</td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Team Size:</td>' +
    '                  <td style="color: #0f172a;">' + teamSize + ' Members</td>' +
    '                </tr>' +
    '                <tr style="border-bottom: 1px solid #e2e8f0;">' +
    '                  <td style="color: #475569; font-weight: bold;">Current Status:</td>' +
    '                  <td><strong style="color: #047857;">Qualified for Offline Grand Finale (Round 2)</strong></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #475569; font-weight: bold;">Submission Deadline:</td>' +
    '                  <td><strong style="color: #b91c1c;">15 October, 12:00 AM (Midnight) [Strict Cutoff]</strong></td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +

    '        <!-- OFFICIAL FINAL PAYMENT FORM CARD -->' +
    '        <div style="font-size: 15px; font-weight: bold; color: #062b59; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #062b59; padding-bottom: 4px;">' +
    '          II. Final Payment &amp; Workstation Confirmation Procedure' +
    '        </div>' +
    '        <div style="background-color: #fafbfc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px 22px; margin-bottom: 28px;">' +
    '          <div style="text-align: center; margin-bottom: 18px;">' +
    '            <div style="font-size: 13px; font-weight: bold; color: #065f46; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px;">' +
    '              Mandatory Round 2 Team Registration Fee' +
    '            </div>' +
    '            <div style="font-size: 14px; color: #475569; margin-bottom: 4px;">' +
    '              ' + teamSize + ' Team Members &times; ₹200 per member' +
    '            </div>' +
    '            <div style="font-size: 38px; font-weight: bold; color: #064e3b; margin: 4px 0 10px 0;">' +
    '              ₹' + feeAmount +
    '            </div>' +
    '            <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 5px 14px; border-radius: 4px; font-size: 13px; font-weight: bold;">' +
    '              Cutoff Date: 15 October, 12:00 AM (Midnight)' +
    '            </div>' +
    '          </div>' +

    '          <!-- UPI Details Box -->' +
    '          <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 14px 18px; margin-bottom: 20px; font-size: 14px;">' +
    '            <div style="font-weight: bold; color: #062b59; margin-bottom: 8px; font-size: 14.5px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px dashed #cbd5e1; padding-bottom: 4px;">' +
    '              Official UPI Payment Coordinates:' +
    '            </div>' +
    '            <div style="margin-bottom: 5px; color: #1e293b;"><strong>UPI ID:</strong> <span style="font-weight: bold; color: #065f46; background-color: #ecfdf5; padding: 2px 8px; border: 1px solid #a7f3d0; border-radius: 3px;">' + upiVpa + '</span></div>' +
    '            <div style="margin-bottom: 5px; color: #1e293b;"><strong>Beneficiary Name:</strong> Mr Shri Avinash Ugale</div>' +
    '            <div style="color: #1e293b;"><strong>Mandatory Payment Remark:</strong> <strong style="color: #062b59;">' + teamId + ' Finale Fee</strong></div>' +
    '          </div>' +

    '          <!-- Step by Step Instructions -->' +
    '          <div style="font-size: 14px; line-height: 1.7; color: #1e293b; margin-bottom: 22px;">' +
    '            <div style="font-weight: bold; color: #062b59; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">' +
    '              Instructions to Complete Final Verification:' +
    '            </div>' +
    '            <ol style="margin: 0; padding-left: 22px;">' +
    '              <li style="margin-bottom: 6px;">Remit the exact amount of <strong>₹' + feeAmount + '</strong> via any UPI application (Google Pay, PhonePe, Paytm, BHIM) to UPI ID <strong>' + upiVpa + '</strong>.</li>' +
    '              <li style="margin-bottom: 6px;">Record the <strong>12-digit UPI Reference / UTR Number</strong> and obtain a clear screenshot of the transaction confirmation.</li>' +
    '              <li style="margin-bottom: 6px;">Access the <strong>Official Final Payment Google Form</strong> via the button below.</li>' +
    '              <li style="margin-bottom: 6px;">Provide your <strong>Team ID (' + teamId + ')</strong>, <strong>Registration ID (' + regId + ')</strong>, participant details, transaction UTR, and upload the payment proof.</li>' +
    '              <li style="color: #991b1b; font-weight: bold;">Ensure submission is completed prior to 15 October, 12:00 AM (Midnight). Submissions will not be accepted after this cutoff.</li>' +
    '            </ol>' +
    '          </div>' +

    '          <!-- Primary CTA Button -->' +
    '          <div style="text-align: center; margin-bottom: 14px;">' +
    '            <a href="' + paymentFormUrl + '" target="_blank" style="display: inline-block; background-color: #062b59; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 15px; padding: 14px 28px; border-radius: 6px; border: 1px solid #062b59; text-transform: uppercase; letter-spacing: 0.5px; font-family: \'Times New Roman\', Times, Georgia, serif;">' +
    '              Submit Final Payment &amp; Team Details Form &rarr;' +
    '            </a>' +
    '          </div>' +

    '          <!-- Direct URL Link fallback -->' +
    '          <div style="font-size: 12.5px; color: #475569; text-align: center; word-break: break-all;">' +
    '            Direct Link: <a href="' + paymentFormUrl + '" target="_blank" style="color: #062b59; font-weight: bold; text-decoration: underline;">' + paymentFormUrl + '</a>' +
    '          </div>' +
    '        </div>' +

    '        <!-- WhatsApp Community Link -->' +
    '        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 6px; padding: 16px 20px; text-align: center; margin-bottom: 26px;">' +
    '          <div style="font-size: 14px; color: #166534; font-weight: bold; margin-bottom: 6px;">' +
    '            Official WhatsApp Community for Shortlisted Finalists:' +
    '          </div>' +
    '          <div style="font-size: 13px; color: #14532d; margin-bottom: 10px;">' +
    '            All competition guidelines, lab workstation schedules, and reporting updates will be communicated here.' +
    '          </div>' +
    '          <a href="' + WHATSAPP_COMMUNITY_URL + '" target="_blank" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13.5px; padding: 9px 20px; border-radius: 4px; font-family: \'Times New Roman\', Times, Georgia, serif;">Join Official WhatsApp Community &rarr;</a>' +
    '        </div>' +

    '        <!-- Formal Sign-Off -->' +
    '        <div style="border-top: 1px solid #cbd5e1; padding-top: 18px; font-size: 14px; color: #334155; line-height: 1.6;">' +
    '          <p style="margin: 0 0 4px 0;">With warm regards,</p>' +
    '          <p style="margin: 0; font-weight: bold; color: #062b59; font-size: 15px;">Organizing Committee — AITHON 2.0</p>' +
    '          <p style="margin: 0; color: #475569;">Department of Artificial Intelligence &amp; Data Science</p>' +
    '          <p style="margin: 0; color: #475569;">Amrutvahini College of Engineering (AVCOE), Sangamner</p>' +
    '          <p style="margin: 4px 0 0 0; font-size: 12.5px; color: #64748b; font-style: italic;">Sangamner, District Ahmednagar, Maharashtra - 422608 | <a href="' + WEBSITE_URL + '" target="_blank" style="color: #062b59;">aithon2-0.xyz</a></p>' +
    '        </div>' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

  sendEmailSafe(recipient, subject, plainText, htmlBody);
}

/**
 * SENDS RESPECTFUL PPT REJECTION & PARTICIPATION APPRECIATION EMAIL
 */
function sendPptRejectionEmail(data) {
  var recipient = data.leadEmail;
  var teamName = data.teamName || "Team";
  var teamId = data.teamId || "N/A";
  var regId = data.registrationId || "N/A";
  var leadName = data.leadFullName || "Team Leader";

  var subject = "AITHON 2.0 — Presentation Review Result for " + teamName + " [" + teamId + "]";

  // Plain Text Version
  var plainText =
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "PRESENTATION EVALUATION UPDATE\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + " and Members of " + teamName + ",\n\n" +
    "Thank you for registering and submitting your idea presentation for AITHON 2.0.\n\n" +
    "Our evaluation jury carefully reviewed all submitted projects based on Technical Innovation, Practical Feasibility, Architecture Depth, and Clarity. We received an exceptionally high volume of competitive submissions from institutions across the country.\n\n" +
    "Due to venue capacity and strict shortlisting cutoffs, we regret to inform you that your team could not be shortlisted for the offline Grand Finale this year.\n\n" +
    "----------------------------------------------------------\n" +
    "PARTICIPATION CERTIFICATES\n" +
    "----------------------------------------------------------\n" +
    "Every member of your team will receive an official AITHON 2.0 E-Certificate of Participation in recognition of your project submission and effort. Certificates will be dispatched to your registered email IDs after the conclusion of the event.\n\n" +
    "We commend your dedication and encouraging spirit towards solving problems with AI. We look forward to seeing your future projects and welcoming you in upcoming hackathons!\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  // Modern HTML Email Template for Rejection / Appreciation
  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 Presentation Review Result</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.07); border: 1px solid #e2e8f0;">' +
    '    <!-- Brand Logo Header -->' +
    '    <tr>' +
    '      <td style="background-color: #ffffff; padding: 26px 20px 20px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">' +
    '        <a href="' + WEBSITE_URL + '" target="_blank" style="text-decoration: none; display: inline-block;">' +
    '          <img src="' + LOGO_IMAGE_URL + '" alt="AITHON 2.0 - National Level AI Hackathon" width="280" style="width: 280px; max-width: 85%; height: auto; border: 0; display: block; margin: 0 auto;" />' +
    '        </a>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Brand Header -->' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 26px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(148,163,184,0.2); border: 1px solid #94a3b8; color: #cbd5e1; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          National Level AI Hackathon' +
    '        </div>' +
    '        <div style="font-size: 12.5px; color: #cbd5e1; margin-top: 4px; font-weight: 500;">Dept. of Artificial Intelligence &amp; Data Science • AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Main Content -->' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <div style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px;">' +
    '          Evaluation Update' +
    '        </div>' +
    '        <h2 style="margin: 0 0 14px 0; color: #062b59; font-size: 21px; font-weight: 800; letter-spacing: -0.5px;">' +
    '          Presentation Review Result' +
    '        </h2>' +
    '        <p style="font-size: 14.5px; margin: 0 0 14px 0; color: #0f172a;">' +
    '          Dear <strong>' + leadName + '</strong> and Members of <strong>' + teamName + '</strong>,' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 16px 0; line-height: 1.6;">' +
    '          Thank you for participating and submitting your idea presentation for <strong>AITHON 2.0</strong> (' + teamId + ').' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 16px 0; line-height: 1.6;">' +
    '          Our evaluation panel conducted a detailed review of all project submissions based on problem innovation, engineering feasibility, technical architecture, and impact. We received an exceptionally competitive pool of solutions this year.' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 22px 0; line-height: 1.6;">' +
    '          Due to strict physical lab seat limitations for the offline finale, we regret to inform you that your team was <strong>not shortlisted</strong> for Round 2 this year.' +
    '        </p>' +
    '        <!-- Certificate Box -->' +
    '        <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #2563eb; border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;">' +
    '          <div style="font-size: 12px; font-weight: 800; color: #062b59; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">' +
    '            E-Certificate of Participation' +
    '          </div>' +
    '          <p style="font-size: 12.5px; color: #475569; margin: 0; line-height: 1.5;">' +
    '            In recognition of your technical submission and participation, all registered team members will receive an official verifiable <strong>AITHON 2.0 E-Certificate of Participation</strong> after the event.' +
    '          </p>' +
    '        </div>' +

    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 24px 0; line-height: 1.6;">' +
    '          We applaud the creative problem-solving and hard work demonstrated by your team. We encourage you to continue refining your ideas and look forward to welcoming you to future technology challenges at AVCOE.' +
    '        </p>' +

    '        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">' +
    '          Best regards,<br>' +
    '          <strong style="color: #062b59;">Organizing Committee — AITHON 2.0</strong><br>' +
    '          Department of Artificial Intelligence & Data Science<br>' +
    '          Amrutvahini College of Engineering, Sangamner' +
    '        </p>' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

  sendEmailSafe(recipient, subject, plainText, htmlBody);
}

/**
 * SENDS INITIAL REGISTRATION & EVALUATION FEE PAYMENT VERIFICATION EMAIL
 * Triggered when Column 42 ("Eval Fee Status") is verified by the committee.
 * Confirms payment via bank UTR without requiring or mentioning payment upload.
 */
function sendConfirmationEmail(data) {
  var recipient = data.leadEmail;
  if (!recipient || recipient.indexOf("@") === -1) {
    Logger.log("No valid recipient email provided: " + recipient);
    return;
  }

  var teamId = data.teamId || "N/A";
  var regId = data.registrationId || "N/A";
  var teamName = data.teamName || "N/A";
  var leadName = data.leadFullName || "Team Leader";
  var teamSize = data.teamSize || "4";
  var pptLink = data.pptDriveUrl || "";
  var utrNumber = data.utr || "Verified";

  var subject = "[VERIFIED] AITHON 2.0 Evaluation Fee Confirmed — " + teamName + " [" + teamId + "]";

  var plainText = 
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + ",\n\n" +
    "Congratulations! Your team's ₹50 Round 1 Evaluation Fee has been successfully verified, and your team registration for AITHON 2.0 is officially confirmed.\n\n" +
    "Your payment was validated directly through your 12-digit banking reference (UTR). Your team is now registered and queued for Round 1 technical evaluation.\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL REGISTRATION & PAYMENT VERIFICATION SUMMARY\n" +
    "----------------------------------------------------------\n" +
    "• Team Name           : " + teamName + "\n" +
    "• Team ID             : " + teamId + "\n" +
    "• Registration ID     : " + regId + "\n" +
    "• Team Leader         : " + leadName + (data.leadCollege ? " (" + data.leadCollege + ")" : "") + "\n" +
    "• Leader Email        : " + recipient + "\n" +
    (data.leadPhone ? ("• Leader Phone        : " + data.leadPhone + "\n") : "") +
    (data.members && data.members.length > 0 ? ("• Team Members        : " + data.members.join(", ") + "\n") : "") +
    "• Project Domain      : " + (data.selectedDomain || "Software") + "\n" +
    "• Competition Track   : " + (data.selectedTrack || "General AI Track") + "\n" +
    "• Team Size           : " + teamSize + " Members\n" +
    "• Evaluation Fee      : ₹50 Paid & Verified\n" +
    "• Payment UTR         : " + utrNumber + "\n" +
    "• Evaluation Status   : Confirmed for Round 1 Jury Review\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL ASSOCIATE SPONSORS\n" +
    "----------------------------------------------------------\n" +
    "• Choudhary Estate Agency — Premier Real Estate & Property Advisory\n" +
    "• Yuva Polyprint & Packaging Industries — Polyprint & Packaging Solutions\n\n" +
    "----------------------------------------------------------\n" +
    "ACTION REQUIRED: JOIN OFFICIAL WHATSAPP COMMUNITY\n" +
    "----------------------------------------------------------\n" +
    "Stay tuned for evaluation results, shortlisted announcements, and schedules:\n" +
    "Join WhatsApp Community: " + WHATSAPP_COMMUNITY_URL + "\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Department of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering, Sangamner";

  var htmlBody = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 Evaluation Fee Verified</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.07); border: 1px solid #e2e8f0;">' +
    '    <!-- Brand Logo Header -->' +
    '    <tr>' +
    '      <td style="background-color: #ffffff; padding: 26px 20px 20px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">' +
    '        <a href="' + WEBSITE_URL + '" target="_blank" style="text-decoration: none; display: inline-block;">' +
    '          <img src="' + LOGO_IMAGE_URL + '" alt="AITHON 2.0 - National Level AI Hackathon" width="280" style="width: 280px; max-width: 85%; height: auto; border: 0; display: block; margin: 0 auto;" />' +
    '        </a>' +
    '      </td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 26px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(37,99,235,0.3); border: 1px solid #38bdf8; color: #93c5fd; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          National Level AI Hackathon' +
    '        </div>' +
    '        <div style="font-size: 18px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 4px; color: #ffffff;">' +
    '          ROUND 1: EVALUATION FEE PAYMENT VERIFIED' +
    '        </div>' +
    '        <div style="font-size: 12.5px; color: #cbd5e1; font-weight: 500;">Dept. of Artificial Intelligence &amp; Data Science • AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px;">' +
    '          &#10003; Payment Verified &amp; Confirmed' +
    '        </div>' +
    '        <h2 style="margin: 0 0 12px 0; color: #062b59; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">' +
    '          ₹50 Evaluation Fee Verified' +
    '        </h2>' +
    '        <p style="font-size: 15px; margin: 0 0 14px 0; color: #0f172a;">' +
    '          Dear <strong>' + leadName + '</strong>,' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 20px 0; line-height: 1.6;">' +
    '          Congratulations! Your team\'s <strong>₹50 Round 1 Evaluation Fee</strong> has been successfully verified via banking reference. Your team registration is officially confirmed, and your entry is queued for Round 1 technical evaluation.' +
    '        </p>' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td style="padding: 18px 20px;">' +
    '              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">' +
    '                Registration &amp; Payment Summary' +
    '              </div>' +
    '              <table role="presentation" width="100%" cellspacing="0" cellpadding="5" style="font-size: 13px;">' +
    '                <tr>' +
    '                  <td style="color: #64748b; width: 38%;">Team ID:</td>' +
    '                  <td><span style="font-family: monospace; font-weight: 800; color: #ea580c; background-color: #fff7ed; border: 1px solid #fed7aa; padding: 3px 10px; border-radius: 6px;">' + teamId + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Registration ID:</td>' +
    '                  <td><span style="font-family: monospace; font-weight: 800; color: #062b59; background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 6px;">' + regId + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Name:</td>' +
    '                  <td style="font-weight: 700; color: #0f172a;">' + teamName + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Leader:</td>' +
    '                  <td style="font-weight: 700; color: #0f172a;">' + leadName + (data.leadCollege ? (' <span style="font-weight: normal; color: #64748b;">(' + data.leadCollege + ')</span>') : '') + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Leader Contact:</td>' +
    '                  <td style="color: #334155;">' + recipient + (data.leadPhone ? (' • ' + data.leadPhone) : '') + '</td>' +
    '                </tr>' +
    (data.members && data.members.length > 0 ? ('                <tr>' +
    '                  <td style="color: #64748b;">Team Members:</td>' +
    '                  <td style="color: #334155; font-weight: 600;">' + data.members.join(', ') + '</td>' +
    '                </tr>') : '') +
    '                <tr>' +
    '                  <td style="color: #64748b;">Project Domain:</td>' +
    '                  <td style="font-weight: 700; color: #0f172a;"><span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; padding: 2px 8px; border-radius: 4px; font-weight: 700;">' + (data.selectedDomain || 'Software') + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Competition Track:</td>' +
    '                  <td style="font-weight: 700; color: #2563eb;">' + (data.selectedTrack || 'General AI Track') + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Size:</td>' +
    '                  <td style="color: #0f172a;">' + teamSize + ' Members</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Evaluation Fee:</td>' +
    '                  <td><span style="color: #047857; font-weight: 700;">&#10003; ₹50 Verified &amp; Confirmed</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Payment UTR:</td>' +
    '                  <td><span style="font-family: monospace; font-weight: 700; color: #062b59;">' + utrNumber + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Round 1 Status:</td>' +
    '                  <td><strong style="color: #047857;">&#10003; Enrolled for Jury Evaluation</strong></td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- Official Associate Sponsors Card -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #fed7aa; border-radius: 12px; margin-bottom: 24px; overflow: hidden; box-shadow: 0 2px 8px rgba(234,88,12,0.06);">' +
    '          <tr>' +
    '            <td colspan="2" style="background-color: #fff7ed; padding: 7px 16px; border-bottom: 1px solid #fed7aa; font-size: 10px; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: 1px; text-align: center;">' +
    '              Official Associate Sponsors' +
    '            </td>' +
    '          </tr>' +
    '          <tr>' +
    '            <td width="50%" style="padding: 16px 12px; text-align: center; vertical-align: middle; border-right: 1px solid #fef3c7;">' +
    '              <img src="' + WEBSITE_URL + '/choudhary_logo.png" alt="Choudhary Estate Agency" width="170" style="width: 170px; max-width: 90%; height: auto; display: block; margin: 0 auto 6px auto;" />' +
    '              <div style="font-size: 12.5px; font-weight: 800; color: #062b59; margin-top: 4px;">Choudhary Estate Agency</div>' +
    '              <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">Real Estate &amp; Property Advisory</div>' +
    '            </td>' +
    '            <td width="50%" style="padding: 16px 12px; text-align: center; vertical-align: middle;">' +
    '              <img src="' + WEBSITE_URL + '/yuva_polyprint_logo.png" alt="Yuva Polyprint &amp; Packaging Industries" width="170" style="width: 170px; max-width: 90%; height: auto; display: block; margin: 0 auto 6px auto;" />' +
    '              <div style="font-size: 12.5px; font-weight: 800; color: #062b59; margin-top: 4px;">Yuva Polyprint &amp; Packaging</div>' +
    '              <div style="font-size: 10.5px; color: #64748b; margin-top: 2px;">Polyprint &amp; Packaging Solutions</div>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- WhatsApp Community -->' +
    '        <div style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 22px 20px; text-align: center; margin-bottom: 26px;">' +
    '          <div style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 10px;">' +
    '            Mandatory For Team Leaders' +
    '          </div>' +
    '          <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 18px; font-weight: 800;">Join Official WhatsApp Community</h3>' +
    '          <p style="font-size: 13px; color: #166534; margin: 0 0 16px 0;">All screening results, problem statements, and schedules are shared here.</p>' +
    '          <a href="' + WHATSAPP_COMMUNITY_URL + '" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 26px; border-radius: 8px;">Join WhatsApp Community &rarr;</a>' +
    '        </div>' +
    '        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">' +
    '          Best regards,<br>' +
    '          <strong style="color: #062b59;">Organizing Committee — AITHON 2.0</strong><br>' +
    '          Department of Artificial Intelligence & Data Science<br>' +
    '          Amrutvahini College of Engineering, Sangamner' +
    '        </p>' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

  sendEmailSafe(recipient, subject, plainText, htmlBody);
}

/**
 * SENDS PAYMENT INCOMPLETE / REJECTED WARNING EMAIL
 * Dispatched when a team's registration is attempted without confirmed ₹50 payment.
 */
function sendPaymentProblemEmail(data) {
  var recipient = data.leadEmail;
  if (!recipient || recipient.indexOf("@") === -1) return;

  var teamId = data.teamId || "N/A";
  var regId = data.registrationId || "N/A";
  var teamName = data.teamName || "N/A";
  var leadName = data.leadFullName || "Team Leader";
  var upiId = UPI_VPA;

  var subject = "[PAYMENT REQUIRED] AITHON 2.0 Registration On Hold - " + teamName + " [" + teamId + "]";

  var plainText =
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "PAYMENT ACTION REQUIRED — REGISTRATION ON HOLD\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + ",\n\n" +
    "We received your team registration attempt for " + teamName + " [" + teamId + "], but the mandatory ₹50 evaluation fee was NOT completed, was rejected, or could not be verified.\n\n" +
    "YOUR REGISTRATION IS CURRENTLY ON HOLD.\n" +
    "Without verified payment confirmation, your idea presentation cannot be reviewed by the jury panel, and official registration confirmation will NOT be issued.\n\n" +
    "----------------------------------------------------------\n" +
    "COMPLETE YOUR PAYMENT TO ACTIVATE YOUR REGISTRATION:\n" +
    "----------------------------------------------------------\n" +
    "1. Pay the ₹50 team evaluation fee via UPI to official ID:\n" +
    "   UPI ID: " + upiId + "\n" +
    "   Amount: ₹50\n\n" +
    "2. After completing payment, reply directly to this email (shivaji.wathore@avcoe.org) with:\n" +
    "   • Team ID: " + teamId + "\n" +
    "   • 12-digit UPI UTR / Transaction Reference Number\n\n" +
    "Our committee will verify your payment against bank records and activate your registration.\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 Payment Incomplete</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.07); border: 1px solid #e2e8f0;">' +
    '    <!-- Brand Logo Header -->' +
    '    <tr>' +
    '      <td style="background-color: #ffffff; padding: 26px 20px 20px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">' +
    '        <a href="' + WEBSITE_URL + '" target="_blank" style="text-decoration: none; display: inline-block;">' +
    '          <img src="' + LOGO_IMAGE_URL + '" alt="AITHON 2.0 - National Level AI Hackathon" width="280" style="width: 280px; max-width: 85%; height: auto; border: 0; display: block; margin: 0 auto;" />' +
    '        </a>' +
    '      </td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td style="background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); padding: 26px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border: 1px solid #fca5a5; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          Action Required • Payment Pending' +
    '        </div>' +
    '        <div style="font-size: 12.5px; color: #fecaca; margin-top: 4px; font-weight: 500;">Registration On Hold • Payment Confirmation Required</div>' +
    '      </td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <div style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;">' +
    '          Registration On Hold' +
    '        </div>' +
    '        <h2 style="margin: 0 0 14px 0; color: #991b1b; font-size: 21px; font-weight: 800; letter-spacing: -0.5px;">' +
    '          ₹50 Evaluation Fee Not Confirmed' +
    '        </h2>' +
    '        <p style="font-size: 14.5px; margin: 0 0 14px 0; color: #0f172a;">' +
    '          Dear <strong>' + leadName + '</strong>,' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 18px 0; line-height: 1.6;">' +
    '          We received an application attempt for <strong>' + teamName + '</strong> (' + teamId + '), but the mandatory <strong>₹50 team evaluation fee</strong> was either cancelled, rejected, or unverified.' +
    '        </p>' +
    '        <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 14px 16px; border-radius: 6px; margin-bottom: 22px; font-size: 13px; color: #9a3412;">' +
    '          <strong>Please Note:</strong> Without verified payment, your idea presentation <strong>will NOT be evaluated</strong> by the jury panel and official registration confirmation will not be issued.' +
    '        </div>' +
    '        <div style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px 20px; text-align: center; margin-bottom: 24px;">' +
    '          <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">' +
    '            Mandatory Evaluation Fee' +
    '          </div>' +
    '          <div style="font-size: 32px; font-weight: 900; color: #062b59; margin-bottom: 12px;">' +
    '            ₹50 per team' +
    '          </div>' +
    '          <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 10px 16px; margin-bottom: 12px; display: inline-block;">' +
    '            <span style="font-size: 11px; color: #1e40af; font-weight: 700; text-transform: uppercase;">Official UPI ID: </span>' +
    '            <span style="font-family: monospace; font-size: 15px; font-weight: 800; color: #1e3a8a;">' + upiId + '</span>' +
    '          </div>' +
    '          <div style="font-size: 12px; color: #64748b;">' +
    '            Pay using Google Pay, PhonePe, Paytm, or BHIM & reply with 12-digit UTR' +
    '          </div>' +
    '        </div>' +
    '        <p style="font-size: 13px; color: #475569; margin-bottom: 16px; line-height: 1.6;">' +
    '          <strong>Already Paid?</strong> If the amount was debited from your account, please reply directly to this email (<strong style="color: #062b59;">shivaji.wathore@avcoe.org</strong>) with your 12-digit UPI UTR number to verify and activate your registration immediately.' +
    '        </p>' +
    '        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">' +
    '          Best regards,<br>' +
    '          <strong style="color: #062b59;">Organizing Committee — AITHON 2.0</strong><br>' +
    '          Department of Artificial Intelligence & Data Science<br>' +
    '          Amrutvahini College of Engineering, Sangamner' +
    '        </p>' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

  sendEmailSafe(recipient, subject, plainText, htmlBody);
}

/**
 * Helper to send email via GmailApp with MailApp fallback
 */
function sendEmailSafe(recipient, subject, plainText, htmlBody) {
  var replyToEmail = "shivaji.wathore@avcoe.org";
  
  // Check remaining daily email quota
  var quotaRemaining = MailApp.getRemainingDailyQuota();
  if (quotaRemaining <= 0) {
    Logger.log("⚠️ Daily email quota reached (0 remaining). Cannot send email to: " + recipient);
    return false;
  }

  try {
    GmailApp.sendEmail(recipient, subject, plainText, {
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee",
      replyTo: replyToEmail
    });
    Logger.log("Email dispatched via GmailApp to: " + recipient + " (Quota remaining: " + (quotaRemaining - 1) + ")");
    return true;
  } catch (gErr) {
    Logger.log("GmailApp warning, trying MailApp: " + gErr.toString());
    try {
      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        body: plainText,
        htmlBody: htmlBody,
        name: "AITHON 2.0 Organizing Committee",
        replyTo: replyToEmail
      });
      Logger.log("Email dispatched via MailApp to: " + recipient);
      return true;
    } catch (mErr) {
      Logger.log("❌ Failed to send email to " + recipient + ": " + mErr.toString());
      return false;
    }
  }
}

/**
 * 📁 1-Click PPT Folder Creator inside shivaji.wathore@avcoe.org Google Drive
 * Eliminates all cross-domain permission errors by creating a dedicated folder natively!
 */
function setupPptFolderInDrive() {
  var folder = DriveApp.createFolder("AITHON 2.0 PPT Submissions");
  try {
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  var folderId = folder.getId();
  var folderUrl = folder.getUrl();

  Logger.log("==========================================");
  Logger.log("✓ NEW PPT FOLDER CREATED IN DRIVE!");
  Logger.log("Folder Name: AITHON 2.0 PPT Submissions");
  Logger.log("Folder ID: " + folderId);
  Logger.log("Folder URL: " + folderUrl);
  Logger.log("==========================================");

  try {
    SpreadsheetApp.getUi().alert(
      "✓ New PPT Folder Created!\n\n" +
      "Folder ID: " + folderId + "\n\n" +
      "Update PPT_FOLDER_ID on Line 23 with this ID, click Save, then Deploy > Manage Deployments > Edit > New Version > Deploy!"
    );
  } catch (uiErr) {}
  return folderId;
}

/**
 * 🧪 Test Google Drive PPT Upload & Permission Grant:
 */
function testPptDriveUpload() {
  Logger.log("Testing PPT upload to folder ID: " + PPT_FOLDER_ID);
  var folder;
  try {
    folder = DriveApp.getFolderById(PPT_FOLDER_ID);
  } catch (err) {
    Logger.log("Could not open PPT_FOLDER_ID: " + err.toString() + ". Using fallback folder...");
    var folders = DriveApp.getFoldersByName("AITHON 2.0 PPT Submissions");
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder("AITHON 2.0 PPT Submissions");
    }
  }

  var testBlob = Utilities.newBlob("AITHON 2.0 Sample PPT Content", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "TEST-UPLOAD.pptx");
  var file = folder.createFile(testBlob);
  try {
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  } catch (e) {}
  var url = file.getUrl();
  Logger.log("✓ Successfully created test PPT in Drive: " + url);
  return url;
}

/**
 * 🧪 Test Round 2 Acceptance Email Dispatch:
 */
function testSendAcceptanceEmail() {
  var dummy = {
    leadEmail: "shivaji.wathore@avcoe.org",
    leadFullName: "Umesh Khairnar",
    teamName: "Neural Nexus",
    teamId: "TEAM-101",
    registrationId: "AI25-101",
    teamSize: 4,
    feeAmount: 800,
    paymentLink: getRound2PaymentLink(4, "TEAM-101")
  };
  sendPptAcceptanceEmail(dummy);
  Logger.log("Test Acceptance email dispatched to shivaji.wathore@avcoe.org!");
}

/**
 * Records any payment that could not be matched automatically to a team
 * into the "Unmatched_Payments" tab so no payment is ever lost.
 */
function recordUnmatchedPayment(payId, amount, email, phone, name, method, notes, reason) {
  try {
    var ss = getTargetSpreadsheet();
    if (!ss) return;
    var unSheet = ss.getSheetByName("Unmatched_Payments");
    if (!unSheet) {
      unSheet = ss.insertSheet("Unmatched_Payments");
      var unHeaders = [
        "Received Timestamp",
        "Payment ID (Ref)",
        "Amount",
        "Payer Email",
        "Payer Phone",
        "Payer Name",
        "Payment Method / VPA",
        "Notes / Remarks",
        "Status",
        "Assigned Team ID"
      ];
      unSheet.appendRow(unHeaders);
      var hRange = unSheet.getRange(1, 1, 1, unHeaders.length);
      hRange.setBackground("#991b1b").setFontColor("#ffffff").setFontWeight("bold");
      unSheet.setFrozenRows(1);
    }

    var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");
    unSheet.appendRow([
      nowStr,
      payId,
      "₹" + amount,
      email || "-",
      phone ? ("'" + phone) : "-",
      name || "-",
      method || "-",
      notes || "-",
      "⚠️ " + (reason || "Needs Manual Match"),
      ""
    ]);
  } catch (err) {
    Logger.log("Error recording unmatched payment: " + err.toString());
  }
}

/**
 * =========================================================================
 * ⚡ WEBHOOK HANDLER (DISABLED)
 * Direct UPI payments with manual verification are active.
 * =========================================================================
 */
function handleRazorpayWebhook(data, sheet) {
  Logger.log("Razorpay webhook disabled. Direct UPI payments with manual verification are active.");
  return ContentService.createTextOutput(JSON.stringify({
    status: "disabled",
    message: "Razorpay webhook is disabled. Direct UPI payments with manual verification are active."
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * =========================================================================
 * ⚡ DIRECT ROUND 2 PAYMENT CONFIRMATION (via UTR / Form Action)
 * =========================================================================
 */
function handleDirectRound2Confirmation(data, sheet) {
  try {
    if (!sheet) {
      var ss = getTargetSpreadsheet();
      sheet = ss ? ss.getSheetByName("Registrations") : null;
    }
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Registrations sheet not found" })).setMimeType(ContentService.MimeType.JSON);
    }

    // Ensure sheet has at least 49 columns
    if (sheet.getMaxColumns() < 49) {
      sheet.insertColumnsAfter(sheet.getMaxColumns(), 49 - sheet.getMaxColumns());
    }

    var targetTeamId = String(data.teamId || data.id || "").trim().toUpperCase();
    var targetEmail = String(data.leadEmail || data.email || "").trim().toLowerCase();
    var utr = String(data.paymentUtr || data.paymentId || data.utr || "").trim();
    var cleanTarget = targetTeamId.replace(/[^A-Z0-9]/gi, "");

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No teams found in sheet" })).setMimeType(ContentService.MimeType.JSON);
    }

    var values = sheet.getRange(2, 1, lastRow - 1, 49).getValues();
    var matchRow = -1;

    // PASS 1: Strictly match by Team ID or Registration ID first
    if (targetTeamId || cleanTarget) {
      for (var i = 0; i < values.length; i++) {
        var row = values[i];
        var rTeamId = String(row[1] || "").trim().toUpperCase();
        var rRegId = String(row[2] || "").trim().toUpperCase();
        var cleanRTeam = rTeamId.replace(/[^A-Z0-9]/gi, "");
        var cleanRReg = rRegId.replace(/[^A-Z0-9]/gi, "");

        if (rTeamId === targetTeamId || rRegId === targetTeamId) {
          matchRow = i + 2;
          break;
        }
        if (cleanTarget && (cleanRTeam === cleanTarget || cleanRReg === cleanTarget)) {
          matchRow = i + 2;
          break;
        }
        if (cleanTarget.length >= 3 && (cleanRTeam.indexOf(cleanTarget) !== -1 || cleanRReg.indexOf(cleanTarget) !== -1)) {
          matchRow = i + 2;
          break;
        }
      }
    }

    // PASS 2: Fallback to Leader Email ONLY if Team ID was not provided or not matched
    if (matchRow === -1 && targetEmail) {
      for (var j = 0; j < values.length; j++) {
        var rEmail = String(values[j][6] || "").trim().toLowerCase();
        if (rEmail === targetEmail) {
          matchRow = j + 2;
          break;
        }
      }
    }

    if (matchRow === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Team not found for ID: " + targetTeamId })).setMimeType(ContentService.MimeType.JSON);
    }

    // 🛡️ SECURITY: Verify email authorization if email was provided
    if (targetEmail) {
      var registeredEmail = String(values[matchRow - 2][6] || "").trim().toLowerCase();
      if (registeredEmail && registeredEmail !== "-" && registeredEmail !== targetEmail) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "Authorization mismatch: The provided email does not match the registered leader email for " + targetTeamId
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    var cleanUtr = String(utr || "").replace(/[^A-Za-z0-9]/g, "").trim().toUpperCase();

    // 🛡️ SECURITY: Prevent duplicate / stolen Round 2 UTR numbers
    var cols = getSheetColumnIndexes(sheet);
    if (cleanUtr && cleanUtr.length >= 6) {
      if (isDuplicateUtr(sheet, cleanUtr, matchRow, cols.round2UtrCol)) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "SECURITY ALERT: The Round 2 UPI UTR '" + cleanUtr + "' has already been registered for another team."
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Determine team size and fee amount strictly (4 = ₹800, 5 = ₹1000, 6 = ₹1200)
    var size = parseInt(sheet.getRange(matchRow, 5).getValue(), 10) || 4;
    if (size < 4) size = 4;
    if (size > 6) size = 6;
    var rawAmount = size * 200;

    // 1. Store calculated Round 2 fee amount
    sheet.getRange(matchRow, cols.round2FeeCol).setValue("₹" + rawAmount);

    // 2. Set status as "Pending Verification" (Amber background)
    // The committee must manually verify the UTR in Google Sheets before ticket email triggers!
    sheet.getRange(matchRow, cols.round2StatusCol)
      .setValue("Pending Verification")
      .setBackground("#fef3c7")
      .setFontColor("#92400e")
      .setFontWeight("bold");

    // 3. Store ONLY the submitted transaction ID / UTR (Plain Text, Formula-safe)
    var r2UtrCell = sheet.getRange(matchRow, cols.round2UtrCol);
    r2UtrCell.clearDataValidations();
    r2UtrCell.setNumberFormat("@");
    r2UtrCell.setValue(cleanUtr ? ("'" + cleanUtr) : "-");

    // Immediately flush spreadsheet changes to ensure instant persistence
    SpreadsheetApp.flush();

    Logger.log("✓ Recorded Round 2 UTR for " + targetTeamId + " at Row " + matchRow + ": " + cleanUtr + " (Fee: ₹" + rawAmount + ")");

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      underReview: true,
      paymentVerified: false,
      message: "Round 2 payment UTR received. We will review your payment shortly in 24hr will get confirmation. Once our committee verifies your payment in Google Sheet, confirmation & Grand Finale Hall Ticket will be triggered to your email.",
      row: matchRow,
      teamId: targetTeamId,
      amount: rawAmount,
      utr: cleanUtr
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * =========================================================================
 * 🎟️ PROCESS ROUND 2 PAYMENT ROW & DISPATCH GRAND FINALE TICKET
 * =========================================================================
 */
function processRound2PaymentRow(sheet, rowNum, payId, amount, forceSend) {
  var cols = getSheetColumnIndexes(sheet);
  var rowData = sheet.getRange(rowNum, 1, 1, cols.totalCols).getValues()[0];

  var teamId = String(rowData[cols.teamIdCol - 1] || rowData[1] || "").trim();
  var regId = String(rowData[cols.regIdCol - 1] || rowData[2] || "").trim();
  var teamName = String(rowData[cols.teamNameCol - 1] || rowData[3] || "").trim();
  var rawSize = rowData[cols.teamSizeCol - 1] || rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  if (teamSize < 4) teamSize = 4;
  if (teamSize > 6) teamSize = 6;
  var leadName = String(rowData[cols.leadNameCol - 1] || rowData[5] || "").trim();
  var leadEmail = String(rowData[cols.leadEmailCol - 1] || rowData[6] || "").trim().toLowerCase();
  var leadPhone = String(rowData[cols.leadPhoneCol - 1] || rowData[7] || "").replace("'", "").trim();
  var leadCollege = String(rowData[cols.leadCollegeCol - 1] || rowData[8] || "").trim();
  var selectedDomain = cols.hasDomain ? String(rowData[cols.domainIdx] || "Software").trim() : "Software";
  var selectedTrack = String(rowData[cols.trackIdx] || "").trim();
  var rawFee = parseInt(String(rowData[cols.round2FeeIdx] || "").replace(/[^0-9]/g, ""), 10);
  var feeAmount = amount || rawFee || (teamSize * 200);
  var r2PaymentStatus = String(rowData[cols.round2StatusIdx] || "").trim();
  var r2PaymentUtr = String(rowData[cols.round2UtrIdx] || "").replace("'", "").trim();
  var emailSentStatus = String(sheet.getRange(rowNum, cols.emailStatusCol).getValue() || "").trim();

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
  var lowerStatus = r2PaymentStatus.toLowerCase().trim();

  // If status is "Rejected", style as red, record in Email Status, and exit
  if (lowerStatus === "rejected" || lowerStatus.indexOf("rejected") !== -1) {
    sheet.getRange(rowNum, cols.round2StatusCol).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");
    recordEmailStatus(sheet, rowNum, cols.emailStatusCol, "❌ Finale Payment Rejected", nowStr);
    Logger.log("Row " + rowNum + " (" + teamId + "): Round 2 payment marked as Rejected.");
    return false;
  }

  // If status is "Pending Verification", style as amber and wait for committee action
  if (lowerStatus === "pending verification" || lowerStatus.indexOf("pending") !== -1) {
    sheet.getRange(rowNum, cols.round2StatusCol).setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");
    Logger.log("Row " + rowNum + " (" + teamId + "): Round 2 payment is Pending Verification.");
    return false;
  }

  // Strictly check that payment is marked as Verified / Paid / Approved
  var isPaid = lowerStatus === "verified" || lowerStatus.indexOf("verified") !== -1 ||
               lowerStatus === "paid" || lowerStatus.indexOf("paid") !== -1 ||
               lowerStatus === "approved" || lowerStatus.indexOf("approved") !== -1;

  if (!isPaid) {
    Logger.log("Row " + rowNum + " (" + teamId + "): Round 2 payment status is '" + r2PaymentStatus + "'. Awaiting manual verification.");
    return false;
  }

  // Prevent duplicate ticket emails unless forceSend from real-time click
  if (!forceSend && emailSentStatus.indexOf("Finale Ticket Sent") !== -1) {
    Logger.log("Row " + rowNum + " (" + teamId + "): Finale Ticket already sent. Skipping.");
    return false;
  }

  // Extract registered team members
  var membersList = [];
  if (rowData[12] && String(rowData[12]).trim() !== "-" && String(rowData[12]).trim() !== "") membersList.push(String(rowData[12]).trim());
  if (rowData[17] && String(rowData[17]).trim() !== "-" && String(rowData[17]).trim() !== "") membersList.push(String(rowData[17]).trim());
  if (rowData[22] && String(rowData[22]).trim() !== "-" && String(rowData[22]).trim() !== "") membersList.push(String(rowData[22]).trim());
  if (rowData[27] && String(rowData[27]).trim() !== "-" && String(rowData[27]).trim() !== "") membersList.push(String(rowData[27]).trim());
  if (rowData[32] && String(rowData[32]).trim() !== "-" && String(rowData[32]).trim() !== "") membersList.push(String(rowData[32]).trim());

  var teamData = {
    teamId: teamId,
    registrationId: regId,
    teamName: teamName,
    teamSize: teamSize,
    leadFullName: leadName,
    leadEmail: leadEmail,
    leadPhone: leadPhone,
    leadCollege: leadCollege,
    members: membersList,
    selectedDomain: selectedDomain || "Software",
    selectedTrack: selectedTrack || "General AI Track",
    feeAmount: feeAmount,
    paymentId: payId || r2PaymentUtr || "VERIFIED"
  };

  sendGrandFinaleTicketEmail(teamData);

  // Update Sheet: Verified green, Ticket Sent status safely recorded
  sheet.getRange(rowNum, cols.round2StatusCol).setValue("Verified").setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");
  recordEmailStatus(sheet, rowNum, cols.emailStatusCol, "✓ Finale Ticket Sent", nowStr);

  Logger.log("✓ Grand Finale Ticket email sent to: " + leadEmail + " for " + teamId + " (UTR: " + (payId || r2PaymentUtr) + ")");
  return true;
}

/**
 * 📧 BATCH DISPATCHER:
 * Scans all rows in the sheet. For any row where Round 2 Payment Status is 'Paid' or 'Verified'
 * and Finale Ticket email has not been sent yet, dispatches the Grand Finale Ticket!
 */
function processAllPaidFinaleTeams() {
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log("No registration rows to process.");
    return;
  }

  var processedCount = 0;
  for (var r = 2; r <= lastRow; r++) {
    var handled = processRound2PaymentRow(sheet, r);
    if (handled) processedCount++;
  }

  Logger.log("Processed " + processedCount + " paid Grand Finale tickets.");
  try {
    SpreadsheetApp.getUi().alert("Grand Finale Ticket Processing Complete!\n\nDispatched Grand Finale Hall Tickets to " + processedCount + " paid team(s).");
  } catch (e) {}
}

/**
 * SENDS OFFICIAL GRAND FINALE TICKET & ENTRY PASS EMAIL
 */
function sendGrandFinaleTicketEmail(data) {
  var recipient = data.leadEmail;
  var teamName = data.teamName || "Team";
  var teamId = data.teamId || "N/A";
  var regId = data.registrationId || "N/A";
  var leadName = data.leadFullName || "Team Leader";
  var teamSize = data.teamSize || 4;
  var track = data.selectedTrack || "General AI Track";
  var feeAmount = data.feeAmount || (teamSize * 200);
  var payRef = data.paymentId || "CONFIRMED";

  var subject = "[FINALE PASS] Confirmed Seat for AITHON 2.0 Grand Finale - " + teamName + " [" + teamId + "]";

  var plainText =
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "OFFICIAL GRAND FINALE ENTRY PASS & SEAT CONFIRMATION\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + " and Members of " + teamName + ",\n\n" +
    "CONGRATULATIONS! We have successfully verified your Grand Finale registration fee of ₹" + feeAmount + " (Ref: " + payRef + ").\n\n" +
    "Your team's physical seat and hackathon workstation at AVCOE Sangamner are officially CONFIRMED!\n\n" +
    "----------------------------------------------------------\n" +
    "GRAND FINALE TICKET SUMMARY\n" +
    "----------------------------------------------------------\n" +
    "• Team Name         : " + teamName + "\n" +
    "• Team ID           : " + teamId + "\n" +
    "• Registration ID   : " + regId + "\n" +
    "• Project Domain   : " + (data.selectedDomain || "Software") + "\n" +
    "• Competition Track : " + track + "\n" +
    "• Team Size         : " + teamSize + " Members\n" +
    "• Payment Status    : ₹" + feeAmount + " PAID & VERIFIED (Ref: " + payRef + ")\n" +
    "• Final Status      : OFFICIALLY CONFIRMED FOR OFFLINE FINALE\n\n" +
    "----------------------------------------------------------\n" +
    "EVENT & VENUE DETAILS\n" +
    "----------------------------------------------------------\n" +
    "• Event Date        : Friday, 23 October 2026\n" +
    "• Reporting Time    : 08:30 AM IST sharp\n" +
    "• Venue             : Dept. of AI & DS, Amrutvahini College of Engineering (AVCOE)\n" +
    "                      PO: Sangamner S.K., Tal: Sangamner, Dist: Ahmednagar, Maharashtra - 422608\n\n" +
    "----------------------------------------------------------\n" +
    "IMPORTANT CHECKLIST FOR PARTICIPATING TEAMS\n" +
    "----------------------------------------------------------\n" +
    "1. Laptops & Hardware: Bring at least 2 laptops per team along with chargers and extension boards.\n" +
    "2. Identification: All team members MUST carry their official college student ID cards.\n" +
    "3. High-speed Wi-Fi, food, and refreshments will be provided on campus during the event.\n" +
    "4. Prepare to present a live working prototype / architecture based on your submitted PPT.\n\n" +
    "We are thrilled to welcome you to AVCOE Sangamner. Let's build the future of AI together!\n\n" +
    "Warm regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 Grand Finale Pass</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">' +
    '    <!-- Brand Logo Header -->' +
    '    <tr>' +
    '      <td style="background-color: #ffffff; padding: 26px 20px 20px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">' +
    '        <a href="' + WEBSITE_URL + '" target="_blank" style="text-decoration: none; display: inline-block;">' +
    '          <img src="' + LOGO_IMAGE_URL + '" alt="AITHON 2.0 - National Level AI Hackathon" width="280" style="width: 280px; max-width: 85%; height: auto; border: 0; display: block; margin: 0 auto;" />' +
    '        </a>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Header -->' +
    '    <tr>' +
    '      <td style="background: linear-gradient(135deg, #062b59 0%, #0f766e 100%); padding: 28px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(34,197,94,0.25); border: 1px solid #4ade80; color: #bbf7d0; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          OFFICIAL GRAND FINALE PASS' +
    '        </div>' +
    '        <div style="font-size: 13px; color: #ccfbf1; margin-top: 4px; font-weight: 500;">Dept. of Artificial Intelligence &amp; Data Science • AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Body -->' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;">' +
    '          &#10003; WORKSTATION SEAT BOOKED' +
    '        </div>' +
    '        <h2 style="margin: 0 0 14px 0; color: #062b59; font-size: 23px; font-weight: 800; letter-spacing: -0.5px;">' +
    '          Your Grand Finale Seat is Confirmed!' +
    '        </h2>' +
    '        <p style="font-size: 15px; margin: 0 0 14px 0; color: #0f172a;">' +
    '          Dear <strong>' + leadName + '</strong> and Members of <strong>' + teamName + '</strong>,' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 22px 0; line-height: 1.6;">' +
    '          We have verified your registration payment of <strong>₹' + feeAmount + '</strong> for <strong>AITHON 2.0 Grand Finale</strong>. Your team workstation has been reserved at Amrutvahini College of Engineering!' +
    '        </p>' +
    '        <!-- Digital Ticket Card -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%); border: 2px solid #062b59; border-radius: 14px; margin-bottom: 26px; overflow: hidden;">' +
    '          <tr>' +
    '            <td style="background-color: #062b59; padding: 12px 20px; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">' +
    '              Team Entry Ticket & Workstation Allocation' +
    '            </td>' +
    '          </tr>' +
    '          <tr>' +
    '            <td style="padding: 20px;">' +
    '              <table role="presentation" width="100%" cellspacing="0" cellpadding="6" style="font-size: 13px;">' +
    '                <tr>' +
    '                  <td style="color: #64748b; width: 38%;">Team ID:</td>' +
    '                  <td><span style="font-family: monospace; font-weight: 800; color: #ea580c; background-color: #fff7ed; border: 1px solid #fed7aa; padding: 3px 10px; border-radius: 6px;">' + teamId + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Registration ID:</td>' +
    '                  <td><span style="font-family: monospace; font-weight: 800; color: #062b59; background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 6px;">' + regId + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Name:</td>' +
    '                  <td style="font-weight: 700; color: #0f172a;">' + teamName + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Project Domain:</td>' +
    '                  <td style="font-weight: 700; color: #0f172a;"><span style="display: inline-block; background-color: #f1f5f9; border: 1px solid #cbd5e1; color: #0f172a; padding: 2px 8px; border-radius: 4px; font-weight: 700;">' + (data.selectedDomain || 'Software') + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Competition Track:</td>' +
    '                  <td style="font-weight: 700; color: #2563eb;">' + track + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Size:</td>' +
    '                  <td style="color: #0f172a; font-weight: 600;">' + teamSize + ' Members</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Payment Status:</td>' +
    '                  <td><span style="color: #047857; font-weight: 800;">&#10003; ₹' + feeAmount + ' Verified (' + payRef + ')</span></td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- Action Button: Google Maps -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td align="center">' +
    '              <a href="https://maps.google.com/?q=Amrutvahini+College+of+Engineering+Sangamner" target="_blank" style="display: inline-block; background-color: #062b59; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; margin-bottom: 8px;">' +
    '                Get Directions (Google Maps)' +
    '              </a>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- Event Venue Card -->' +
    '        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">' +
    '          <div style="font-size: 11px; font-weight: 800; color: #1e40af; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">' +
    '            Reporting & Venue Information' +
    '          </div>' +
    '          <div style="font-size: 13px; color: #1e3a8a; line-height: 1.6;">' +
    '            <strong>Event Date:</strong> Friday, 23 October 2026<br>' +
    '            <strong>Reporting Time:</strong> 08:30 AM IST sharp<br>' +
    '            <strong>Venue:</strong> Dept. of AI & DS, Amrutvahini College of Engineering (AVCOE), Sangamner, Ahmednagar, MH - 422608' +
    '          </div>' +
    '        </div>' +
    '        <!-- Instructions -->' +
    '        <div style="margin-bottom: 26px;">' +
    '          <div style="font-size: 12px; font-weight: 800; color: #062b59; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">' +
    '            Things to Bring:' +
    '          </div>' +
    '          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569; line-height: 1.7;">' +
    '            <li>Valid College Identity Card for all team members (Mandatory for registration desk entry).</li>' +
    '            <li>At least 2 laptops per team with required development environments and chargers.</li>' +
    '            <li>Spike guard / extension cord for your workstation.</li>' +
    '            <li>A digital copy of your presentation and project code repository.</li>' +
    '          </ul>' +
    '        </div>' +
    '        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">' +
    '          Best regards,<br>' +
    '          <strong style="color: #062b59;">Organizing Committee — AITHON 2.0</strong><br>' +
    '          Department of Artificial Intelligence & Data Science<br>' +
    '          Amrutvahini College of Engineering, Sangamner' +
    '        </p>' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

  sendEmailSafe(recipient, subject, plainText, htmlBody);
}

/**
 * 🔗 REGENERATE ALL ROUND 2 PAYMENT LINKS & REFRESH COLUMNS:
 * Scans all rows from Row 2 downwards:
 * 1. Computes exact fee strictly as teamSize * 200 (₹800, ₹1000, ₹1200) and saves in Col 45.
 * 2. Generates complete private payment portal link with all parameters (teamId, email, name, track, phone, size, fee) and saves in Col 46.
 * 3. Formats Column 48 (Round 2 Payment UTR) as Plain Text (no dropdown).
 * 4. Sets Column 42 & 47 dropdowns to ONLY ["Pending Verification", "Verified", "Rejected"].
 */
function regenerateAllRound2PaymentLinks() {
  var ss = getTargetSpreadsheet();
  var sheet = ss.getSheetByName("Registrations") || ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    Logger.log("No registration rows found.");
    return;
  }

  // Ensure sheet has at least 50 columns
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }

  var cols = getSheetColumnIndexes(sheet);
  var values = sheet.getRange(2, 1, lastRow - 1, cols.totalCols).getValues();
  var updated = 0;

  for (var i = 0; i < values.length; i++) {
    var row = values[i];
    var rowNum = i + 2;
    var teamId = String(row[1] || "").trim();
    if (!teamId) continue;

    var rawSize = row[4];
    var teamSize = parseInt(rawSize, 10) || 4;
    if (teamSize < 4) teamSize = 4;
    if (teamSize > 6) teamSize = 6;
    var fee = teamSize * 200;

    var teamName = String(row[3] || "").trim();
    var leadName = String(row[5] || "").trim();
    var leadEmail = String(row[6] || "").trim();
    var leadPhone = String(row[7] || "").replace("'", "").trim();
    var selectedTrack = String(row[cols.trackIdx] || "").trim();

    var link = getRound2PaymentLink(teamSize, teamId, leadEmail, teamName, leadName, selectedTrack, leadPhone);

    // Round 2 Fee Amount
    sheet.getRange(rowNum, cols.round2FeeCol).setValue("₹" + fee);

    // Round 2 Payment Link
    sheet.getRange(rowNum, cols.round2LinkCol).setValue(link);

    // Ensure Round 2 Payment UTR has no dropdown and is plain text
    var utrVal = row[cols.round2UtrIdx];
    if (utrVal && String(utrVal).trim() !== "" && String(utrVal).trim() !== "-") {
      var cleanUtr = String(utrVal).replace("'", "").trim();
      sheet.getRange(rowNum, cols.round2UtrCol).setValue("'" + cleanUtr);
    }
    sheet.getRange(rowNum, cols.round2UtrCol).clearDataValidations();
    sheet.getRange(rowNum, cols.round2UtrCol).setNumberFormat("@");

    updated++;
  }

  // Apply dropdown rules to entire columns
  var maxRows = Math.max(sheet.getLastRow(), 100);
  var evalRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
    .setAllowInvalid(true)
    .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
    .build();
  sheet.getRange(2, cols.evalFeeStatusCol, maxRows - 1, 1).setDataValidation(evalRule);
  sheet.getRange(2, cols.round2StatusCol, maxRows - 1, 1).setDataValidation(evalRule);

  sheet.getRange(2, cols.evalUtrCol, maxRows - 1, 1).clearDataValidations();
  sheet.getRange(2, cols.evalUtrCol, maxRows - 1, 1).setNumberFormat("@");
  sheet.getRange(2, cols.round2UtrCol, maxRows - 1, 1).clearDataValidations();
  sheet.getRange(2, cols.round2UtrCol, maxRows - 1, 1).setNumberFormat("@");

  Logger.log("✓ Successfully regenerated Round 2 Payment Links for " + updated + " teams and refreshed dropdowns/UTR columns!");
  try {
    SpreadsheetApp.getUi().alert("Round 2 Payment Links & Columns Updated!\n\n• Updated Column " + cols.round2FeeCol + " (Fee Amount) & Column " + cols.round2LinkCol + " (Full Payment Links) for " + updated + " team(s).\n• Formatted Column " + cols.round2UtrCol + " (Round 2 Payment UTR) as Plain Text (no dropdown).\n• Formatted Column " + cols.round2StatusCol + " (Round 2 Payment Status) with ['Pending Verification', 'Verified', 'Rejected'] dropdown.");
  } catch (e) {}
}

/**
 * 🧪 Test Grand Finale Ticket Email Dispatch:
 */
function testSendGrandFinaleTicketEmail() {
  var dummy = {
    leadEmail: "shivaji.wathore@avcoe.org",
    leadFullName: "Umesh Khairnar",
    teamName: "Neural Nexus",
    teamId: "TEAM-101",
    registrationId: "AI25-101",
    teamSize: 4,
    selectedTrack: "Track 01: AI in Healthcare & Medicine",
    feeAmount: 800,
    paymentId: "pay_TEST_CONFIRMED"
  };
  sendGrandFinaleTicketEmail(dummy);
  Logger.log("Test Grand Finale Ticket email dispatched to shivaji.wathore@avcoe.org!");
}
