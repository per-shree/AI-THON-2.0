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
var UPI_VPA = "shreeugale123-3@oksbi";

// Official Website Domain (used to generate private Grand Finale payment portal link in acceptance emails)
// Update this to your deployed domain (e.g. "https://aithon2026.vercel.app") or custom domain
var WEBSITE_URL = "https://aithon2-0.xyz";

/**
 * ROUND 2 PAYMENT PORTAL FALLBACK LINKS (Team Members × ₹200):
 * - 4 Members = ₹800
 * - 5 Members = ₹1,000
 * - 6 Members = ₹1,200
 */
var ROUND_2_PAYMENT_LINKS = {
  4: "https://aithon2-0.xyz/finale-payment?size=4&fee=800", // 4 members = ₹800
  5: "https://aithon2-0.xyz/finale-payment?size=5&fee=1000", // 5 members = ₹1000
  6: "https://aithon2-0.xyz/finale-payment?size=6&fee=1200"  // 6 members = ₹1200
};

// Comprehensive 48-Column Header Structure for AITHON 2.0
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
  "Selected Track",            // Col 38 (AL) - Competition Domain (1 of 23 Tracks)
  "PPT Drive Link",            // Col 39 (AM) - Direct Google Drive URL (Named as Team ID)
  "Original PPT File Name",    // Col 40 (AN)
  "Evaluation Fee (₹50)",      // Col 41 (AO) - ₹50
  "Eval Fee Status",           // Col 42 (AP) - ₹50 Successful
  "Eval Payment UTR",          // Col 43 (AQ)
  "PPT Status",                // Col 44 (AR) - Selection / Rejection (Accepted / Rejected / Pending Review)
  "Round 2 Fee Amount",        // Col 45 (AS) - Calculated: Team Size × 200 (₹800, ₹1000, ₹1200)
  "Round 2 Payment Link",      // Col 46 (AT) - Non-Editable Payment Link
  "Round 2 Payment Status",    // Col 47 (AU) - Pending / Paid
  "Email Notification Status"  // Col 48 (AV) - Tracks email sent date/time to prevent duplicate emails
];

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
 * Generates the private website payment portal link for Round 2
 * This link is unlisted and ONLY dispatched inside the Acceptance Email!
 */
