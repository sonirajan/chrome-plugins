# LinkedIn Cleaner — Chrome Extension

A Chrome extension that removes distractions from LinkedIn: member profile images, promoted posts, advertisements, and videos.

---

## Features

| Feature | Details |
|---|---|
| **Block profile images** | Replaces all member avatars with a neutral placeholder across feed, messaging, search, notifications, and profile pages |
| **Hide promoted posts** | Removes any feed item containing "Promoted" or "Promoted by" text |
| **Remove ads** | Removes `<iframe>` advertisement elements anywhere on the page |
| **Block videos** | Stops video playback and hides video players in the feed |


---

## Installation

1. Download and unzip the extension folder
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the `linkedin-image-blocker-v2` folder
6. Open LinkedIn — the extension is active immediately


---

## File Structure

```
linkedin-image-blocker-v2/
├── manifest.json       # Chrome extension config (Manifest V3)
├── content.js          # DOM manipulation, observers, image/video/ad blocking
├── blocker.css         # CSS injected into LinkedIn pages
├── rules.json          # Declarative network rules blocking licdn.com image CDN
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## How It Works

### 3-layer image blocking

**Layer 1 — Network (rules.json)**
Blocks image requests to `media.licdn.com` and `dms.licdn.com` at the network level before they download.

**Layer 2 — CSS (blocker.css)**
Targets known LinkedIn avatar selectors immediately at `document_start`, before JS runs, to prevent flash of real images.

**Layer 3 — JS MutationObserver (content.js)**
LinkedIn is a React SPA. Images are injected dynamically as you scroll or navigate. The observer watches the entire DOM tree and replaces any `licdn.com` src with a placeholder SVG data URL. It also intercepts LinkedIn's JS attempting to re-set the src back to the CDN via `Object.defineProperty`.

### Promoted post removal

Scans all `<p>` and `<span>` elements for text starting with `"Promoted"`, then removes the nearest `role="listitem"` ancestor (the full feed card). A second observer handles posts injected during infinite scroll.

### Video blocking

CSS hides `.video-js` and `[data-vjs-player]` containers immediately. A `play` event listener (capturing phase) pauses and clears any video that attempts to play, preventing audio bleed-through.

### Advertisement removal

Removes any `<iframe title="advertisement">` element found anywhere in the page, including those injected dynamically.

---

## Permissions

| Permission | Reason |
|---|---|
| `declarativeNetRequest` | Block CDN image requests at the network level |
| `host_permissions: *.linkedin.com, *.licdn.com` | Inject content scripts and block requests on LinkedIn domains |

---

## Known Limitations

- Video poster (gray thumbnail) may still be partially visible in some feed layouts
- Company/school logo images are not blocked (intentional — only member photos are targeted)
- Toggle requires a tab reload to take full effect
- LinkedIn occasionally updates its DOM structure and CSS class names, which may require selector updates