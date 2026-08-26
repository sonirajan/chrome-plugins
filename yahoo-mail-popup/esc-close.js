// Runs inside mail.yahoo.com when it's loaded in our popup window.
// Pressing Esc sends a message to the background script, which closes this window.
// (We can't just call window.close() here because Yahoo's own JS may intercept
// Esc first for things like closing a compose box or a modal — this listener
// only fires window-close if Yahoo didn't already handle/stop the event.)
//
// This script runs in ALL frames (see manifest.json's all_frames: true), because
// Yahoo Mail is iframe-heavy and keyboard focus is often inside an iframe our
// script wouldn't otherwise see Esc in.

document.addEventListener(
  "keydown",
  (event) => {
    if (event.key === "Escape" || event.key === "Esc") {
      chrome.runtime.sendMessage({ type: "CLOSE_YAHOO_POPUP" });
    }
  },
  true // capture phase, so we still see it even if Yahoo stops propagation later
);

// Fallback close button: Esc can still fail to reach us in some flows (a
// modal or iframe swallowing the keystroke before our capture listener runs).
// This gives a guaranteed way to close the popup that doesn't depend on
// keyboard events at all. Only added in the top-level frame, not iframes.
if (window.top === window.self) {
  function addCloseButton() {
    if (document.getElementById("__yahoo_popup_close_btn__")) return;

    const btn = document.createElement("button");
    btn.id = "__yahoo_popup_close_btn__";
    btn.textContent = "✕";
    btn.title = "Close Yahoo Mail popup";
    btn.setAttribute("aria-label", "Close Yahoo Mail popup");

    Object.assign(btn.style, {
      position: "fixed",
      top: "8px",
      right: "8px",
      zIndex: "2147483647", // max z-index, sit above Yahoo's own UI
      width: "28px",
      height: "28px",
      borderRadius: "50%",
      border: "none",
      background: "rgba(0, 0, 0, 0.6)",
      color: "#fff",
      fontSize: "14px",
      lineHeight: "28px",
      textAlign: "center",
      cursor: "pointer",
      padding: "0"
    });

    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      chrome.runtime.sendMessage({ type: "CLOSE_YAHOO_POPUP" });
    });

    document.documentElement.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addCloseButton);
  } else {
    addCloseButton();
  }
}
