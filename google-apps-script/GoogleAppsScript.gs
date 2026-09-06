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

// Official WhatsApp Community Group link for Team Leaders
var WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/HRvMvxxB2NUIvw5zMiTsQ9";

/**
 * Dispatch confirmation email using GmailApp with MailApp fallback,
 * including official WhatsApp Community group link and registration details.
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
  var leadName = data.leadFullName || "Participant";
  var teamSize = data.teamSize || "3";

  var subject = "🎉 Registration Confirmed: " + teamName + " [Team ID: " + teamId + "] — AITHON 2.0";

  // Plain Text Version
  var plainText = 
    "==========================================================\n" +
    "AITHON 2.0 — NATIONAL LEVEL AI HACKATHON\n" +
    "Department of Artificial Intelligence & Data Science\n" +
    "Amrutvahini College of Engineering (AVCOE), Sangamner\n" +
    "==========================================================\n\n" +
    "Dear " + leadName + ",\n\n" +
    "Congratulations! Your team registration for AITHON 2.0 has been successfully recorded.\n\n" +
    "----------------------------------------------------------\n" +
    "REGISTRATION SUMMARY\n" +
    "----------------------------------------------------------\n" +
    "• Team Name        : " + teamName + "\n" +
    "• Team ID          : " + teamId + "\n" +
    "• Registration ID  : " + regId + "\n" +
    "• Team Size        : " + teamSize + " Members\n" +
    "• Event Date       : 09 October 2026\n" +
    "• Venue            : Dept. of AI & DS, AVCOE Sangamner, Maharashtra\n\n" +
    "----------------------------------------------------------\n" +
    "ACTION REQUIRED: JOIN OFFICIAL WHATSAPP COMMUNITY\n" +
    "----------------------------------------------------------\n" +
    "It is mandatory for all team leaders to join our official WhatsApp Community. All crucial updates, problem statement announcements, event schedules, and live briefings will be shared exclusively in this group:\n\n" +
    "👉 Join WhatsApp Group: " + WHATSAPP_COMMUNITY_URL + "\n\n" +
    "Please join immediately and stay connected for upcoming rounds and schedule updates.\n\n" +
    "----------------------------------------------------------\n" +
    "NEXT STEPS\n" +
    "----------------------------------------------------------\n" +
    "1. Review & Verification: Our evaluation committee will review team submissions.\n" +
    "2. Problem Statements: Briefings and resources will be posted in the WhatsApp group.\n" +
    "3. Offline Hackathon: Arrive at AVCOE campus on 09 October 2026.\n\n" +
    "For any urgent queries, contact our student coordinators:\n" +
    "• Vedant Mande: +91 85919 10018\n" +
    "• Sudhanshu Rahane: +91 77200 92989\n" +
    "• Official Email: ai.veer2k26@gmail.com\n\n" +
    "Best regards,\n" +
    "AITHON 2.0 Organizing Committee\n" +
    "Dept. of AI & DS, AVCOE Sangamner";

  // Rich HTML Version with Professional Theme Styling
  var htmlBody = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>' +
    '<body style="margin: 0; padding: 20px; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">' +
    '  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">' +
    '    <!-- Brand Header -->' +
    '    <tr>' +
    '      <td style="background-color: #062b59; padding: 32px 24px; text-align: center; color: #ffffff;">' +
    '        <div style="font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #38bdf8; margin-bottom: 8px;">National Level AI Hackathon</div>' +
    '        <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">AITHON 2.0</h1>' +
    '        <div style="font-size: 13px; color: #cbd5e1; margin-top: 6px;">Dept. of Artificial Intelligence & Data Science | AVCOE Sangamner</div>' +
    '      </td>' +
    '    </tr>' +
    '    <!-- Main Content -->' +
    '    <tr>' +
    '      <td style="padding: 32px 28px;">' +
    '        <p style="font-size: 16px; margin-top: 0; color: #0f172a;">Dear <strong>' + leadName + '</strong>,</p>' +
    '        <p style="font-size: 14px; color: #334155; margin-bottom: 24px;">' +
    '          Congratulations! Your team registration for <strong>AITHON 2.0</strong> has been successfully received and recorded.' +
    '        </p>' +
    '        <!-- Registration Summary Card -->' +
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px;">' +
    '          <tr>' +
    '            <td style="padding: 18px 20px;">' +
    '              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Official Registration Summary</div>' +
    '              <table role="presentation" width="100%" cellspacing="0" cellpadding="4" style="font-size: 13px;">' +
    '                <tr>' +
    '                  <td style="color: #64748b; width: 38%;">Team ID:</td>' +
    '                  <td style="font-weight: 700; color: #ea580c; font-family: monospace; font-size: 14px;">' + teamId + '</td>' +
    '                </tr>' +
    '                <tr>' +
    '                  <td style="color: #64748b;">Registration ID:</td>' +
    '                  <td style="font-weight: 700; color: #062b59; font-family: monospace; font-size: 14px;">' + regId + '</td>' +
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
    '                  <td style="color: #0f172a; font-weight: 600;">09 October 2026</td>' +
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
    '        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 12px; margin-bottom: 28px;">' +
    '          <tr>' +
    '            <td style="padding: 24px; text-align: center;">' +
    '              <div style="display: inline-block; background-color: #25D366; color: #ffffff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 10px;">Mandatory For Team Leaders</div>' +
    '              <h2 style="margin: 0 0 8px 0; color: #064e3b; font-size: 18px; font-weight: 800;">Join Official WhatsApp Community</h2>' +
    '              <p style="font-size: 13px; color: #047857; margin: 0 0 18px 0; line-height: 1.5;">' +
    '                Stay updated with round-the-clock announcements, problem statement drops, timeline changes, and coordinator support.' +
    '              </p>' +
    '              <a href="' + WHATSAPP_COMMUNITY_URL + '" target="_blank" style="background-color: #25D366; color: #ffffff; padding: 14px 28px; font-size: 14px; font-weight: 800; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 2px 8px rgba(37,211,102,0.3); text-transform: uppercase; letter-spacing: 0.5px;">' +
    '                👉 Join WhatsApp Community' +
    '              </a>' +
    '              <div style="margin-top: 14px; font-size: 11px; color: #065f46;">' +
    '                Direct Link: <a href="' + WHATSAPP_COMMUNITY_URL + '" style="color: #047857; text-decoration: underline; word-break: break-all;">' + WHATSAPP_COMMUNITY_URL + '</a>' +
    '              </div>' +
    '            </td>' +
    '          </tr>' +
    '        </table>' +
    '        <!-- Next Steps Roadmap -->' +
    '        <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next:</div>' +
    '        <ol style="font-size: 13px; color: #334155; padding-left: 18px; margin-top: 0; margin-bottom: 24px;">' +
    '          <li style="margin-bottom: 6px;"><strong>Review & Verification:</strong> Our committee reviews team submissions.</li>' +
    '          <li style="margin-bottom: 6px;"><strong>Live Updates:</strong> Keep notifications ON in the WhatsApp Community.</li>' +
    '          <li style="margin-bottom: 6px;"><strong>Hackathon Day:</strong> Arrive at AVCOE campus on 09 October 2026.</li>' +
    '        </ol>' +
    '        <!-- Contact Coordinators -->' +
    '        <div style="background-color: #f8fafc; border-left: 3px solid #2563eb; padding: 14px 16px; border-radius: 4px; font-size: 12px; color: #475569; margin-bottom: 24px;">' +
    '          <strong style="color: #0f172a; display: block; margin-bottom: 4px;">Student Coordinators:</strong>' +
    '          • Vedant Mande: <a href="tel:+918591910018" style="color: #2563eb; text-decoration: none;">+91 85919 10018</a><br>' +
    '          • Sudhanshu Rahane: <a href="tel:+917720092989" style="color: #2563eb; text-decoration: none;">+91 77200 92989</a><br>' +
    '          • Official Support: <a href="mailto:ai.veer2k26@gmail.com" style="color: #2563eb; text-decoration: none;">ai.veer2k26@gmail.com</a>' +
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
    '      <td style="background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">' +
    '        This is an automated confirmation for AITHON 2.0 registrations. Please do not reply directly to this automated email.' +
    '      </td>' +
    '    </tr>' +
    '  </table>' +
    '</body>' +
    '</html>';

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
    leadFullName: "Test Organizers",
    teamName: "Neural Nexus",
    teamId: "TEAM-101",
    registrationId: "AI25-1001",
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
        teamId: "TEAM-533",
        registrationId: "AI25-1453",
        teamName: "CyberKnights",
        teamSize: "3",
        leadFullName: "Aarav Sharma",
        leadEmail: "ai.veer2k26@gmail.com",
        leadPhone: "+91 9876543210",
        leadCollege: "AVCOE Sangamner",
        leadCourse: "AI & Data Science",
        leadYear: "3rd Year",
        leadCity: "Sangamner",
        member2Name: "Rohan Patil",
        member2Email: "rohan@example.com",
        member2College: "AVCOE Sangamner",
        member3Name: "Sneha Deshmukh",
        member3Email: "sneha@example.com",
        member3College: "AVCOE Sangamner",
        member4Name: "-",
        member4Email: "-",
        member4College: "-",
        github: "https://github.com/cyberknights",
        linkedin: "https://linkedin.com/in/aarav",
        portfolio: "https://cyberknights.dev",
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

