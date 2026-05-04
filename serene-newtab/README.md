# Serene New Tab

A minimal Chrome extension that replaces the new tab page with a full-screen background photo, live clock, date, and a daily focus reminder — inspired by the iOS lock screen aesthetic.

## Features

- Full-screen background image randomly selected from your `imgs/` folder on every new tab
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
├── clock.js        # Clock logic, random image picker, daily reminder text
├── imgs/
│   ├── bg1.jpg     # 13 images included out of the box
│   ├── bg2.jpg
│   └── ...bg13.jpg
└── README.md
```

## Installation

1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the `serene-newtab` folder
5. Open a new tab — done, no setup needed

## Adding More Background Images

13 images (`bg1.jpg` … `bg13.jpg`) are already included. To add more, drop additional images into `imgs/` following the same naming pattern, then update the count in `clock.js`:

```js
const totalImages = 13; // change this to match your image count
```

Recommended size: **2190 × 1460 px** or larger for sharp display on high-DPI screens.

## Changing the Daily Reminder

Open `clock.js` and edit this line:

```js
const TODAY_TEXT = "Pause. Are you working on your #1 priority?";
```

Replace the text with your goal, intention, or reminder for the day. Reload the extension to see the update.

## Customization

| What | Where | How |
|------|-------|-----|
| Number of background images | `clock.js` | Update `totalImages` to match your image count |
| Brightness of image | `newtab.html` | Adjust `filter: brightness(0.82)` (0–1) |
| Clock size | `newtab.html` | Change `font-size` on `#time` |
| Clock weight | `newtab.html` | Change `font-weight` on `#time` (200 = thin) |
| AM/PM size | `newtab.html` | Change `font-size` on `.ampm` |
| Daily reminder text | `clock.js` | Edit the `TODAY_TEXT` variable |
| Daily reminder style | `newtab.html` | Edit CSS on `#today-text` |