# Setting up Google Sheets as your email list
## Takes about 5 minutes. No billing, no OAuth.

---

## Step 1 — Create your spreadsheet

1. Go to https://sheets.google.com
2. Create a new spreadsheet
3. Name it: **FlipFinder Email List**
4. Add these headers in Row 1:
   ```
   A1: First Name
   B1: Email
   C1: Source
   D1: Signup Date
   E1: Signup Time
   ```
5. Bold row 1 and freeze it (View → Freeze → 1 row)

---

## Step 2 — Create the Apps Script webhook

This is a tiny script that receives data from your backend and appends it as a new row.

1. In your spreadsheet, click **Extensions → Apps Script**
2. Delete any existing code and paste this exactly:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.firstName  || '',
      data.email      || '',
      data.source     || 'app_signup',
      data.signupDate || '',
      data.signupTime || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (floppy disk icon). Name it "FlipFinder Sheet Hook".

---

## Step 3 — Deploy as a Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙ next to "Select type" → choose **Web app**
3. Fill in:
   - Description: `FlipFinder email capture`
   - Execute as: **Me**
   - Who has access: **Anyone** ← important, otherwise your backend can't POST to it
4. Click **Deploy**
5. Copy the **Web app URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
   ```

---

## Step 4 — Add the URL to your backend

Open `backend/.env` and set:
```
GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxxxxxxxxxxxxxxxx/exec
```

Then redeploy your backend on Railway/Render (or restart locally).

---

## Step 5 — Test it

Run this in your terminal to test the whole chain:
```bash
curl -X POST https://YOUR_BACKEND_URL/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","firstName":"Test","source":"curl_test"}'
```

You should see a new row appear in your spreadsheet within seconds.

---

## What you'll see in the sheet

| First Name | Email              | Source       | Signup Date | Signup Time            |
|------------|--------------------|--------------|-------------|------------------------|
| Sarah      | sarah@example.com  | app_signup   | 2025-03-22  | Sat, 22 Mar 2025 ...   |
| John       | john@example.com   | app_launch_modal | 2025-03-22 | ...                |

---

## Exporting to Mailchimp / ConvertKit later

When you're ready to send email campaigns:
1. In Google Sheets: **File → Download → CSV**
2. In Mailchimp: **Audience → Import contacts → Upload CSV**
3. Map columns: Email = Email, First Name = FNAME

Or you can swap the Apps Script with a direct Mailchimp API call at any time —
just ask and I'll update the backend for you.

---

## Tip: get a notification for every new signup

In Google Sheets: **Tools → Notification rules → Any changes → Email me immediately**

You'll get a real-time email every time someone signs up through FlipFinder.
