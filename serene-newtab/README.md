# Serene New Tab

A minimal Chrome extension that replaces the new tab page with a full-screen background photo, live clock, date, and a daily focus reminder — inspired by the iOS lock screen aesthetic.

## Features

- Full-screen background image from your own photo
- Live clock in 12-hour format with small AM/PM indicator
- Weekday and date below the clock
- Daily goal/reminder text below the date — edit anytime in `clock.js`
- SF Pro / system font for a clean, native feel
- Subtle brightness filter so text stays legible over any photo

## File Structure

```
serene-newtab/
├── manifest.json   # Chrome extension config (Manifest V3)
├── newtab.html     # New tab page + all CSS
├── clock.js        # Clock logic + daily reminder text
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

## Changing the Daily Reminder

Open `clock.js` and edit the first line:

```js
const TODAY_TEXT = "Pause. Are you working on your #1 priority?";
```

Replace the text with your goal, intention, or reminder for the day. Reload the extension to see the update.

## Customization

| What | Where | How |
|------|-------|-----|
| Background image | `newtab.html` | Change the `url('imgs/bg.jpg')` path |
| Brightness of image | `newtab.html` | Adjust `filter: brightness(0.82)` (0–1) |
| Clock size | `newtab.html` | Change `font-size` on `#time` |
| Clock weight | `newtab.html` | Change `font-weight` on `#time` (200 = thin) |
| AM/PM size | `newtab.html` | Change `font-size` on `.ampm` |
| Daily reminder text | `clock.js` | Edit the `TODAY_TEXT` variable |
| Daily reminder style | `newtab.html` | Edit CSS on `#today-text` |