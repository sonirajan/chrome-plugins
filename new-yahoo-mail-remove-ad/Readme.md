# Yahoo Mail: Remove Advertisement — Chrome Extension

Removes the ad section in new Yahoo Mail and extends the email area to fill the empty space.

---

## Setup

1. Download or clone this repository to your local machine
2. Open Chrome and go to `chrome://extensions`
3. Toggle **Developer mode** on (top-right corner)
4. Click **Load unpacked**
5. Select the project folder containing `manifest.json` and `content.js`
6. Open [Yahoo Mail](https://mail.yahoo.com) — the extension activates automatically

---

## What It Does

| Fix | Details |
|-----|---------|
| **Expands email area** | Removes right-side ad column and fills the empty space |
| **Bolder unread fonts** | Increases font weight for unread message subjects in dark theme |
| **Right spacing** | Adds 15px right margin to the main email content area |
| **Hides ad section** | Removes the ad `<section>` element from the DOM |

---

## Refreshing After Code Changes

1. Edit `content.js` or `manifest.json`
2. Go to `chrome://extensions`
3. Find **Yahoo Mail: Remove Advertisement**
4. Click the **refresh icon** (↺) on the extension card
5. Reload Yahoo Mail tab — changes apply immediately

---

## Troubleshooting

**Extension not working after Yahoo update**

Yahoo's hashed CSS class names (e.g. `fo_Z1Gyd3M`) change on deploys. If the ad section reappears:

1. Open Yahoo Mail → right-click the ad area → **Inspect**
2. Find the updated selector or `data-test-id`
3. Update the selector in `content.js`
4. Refresh the extension (see above)

**Layout not expanding**

The grid fix targets `#mail-app-component-container`. If Yahoo renames this ID:
1. Inspect the main app wrapper div
2. Update `document.getElementById('mail-app-component-container')` in `content.js` with the new ID

---

## Project Structure

```
yahoo-mail-ad-fix/
  manifest.json   # Extension config and metadata
  content.js      # All layout fixes and style injections
  README.md       # This file
```