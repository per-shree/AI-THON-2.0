/**
 * ============================================================================
 * AITHON 2.0 — Google Sheets Registration Sync & Email Dispatch Script
 * Target Account: ai.veer2k26@gmail.com
 * ============================================================================
 * 
 * INSTRUCTIONS TO FIX & ENABLE AUTOMATED CONFIRMATION EMAILS:
 * 1. Open Google Apps Script editor at your sheet (Extensions > Apps Script).
 * 2. Replace all code with this updated script and click SAVE (Ctrl+S / Cmd+S).
 * 3. ⚠️ IMPORTANT STEP (AUTHORIZE GMAIL PERMISSIONS):
 *    - In the top menu toolbar, select function: "testSendEmail"
 *    - Click "Run".
 *    - A popup "Authorization Required" will appear.
 *    - Click "Review Permissions" > Choose your Google Account (ai.veer2k26@gmail.com).
 *    - Click "Advanced" > Click "Go to AITHON Webhook (unsafe)" > Click "Allow".
 *    - Check your inbox (ai.veer2k26@gmail.com) for a test email!
 * 4. ⚠️ CRITICAL STEP (UPDATE WEB APP DEPLOYMENT):
 *    - Click "Deploy" (top right) > "Manage deployments"
 *    - Click the Pencil/Edit icon.
 *    - Under "Version", select "New version".
 *    - Click "Deploy".
 * ============================================================================
 */

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

var SPREADSHEET_ID = "1uBkGnCNJ8dIRhLUY9N4zbTWSh5VEy-p-fbnTkfUNt6k";

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

