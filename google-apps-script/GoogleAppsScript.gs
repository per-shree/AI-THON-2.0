/**
 * ============================================================================
 * AITHON 2.0 — Google Sheets Registration Sync Script
 * Target Account: ai.veer2k26@gmail.com
 * ============================================================================
 * 
 * INSTRUCTIONS FOR SETUP:
 * 1. Log in to Google with account: ai.veer2k26@gmail.com
 * 2. Go to https://sheets.google.com and create a new sheet: "AITHON 2.0 Registrations"
 * 3. In the top menu, click: Extensions > Apps Script
 * 4. Delete any existing code and PASTE this entire script into the editor.
 * 5. Click "Deploy" (top right) > "New deployment"
 * 6. Select type: "Web app"
 *    - Description: "AITHON 2.0 Registration Webhook"
 *    - Execute as: "Me (ai.veer2k26@gmail.com)"
 *    - Who has access: "Anyone"  <-- CRITICAL: Choose "Anyone"
 * 7. Click "Deploy", grant permissions when prompted.
 * 8. Copy the Web App URL (starts with https://script.google.com/macros/s/.../exec)
 * 9. Add it to your project's .env file as:
 *    VITE_GOOGLE_SHEETS_URL=https://script.google.com/macros/s/.../exec
 *    (or paste it in the Admin Dashboard > Settings > Google Sheets URL)
 * ============================================================================
 */

// Define the exact structured columns for the hackathon
var HEADERS = [
  "Timestamp",
  "Team ID",
  "Registration ID",
  "Team Name",
  "Team Size",
  "Leader Full Name",
  "Leader Email",
  "Leader Phone",
  "Leader College",
  "Leader Course / Branch",
  "Leader Year",
  "Leader City",
  "Member 2 Name",
  "Member 2 Email",
  "Member 2 College",
  "Member 3 Name",
  "Member 3 Email",
  "Member 3 College",
  "Member 4 Name",
  "Member 4 Email",
  "Member 4 College",
  "GitHub Profile",
  "LinkedIn Profile",
  "Portfolio URL",
  "Key Skills",
  "Experience Level",
  "Referral Source",
  "Status"
];

// Target Google Spreadsheet ID from your URL:
// https://docs.google.com/spreadsheets/d/1uBkGnCNJ8dIRhLUY9N4zbTWSh5VEy-p-fbnTkfUNt6k/edit?usp=sharing
var SPREADSHEET_ID = "1uBkGnCNJ8dIRhLUY9N4zbTWSh5VEy-p-fbnTkfUNt6k";

function getTargetSpreadsheet() {
  try {
    if (SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
      return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
    }
  } catch (err) {
    Logger.log("Falling back to active spreadsheet: " + err.toString());
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 30 seconds for other processes to finish
  lock.tryLock(30000);

  try {
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

    // Auto-create headers if sheet is brand new / empty
    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }

    // Parse incoming data
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    // Format Indian Standard Time
    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");

    // Format phone to prevent Google Sheets scientific notation
    var phone = data.leadPhone ? "'" + data.leadPhone : "";

    // Arrange row data in the exact structured column order
    var row = [
      timestamp,
      data.teamId || "N/A",
      data.registrationId || "N/A",
      data.teamName || "N/A",
      data.teamSize || "3",
      data.leadFullName || "N/A",
      data.leadEmail || "N/A",
      phone,
      data.leadCollege || "N/A",
      data.leadCourse || "N/A",
      data.leadYear || "N/A",
      data.leadCity || "N/A",
      data.member2Name || "-",
      data.member2Email || "-",
      data.member2College || "-",
      data.member3Name || "-",
      data.member3Email || "-",
      data.member3College || "-",
      data.member4Name || "-",
      data.member4Email || "-",
      data.member4College || "-",
      data.github || "-",
      data.linkedin || "-",
      data.portfolio || "-",
      data.skills || "-",
      data.experience || "-",
      data.referral || "-",
      data.status || "Pending Review"
    ];

    // Append the row
    sheet.appendRow(row);

    // Style the appended row (center align IDs and timestamps, vertical center)
    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, row.length);
    rowRange.setVerticalAlignment("middle");
    rowRange.setFontFamily("Plus Jakarta Sans");
    rowRange.setFontSize(10);

    // Optional: send confirmation email to team leader from ai.veer2k26@gmail.com
    try {
      if (data.leadEmail && data.leadEmail.indexOf("@") !== -1) {
        sendConfirmationEmail(data);
      }
    } catch (mailErr) {
      Logger.log("Email error: " + mailErr.toString());
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: "success", 
        row: lastRow, 
        teamId: data.teamId,
        registrationId: data.registrationId
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Health check endpoint
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      service: "AITHON 2.0 Registration Webhook",
      account: "ai.veer2k26@gmail.com",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Helper: Setup aesthetic header row
function setupSheetHeaders(sheet) {
  sheet.appendRow(HEADERS);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  
  // Theme styling: Deep Navy (#062b59) with white bold text
  headerRange.setBackground("#062b59");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Plus Jakarta Sans");
  headerRange.setFontSize(10);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
}

// Helper: Optional automated confirmation email
function sendConfirmationEmail(data) {
  var subject = "AITHON 2.0 Registration Confirmed — " + data.teamName + " [" + data.teamId + "]";
  var body = 
    "Dear " + data.leadFullName + ",\n\n" +
    "Thank you for registering your team for AITHON 2.0 — National Level AI Hackathon at Amrutvahini College of Engineering (AVCOE), Sangamner!\n\n" +
    "REGISTRATION SUMMARY:\n" +
    "• Team Name: " + data.teamName + "\n" +
    "• Team ID: " + data.teamId + "\n" +
    "• Registration ID: " + data.registrationId + "\n" +
    "• Team Size: " + data.teamSize + " Members\n" +
    "• Event Date: 09 October 2026\n" +
    "• Venue: Dept. of AI & DS, AVCOE Sangamner, Maharashtra\n\n" +
    "Our organizing committee will review your application and update your verification status shortly.\n\n" +
    "For any urgent queries, contact our student coordinators:\n" +
    "• Vedant Mande: +91 85919 10018\n" +
    "• Sudhanshu Rahane: +91 77200 92989\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Department of Artificial Intelligence & Data Science\n" +
    "AVCOE Sangamner\n" +
    "ai.veer2k26@gmail.com";

  MailApp.sendEmail(data.leadEmail, subject, body);
}
