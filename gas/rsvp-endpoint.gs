// Google Apps Script Web App — RSVP + Guestbook endpoint for the Adam & Elsa wedding site.
//
// SETUP (one-time, from your own Google account):
// 1. Create a new Google Sheet. Add a header row in "Sheet1": Timestamp | Name | Attendance | Guests | Message
// 2. In the Sheet, go to Extensions > Apps Script. Delete any starter code and paste this whole file.
// 3. Click Deploy > New deployment > select type "Web app".
//    - Execute as: Me
//    - Who has access: Anyone
// 4. Copy the deployment URL (ends in /exec) and paste it into RSVP_ENDPOINT_URL in script.js.
// 5. Re-deploy (Deploy > Manage deployments > edit > new version) any time you change this file.

const SHEET_NAME = 'Sheet1';

// Stop guest input like "=HYPERLINK(...)" from being run as a Sheet formula.
function safeCell(value) {
  const s = String(value == null ? '' : value);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    safeCell(data.name),
    safeCell(data.attendance),
    safeCell(data.guests),
    safeCell(data.message),
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const [, ...body] = rows; // skip header row

  // Public endpoint: only return what the guestbook shows — never attendance or guest counts.
  const wishes = body
    .filter((row) => row[4])
    .map((row) => ({
      name: row[1],
      message: row[4],
    }));

  return ContentService
    .createTextOutput(JSON.stringify(wishes))
    .setMimeType(ContentService.MimeType.JSON);
}