function doPost(e) {
  var lock = LockService.getScriptLock();
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

    if (sheet.getLastRow() === 0) {
      setupSheetHeaders(sheet);
    }

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

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");
    var phone = data.leadPhone ? "'" + data.leadPhone : "";

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

    sheet.appendRow(row);

    var lastRow = sheet.getLastRow();
    var rowRange = sheet.getRange(lastRow, 1, 1, row.length);
    rowRange.setVerticalAlignment("middle");
    rowRange.setFontFamily("Plus Jakarta Sans");
    rowRange.setFontSize(10);

    // Send confirmation email to team leader
    var emailSentStatus = false;
    var emailErrorMsg = "";
    try {
      if (data.leadEmail && data.leadEmail.indexOf("@") !== -1) {
        sendConfirmationEmail(data);
        emailSentStatus = true;
      }
    } catch (mailErr) {
      emailErrorMsg = mailErr.toString();
      Logger.log("Email Dispatch Error: " + emailErrorMsg);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: "success", 
        row: lastRow, 
        teamId: data.teamId,
        registrationId: data.registrationId,
        emailSent: emailSentStatus,
        emailError: emailErrorMsg
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

function setupSheetHeaders(sheet) {
  sheet.appendRow(HEADERS);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
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

/**
 * Dispatch confirmation email using GmailApp & MailApp fallback
 */
function sendConfirmationEmail(data) {
  var recipient = data.leadEmail;
  var subject = "AITHON 2.0 Registration Confirmed — " + data.teamName + " [" + (data.teamId || 'TEAM') + "]";

  var plainBody = 
    "Dear " + (data.leadFullName || "Participant") + ",\n\n" +
    "Congratulations! Your team registration for AITHON 2.0 has been successfully recorded.\n\n" +
    "REGISTRATION SUMMARY:\n" +
    "• Team Name: " + (data.teamName || "N/A") + "\n" +
    "• Team ID: " + (data.teamId || "N/A") + "\n" +
    "• Registration ID: " + (data.registrationId || "N/A") + "\n" +
    "• Team Size: " + (data.teamSize || "3") + " Members\n" +
    "• Event Date: 09 October 2026\n" +
    "• Venue: Dept. of AI & DS, AVCOE Sangamner, Maharashtra\n\n" +
    "Our organizing committee will review your team details. For urgent queries, contact:\n" +
    "• Email: aiesa.avcoe@gmail.com\n" +
    "• Vedant Mande: +91 85919 10018\n" +
    "• Sudhanshu Rahane: +91 77200 92989\n\n" +
    "Best regards,\n" +
    "AITHON 2.0 Organizing Committee\n" +
    "Dept. of AI & DS, AVCOE Sangamner";

  var htmlBody = 
    "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; rounded: 12px; overflow: hidden;'>" +
      "<div style='background-color: #062b59; padding: 24px; text-align: center; color: #ffffff;'>" +
        "<h1 style='margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px;'>AITHON 2.0</h1>" +
        "<p style='margin: 4px 0 0 0; font-size: 12px; color: #93c5fd; text-transform: uppercase; tracking-wider: 1px;'>National Level AI Hackathon • AVCOE</p>" +
      "</div>" +
      "<div style='padding: 24px; background-color: #ffffff; color: #334155; line-height: 1.6;'>" +
        "<h2 style='color: #062b59; font-size: 18px; margin-top: 0;'>Registration Confirmed! 🎉</h2>" +
        "<p>Dear <strong>" + (data.leadFullName || "Participant") + "</strong>,</p>" +
        "<p>Thank you for registering your team for <strong>AITHON 2.0</strong> organized by the Department of Artificial Intelligence & Data Science, Amrutvahini College of Engineering, Sangamner.</p>" +
        
        "<div style='background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; margin: 20px 0;'>" +
          "<h3 style='margin-top: 0; color: #2563eb; font-size: 14px; text-transform: uppercase;'>Team Details</h3>" +
          "<table style='width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;'>" +
            "<tr><td style='padding: 4px 0; color: #64748b;'>Team Name:</td><td style='padding: 4px 0; font-weight: bold; color: #0f172a;'>" + (data.teamName || "N/A") + "</td></tr>" +
            "<tr><td style='padding: 4px 0; color: #64748b;'>Team ID:</td><td style='padding: 4px 0; font-weight: bold; color: #2563eb;'>" + (data.teamId || "N/A") + "</td></tr>" +
            "<tr><td style='padding: 4px 0; color: #64748b;'>Registration ID:</td><td style='padding: 4px 0; font-weight: bold; color: #059669;'>" + (data.registrationId || "N/A") + "</td></tr>" +
            "<tr><td style='padding: 4px 0; color: #64748b;'>Team Size:</td><td style='padding: 4px 0; font-weight: bold; color: #0f172a;'>" + (data.teamSize || "3") + " Members</td></tr>" +
          "</table>" +
        "</div>" +

        "<p style='font-size: 13px;'>Keep your <strong>Team ID</strong> safe. You will need it for project submissions and check-in on the hackathon day.</p>" +
        
        "<hr style='border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;' />" +
        
        "<p style='font-size: 12px; color: #64748b; margin-bottom: 0;'>For support, contact student coordinators:<br/>" +
        "• <strong>Vedant Mande:</strong> +91 85919 10018<br/>" +
        "• <strong>Sudhanshu Rahane:</strong> +91 77200 92989<br/>" +
        "• Email: <a href='mailto:aiesa.avcoe@gmail.com' style='color: #2563eb;'>aiesa.avcoe@gmail.com</a></p>" +
      "</div>" +
      "<div style='background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 11px; color: #64748b;'>" +
        "© 2026 AITHON 2.0 • Dept of AI & DS, AVCOE Sangamner" +
      "</div>" +
    "</div>";

  // Attempt GmailApp first
  try {
    GmailApp.sendEmail(recipient, subject, plainBody, {
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee"
    });
    Logger.log("Email successfully sent via GmailApp to: " + recipient);
  } catch (gErr) {
    Logger.log("GmailApp failed, trying MailApp fallback: " + gErr.toString());
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee"
    });
    Logger.log("Email successfully sent via MailApp to: " + recipient);
  }
}

/**
 * 🧪 TEST FUNCTION — Run this once in Apps Script Editor to trigger Authorization Popup!
 */
function testSendEmail() {
  var dummyData = {
    leadEmail: "ai.veer2k26@gmail.com",
    leadFullName: "Test Organizers",
    teamName: "Test Squad",
    teamId: "TEAM-999",
    registrationId: "AI25-9999",
    teamSize: "3"
  };
  
  Logger.log("Sending test email to ai.veer2k26@gmail.com...");
  sendConfirmationEmail(dummyData);
  Logger.log("Test email sent! Please check your inbox at ai.veer2k26@gmail.com.");
}
