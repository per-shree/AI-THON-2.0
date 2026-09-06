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

    // Auto-generate unique sequential serial numbers starting strictly from 101 (TEAM-101, AI25-101)
    var nextSerialInfo = getLiveNextSerial(sheet);
    var nextSerialNum = nextSerialInfo.nextNum;
    var usedNums = nextSerialInfo.usedNums || {};

    // Validate if client sent a serial number that matches the next available unique slot
    var requestedNum = null;
    if (data.teamId && typeof data.teamId === 'string') {
      var match = data.teamId.match(/^TEAM-(\d+)$/i);
      if (match) {
        requestedNum = parseInt(match[1], 10);
      }
    }

    var assignedNum = nextSerialNum;
    // Accept client ID ONLY if it is >= 101, not already used in the sheet, and matches nextSerialNum
    if (requestedNum && requestedNum >= 101 && !usedNums[requestedNum] && requestedNum === nextSerialNum) {
      assignedNum = requestedNum;
    } else {
      assignedNum = nextSerialNum;
    }

    // Both Team ID and Registration ID increase simultaneously with the exact same unique number
    data.teamId = "TEAM-" + assignedNum;
    data.registrationId = "AI25-" + assignedNum;

    // Enforce max team size of 4 members
    var rawTeamSize = parseInt(data.teamSize || "3", 10);
    var clampedTeamSize = Math.min(4, Math.max(1, isNaN(rawTeamSize) ? 3 : rawTeamSize));
    data.teamSize = String(clampedTeamSize);

    var timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");
    var phone = data.leadPhone ? "'" + data.leadPhone : "";

    var row = [
      timestamp,
      data.teamId || "N/A",
      data.registrationId || "N/A",
      data.teamName || "N/A",
      data.teamSize,
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
        serialNum: assignedNum,
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

/**
 * Calculates the next unique serial number starting strictly from 101.
 * Scans existing rows in the "Registrations" sheet for sequential series (101, 102, 103, ...).
 * Guarantees that every new team receives a strictly increasing, unique number,
 * and ignores legacy/random test artifacts (e.g. 653, 999).
 */
function getLiveNextSerial(sheet) {
  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return { nextNum: 101, usedNums: {} };
  }

  var idRows = sheet.getRange(2, 2, lastRow - 1, 2).getValues();
  var usedNums = {};
  var maxSequentialNum = 100; // Sequence baseline (first team will be 101)

  for (var i = 0; i < idRows.length; i++) {
    var teamIdStr = String(idRows[i][0] || "").trim();
    var regIdStr = String(idRows[i][1] || "").trim();

    // Check Team ID (e.g. TEAM-101)
    var m1 = teamIdStr.match(/^TEAM-(\d+)$/i);
    if (m1) {
      var n1 = parseInt(m1[1], 10);
      // Valid sequential series (101 to 499)
      if (n1 >= 101 && n1 < 500) {
        usedNums[n1] = true;
        if (n1 > maxSequentialNum) maxSequentialNum = n1;
      }
    }

    // Check Registration ID (e.g. AI25-101)
    var m2 = regIdStr.match(/^AI25-(\d+)$/i);
    if (m2) {
      var n2 = parseInt(m2[1], 10);
      if (n2 >= 101 && n2 < 500) {
        usedNums[n2] = true;
        if (n2 > maxSequentialNum) maxSequentialNum = n2;
      }
    }
  }

  // Find next available unique number >= maxSequentialNum + 1 that is not used
  var candidate = maxSequentialNum + 1;
  while (usedNums[candidate]) {
    candidate++;
  }

  return {
    nextNum: candidate,
    usedNums: usedNums
  };
}

