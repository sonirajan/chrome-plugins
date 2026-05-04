# Serene New Tab

A minimal Chrome extension that replaces the new tab page with a full-screen background photo, live clock, and date — inspired by the iOS lock screen aesthetic.

## Features

- Full-screen background image from your own photo
- Live clock (HH:MM, 24-hour format)
- Weekday and date below the clock
- SF Pro / system font for a clean, native feel
- Subtle brightness filter so text stays legible over any photo

## File Structure

```
serene-newtab/
├── manifest.json   # Chrome extension config (Manifest V3)
├── newtab.html     # New tab page
├── clock.js        # Clock logic (external JS required by CSP)
├── imgs/
│   └── bg.jpg      # Your background image (add this yourself)
└── README.md
```

## Installation

1. Download and unzip `serene-newtab.zip`
2. Add your background image to the `imgs/` folder (see below)
3. Go to `chrome://extensions`
4. Enable **Developer mode** (top-right toggle)
5. Click **Load unpacked** and select the `serene-newtab` folder
6. Open a new tab

## Adding Your Background Image

Drop any image into the `imgs/` folder. Recommended size: **2190 × 1460 px** or larger for sharp display on high-DPI screens.

The default filename expected is `bg.jpg`. If you use a different name or format, update this line in `newtab.html`:

```css
background-image: url('imgs/bg.jpg');
```

Change `bg.jpg` to match your filename, e.g. `mountain.png`, `wallpaper.webp`.

After changing any file, go to `chrome://extensions` and click the **refresh icon** on the extension card, then open a new tab.

## Customization

| What | Where | How |
|------|-------|-----|
| Background image | `newtab.html` | Change the `url('imgs/bg.jpg')` path |
| Brightness of image | `newtab.html` | Adjust `filter: brightness(0.82)` (0–1) |
| Clock size | `newtab.html` | Change `font-size` on `#time` |
| Clock weight | `newtab.html` | Change `font-weight` on `#time` (200 = thin) |
| 12-hour format | `clock.js` | Use `now.getHours() % 12 \|\| 12` |

## Switching to 12-Hour Format

In `clock.js`, replace the `tick()` function body with:

```js
function tick() {
  const now = new Date();
  let h = now.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  timeEl.textContent = h + ':' + pad(now.getMinutes()) + ' ' + ampm;
  dateEl.textContent = DAYS[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate();
}
```