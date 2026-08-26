const YAHOO_MAIL_URL = "https://mail.yahoo.com";

let yahooWindowId = null;

// Track window closes so we know when to open a fresh one vs. focus the existing one
chrome.windows.onRemoved.addListener((closedWindowId) => {
  if (closedWindowId === yahooWindowId) {
    yahooWindowId = null;
  }
});

async function openOrFocusYahooPopup(triggerWindow) {
  // If a popup is already open, just focus it instead of spawning a duplicate
  if (yahooWindowId !== null) {
    try {
      const existing = await chrome.windows.get(yahooWindowId);
      if (existing) {
        await chrome.windows.update(yahooWindowId, { focused: true });
        return;
      }
    } catch (e) {
      // Window no longer exists; fall through and create a new one
      yahooWindowId = null;
    }
  }

  // Default to matching the size/position of the Chrome window the icon was clicked from
  let width = triggerWindow?.width;
  let height = triggerWindow?.height;
  let left = triggerWindow?.left;
  let top = triggerWindow?.top;

  // Fallback if for some reason we don't have the triggering window's bounds
  if (!width || !height) {
    const displays = await chrome.system.display.getInfo().catch(() => null);
    width = 1000;
    height = 750;
    if (displays && displays.length > 0) {
      const { width: screenWidth, height: screenHeight } = displays[0].workArea;
      left = Math.round((screenWidth - width) / 2);
      top = Math.round((screenHeight - height) / 2);
    }
  }

  const newWindow = await chrome.windows.create({
    url: YAHOO_MAIL_URL,
    type: "popup",
    width,
    height,
    left,
    top,
    focused: true
  });

  yahooWindowId = newWindow.id;
}

chrome.action.onClicked.addListener((tab) => {
  // tab.windowId tells us which Chrome window the user was in when they clicked the icon
  chrome.windows.get(tab.windowId).then(openOrFocusYahooPopup).catch(() => openOrFocusYahooPopup(null));
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message?.type !== "CLOSE_YAHOO_POPUP" || !sender.tab) return;

  const senderWindowId = sender.tab.windowId;

  // Re-derive the truth from the actual window at close-time, instead of
  // trusting the in-memory yahooWindowId. yahooWindowId can drift out of
  // sync in edge cases (e.g. the service worker was restarted and lost its
  // in-memory state, or the popup was reloaded/renavigated in a way that
  // changed which window Chrome considers "current"). If we only trusted
  // yahooWindowId, a mismatch would silently no-op both Esc AND the fallback
  // close button, since they both funnel through this same check.
  chrome.windows.get(senderWindowId).then((win) => {
    if (win.type !== "popup") {
      // Definitely not our popup (e.g. Yahoo Mail open in a normal tab in
      // the main browsing window) — never close this.
      console.log("[yahoo-mail-popup] Ignoring close request: window is not a popup", win);
      return;
    }

    // It's a popup window containing mail.yahoo.com — safe to close, even if
    // it doesn't match our stored yahooWindowId (that just means our tracking
    // drifted; the window itself is still unambiguously our popup).
    chrome.windows.remove(senderWindowId);
  }).catch((err) => {
    console.log("[yahoo-mail-popup] Could not look up sender window, not closing anything", err);
  });
});
