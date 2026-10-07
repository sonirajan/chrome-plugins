# LinkedIn Cleaner — Chrome Extension

A Chrome extension that removes distractions from LinkedIn: member profile images, promoted posts, advertisements, and videos.

---

## Features

| Feature | Details |
|---|---|
| **Block profile images** | Replaces all member avatars with a neutral placeholder across feed, messaging, search, notifications, and profile pages |
| **Hide promoted posts** | Removes any feed item containing "Promoted" or "Promoted by" text |
| **Remove ads** | Removes `section.ad-banner-container` advertisement elements anywhere on the page |
| **Block videos** | Stops video playback and hides video players in the feed |
| **Allowlist profiles** | Specific profiles and paths can be excluded from blocking |

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
├── rules.json          # Empty — network rules were removed (see below)
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## How It Works

### 2-layer image blocking

**Layer 1 — CSS (blocker.css)**
Targets known LinkedIn avatar selectors immediately at `document_start`, before JS runs, to prevent flash of real images.

**Layer 2 — JS MutationObserver (content.js)**
LinkedIn is a React SPA. Images are injected dynamically as you scroll or navigate. Newly added DOM nodes are processed immediately (no debounce) to catch cached images before they render. The observer also watches `src`, `data-delayed-url`, `data-ghost-url`, and `data-src` attributes — when LinkedIn's lazy loader sets any of these to a `licdn.com` URL, the image is replaced with a placeholder SVG data URL instantly.

### Promoted post removal

Scans all `<p>` and `<span>` elements for text starting with `"Promoted"`, then hides the nearest `role="listitem"` ancestor (the full feed card). Handles posts injected during infinite scroll.

### Video blocking

CSS hides `.video-js` and `[data-vjs-player]` containers immediately. A `play` event listener (capturing phase) pauses and clears any video that attempts to play, preventing audio bleed-through.

### Advertisement removal

Hides `section.ad-banner-container` elements and removes stray `<footer>` tags injected by ads.

### Allowlist — excluded paths and profiles

Blocking is skipped entirely on:

- `/learning` — LinkedIn Learning (videos must work)
- `/company/` — company pages
- `/feed/update/` — only when navigating there from an allowed profile (image viewer)
- Specific profiles listed in `ALLOWED_PROFILES` in `content.js`

**To add a profile to the allowlist**, open `content.js` and add to `ALLOWED_PROFILES`:

```js
const ALLOWED_PROFILES = [
  '/in/yangshun/',
  '/in/addyosmani/',
  // add more here
];
```

Reload the extension at `chrome://extensions` after saving.

### SPA navigation handling

LinkedIn is a single-page app — the URL changes without a full page reload. The extension polls the URL every 500ms and:

- **Allowed → blocked page**: starts blocking immediately without a reload
- **Blocked → allowed page**: disconnects the observer and reloads so the page renders normally

---

## Permissions

| Permission | Reason |
|---|---|
| `host_permissions: *.linkedin.com, *.licdn.com` | Inject content scripts on LinkedIn domains |

---

## Known Limitations

- Video poster (gray thumbnail) may still be partially visible in some feed layouts
- Company/school logo images are not blocked (intentional — only member photos are targeted)
- LinkedIn occasionally updates its DOM structure and CSS class names, which may require selector updates