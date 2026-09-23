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

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.name || '',
    data.attendance || '',
    data.guests || '',
    data.message || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const [, ...body] = rows; // skip header row

  const wishes = body.map((row) => ({
    timestamp: row[0],
    name: row[1],
    attendance: row[2],
    guests: row[3],
    message: row[4],
  }));

  return ContentService
    .createTextOutput(JSON.stringify(wishes))
    .setMimeType(ContentService.MimeType.JSON);
}