function getRound2PaymentLink(teamSize, teamId, leadEmail, teamName) {
  var size = parseInt(teamSize, 10) || 4;
  var fee = size * 200;
  var base = (WEBSITE_URL || "").replace(/\/+$/, "");

  // If website URL is configured, build the private website payment portal URL:
  if (base && base !== "") {
    return base + "/finale-payment?teamId=" + encodeURIComponent(teamId || "") +
           "&size=" + size +
           "&fee=" + fee +
           "&email=" + encodeURIComponent(leadEmail || "") +
           "&teamName=" + encodeURIComponent(teamName || "");
  }

  // Fallback to static link if website URL not configured
  return ROUND_2_PAYMENT_LINKS[size] || ROUND_2_PAYMENT_LINKS[4];
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

    // Ensure sequential IDs if not provided
    if (!data.teamId || !data.registrationId) {
      var nextSerial = getLiveNextSerial(sheet);
      data.teamId = data.teamId || ("TEAM-" + nextSerial);
      data.registrationId = data.registrationId || ("AI25-" + nextSerial);
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
    var round2Link = getRound2PaymentLink(teamSizeNum, data.teamId);

    // 🛡️ SUBMISSION RECORDING (MANUAL VERIFICATION REQUIRED — AUTO-DETECTION DISABLED)
    var utrStr = data.paymentUtr ? String(data.paymentUtr).trim() : "";
    var evalFeeStatus = "Pending Verification";
    var pptStatusCol = "Pending Review";
    var emailSentCol = "Not Sent (Pending Manual Verification)";

    // 48-column row aligned with HEADERS
    var row = [
      timestamp,                               // Col 1: Timestamp
      data.teamId || "N/A",                    // Col 2: Team ID
      data.registrationId || "N/A",            // Col 3: Registration ID
      data.teamName || "N/A",                  // Col 4: Team Name
      data.teamSize,                           // Col 5: Team Size
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
      data.selectedTrack || "General AI Track",// Col 38: Selected Track (1 of 23 Tracks)
      pptDriveUrl,                             // Col 39: PPT Drive Link
      data.pptFileName || "-",                 // Col 40: Original PPT File Name
      "₹50",                                   // Col 41: Evaluation Fee (₹50)
      evalFeeStatus,                           // Col 42: Eval Fee Status (Dropdown: Pending Verification / Verified / Rejected)
      utrStr ? ("'" + utrStr) : "-",           // Col 43: Eval Payment UTR (Only Payment ID / UTR, No Dropdown)
      pptStatusCol,                            // Col 44: PPT Status
      round2FeeAmount,                         // Col 45: Round 2 Fee Amount (teamSize * 200)
      round2Link,                              // Col 46: Round 2 Payment Link (Non-editable)
      "Pending",                               // Col 47: Round 2 Payment Status
      emailSentCol                             // Col 48: Email Notification Status
    ];

    sheet.appendRow(row);

    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, row.length);
    rowRange.setVerticalAlignment("middle");
    rowRange.setFontFamily("Plus Jakarta Sans");
    rowRange.setFontSize(10);

    // Style Col 42 as amber (Pending Verification) and apply dropdown
    try {
      var evalRule = SpreadsheetApp.newDataValidation()
        .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
        .setAllowInvalid(true)
        .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
        .build();
      sheet.getRange(lastRow, 42).setDataValidation(evalRule);
      sheet.getRange(lastRow, 42).setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");

      // Strictly ensure Column 43 (Eval Payment UTR) has NO dropdown and is formatted as Plain Text
      sheet.getRange(lastRow, 43).clearDataValidations();
      sheet.getRange(lastRow, 43).setNumberFormat("@");
    } catch (styleErr) {}

    // NOTE: Auto-email trigger is disabled. Emails are only sent when an admin manually marks Col 42 as Verified/Paid.

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      underReview: true,
      paymentVerified: false,
      message: "Registration received. We will review your payment shortly in 24hr will get confirmation. By confirming via Google Sheet mail will get trigger.",
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

    // Check if client is looking up team details for the Grand Finale Payment Portal
    if (e && e.parameter && (e.parameter.action === "getTeamDetails" || e.parameter.teamId)) {
      var queryTeamId = String(e.parameter.teamId || "").trim().toUpperCase();
      var queryEmail = String(e.parameter.email || "").trim().toLowerCase();

      if (sheet && (queryTeamId || queryEmail)) {
        var lastRow = sheet.getLastRow();
        if (lastRow > 1) {
          var rows = sheet.getRange(2, 1, lastRow - 1, 48).getValues();
          for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            var rTeamId = String(r[1] || "").trim().toUpperCase();
            var rEmail = String(r[6] || "").trim().toLowerCase();
            if ((queryTeamId && rTeamId === queryTeamId) || (queryEmail && rEmail === queryEmail)) {
              var size = parseInt(r[4], 10) || 4;
              return ContentService.createTextOutput(JSON.stringify({
                success: true,
                teamId: r[1],
                registrationId: r[2],
                teamName: r[3],
                teamSize: size,
                leadFullName: r[5],
                leadEmail: r[6],
                leadPhone: String(r[7] || "").replace("'", ""),
                selectedTrack: r[37] || "General AI Track",
                pptStatus: r[43] || "Pending Review",
                round2FeeAmount: size * 200,
                round2PaymentStatus: r[46] || "Pending",
                ticketSent: String(r[47] || "").indexOf("Finale Ticket Sent") !== -1
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
      nextTeamId: "TEAM-" + nextSerial,
      nextRegistrationId: "AI25-" + nextSerial,
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
 * Calculates live next serial ID from sheet rows
 */
function getLiveNextSerial(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 101;

  var teamIdColValues = sheet.getRange(2, 2, lastRow - 1, 1).getValues();
  var maxSerial = 100;

  for (var i = 0; i < teamIdColValues.length; i++) {
    var val = String(teamIdColValues[i][0]).trim();
    var match = val.match(/(?:TEAM-?|AI25-?)(\d+)/i);
    if (match && match[1]) {
      var num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxSerial) {
        maxSerial = num;
      }
    }
  }

  return Math.max(maxSerial + 1, 100 + lastRow);
}

/**
 * Sets up sheet headers and formatting
 */
function setupSheet(sheet) {
  sheet.appendRow(HEADERS);
  formatHeaderRow(sheet);
}

function formatHeaderRow(sheet) {
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
    sheet.setColumnWidth(38, 250); // Selected Track (1 of 23 Tracks)
    sheet.setColumnWidth(39, 280); // PPT Drive Link
    sheet.setColumnWidth(40, 200); // Original PPT File Name
    sheet.setColumnWidth(41, 120); // Evaluation Fee (₹50)
    sheet.setColumnWidth(42, 140); // Eval Fee Status
    sheet.setColumnWidth(43, 150); // Eval Payment UTR
    sheet.setColumnWidth(44, 170); // PPT Status (Selection/Rejection)
    sheet.setColumnWidth(45, 150); // Round 2 Fee Amount
    sheet.setColumnWidth(46, 290); // Round 2 Payment Link
    sheet.setColumnWidth(47, 150); // Round 2 Payment Status
    sheet.setColumnWidth(48, 260); // Email Notification Status

    // Apply Dropdown Data Validation to Column 44 (PPT Status) for all data rows
    var maxRows = Math.max(sheet.getMaxRows(), 100);
    var statusRange = sheet.getRange(2, 44, maxRows - 1, 1);
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Accepted", "Rejected", "Pending Review"], true)
      .setAllowInvalid(false)
      .setHelpText("Select 'Accepted' or 'Rejected' to evaluate team PPT.")
      .build();
    statusRange.setDataValidation(rule);

    // Apply Dropdown Data Validation to Column 42 (Eval Fee Status) for all data rows: ONLY Pending Verification, Verified, Rejected
    var evalStatusRange = sheet.getRange(2, 42, maxRows - 1, 1);
    var evalRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
      .build();
    evalStatusRange.setDataValidation(evalRule);

    // Strictly remove any dropdown data validation from Column 43 (Eval Payment UTR) - ONLY payment ID occurs
    var utrRange = sheet.getRange(2, 43, maxRows - 1, 1);
    utrRange.clearDataValidations();
    utrRange.setNumberFormat("@");

    // Apply Dropdown Data Validation to Column 47 (Round 2 Payment Status) for all data rows
    var r2StatusRange = sheet.getRange(2, 47, maxRows - 1, 1);
    var r2Rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending", "Paid", "Verified", "Failed"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Paid' or 'Verified' when Grand Finale payment is received.")
      .build();
    r2StatusRange.setDataValidation(r2Rule);

  } catch (e) {
    Logger.log("Column formatting notice: " + e.toString());
  }
}

/**
 * 🛠️ ONE-CLICK SHEET STRUCTURE UPDATER:
 * Run this function once to update your Google Sheet to the comprehensive 47 columns,
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

  // Ensure sheet has at least 48 columns
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }

  // Update row 1 with new comprehensive headers
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);
  formatHeaderRow(sheet);

  Logger.log("✓ Google Sheet headers successfully updated to 48 columns with Selected Track and PPT Status dropdown!");
  return "Sheet structure updated successfully to 48 columns!";
}

/**
 * Adds Top Menu "🚀 AITHON 2.0" directly in Google Sheets toolbar
 */
function onOpen() {
  try {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu("🚀 AITHON 2.0")
      .addItem("✅ Verify Registration Payment & Send Email (Col 42)", "processAllVerifiedRegistrations")
      .addItem("⚡ Quick Verify Registration Payment (1-Click)", "quickVerifyRegistrationPaymentPrompt")
      .addSeparator()
      .addItem("⚡ Quick Mark Team as Paid (Finale Col 47)", "quickMarkTeamPaidPrompt")
      .addItem("🎟️ Dispatch Finale Tickets to Paid Teams", "processAllPaidFinaleTeams")
      .addItem("📧 Process PPT Evaluations (Send Emails)", "processAllPptEvaluations")
      .addItem("📋 View Unmatched Payments Sheet", "openUnmatchedPaymentsSheet")
      .addSeparator()
      .addItem("🔄 Fix Eval Dropdowns (Col 42 & Col 43)", "fixEvalColumnsDropdownAndUtr")
      .addItem("🛠️ Setup Sheet Columns & Dropdowns", "updateSheetStructure")
      .addItem("⚡ Enable Real-Time Edit Trigger", "installEditTrigger")
      .addToUi();
  } catch (e) {
    Logger.log("onOpen UI notice: " + e.toString());
  }
}

/**
 * 🛠️ Fix Column 42 Dropdowns & Remove Dropdowns from Column 43 (Eval Payment UTR)
 */
function fixEvalColumnsDropdownAndUtr() {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss ? ss.getSheetByName("Registrations") : null;
    if (!sheet) sheet = ss.getActiveSheet();
    var maxRows = Math.max(sheet.getMaxRows(), 100);

    // 1. Column 42: Dropdown with ONLY [Pending Verification, Verified, Rejected]
    var evalRule = SpreadsheetApp.newDataValidation()
      .requireValueInList(["Pending Verification", "Verified", "Rejected"], true)
      .setAllowInvalid(true)
      .setHelpText("Select 'Pending Verification', 'Verified', or 'Rejected'.")
      .build();
    sheet.getRange(2, 42, maxRows - 1, 1).setDataValidation(evalRule);

    // 2. Column 43: Clear all dropdown data validations so only payment ID occurs
    sheet.getRange(2, 43, maxRows - 1, 1).clearDataValidations();
    sheet.getRange(2, 43, maxRows - 1, 1).setNumberFormat("@");

    Logger.log("✓ Updated Column 42 dropdowns to [Pending Verification, Verified, Rejected] and cleared Column 43 dropdowns.");
    try {
      SpreadsheetApp.getUi().alert("✓ Updated successfully!\n\n• Column 42 (Eval Fee Status): Dropdown now consists only of 'Pending Verification', 'Verified', and 'Rejected'.\n• Column 43 (Eval Payment UTR): All dropdowns removed so only the payment ID occurs.");
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

  var values = sheet.getRange(2, 1, lastRow - 1, 48).getValues();
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

  var rowData = sheet.getRange(matchRow, 1, 1, 48).getValues()[0];
  var teamId = rowData[1];
  var teamName = rowData[3];

  sheet.getRange(matchRow, 42)
    .setValue("Verified")
    .setBackground("#dcfce7")
    .setFontColor("#166534")
    .setFontWeight("bold");

  var dispatched = processEvalFeeStatusRow(sheet, matchRow);
  if (dispatched) {
    ui.alert("✓ Success!\n\nTeam " + teamId + " (" + teamName + ") payment verified.\nOfficial Registration Confirmation Email sent to: " + rowData[6]);
  } else {
    ui.alert("Team " + teamId + " payment marked as Verified in Column 42.");
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

  var values = sheet.getRange(2, 1, lastRow - 1, 48).getValues();
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

  var rowData = sheet.getRange(matchRow, 1, 1, 48).getValues()[0];
  var teamId = rowData[1];
  var teamName = rowData[3];
  var teamSize = parseInt(rowData[4], 10) || 4;
  var fee = teamSize * 200;

  sheet.getRange(matchRow, 47)
    .setValue("✓ ₹" + fee + " Confirmed (Manual)")
    .setBackground("#dcfce7")
    .setFontColor("#166534")
    .setFontWeight("bold");

  var dispatched = processRound2PaymentRow(sheet, matchRow, "MANUAL_CONFIRMED", fee);
  if (dispatched) {
    ui.alert("✓ Success!\n\nTeam " + teamId + " (" + teamName + ") marked as Paid.\nOfficial Grand Finale Ticket has been emailed to: " + rowData[6]);
  } else {
    ui.alert("Team " + teamId + " marked as Paid in Column 47.");
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
 * 1. Sends confirmation email when Col 42 (Eval Fee Status) is changed to 'Verified' / 'Paid',
 * 2. Sends acceptance/rejection email when Col 44 (PPT Status) is changed,
 * 3. Sends Grand Finale Hall Ticket when Col 47 (Round 2 Payment Status) is changed to 'Paid'!
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
    SpreadsheetApp.getUi().alert("Real-time Triggers Installed!\n\n1. When Col 42 (Eval Fee Status) is marked 'Verified' / 'Paid', registration confirmation email is sent.\n2. When Col 44 (PPT Status) is 'Accepted', acceptance email is sent.\n3. When Col 47 (Round 2 Payment) is marked 'Paid', official Grand Finale Ticket email is sent automatically!");
  } catch (e) {}
}

/**
 * Trigger handler for real-time edits:
 * - Column 42 (Eval Fee Status)
 * - Column 44 (PPT Status)
 * - Column 47 (Round 2 Payment Status)
 */
function installedOnEdit(e) {
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  if (sheet.getName() !== "Registrations") return;

  var row = e.range.getRow();
  var col = e.range.getColumn();

  // Column 42 is "Eval Fee Status" (Row >= 2) - Manual Payment Verification
  if (col === 42 && row >= 2) {
    processEvalFeeStatusRow(sheet, row);
  }

  // Column 44 is "PPT Status" (Row >= 2)
  if (col === 44 && row >= 2) {
    processPptEvaluationRow(sheet, row);
  }

  // Column 47 is "Round 2 Payment Status" (Row >= 2)
  if (col === 47 && row >= 2) {
    processRound2PaymentRow(sheet, row);
  }
}

/**
 * 📧 MANUAL EVALUATION FEE PROCESSOR:
 * Processes a single row for Column 42 ("Eval Fee Status") manual payment verification & confirmation email dispatch.
 * Confirmation emails will ONLY be sent when Col 42 is manually marked as "Verified", "Paid", "Approved", or "Successful".
 */
function processEvalFeeStatusRow(sheet, rowNum) {
  var rowData = sheet.getRange(rowNum, 1, 1, 48).getValues()[0];

  var teamId = String(rowData[1] || "").trim();
  var regId = String(rowData[2] || "").trim();
  var teamName = String(rowData[3] || "").trim();
  var rawSize = rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  var leadName = String(rowData[5] || "").trim();
  var leadEmail = String(rowData[6] || "").trim();
  var selectedTrack = String(rowData[37] || "").trim(); // Col 38 (0-indexed: 37)
  var pptLink = String(rowData[38] || "").trim();       // Col 39 (0-indexed: 38)
  var evalFeeStatus = String(rowData[41] || "").trim(); // Col 42 (0-indexed: 41)
  var utr = String(rowData[42] || "").trim();           // Col 43 (0-indexed: 42)
  var emailSentStatus = String(rowData[47] || "").trim(); // Col 48 (0-indexed: 47)

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var lowerStatus = evalFeeStatus.toLowerCase().trim();

  // If status is "Rejected", style as red, record in Col 48, and exit
  if (lowerStatus === "rejected" || lowerStatus.indexOf("rejected") !== -1) {
    sheet.getRange(rowNum, 42).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");
    sheet.getRange(rowNum, 48).setValue("❌ Payment Rejected (" + nowStr + ")");
    Logger.log("Row " + rowNum + " (" + teamId + "): Eval fee status marked as Rejected.");
    return false;
  }

  // If status is "Pending Verification", style as amber and wait for manual action
  if (lowerStatus === "pending verification" || lowerStatus.indexOf("pending") !== -1) {
    sheet.getRange(rowNum, 42).setBackground("#fef3c7").setFontColor("#92400e").setFontWeight("bold");
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

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

  var teamData = {
    teamId: teamId,
    registrationId: regId,
    teamName: teamName,
    teamSize: teamSize,
    leadFullName: leadName,
    leadEmail: leadEmail,
    selectedTrack: selectedTrack || "General AI Track",
    pptDriveUrl: pptLink,
    evalFeeStatus: "Verified",
    utr: utr
  };

  sendConfirmationEmail(teamData);

  // Update Col 48: Email Notification Status
  sheet.getRange(rowNum, 48).setValue("✓ Confirmation Email Sent (" + nowStr + ")");
  // Style Col 42 with verified green and ensure text is "Verified"
  sheet.getRange(rowNum, 42).setValue("Verified").setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");

  Logger.log("✓ Manual payment verified & confirmation email sent to: " + leadEmail + " for " + teamId);
  return true;
}

/**
 * 📧 BATCH PROCESSOR FOR REGISTRATION PAYMENT VERIFICATION:
 * Scans all rows in the sheet. For any row where Col 42 is 'Verified'/'Paid'/'Approved'/'Successful'
 * and confirmation email has not been sent yet (Col 48), dispatches the confirmation email!
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
  var rowData = sheet.getRange(rowNum, 1, 1, 48).getValues()[0];

  var teamId = String(rowData[1] || "").trim();
  var regId = String(rowData[2] || "").trim();
  var teamName = String(rowData[3] || "").trim();
  var rawSize = rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  var leadName = String(rowData[5] || "").trim();
  var leadEmail = String(rowData[6] || "").trim();
  var selectedTrack = String(rowData[37] || "").trim(); // Col 38 (0-indexed: 37)
  var pptStatus = String(rowData[43] || "").trim();     // Col 44 (0-indexed: 43)
  var emailSentStatus = String(rowData[47] || "").trim(); // Col 48 (0-indexed: 47)

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

  // CASE 1: PPT ACCEPTED
  if (pptStatus.toLowerCase() === "accepted" || pptStatus.toLowerCase() === "selected") {
    // Check if already sent to prevent duplicate email spam
    if (emailSentStatus.indexOf("Accepted Email Sent") !== -1) {
      Logger.log("Row " + rowNum + " (" + teamId + "): Acceptance email already sent. Skipping.");
      return false;
    }

    var feeAmount = teamSize * 200;
    var paymentLink = getRound2PaymentLink(teamSize, teamId, leadEmail, teamName);

    var teamData = {
      teamId: teamId,
      registrationId: regId,
      teamName: teamName,
      teamSize: teamSize,
      leadFullName: leadName,
      leadEmail: leadEmail,
      selectedTrack: selectedTrack || "General AI Track",
      feeAmount: feeAmount,
      paymentLink: paymentLink
    };

    sendPptAcceptanceEmail(teamData);

    // Update Sheet: Col 45 (Fee), Col 46 (Link), Col 47 (Payment Status), Col 48 (Email Status)
    sheet.getRange(rowNum, 45).setValue("₹" + feeAmount);
    sheet.getRange(rowNum, 46).setValue(paymentLink);
    sheet.getRange(rowNum, 47).setValue("Pending");
    sheet.getRange(rowNum, 48).setValue("✓ Accepted Email Sent (" + nowStr + ")");

    // Highlight row status
    sheet.getRange(rowNum, 44).setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");

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
      selectedTrack: selectedTrack || "General AI Track"
    };

    sendPptRejectionEmail(teamDataReject);

    // Update Sheet: Col 48 (Email Status)
    sheet.getRange(rowNum, 48).setValue("✓ Rejection Email Sent (" + nowStr + ")");
    sheet.getRange(rowNum, 44).setBackground("#fee2e2").setFontColor("#991b1b").setFontWeight("bold");

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
  var feeAmount = data.feeAmount || (teamSize * 200);
  var paymentLink = data.paymentLink || getRound2PaymentLink(teamSize, teamId);

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
    "• Competition Track : " + (data.selectedTrack || "General AI Track") + "\n" +
    "• Team Size         : " + teamSize + " Members\n" +
    "• Status            : SHORTLISTED FOR FINALE (ROUND 2)\n\n" +
    "----------------------------------------------------------\n" +
    "ROUND 2 REGISTRATION FEE (NON-EDITABLE)\n" +
    "----------------------------------------------------------\n" +
    "Calculation         : " + teamSize + " Members × ₹200/member\n" +
    "Total Team Fee      : ₹" + feeAmount + " (Fixed for entire team)\n\n" +
    "OFFICIAL PAYMENT LINK (AMOUNT LOCKED):\n" +
    paymentLink + "\n\n" +
    "Note: The fee of ₹" + feeAmount + " is strictly fixed and non-editable. Please complete this final step to confirm your team's physical seat.\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  // Modern HTML Email Template with Non-Editable Payment Call-To-Action
  var htmlBody =
    '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '  <meta charset="utf-8">' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '  <title>AITHON 2.0 PPT Accepted</title>' +
    '</head>' +
    '<body style="margin: 0; padding: 24px 12px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 6px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">' +
    '    <!-- Brand Header -->' +
    '    <tr>' +
    '      <td style="background: linear-gradient(135deg, #062b59 0%, #1e3a8a 100%); padding: 32px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(34,197,94,0.25); border: 1px solid #4ade80; color: #bbf7d0; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">' +
    '          PPT Shortlisted • Grand Finale' +
    '        </div>' +
    '        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">AITHON 2.0</h1>' +
    '        <div style="font-size: 12px; color: #cbd5e1; margin-top: 6px; font-weight: 500;">Dept. of Artificial Intelligence & Data Science • AVCOE Sangamner</div>' +
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
    '          We are pleased to inform you that your idea presentation for <strong>AITHON 2.0</strong> has been evaluated and <strong>SHORTLISTED</strong> by our jury panel! Your team has officially qualified to compete in the offline Grand Finale.' +
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
    '                  <td style="color: #64748b;">Competition Track:</td>' +
    '                  <td style="font-weight: 700; color: #2563eb;">' + (data.selectedTrack || 'General AI Track') + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Size:</td>' +
    '                  <td style="color: #0f172a; font-weight: 600;">' + teamSize + ' Members</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Status:</td>' +
    '                  <td><span style="color: #047857; font-weight: 700;">Qualified for Finale</span></td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +

    '        <!-- NON-EDITABLE PAYMENT CARD -->' +
    '        <div style="background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 100%); border: 2px solid #22c55e; border-radius: 14px; padding: 24px 20px; text-align: center; margin-bottom: 26px;">' +
    '          <div style="display: inline-block; background-color: #15803d; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">' +
    '            Final Round Entry Fee (Non-Editable)' +
    '          </div>' +
    '          <div style="font-size: 13px; color: #166534; font-weight: 600; margin-bottom: 4px;">' +
    '            ' + teamSize + ' Team Members × ₹200 per member' +
    '          </div>' +
    '          <div style="font-size: 34px; font-weight: 900; color: #064e3b; margin: 4px 0 16px 0; letter-spacing: -1px;">' +
    '            ₹' + feeAmount +
    '          </div>' +

    '          <!-- Pay Button -->' +
    '          <div style="margin-bottom: 16px;">' +
    '            <a href="' + paymentLink + '" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #047857 0%, #059669 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 28px; border-radius: 10px; box-shadow: 0 4px 14px rgba(5,150,105,0.35); text-transform: uppercase; letter-spacing: 0.5px;">' +
    '              Pay ₹' + feeAmount + ' & Confirm Finale Workstation &rarr;' +
    '            </a>' +
    '          </div>' +

    '          <div style="font-size: 11.5px; color: #15803d; font-weight: 600; line-height: 1.5; max-width: 480px; margin: 0 auto;">' +
    '            <strong>Private Finalist Portal:</strong> Click above to open your private AITHON 2.0 Grand Finale portal. Completing the fee of ₹' + feeAmount + ' locks your team workstation at AVCOE Sangamner, and your official Grand Finale Ticket & Entry Pass will be dispatched immediately.' +
    '          </div>' +
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
    '    <!-- Brand Header -->' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 32px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(148,163,184,0.2); border: 1px solid #94a3b8; color: #cbd5e1; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          National Level AI Hackathon' +
    '        </div>' +
    '        <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">AITHON 2.0</h1>' +
    '        <div style="font-size: 12px; color: #cbd5e1; margin-top: 6px; font-weight: 500;">Dept. of Artificial Intelligence & Data Science • AVCOE Sangamner</div>' +
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
    "Congratulations! Your team registration for AITHON 2.0 has been successfully recorded.\n\n" +
    "----------------------------------------------------------\n" +
    "OFFICIAL REGISTRATION SUMMARY\n" +
    "----------------------------------------------------------\n" +
    "• Team Name        : " + teamName + "\n" +
    "• Team ID          : " + teamId + "\n" +
    "• Registration ID  : " + regId + "\n" +
    "• Competition Track: " + (data.selectedTrack || "General AI Track") + "\n" +
    "• Team Size        : " + teamSize + " Members\n" +
    "• PPT Submission   : Stored in Drive as " + teamId + ".pptx\n" +
    (pptLink && pptLink.indexOf("http") === 0 ? "• PPT Drive Link   : " + pptLink + "\n" : "") +
    "• Evaluation Fee   : ₹50 Successful\n" +
    "• Event Date       : Friday, 23 October 2026\n" +
    "• Venue            : Dept. of AI & DS, AVCOE Sangamner, Maharashtra\n\n" +
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
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.07); border: 1px solid #e2e8f0;">' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 32px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(37,99,235,0.3); border: 1px solid #38bdf8; color: #93c5fd; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          National Level AI Hackathon' +
    '        </div>' +
    '        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">AITHON 2.0</h1>' +
    '        <div style="font-size: 12px; color: #cbd5e1; margin-top: 6px; font-weight: 500;">Dept. of Artificial Intelligence & Data Science • AVCOE Sangamner</div>' +
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
    '          Congratulations! Your team registration and idea PPT for <strong>AITHON 2.0</strong> have been successfully recorded.' +
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
    '                  <td><span style="color: #047857; font-weight: 700;">&#10003; ₹50 Successful</span></td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Event Date:</td>' +
    '                  <td style="color: #0f172a; font-weight: 600;">Friday, 23 October 2026</td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
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
    '    <tr>' +
    '      <td style="background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); padding: 32px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(255,255,255,0.2); border: 1px solid #fca5a5; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          Action Required • Payment Pending' +
    '        </div>' +
    '        <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">AITHON 2.0</h1>' +
    '        <div style="font-size: 12px; color: #fecaca; margin-top: 6px; font-weight: 500;">Registration On Hold • Payment Confirmation Required</div>' +
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
    var targetTeamId = String(data.teamId || "").trim().toUpperCase();
    var targetEmail = String(data.leadEmail || "").trim().toLowerCase();
    var utr = String(data.paymentUtr || data.paymentId || "").trim();

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "No teams found in sheet" })).setMimeType(ContentService.MimeType.JSON);
    }

    var values = sheet.getRange(2, 1, lastRow - 1, 48).getValues();
    var matchRow = -1;

    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      var rTeamId = String(row[1] || "").trim().toUpperCase();
      var rEmail = String(row[6] || "").trim().toLowerCase();

      if ((targetTeamId && rTeamId === targetTeamId) || (targetEmail && rEmail === targetEmail)) {
        matchRow = i + 2;
        break;
      }
    }

    if (matchRow === -1) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "Team not found for ID: " + targetTeamId })).setMimeType(ContentService.MimeType.JSON);
    }

    var rawAmount = data.amount || 0;
    if (!rawAmount) {
      var size = parseInt(sheet.getRange(matchRow, 5).getValue(), 10) || 4;
      rawAmount = size * 200;
    }
    var amountStr = rawAmount > 0 ? ("₹" + rawAmount) : "Paid";
    
    // 🛡️ DO NOT AUTO-DISPATCH TICKET EMAIL OR MARK AS CONFIRMED!
    // Set Column 47 as Pending Verification so organizing committee must confirm via Google Sheet
    var statusText = "Pending Verification (UTR: " + (utr || "Submitted") + ", " + amountStr + ")";
    sheet.getRange(matchRow, 47)
      .setValue(statusText)
      .setBackground("#fef3c7")
      .setFontColor("#92400e")
      .setFontWeight("bold");

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      underReview: true,
      paymentVerified: false,
      message: "Round 2 payment UTR received. We will review your payment shortly in 24hr will get confirmation. By confirming via Google Sheet mail will get trigger.",
      row: matchRow,
      teamId: targetTeamId,
      amount: rawAmount,
      utr: utr
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
  var rowData = sheet.getRange(rowNum, 1, 1, 48).getValues()[0];

  var teamId = String(rowData[1] || "").trim();
  var regId = String(rowData[2] || "").trim();
  var teamName = String(rowData[3] || "").trim();
  var rawSize = rowData[4];
  var teamSize = parseInt(rawSize, 10) || 4;
  var leadName = String(rowData[5] || "").trim();
  var leadEmail = String(rowData[6] || "").trim();
  var selectedTrack = String(rowData[37] || "").trim(); // Col 38 (0-indexed: 37)
  var feeAmount = amount || (teamSize * 200);
  var r2PaymentStatus = String(rowData[46] || "").trim(); // Col 47 (0-indexed: 46)
  var emailSentStatus = String(rowData[47] || "").trim(); // Col 48 (0-indexed: 47)

  if (!leadEmail || leadEmail.indexOf("@") === -1) {
    Logger.log("Row " + rowNum + " skipped: No valid leader email.");
    return false;
  }

  var lowerStatus = r2PaymentStatus.toLowerCase();
  // Strictly check that payment is marked as confirmed/paid AND not still pending verification
  var isPaid = (lowerStatus.indexOf("paid") !== -1 ||
                lowerStatus.indexOf("approved") !== -1 ||
                lowerStatus.indexOf("verified") !== -1 ||
                lowerStatus.indexOf("confirmed") !== -1) &&
               lowerStatus.indexOf("pending") === -1 &&
               lowerStatus.indexOf("hold") === -1;

  if (!isPaid) {
    return false;
  }

  // Prevent duplicate ticket emails
  if (emailSentStatus.indexOf("Finale Ticket Sent") !== -1) {
    Logger.log("Row " + rowNum + " (" + teamId + "): Finale Ticket already sent. Skipping.");
    return false;
  }

  var nowStr = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm a");

  var teamData = {
    teamId: teamId,
    registrationId: regId,
    teamName: teamName,
    teamSize: teamSize,
    leadFullName: leadName,
    leadEmail: leadEmail,
    selectedTrack: selectedTrack || "General AI Track",
    feeAmount: feeAmount,
    paymentId: payId || "VERIFIED"
  };

  sendGrandFinaleTicketEmail(teamData);

  // Update Sheet Col 48 (Email Notification Status)
  sheet.getRange(rowNum, 48).setValue("✓ Finale Ticket Sent (" + nowStr + ")");
  sheet.getRange(rowNum, 47).setBackground("#dcfce7").setFontColor("#166534").setFontWeight("bold");

  Logger.log("✓ Grand Finale Ticket email sent to: " + leadEmail + " for " + teamId);
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
    '    <!-- Header -->' +
    '    <tr>' +
    '      <td style="background: linear-gradient(135deg, #062b59 0%, #0f766e 100%); padding: 36px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(34,197,94,0.25); border: 1px solid #4ade80; color: #bbf7d0; padding: 5px 16px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 12px;">' +
    '          OFFICIAL GRAND FINALE PASS' +
    '        </div>' +
    '        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">AITHON 2.0</h1>' +
    '        <div style="font-size: 13px; color: #ccfbf1; margin-top: 6px; font-weight: 500;">Dept. of Artificial Intelligence & Data Science • AVCOE Sangamner</div>' +
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
