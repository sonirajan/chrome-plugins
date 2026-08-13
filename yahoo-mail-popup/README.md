# Yahoo Mail Popup

A Chrome extension that opens Yahoo Mail in a small, dedicated popup window
instead of a new tab — one click to open, Esc or the close button to dismiss.

## Why

Opening Yahoo Mail in a regular tab clutters your tab bar and pulls you into
your main browsing window. This extension gives you a lightweight, separate
window instead — closer to a quick-glance inbox than a full browsing session.

## What it does

- Click the toolbar icon → Yahoo Mail opens in a `type: "popup"` Chrome
  window (no address bar, no tab strip, no bookmarks bar).
- The popup is sized and positioned to match whichever Chrome window you
  clicked the icon from.
- Click the icon again while the popup is open → it just focuses the
  existing popup instead of opening a duplicate.
- Press **Esc** anywhere inside the popup → the popup window closes.
- The native window close button (✕) also closes it, same as any window.

## Known limitation: native title bar

Chrome's `type: "popup"` window always keeps the OS-native title bar
(minimize / maximize / close on Windows & Linux, or the traffic-light
buttons on macOS). There is no extension API to remove or customize this —
it's drawn by the browser shell, not by web content. What you get instead is
everything *below* the title bar stripped out: no address bar, no tabs, no
bookmarks bar.

A fully chrome-less window is technically possible only by loading Yahoo
Mail inside an iframe in an extension page, but Yahoo blocks iframe
embedding via `X-Frame-Options`/CSP. Bypassing that requires stripping
response headers, which is unreliable and likely against Yahoo's terms of
service — so this extension intentionally does not attempt it.

## Files

| File | Purpose |
|---|---|
| `manifest.json` | Extension config (Manifest V3). Declares the background service worker, the content script, permissions, and icons. |
| `background.js` | Service worker. Handles the toolbar icon click, creates/focuses the popup window, and handles the Esc-close message. |
| `esc-close.js` | Content script injected into `mail.yahoo.com`. Listens for the Esc key and messages the background script to close the popup. |
| `icon16.png` / `icon48.png` / `icon128.png` | Toolbar/extension icons. |

## How it works

### Opening the popup (`background.js`)

- `chrome.action.onClicked` fires when the toolbar icon is clicked, giving
  us the `tab` (and therefore `windowId`) the click came from.
- If a popup is already open and tracked (`yahooWindowId`), the extension
  just calls `chrome.windows.update(..., { focused: true })` to bring it
  forward — it never opens a second popup.
- Otherwise, it reads the triggering window's `width`/`height`/`left`/`top`
  and passes those into `chrome.windows.create({ type: "popup", ... })` so
  the popup matches your current window's size and position. If that lookup
  fails for any reason, it falls back to a centered 1000×750 window using
  `chrome.system.display`.
- `chrome.windows.onRemoved` clears `yahooWindowId` back to `null` whenever
  the popup is closed (by Esc, the close button, or otherwise), so the next
  icon click knows to create a fresh window rather than trying to focus a
  window that no longer exists.

### Closing on Esc (`esc-close.js` + `background.js`)

- `esc-close.js` is a content script that runs inside `mail.yahoo.com` and
  listens for the `Escape` key in the capture phase (so it still sees the
  key even if Yahoo's own JS also tries to handle Esc for something like
  closing a compose box).
- On Esc, it sends a `{ type: "CLOSE_YAHOO_POPUP" }` message to the
  background script via `chrome.runtime.sendMessage`.
- **Important safety check:** because this content script matches
  `mail.yahoo.com` everywhere — including a normal browsing tab, not just
  the popup — the background script only closes the window if
  `sender.tab.windowId` matches the `yahooWindowId` it created and is
  tracking. This prevents Esc from closing your main browsing window if you
  happen to also have Yahoo Mail open in a regular tab there.

## Install

1. Unzip the extension folder if you downloaded it as a `.zip`.
2. Go to `chrome://extensions`.
3. Enable **Developer mode** (toggle, top right).
4. Click **Load unpacked** and select the `yahoo-mail-popup` folder.
5. Pin the extension icon to your toolbar if you want quick access.

## Updating after a code change

Go to `chrome://extensions`, find the extension's card, and click the
reload icon. No need to re-run "Load unpacked" unless you moved the folder.

## Permissions used

| Permission | Why |
|---|---|
| `windows` | Create, focus, and close the popup window. |
| `system.display` | Get screen dimensions for the fallback centered window size. |
| `storage` | Reserved for future use (not currently used for anything). |

## Possible future improvements

- Remember the popup's last manually-resized dimensions instead of always
  matching the trigger window.
- Custom short window title instead of Yahoo's default page title.
- Keyboard shortcut (`chrome.commands`) to open/focus the popup without
  clicking the toolbar icon.