function doGet(e) {
  try {
    var ss = getTargetSpreadsheet();
    var sheet = ss ? ss.getSheetByName("Registrations") : null;
    var nextInfo = sheet ? getLiveNextSerial(sheet) : { nextNum: 101 };
    var serial = nextInfo.nextNum;

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "online",
        service: "AITHON 2.0 Registration Webhook",
        account: "ai.veer2k26@gmail.com",
        nextSerialNum: serial,
        nextTeamId: "TEAM-" + serial,
        nextRegistrationId: "AI25-" + serial,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        error: err.toString(),
        nextSerialNum: 101,
        nextTeamId: "TEAM-101",
        nextRegistrationId: "AI25-101"
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
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

// Official WhatsApp Community Group link for Team Leaders
var WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/HRvMvxxB2NUIvw5zMiTsQ9";

/**
 * Dispatch confirmation email using GmailApp with MailApp fallback,
 * featuring a professional branded template with zero emoji corruption,
 * full team details, and the mandatory WhatsApp Community group button.
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
  var teamSize = data.teamSize || "3";

  // Clean ASCII-safe subject line (avoids raw emoji corruption across mail servers)
  var subject = "[CONFIRMED] AITHON 2.0 Registration — " + teamName + " [" + teamId + "]";

  // Plain Text Version (for text-only email clients)
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
    "• Team Size        : " + teamSize + " Members\n" +
    "• Event Date       : Friday, 09 October 2026\n" +
    "• Venue            : Dept. of AI & DS, AVCOE Sangamner, Maharashtra\n\n" +
    "----------------------------------------------------------\n" +
    "ACTION REQUIRED: JOIN OFFICIAL WHATSAPP COMMUNITY\n" +
    "----------------------------------------------------------\n" +
    "It is mandatory for all team leaders to join our official WhatsApp Community. All track problem statements, mentoring schedules, and live briefings will be released exclusively in this group:\n\n" +
    "Join WhatsApp Group: " + WHATSAPP_COMMUNITY_URL + "\n\n" +
    "Please join immediately and ask your team members to stay in touch for official announcements.\n\n" +
    "----------------------------------------------------------\n" +
    "NEXT STEPS\n" +
    "----------------------------------------------------------\n" +
    "1. Review & Screening: Our evaluation committee will verify team credentials.\n" +
    "2. WhatsApp Alerts: Turn on notifications for the problem statement release.\n" +
    "3. Campus Check-in: Report at AVCOE campus on 09 October 2026 with your Team ID.\n\n" +
    "Student Coordinators:\n" +
    "• Vedant Mande   : +91 85919 10018\n" +
    "• Sudhanshu Rahane: +91 77200 92989\n" +
    "• Official Email : ai.veer2k26@gmail.com\n\n" +
    "Best regards,\n" +
    "Organizing Committee — AITHON 2.0\n" +
    "Amrutvahini College of Engineering, Sangamner";

  // Rich, Modern, Bulletproof HTML Email Template
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
    '    <!-- Brand Header -->' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 32px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="display: inline-block; background-color: rgba(37,99,235,0.3); border: 1px solid #38bdf8; color: #93c5fd; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">' +
    '          National Level AI Hackathon' +
    '        </div>' +
    '        <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">AITHON 2.0</h1>' +
    '        <div style="font-size: 12px; color: #cbd5e1; margin-top: 6px; font-weight: 500;">Dept. of Artificial Intelligence & Data Science • AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Main Body -->' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <!-- Confirmation Badge -->' +
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
    '          Congratulations! Your team registration for <strong>AITHON 2.0</strong> has been successfully recorded. Please keep your <strong>Team ID</strong> safe as you will need it for all upcoming rounds.' +
    '        </p>' +
    '        <!-- Registration Details Card -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td style="padding: 18px 20px;">' +
    '              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">' +
    '                Registration Summary' +
    '              </div>' +
    '              <table role="presentation" width="100%" cellspacing="0" cellpadding="5" style="font-size: 13px;">' +
    '                <tr>' +
    '                  <td style="color: #64748b; width: 38%;">Team ID:</td>' +
    '                  <td>' +
    '                    <span style="font-family: monospace; font-weight: 800; color: #ea580c; background-color: #fff7ed; border: 1px solid #fed7aa; padding: 3px 10px; border-radius: 6px; font-size: 13.5px;">' +
    '                      ' + teamId + '' +
    '                    </span>' +
    '                  </td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Registration ID:</td>' +
    '                  <td>' +
    '                    <span style="font-family: monospace; font-weight: 800; color: #062b59; background-color: #eff6ff; border: 1px solid #bfdbfe; padding: 3px 10px; border-radius: 6px; font-size: 13.5px;">' +
    '                      ' + regId + '' +
    '                    </span>' +
    '                  </td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Name:</td>' +
    '                  <td style="font-weight: 700; color: #0f172a;">' + teamName + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Team Size:</td>' +
    '                  <td style="color: #0f172a;">' + teamSize + ' Members</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Event Date:</td>' +
    '                  <td style="color: #0f172a; font-weight: 600;">Friday, 09 October 2026</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Venue:</td>' +
    '                  <td style="color: #0f172a;">AVCOE Sangamner, Maharashtra</td>' +
    '                </tr>' +
    '              </table>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- MANDATORY WHATSAPP COMMUNITY BOX -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; margin-bottom: 26px;">' +
    '          <tr>' +
    '            <td style="padding: 24px 20px; text-align: center;">' +
    '              <div style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 4px 14px; border-radius: 20px; font-size: 10.5px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 10px;">' +
    '                Mandatory For Team Leaders' +
    '              </div>' +
    '              <h3 style="margin: 0 0 8px 0; color: #064e3b; font-size: 18px; font-weight: 800;">' +
    '                Join Official WhatsApp Community' +
    '              </h3>' +
    '              <p style="font-size: 13px; color: #047857; margin: 0 auto 18px auto; max-width: 440px; line-height: 1.55;">' +
    '                All official problem statements, mentoring schedules, submission links, and live briefings will be shared exclusively in this WhatsApp community.' +
    '              </p>' +
    '              <a href="' + WHATSAPP_COMMUNITY_URL + '" target="_blank" style="background-color: #25D366; color: #ffffff; padding: 14px 28px; font-size: 13.5px; font-weight: 800; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 12px rgba(37,211,102,0.35); text-transform: uppercase; letter-spacing: 0.5px;">' +
    '                &#9758; JOIN WHATSAPP COMMUNITY' +
    '              </a>' +
    '              <div style="margin-top: 14px; font-size: 11px; color: #047857;">' +
    '                Direct Link: <a href="' + WHATSAPP_COMMUNITY_URL + '" style="color: #047857; font-weight: 600; text-decoration: underline; word-break: break-all;">' + WHATSAPP_COMMUNITY_URL + '</a>' +
    '              </div>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- Next Steps Roadmap -->' +
    '        <div style="font-size: 12.5px; font-weight: 800; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">' +
    '          What Happens Next:' +
    '        </div>' +
    '        <ol style="font-size: 13px; color: #334155; padding-left: 18px; margin-top: 0; margin-bottom: 22px; line-height: 1.6;">' +
    '          <li style="margin-bottom: 6px;"><strong>Review & Screening:</strong> Our evaluation committee reviews team credentials.</li>' +
    '          <li style="margin-bottom: 6px;"><strong>WhatsApp Alerts:</strong> Keep notifications ON for problem statement releases.</li>' +
    '          <li style="margin-bottom: 6px;"><strong>Offline Hackathon:</strong> Report at AVCOE campus on 09 October 2026.</li>' +
    '        </ol>' +
    '        <!-- Student Coordinators Support Card -->' +
    '        <div style="background-color: #f8fafc; border-left: 3px solid #2563eb; padding: 14px 16px; border-radius: 6px; font-size: 12px; color: #475569; margin-bottom: 22px;">' +
    '          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Student Coordinators & Support:</strong>' +
    '          • Vedant Mande: <a href="tel:+918591910018" style="color: #2563eb; text-decoration: none; font-weight: 600;">+91 85919 10018</a><br>' +
    '          • Sudhanshu Rahane: <a href="tel:+917720092989" style="color: #2563eb; text-decoration: none; font-weight: 600;">+91 77200 92989</a><br>' +
    '          • Official Support Email: <a href="mailto:ai.veer2k26@gmail.com" style="color: #2563eb; text-decoration: none; font-weight: 600;">ai.veer2k26@gmail.com</a>' +
    '        </div>' +
    '        <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">' +
    '          Best regards,<br>' +
    '          <strong style="color: #062b59;">Organizing Committee — AITHON 2.0</strong><br>' +
    '          Department of Artificial Intelligence & Data Science<br>' +
    '          Amrutvahini College of Engineering, Sangamner' +
    '        </p>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Footer -->' +
    '    <tr>' +
    '      <td style="background-color: #f8fafc; padding: 18px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">' +
    '        This is an automated confirmation for AITHON 2.0 registrations. Please do not reply directly to this automated email.' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

  // Attempt GmailApp first
  try {
    GmailApp.sendEmail(recipient, subject, plainText, {
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee"
    });
    Logger.log("Confirmation email sent via GmailApp to: " + recipient);
  } catch (gErr) {
    Logger.log("GmailApp failed, trying MailApp fallback: " + gErr.toString());
    MailApp.sendEmail({
      to: recipient,
      subject: subject,
      body: plainText,
      htmlBody: htmlBody,
      name: "AITHON 2.0 Organizing Committee"
    });
    Logger.log("Confirmation email sent via MailApp to: " + recipient);
  }
}

/**
 * 🧪 Test Email Function:
 * Select "testSendEmail" in Apps Script and click "Run" (▶️) to test sending the email!
 */
function testSendEmail() {
  var dummyData = {
    leadEmail: "ai.veer2k26@gmail.com",
    leadFullName: "Umesh Khairnar",
    teamName: "Neural Nexus",
    teamId: "TEAM-101",
    registrationId: "AI25-101",
    teamSize: "3"
  };
  
  Logger.log("Sending test confirmation email with WhatsApp link to ai.veer2k26@gmail.com...");
  sendConfirmationEmail(dummyData);
  Logger.log("Test email sent! Please check inbox.");
}

/**
 * Direct Test Function:
 * You can select "testAddSampleRow" in the Apps Script toolbar and click "Run" (▶️)
 * to immediately write a test row and verify your sheet without waiting for website submit!
 */
function testAddSampleRow() {
  var sample = {
    postData: {
      contents: JSON.stringify({
        timestamp: Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a"),
        teamId: "TEAM-653",
        registrationId: "AI25-7801",
        teamName: "Neural Nexus",
        teamSize: "2",
        leadFullName: "Umesh Khairnar",
        leadEmail: "ai.veer2k26@gmail.com",
        leadPhone: "+91 9876543210",
        leadCollege: "AVCOE Sangamner",
        leadCourse: "AI & Data Science",
        leadYear: "3rd Year",
        leadCity: "Sangamner",
        member2Name: "Rohan Patil",
        member2Email: "rohan@example.com",
        member2College: "AVCOE Sangamner",
        member3Name: "-",
        member3Email: "-",
        member3College: "-",
        member4Name: "-",
        member4Email: "-",
        member4College: "-",
        github: "https://github.com/neuralnexus",
        linkedin: "https://linkedin.com/in/umesh",
        portfolio: "https://neuralnexus.dev",
        skills: "Python, React / Next.js, PyTorch",
        experience: "1–2 Hackathons Attended",
        referral: "College / Faculty Announcement",
        status: "Pending Review"
      })
    }
  };
  doPost(sample);
  Logger.log("Sample test row successfully written to your Google Sheet!");
}


