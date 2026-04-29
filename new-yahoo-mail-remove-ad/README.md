# Yahoo Mail: Remove Advertisement — Chrome Extension

Removes ads and cleans up the UI in new Yahoo Mail UI.

---

## Setup

1. Open Chrome and go to `chrome://extensions`
2. Toggle **Developer mode** on (top-right corner)
3. Click **Load unpacked**
4. Select this folder
5. Open [Yahoo Mail](https://mail.yahoo.com) — the extension activates automatically

---

## What It Does

| Fix | Details |
|-----|---------|
| **Removes right-side ad column** | Hides `novation-right-rail` and expands email area to fill the space |
| **Removes bottom ad** | Hides leaderboard ad that appears after deleting spam |
| **Removes inline ad in mail list** | Hides Taboola ad injected inside the virtual mail list without breaking Yahoo's virtualizer |
| **Removes upgrade prompt** | Hides the top bar button that promotes Yahoo Premium |
| **Redirects on load** | Redirects `mail.yahoo.com` to the search/inbox view on first load per session |
| **Fixes Yahoo logo link** | Clicking the Yahoo logo redirects to a combined view of both mailboxes. The `accountIds` in the URL are private — update them in `content.js` with your own mailbox account IDs |
| **Bolder unread messages** | Increases font weight and size for unread message rows |
| **Right spacing** | Adds 15px right margin to the main email content area |
| **Hidden scrollbars** | Hides scrollbar on left panel (both icon-only and icon+name views) while keeping scroll functionality |

---

## Refreshing After Code Changes

1. Edit `content.js` or `manifest.json`
2. Go to `chrome://extensions`
3. Find **Yahoo Mail: Remove Advertisement**
4. Click the **refresh icon** (↺) on the extension card
5. Reload Yahoo Mail tab — changes apply immediately

---

## Troubleshooting

**A fix stopped working after a Yahoo update**

All selectors use stable `data-test-id` attributes or semantic HTML — they should survive most Yahoo deploys. If something breaks:

1. Open Yahoo Mail → right-click the element → **Inspect**
2. Find the updated `data-test-id`
3. Update the selector in `content.js`
4. Refresh the extension (see above)

**Layout not expanding**

The grid fix targets `#mail-app-component-container`. If Yahoo renames this:
1. Inspect the main app wrapper div
2. Update `document.getElementById('mail-app-component-container')` in `content.js`

**Crash when scrolling mail list**

The inline ad removal hides the ad content but keeps the `li` intact so Yahoo's virtual list renderer stays stable. If Yahoo changes their ad network from Taboola, update the `href*="taboola.com"` selector in `removeAdLi()`.

---

## Project Structure

```
yahoo-mail-ad-fix/
  manifest.json   # Extension config and metadata
  content.js      # All layout fixes and style injections
  README.md       # This file
```