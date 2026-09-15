/**
 * ============================================================================
 * AITHON 2.0 — Google Sheets Registration Sync, Drive PPT Storage & Email Dispatch
 * Target Google Account: ai.veer2k26@gmail.com
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

// Target Google Spreadsheet ID
var SPREADSHEET_ID = "1uBkGnCNJ8dIRhLUY9N4zbTWSh5VEy-p-fbnTkfUNt6k";

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
 * Dynamic Column Resolver:
 * Supports both 50-column (with "Selected Domain") and older 49-column sheets
 */
function getSheetColumnIndexes(sheet) {
  var headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 50)).getValues()[0];
  var domainIdx = -1;
  for (var i = 0; i < headers.length; i++) {
    var h = String(headers[i] || "").trim();
    if (h === "Selected Domain" || h === "Domain") {
      domainIdx = i;
      break;
    }
  }
  var hasDomain = domainIdx !== -1;
  var offset = hasDomain ? 1 : 0;
  return {
    hasDomain: hasDomain,
    totalCols: 49 + offset,
    domainIdx: hasDomain ? domainIdx : -1,
    domainCol: hasDomain ? (domainIdx + 1) : -1,
    trackIdx: 37 + offset,
    trackCol: 38 + offset,
    pptLinkIdx: 38 + offset,
    pptLinkCol: 39 + offset,
    pptFileNameIdx: 39 + offset,
    pptFileNameCol: 40 + offset,
    evalFeeIdx: 40 + offset,
    evalFeeCol: 41 + offset,
    evalFeeStatusIdx: 41 + offset,
    evalFeeStatusCol: 42 + offset,
    evalUtrIdx: 42 + offset,
    evalUtrCol: 43 + offset,
    pptStatusIdx: 43 + offset,
    pptStatusCol: 44 + offset,
    round2FeeIdx: 44 + offset,
    round2FeeCol: 45 + offset,
    round2LinkIdx: 45 + offset,
    round2LinkCol: 46 + offset,
    round2StatusIdx: 46 + offset,
    round2StatusCol: 47 + offset,
    round2UtrIdx: 47 + offset,
    round2UtrCol: 48 + offset,
    emailStatusIdx: 48 + offset,
    emailStatusCol: 49 + offset
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

    // 📁 STORE PPT IN GOOGLE DRIVE & RENAME AUTOMATICALLY AS TEAM ID
    var pptDriveUrl = "-";
    if (data.pptBase64 && String(data.pptBase64).trim() !== "") {
      try {
        var folder = DriveApp.getFolderById(PPT_FOLDER_ID);
        var base64Data = String(data.pptBase64);
        
        if (base64Data.indexOf("base64,") !== -1) {
          base64Data = base64Data.split("base64,")[1];
        }

        var ext = ".pptx";
        if (data.pptFileName) {
          var dotIdx = data.pptFileName.lastIndexOf(".");
          if (dotIdx !== -1) {
            ext = data.pptFileName.substring(dotIdx).toLowerCase();
          }
        }

        var driveFileName = data.teamId + ext;
        var mimeType = data.pptMimeType || "application/vnd.openxmlformats-officedocument.presentationml.presentation";

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
    var phone = data.leadPhone ? "'" + data.leadPhone : "";

    // Automatically resolve specified course/branch if 'Other' was selected
    var leadCourse = (data.leadCourse === "Other" && data.leadCourseOther) ? data.leadCourseOther : (data.leadCourse || "N/A");
    var member2Course = (data.member2Course === "Other" && data.member2CourseOther) ? data.member2CourseOther : (data.member2Course || "-");
    var member3Course = (data.member3Course === "Other" && data.member3CourseOther) ? data.member3CourseOther : (data.member3Course || "-");
    var member4Course = (data.member4Course === "Other" && data.member4CourseOther) ? data.member4CourseOther : (data.member4Course || "-");
    var member5Course = (data.member5Course === "Other" && data.member5CourseOther) ? data.member5CourseOther : (data.member5Course || "-");
    var member6Course = (data.member6Course === "Other" && data.member6CourseOther) ? data.member6CourseOther : (data.member6Course || "-");

    // Calculate Round 2 non-editable fee: teamSize * 200
    var teamSizeNum = parseInt(data.teamSize, 10) || 4;
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

    // 50-column row aligned with HEADERS
    var row = [
      timestamp,                               // Col 1: Timestamp
      data.teamId || "N/A",                    // Col 2: Team ID
      data.registrationId || "N/A",            // Col 3: Registration ID
      data.teamName || "N/A",                  // Col 4: Team Name
      data.teamSize || "4",                    // Col 5: Team Size
      data.leadFullName || "N/A",              // Col 6: Leader Full Name
      data.leadEmail || "N/A",                 // Col 7: Leader Email
      phone,                                   // Col 8: Leader Phone
      data.leadCollege || "N/A",               // Col 9: Leader College
      leadCourse,                              // Col 10: Leader Course (or user-specified Other)
      data.leadYear || "N/A",                  // Col 11: Leader Year
      data.leadCity || "N/A",                  // Col 12: Leader City
      data.member2Name || "-",                 // Col 13: Member 2 Name
      data.member2Email || "-",                // Col 14: Member 2 Email
      data.member2College || "-",              // Col 15: Member 2 College
      member2Course,                           // Col 16: Member 2 Course (or user-specified Other)
      data.member2Year || "-",                 // Col 17: Member 2 Year
      data.member3Name || "-",                 // Col 18: Member 3 Name
      data.member3Email || "-",                // Col 19: Member 3 Email
      data.member3College || "-",              // Col 20: Member 3 College
      member3Course,                           // Col 21: Member 3 Course (or user-specified Other)
      data.member3Year || "-",                 // Col 22: Member 3 Year
      data.member4Name || "-",                 // Col 23: Member 4 Name
      data.member4Email || "-",                // Col 24: Member 4 Email
      data.member4College || "-",              // Col 25: Member 4 College
      member4Course,                           // Col 26: Member 4 Course (or user-specified Other)
      data.member4Year || "-",                 // Col 27: Member 4 Year
      data.member5Name || "-",                 // Col 28: Member 5 Name
      data.member5Email || "-",                // Col 29: Member 5 Email
      data.member5College || "-",              // Col 30: Member 5 College
      member5Course,                           // Col 31: Member 5 Course (or user-specified Other)
      data.member5Year || "-",                 // Col 32: Member 5 Year
      data.member6Name || "-",                 // Col 33: Member 6 Name
      data.member6Email || "-",                // Col 34: Member 6 Email
      data.member6College || "-",              // Col 35: Member 6 College
      member6Course,                           // Col 36: Member 6 Course (or user-specified Other)
      data.member6Year || "-",                 // Col 37: Member 6 Year
      selectedDomain,                          // Col 38: Selected Domain (1. Software / 2. Hardware)
      data.selectedTrack || "General AI Track",// Col 39: Selected Track (1 of 23 Tracks)
      pptDriveUrl,                             // Col 40: PPT Drive Link
      data.pptFileName || "-",                 // Col 41: Original PPT File Name
      "₹50",                                   // Col 42: Evaluation Fee (₹50)
      evalFeeStatus,                           // Col 43: Eval Fee Status (Dropdown: Pending Verification / Verified / Rejected)
      utrStr ? ("'" + utrStr) : "-",           // Col 44: Eval Payment UTR (Only Payment ID / UTR, No Dropdown)
      pptStatusCol,                            // Col 45: PPT Status
      round2FeeAmount,                         // Col 46: Round 2 Fee Amount (teamSize * 200)
      round2Link,                              // Col 47: Round 2 Payment Link (Non-editable)
      "Pending Verification",                  // Col 48: Round 2 Payment Status (Dropdown: Pending Verification / Verified / Rejected)
      "-",                                     // Col 49: Round 2 Payment UTR (Only Payment ID / UTR, No Dropdown)
      emailSentCol                             // Col 50: Email Notification Status
    ];

    var targetRow = existingRow !== -1 ? existingRow : (sheet.getLastRow() + 1);

    if (existingRow !== -1) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
      Logger.log("✓ Real-time updated row " + existingRow + " for " + data.teamId);
    } else {
      sheet.appendRow(row);
      targetRow = sheet.getLastRow();
      Logger.log("✓ Real-time allocated & appended row " + targetRow + " for " + data.teamId);
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

    // ⚡ 2. Check for next available serial ID query (e.g. action=getNextId)
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

    // Check if client is looking up team details for the Grand Finale Payment Portal or Post-Registration Verification
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
          // Search backwards so that the most recent registration matching email/UTR is returned
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
              } else if (cleanQuery.length >= 3 && (cleanRTeam.indexOf(cleanQuery) !== -1 || cleanRReg.indexOf(cleanQuery) !== -1)) {
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
                leadEmail: r[6],
                leadPhone: String(r[7] || "").replace("'", ""),
                leadCollege: r[8] || "",
                leadCourse: r[9] || "",
                leadYear: r[10] || "",
                leadCity: r[11] || "",
                selectedDomain: cols.hasDomain ? (r[cols.domainIdx] || "Software") : "Software",
                selectedTrack: r[cols.trackIdx] || "General AI Track",
                pptDriveLink: r[cols.pptLinkIdx] || "",
                pptFileName: r[cols.pptFileNameIdx] || "",
                evalFee: r[cols.evalFeeIdx] || "₹50",
                evalFeeStatus: r[cols.evalFeeStatusIdx] || "Pending Verification",
                evalPaymentUtr: String(r[cols.evalUtrIdx] || "").replace("'", ""),
                pptStatus: r[cols.pptStatusIdx] || "Pending Review",
                round2FeeAmount: finaleFee,
                round2PaymentLink: r[cols.round2LinkIdx] || "",
                round2PaymentStatus: r[cols.round2StatusIdx] || "Pending Verification",
                round2PaymentUtr: String(r[cols.round2UtrIdx] || "").replace("'", ""),
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
      account: "ai.veer2k26@gmail.com",
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
 * Finds existing row number (1-indexed) for a team by Team ID or Leader Email
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
  for (var i = values.length - 1; i >= 0; i--) {
    var rTeam = String(values[i][1] || "").trim().toUpperCase();
    var rEmail = String(values[i][6] || "").trim().toLowerCase();

    if (targetTeamId && rTeam && rTeam === targetTeamId) {
      return i + 2;
    }
    if (targetEmail && rEmail && rEmail === targetEmail) {
      return i + 2;
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
 * Sets up sheet headers and formatting
 */
function setupSheet(sheet) {
  sheet.appendRow(HEADERS);
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

  Logger.log("✓ Google Sheet headers successfully updated to 50 columns with Selected Domain (Software / Hardware)!");
  return "Sheet structure updated successfully to 50 columns!";
}

/**
 * Adds Top Menu "🚀 AITHON 2.0" directly in Google Sheets toolbar
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("🚀 AITHON 2.0")
      .addItem("✅ Verify Registration Payment & Send Email", "processAllVerifiedRegistrations")
      .addItem("⚡ Quick Verify Registration Payment (1-Click)", "quickVerifyRegistrationPaymentPrompt")
      .addSeparator()
      .addItem("⚡ Quick Mark Team as Paid (Finale)", "quickMarkTeamPaidPrompt")
      .addItem("🎟️ Dispatch Finale Tickets to Paid Teams", "processAllPaidFinaleTeams")
      .addItem("📧 Process PPT Evaluations (Send Emails)", "processAllPptEvaluations")
      .addSeparator()
      .addItem("🔗 Regenerate All Round 2 Payment Links", "regenerateAllRound2PaymentLinks")
      .addItem("📋 View Unmatched Payments Sheet", "openUnmatchedPaymentsSheet")
      .addSeparator()
      .addItem("🔄 Fix Sheet Dropdowns & Payment UTRs", "fixEvalColumnsDropdownAndUtr")
      .addItem("🛠️ Setup Sheet Columns & Dropdowns (50 Cols)", "updateSheetStructure")
      .addItem("⚡ Enable Real-Time Edit Trigger", "installEditTrigger")
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
 * 1. Sends confirmation email when Eval Fee Status is changed to 'Verified' / 'Paid',
 * 2. Sends acceptance/rejection email when PPT Status is changed,
 * 3. Sends Grand Finale Hall Ticket when Round 2 Payment Status is changed to 'Paid'!
 */
function installEditTrigger() {
  var ss = getTargetSpreadsheet();
  var triggers = ScriptApp.getUserTriggers(ss);
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === "installedOnEdit") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger("installedOnEdit")
    .forSpreadsheet(ss)
    .onEdit()
    .create();

  Logger.log("✓ Real-time onEdit trigger successfully installed!");
  try {
    SpreadsheetApp.getUi().alert("Real-time Triggers Installed!\n\n1. When Eval Fee Status is marked 'Verified' / 'Paid', registration confirmation email is sent.\n2. When PPT Status is 'Accepted', acceptance email is sent.\n3. When Round 2 Payment is marked 'Paid', official Grand Finale Ticket email is sent automatically!");
  } catch (e) {}
}

/**
 * Trigger handler for real-time edits:
 * - Eval Fee Status
 * - PPT Status
 * - Round 2 Payment Status
 */
function installedOnEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "Registrations") return;

  var row = e.range.getRow();
  var col = e.range.getColumn();
  var cols = getSheetColumnIndexes(sheet);

  // Eval Fee Status (Row >= 2) - Manual Payment Verification
  if (col === cols.evalFeeStatusCol && row >= 2) {
    processEvalFeeStatusRow(sheet, row);
  }

  // PPT Status (Row >= 2)
  if (col === cols.pptStatusCol && row >= 2) {
    processPptEvaluationRow(sheet, row);
  }

  // Round 2 Payment Status (Row >= 2)
  if (col === cols.round2StatusCol && row >= 2) {
    processRound2PaymentRow(sheet, row);
  }
}

/**
 * 📧 MANUAL EVALUATION FEE PROCESSOR:
 * Processes a single row for Column 42 ("Eval Fee Status") manual payment verification & confirmation email dispatch.
 * Confirmation emails will ONLY be sent when Col 42 is manually marked as "Verified", "Paid", "Approved", or "Successful".
 */
function processEvalFeeStatusRow(sheet, rowNum) {
  var cols = getSheetColumnIndexes(sheet);
  var rowData = sheet.getRange(rowNum, 1, 1, cols.totalCols).getValues()[0];

  var teamId = String(rowData[1] || "").trim();
  var regId = String(rowData[2] || "").trim();
  var teamName = String(rowData[3] || "").trim();
  var rawSize = rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  var leadName = String(rowData[5] || "").trim();
  var leadEmail = String(rowData[6] || "").trim();
  var leadPhone = String(rowData[7] || "").replace("'", "").trim();
  var leadCollege = String(rowData[8] || "").trim();
  var selectedDomain = cols.hasDomain ? String(rowData[cols.domainIdx] || "Software").trim() : "Software";
  var selectedTrack = String(rowData[cols.trackIdx] || "").trim();
  var pptLink = String(rowData[cols.pptLinkIdx] || "").trim();
  var evalFeeStatus = String(rowData[cols.evalFeeStatusIdx] || "").trim();
  var utr = String(rowData[cols.evalUtrIdx] || "").replace("'", "").trim();
  var emailSentStatus = String(rowData[cols.emailStatusIdx] || "").trim();

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
  var lowerStatus = evalFeeStatus.toLowerCase().trim();

  // If status is "Rejected", style as red, record in Email Status, and exit
  if (lowerStatus === "rejected" || lowerStatus.indexOf("rejected") !== -1) {
    sheet.getRange(rowNum, cols.evalFeeStatusCol).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");
    sheet.getRange(rowNum, cols.emailStatusCol).setValue("❌ Payment Rejected (" + nowStr + ")");
    Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee status marked as Rejected.");
    return false;
  }

  // If status is "Pending Verification", style as amber and wait for manual action
  if (lowerStatus === "pending verification" || lowerStatus.indexOf("pending") !== -1) {
    sheet.getRange(rowNum, cols.evalFeeStatusCol).setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");
    Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee status is Pending Verification.");
    return false;
  }

  // Check if status is "Verified"
  var isVerified = lowerStatus === "verified" || lowerStatus.indexOf("verified") !== -1 || lowerStatus.indexOf("paid") !== -1;

  if (!isVerified) {
    Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee status is '" + evalFeeStatus + "'. Awaiting manual verification.");
    return false;
  }

  // Check if confirmation email already sent to avoid duplicate emails
  if (emailSentStatus.indexOf("Confirmation Email Sent") !== -1) {
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

  // Update Email Notification Status
  sheet.getRange(rowNum, cols.emailStatusCol).setValue("✓ Confirmation Email Sent (" + nowStr + ")");
  // Style Eval Fee Status with verified green and ensure text is "Verified"
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
 * Processes a single row for PPT Status evaluation & email dispatch
 */
function processPptEvaluationRow(sheet, rowNum) {
  var cols = getSheetColumnIndexes(sheet);
  var rowData = sheet.getRange(rowNum, 1, 1, cols.totalCols).getValues()[0];

  var teamId = String(rowData[1] || "").trim();
  var regId = String(rowData[2] || "").trim();
  var teamName = String(rowData[3] || "").trim();
  var rawSize = rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  if (teamSize < 4) teamSize = 4;
  if (teamSize > 6) teamSize = 6;
  var leadName = String(rowData[5] || "").trim();
  var leadEmail = String(rowData[6] || "").trim();
  var leadPhone = String(rowData[7] || "").replace("'", "").trim();
  var leadCollege = String(rowData[8] || "").trim();
  var selectedDomain = cols.hasDomain ? String(rowData[cols.domainIdx] || "Software").trim() : "Software";
  var selectedTrack = String(rowData[cols.trackIdx] || "").trim();
  var pptStatus = String(rowData[cols.pptStatusIdx] || "").trim();
  var emailSentStatus = String(rowData[cols.emailStatusIdx] || "").trim();

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

  // Extract registered team members
  var membersList = [];
  if (rowData[12] && String(rowData[12]).trim() !== "-" && String(rowData[12]).trim() !== "") membersList.push(String(rowData[12]).trim());
  if (rowData[17] && String(rowData[17]).trim() !== "-" && String(rowData[17]).trim() !== "") membersList.push(String(rowData[17]).trim());
  if (rowData[22] && String(rowData[22]).trim() !== "-" && String(rowData[22]).trim() !== "") membersList.push(String(rowData[22]).trim());
  if (rowData[27] && String(rowData[27]).trim() !== "-" && String(rowData[27]).trim() !== "") membersList.push(String(rowData[27]).trim());
  if (rowData[32] && String(rowData[32]).trim() !== "-" && String(rowData[32]).trim() !== "") membersList.push(String(rowData[32]).trim());

  // CASE 1: PPT ACCEPTED
  if (pptStatus.toLowerCase() === "accepted" || pptStatus.toLowerCase() === "selected") {
    // Check if already sent to prevent duplicate email spam
    if (emailSentStatus.indexOf("Accepted Email Sent") !== -1) {
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
    sheet.getRange(rowNum, cols.emailStatusCol).setValue("✓ Accepted Email Sent (" + nowStr + ")");

    // Highlight row status
    sheet.getRange(rowNum, cols.pptStatusCol).setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");

    Logger.log("✓ Acceptance email sent to: " + leadEmail + " for " + teamId + " (Track: " + (selectedTrack || "N/A") + ", Fee: ₹" + feeAmount + ")");
    return true;
  }

  // CASE 2: PPT REJECTED
  if (pptStatus.toLowerCase() === "rejected") {
    if (emailSentStatus.indexOf("Rejection Email Sent") !== -1) {
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
    sheet.getRange(rowNum, cols.emailStatusCol).setValue("✓ Rejection Email Sent (" + nowStr + ")");
    sheet.getRange(rowNum, cols.pptStatusCol).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");

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
    "• Status            : SHORTLISTED FOR FINALE (ROUND 2)\n\n" +
    "----------------------------------------------------------\n" +
    "MANDATORY STEP: FINAL PAYMENT & SEAT CONFIRMATION\n" +
    "----------------------------------------------------------\n" +
    "To officially reserve and lock your team's physical seat & workstation at AVCOE Sangamner, your team must complete the Round 2 registration fee and submit the payment proof on our official Google Form.\n\n" +
    "• Fee Calculation   : " + teamSize + " Members × ₹200/member\n" +
    "• Total Team Fee    : ₹" + feeAmount + " (Fixed for entire team)\n" +
    "• Payment Mode      : UPI (Google Pay, PhonePe, Paytm, BHIM, etc.)\n" +
    "• Official UPI ID   : " + upiVpa + "\n" +
    "• Beneficiary Name  : AITHON 2.0 / AVCOE\n" +
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
    "5. Submit the form. Our organizing team will verify your payment and confirm your team's physical workstation and entry passes.\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL WHATSAPP COMMUNITY FOR FINALISTS:\n" +
    "----------------------------------------------------------\n" +
    WHATSAPP_COMMUNITY_URL + "\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  // Modern HTML Email Template with Official Google Form Payment Call-To-Action
  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 PPT Accepted - Final Payment Form</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">' +
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
    '      <td style="background: linear-gradient(135deg, #062b59 0%, #1e3a8a 100%); padding: 26px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(34,197,94,0.25); border: 1px solid #4ade80; color: #bbf7d0; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          PPT Shortlisted • Grand Finale' +
    '        </div>' +
    '        <div style="font-size: 12.5px; color: #cbd5e1; margin-top: 4px; font-weight: 500;">Dept. of Artificial Intelligence &amp; Data Science • AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Main Content -->' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 14px;">' +
    '          Idea Presentation Approved' +
    '        </div>' +
    '        <h2 style="margin: 0 0 14px 0; color: #062b59; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">' +
    '          Congratulations! Your Team is Selected for the Finale' +
    '        </h2>' +
    '        <p style="font-size: 15px; margin: 0 0 14px 0; color: #0f172a;">' +
    '          Dear <strong>' + leadName + '</strong> and Members of <strong>' + teamName + '</strong>,' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 22px 0; line-height: 1.6;">' +
    '          We are pleased to inform you that your idea presentation for <strong>AITHON 2.0</strong> has been evaluated and <strong>SHORTLISTED</strong> by our jury panel! Your team has officially qualified to compete in the offline Grand Finale at Amrutvahini College of Engineering, Sangamner.' +
    '        </p>' +
    '        <!-- Summary Card -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td style="padding: 18px 20px;">' +
    '              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">' +
    '                Selection Overview' +
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
    '                  <td style="color: #64748b;">Leader Email:</td>' +
    '                  <td style="font-family: monospace; color: #334155;">' + recipient + '</td>' +
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
    '                  <td style="color: #0f172a; font-weight: 600;">' + teamSize + ' Members</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Status:</td>' +
    '                  <td><span style="color: #047857; font-weight: 700;">Qualified for Finale (Round 2)</span></td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +

    '        <!-- OFFICIAL FINAL PAYMENT FORM CARD -->' +
    '        <div style="background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #22c55e; border-radius: 14px; padding: 24px 20px; text-align: center; margin-bottom: 26px;">' +
    '          <div style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">' +
    '            Mandatory Step • Finale Seat Confirmation' +
    '          </div>' +
    '          <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">' +
    '            ' + teamSize + ' Team Members × ₹200 per member' +
    '          </div>' +
    '          <div style="font-size: 36px; font-weight: 900; color: #064e3b; margin: 4px 0 16px 0; letter-spacing: -1px;">' +
    '            ₹' + feeAmount +
    '          </div>' +

    '          <!-- UPI Details Box -->' +
    '          <div style="background-color: #ffffff; border: 1px solid #bbf7d0; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px; text-align: left; font-size: 13px;">' +
    '            <div style="font-weight: 700; color: #065f46; margin-bottom: 6px; font-size: 13.5px;">UPI Payment Details:</div>' +
    '            <div style="margin-bottom: 4px; color: #334155;"><strong>UPI ID:</strong> <span style="font-family: monospace; font-size: 14px; font-weight: 800; color: #047857; background-color: #ecfdf5; padding: 2px 8px; border-radius: 4px; border: 1px dashed #059669;">' + upiVpa + '</span></div>' +
    '            <div style="margin-bottom: 4px; color: #334155;"><strong>Beneficiary:</strong> AITHON 2.0 / AVCOE</div>' +
    '            <div style="color: #334155;"><strong>Payment Remark:</strong> <span style="font-family: monospace; font-weight: 700;">' + teamId + ' Finale Fee</span></div>' +
    '          </div>' +

    '          <!-- Step by Step Instructions -->' +
    '          <div style="background-color: #ffffff; border: 1px solid #d1fae5; border-radius: 10px; padding: 16px 18px; margin-bottom: 22px; text-align: left; font-size: 12.5px; line-height: 1.6; color: #334155;">' +
    '            <div style="font-weight: 700; color: #065f46; margin-bottom: 8px; font-size: 13px;">Steps to Submit Final Payment & Confirm Workstation:</div>' +
    '            <ol style="margin: 0; padding-left: 20px;">' +
    '              <li style="margin-bottom: 6px;">Pay <strong>₹' + feeAmount + '</strong> to UPI ID <strong style="color: #047857;">' + upiVpa + '</strong> via Google Pay, PhonePe, Paytm, or BHIM.</li>' +
    '              <li style="margin-bottom: 6px;">Note down the <strong>12-digit UPI Reference / UTR Number</strong> and capture a clear screenshot of the completed payment.</li>' +
    '              <li style="margin-bottom: 6px;">Click the button below to open the <strong>Official Final Payment Google Form</strong>.</li>' +
    '              <li>Fill in your <strong>Team ID (' + teamId + ')</strong>, <strong>Registration ID (' + regId + ')</strong>, enter the UTR Number, upload the screenshot, and submit.</li>' +
    '            </ol>' +
    '          </div>' +

    '          <!-- Primary CTA Button -->' +
    '          <div style="margin-bottom: 14px;">' +
    '            <a href="' + paymentFormUrl + '" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #047857 0%, #059669 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 15px; padding: 15px 32px; border-radius: 10px; box-shadow: 0 4px 16px rgba(5,150,105,0.35); text-transform: uppercase; letter-spacing: 0.5px;">' +
    '              Submit Final Payment Form (Google Form) &rarr;' +
    '            </a>' +
    '          </div>' +

    '          <!-- Direct URL Link fallback -->' +
    '          <div style="font-size: 11.5px; color: #475569; word-break: break-all; margin-top: 10px;">' +
    '            Direct Form Link: <a href="' + paymentFormUrl + '" target="_blank" style="color: #047857; font-weight: 700; text-decoration: underline;">' + paymentFormUrl + '</a>' +
    '          </div>' +
    '        </div>' +

    '        <!-- WhatsApp Community Link -->' +
    '        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px 20px; text-align: center; margin-bottom: 24px;">' +
    '          <div style="font-size: 12px; color: #166534; font-weight: 700; margin-bottom: 8px;">Official WhatsApp Community for Finalists:</div>' +
    '          <a href="' + WHATSAPP_COMMUNITY_URL + '" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 12px; padding: 10px 22px; border-radius: 8px;">Join WhatsApp Community &rarr;</a>' +
    '        </div>' +

    '        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">' +
    '          Best regards,<br>' +
    '          <strong style="color: #062b59;">Organizing Committee — AITHON 2.0</strong><br>' +
    '          Department of Artificial Intelligence & Data Science<br>' +
    '          Amrutvahini College of Engineering (AVCOE), Sangamner' +
    '        </p>' +
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
 * SENDS INITIAL REGISTRATION CONFIRMATION EMAIL
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

  var subject = "[CONFIRMED] AITHON 2.0 Registration — " + teamName + " [" + teamId + "]";

  var plainText = 
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "Dept. of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + ",\n\n" +
    "Congratulations! Your team registration and idea presentation for AITHON 2.0 have been successfully recorded and verified.\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL REGISTRATION SUMMARY\n" +
    "----------------------------------------------------------\n" +
    "• Team Name         : " + teamName + "\n" +
    "• Team ID           : " + teamId + "\n" +
    "• Registration ID   : " + regId + "\n" +
    "• Team Leader       : " + leadName + (data.leadCollege ? " (" + data.leadCollege + ")" : "") + "\n" +
    "• Leader Email      : " + recipient + "\n" +
    (data.leadPhone ? ("• Leader Phone      : " + data.leadPhone + "\n") : "") +
    (data.members && data.members.length > 0 ? ("• Team Members      : " + data.members.join(", ") + "\n") : "") +
    "• Project Domain   : " + (data.selectedDomain || "Software") + "\n" +
    "• Competition Track : " + (data.selectedTrack || "General AI Track") + "\n" +
    "• Team Size         : " + teamSize + " Members\n" +
    "• PPT Submission    : Uploaded (" + teamId + ".pptx)\n" +
    "• Evaluation Fee    : ₹50 Verified & Confirmed" + (data.utr ? (" (UTR: " + data.utr + ")") : "") + "\n" +
    "• Event Date        : Friday, 23 October 2026\n" +
    "• Venue             : Dept. of AI & DS, AVCOE Sangamner, Maharashtra\n\n" +
    "----------------------------------------------------------\n" +
    "ACTION REQUIRED: JOIN OFFICIAL WHATSAPP COMMUNITY\n" +
    "----------------------------------------------------------\n" +
    "Join WhatsApp Group: " + WHATSAPP_COMMUNITY_URL + "\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  var htmlBody = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 Registration Confirmed</title>' +
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
    '        <div style="font-size: 12.5px; color: #cbd5e1; margin-top: 4px; font-weight: 500;">Dept. of Artificial Intelligence &amp; Data Science • AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <div style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; margin-bottom: 12px;">' +
    '          &#10003; Application Confirmed' +
    '        </div>' +
    '        <h2 style="margin: 0 0 12px 0; color: #062b59; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">' +
    '          Team Registration Confirmed' +
    '        </h2>' +
    '        <p style="font-size: 15px; margin: 0 0 14px 0; color: #0f172a;">' +
    '          Dear <strong>' + leadName + '</strong>,' +
    '        </p>' +
    '        <p style="font-size: 13.5px; color: #334155; margin: 0 0 22px 0; line-height: 1.6;">' +
    '          Congratulations! Your team registration and idea PPT for <strong>AITHON 2.0</strong> have been successfully recorded and verified.' +
    '        </p>' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td style="padding: 18px 20px;">' +
    '              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">' +
    '                Registration Summary' +
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
    '                  <td style="color: #64748b;">PPT Submission:</td>' +
    '                  <td><span style="color: #047857; font-weight: 700;">&#10003; Uploaded (' + teamId + '.pptx)</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Evaluation Fee:</td>' +
    '                  <td><span style="color: #047857; font-weight: 700;">&#10003; ₹50 Verified & Confirmed' + (data.utr ? (' (UTR: ' + data.utr + ')') : '') + '</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Event Date:</td>' +
    '                  <td style="color: #0f172a; font-weight: 600;">Friday, 23 October 2026</td>' +
    '                </tr>' +
    '              </table>' +
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
    "2. After completing payment, reply directly to this email (ai.veer2k26@gmail.com) with:\n" +
    "   • Team ID: " + teamId + "\n" +
    "   • 12-digit UPI UTR / Transaction Reference Number\n" +
    "   • Payment confirmation screenshot\n\n" +
    "Our committee will verify your payment and activate your registration.\n\n" +
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
    '          <strong>Already Paid?</strong> If the amount was debited from your account, please reply directly to this email (<strong style="color: #062b59;">ai.veer2k26@gmail.com</strong>) with your payment screenshot and 12-digit UTR to activate your registration immediately.' +
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
  try {
    GmailApp.sendEmail(recipient, subject, plainText, {
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee"
    });
    Logger.log("Email dispatched via GmailApp to: " + recipient);
  } catch (gErr) {
    Logger.log("GmailApp warning, trying MailApp: " + gErr.toString());
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainText,
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee"
    });
    Logger.log("Email dispatched via MailApp to: " + recipient);
  }
}

/**
 * 🧪 Test Google Drive PPT Upload & Permission Grant:
 */
function testPptDriveUpload() {
  Logger.log("Testing PPT upload to folder ID: " + PPT_FOLDER_ID);
  var folder = DriveApp.getFolderById(PPT_FOLDER_ID);
  var testBlob = Utilities.newBlob("AITHON 2.0 Sample PPT Content", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "TEAM-101.pptx");
  var file = folder.createFile(testBlob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  var url = file.getUrl();
  Logger.log("✓ Successfully created test PPT in Drive: " + url);
  return url;
}

/**
 * 🧪 Test Round 2 Acceptance Email Dispatch:
 */
function testSendAcceptanceEmail() {
  var dummy = {
    leadEmail: "ai.veer2k26@gmail.com",
    leadFullName: "Umesh Khairnar",
    teamName: "Neural Nexus",
    teamId: "TEAM-101",
    registrationId: "AI25-101",
    teamSize: 4,
    feeAmount: 800,
    paymentLink: getRound2PaymentLink(4, "TEAM-101")
  };
  sendPptAcceptanceEmail(dummy);
  Logger.log("Test Acceptance email dispatched to ai.veer2k26@gmail.com!");
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

    // Determine team size and fee amount strictly (4 = ₹800, 5 = ₹1000, 6 = ₹1200)
    var size = parseInt(sheet.getRange(matchRow, 5).getValue(), 10) || 4;
    if (size < 4) size = 4;
    if (size > 6) size = 6;
    var rawAmount = size * 200;
    var cols = getSheetColumnIndexes(sheet);

    // 1. Store calculated Round 2 fee amount
    sheet.getRange(matchRow, cols.round2FeeCol).setValue("₹" + rawAmount);

    // 2. Set status as "Pending Verification" (Amber background)
    // The committee must manually verify the UTR in Google Sheets before ticket email triggers!
    sheet.getRange(matchRow, cols.round2StatusCol)
      .setValue("Pending Verification")
      .setBackground("#fef3c7")
      .setFontColor("#92400e")
      .setFontWeight("bold");

    // 3. Store ONLY the submitted transaction ID / UTR (Plain Text, No Dropdown)
    var cleanUtr = String(utr || "").replace("'", "").trim();
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
function processRound2PaymentRow(sheet, rowNum, payId, amount) {
  var cols = getSheetColumnIndexes(sheet);
  var rowData = sheet.getRange(rowNum, 1, 1, cols.totalCols).getValues()[0];

  var teamId = String(rowData[1] || "").trim();
  var regId = String(rowData[2] || "").trim();
  var teamName = String(rowData[3] || "").trim();
  var rawSize = rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  if (teamSize < 4) teamSize = 4;
  if (teamSize > 6) teamSize = 6;
  var leadName = String(rowData[5] || "").trim();
  var leadEmail = String(rowData[6] || "").trim();
  var leadPhone = String(rowData[7] || "").replace("'", "").trim();
  var leadCollege = String(rowData[8] || "").trim();
  var selectedDomain = cols.hasDomain ? String(rowData[cols.domainIdx] || "Software").trim() : "Software";
  var selectedTrack = String(rowData[cols.trackIdx] || "").trim();
  var rawFee = parseInt(String(rowData[cols.round2FeeIdx] || "").replace(/[^0-9]/g, ""), 10);
  var feeAmount = amount || rawFee || (teamSize * 200);
  var r2PaymentStatus = String(rowData[cols.round2StatusIdx] || "").trim();
  var r2PaymentUtr = String(rowData[cols.round2UtrIdx] || "").replace("'", "").trim();
  var emailSentStatus = String(rowData[cols.emailStatusIdx] || "").trim();

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");
  var lowerStatus = r2PaymentStatus.toLowerCase().trim();

  // If status is "Rejected", style as red, record in Email Status, and exit
  if (lowerStatus === "rejected" || lowerStatus.indexOf("rejected") !== -1) {
    sheet.getRange(rowNum, cols.round2StatusCol).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");
    sheet.getRange(rowNum, cols.emailStatusCol).setValue("❌ Finale Payment Rejected (" + nowStr + ")");
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

  // Prevent duplicate ticket emails
  if (emailSentStatus.indexOf("Finale Ticket Sent") !== -1) {
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

  // Update Sheet: Verified green, Ticket Sent status
  sheet.getRange(rowNum, cols.round2StatusCol).setValue("Verified").setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");
  sheet.getRange(rowNum, cols.emailStatusCol).setValue("✓ Finale Ticket Sent (" + nowStr + ")");

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
    '        <!-- Action Buttons: Digital Pass & Google Maps -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td align="center">' +
    '              <a href="' + ((WEBSITE_URL || "https://aithon2-0.xyz").replace(/\/+$/, "")) + '/finale-payment?teamId=' + encodeURIComponent(teamId) + '" style="display: inline-block; background-color: #062b59; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 8px; margin-right: 8px; margin-bottom: 8px;">' +
    '                🎟️ View Workstation Digital Pass &rarr;' +
    '              </a>' +
    '              <a href="https://maps.google.com/?q=Amrutvahini+College+of+Engineering+Sangamner" target="_blank" style="display: inline-block; background-color: #f1f5f9; color: #062b59; border: 1px solid #cbd5e1; text-decoration: none; font-weight: 700; font-size: 13px; padding: 12px 20px; border-radius: 8px; margin-bottom: 8px;">' +
    '                📍 Get Directions (Google Maps)' +
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
    leadEmail: "ai.veer2k26@gmail.com",
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
  Logger.log("Test Grand Finale Ticket email dispatched to ai.veer2k26@gmail.com!");
}
