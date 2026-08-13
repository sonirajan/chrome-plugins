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

  // Only ever close the window we ourselves created and are tracking.
  // Without this, pressing Esc on mail.yahoo.com in ANY window (including your
  // main browsing window, if you had Yahoo Mail open there too) would close
  // that window entirely.
  if (senderWindowId !== yahooWindowId) {
    return;
  }

  chrome.windows.remove(senderWindowId);
});
