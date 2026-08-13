// Runs inside mail.yahoo.com when it's loaded in our popup window.
// Pressing Esc sends a message to the background script, which closes this window.
// (We can't just call window.close() here because Yahoo's own JS may intercept
// Esc first for things like closing a compose box or a modal — this listener
// only fires window-close if Yahoo didn't already handle/stop the event.)

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      chrome.runtime.sendMessage({ type: "CLOSE_YAHOO_POPUP" });
    }
  },
  true // capture phase, so we still see it even if Yahoo stops propagation later
);
