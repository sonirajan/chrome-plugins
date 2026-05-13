# Serene New Tab

A minimal Chrome extension that replaces the new tab page with a full-screen background photo, live clock, date, a daily focus reminder, and a daily #1 task input — inspired by the iOS lock screen aesthetic.

## Features

- Full-screen background image — random Unsplash Hawaiian photos or your own local images
- Automatic fallback to local images if Unsplash API is unavailable
- Local images cycle in shuffled order — all shown before any repeats
- Live clock in 12-hour format with AM/PM indicator
- Weekday and date below the clock
- Motivational quotes cycle in shuffled order — all shown before any repeats
- Daily #1 task — enter, persist across tabs, click to edit, × to clear
- SF Pro / system font for a clean, native feel
- Subtle brightness filter so text stays legible over any photo

## File Structure

```
serene-newtab/
├── manifest.json        # Chrome extension config (Manifest V3)
├── newtab.html          # New tab page + all CSS
├── clock.js             # Clock logic and image loading
├── quotes.js            # Motivational quotes — edit to add your own
├── config.js            # Extension config — works out of the box with local images
├── config.example.js    # Full config template with all options
├── imgs/
│   ├── bg1.jpg          # Local background images
│   └── ...
├── icons/
│   └── ...              # Extension icons
└── README.md
```

## Installation

1. Clone or download this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the `serene-newtab` folder
5. Open a new tab — works immediately with local images

## Unsplash API Setup

[Unsplash](https://unsplash.com) is a free platform offering high-resolution photos contributed by photographers worldwide. This extension uses their API to fetch a fresh random photo on every new tab based on `QUERY` set in config.js file.

1. Sign up at https://unsplash.com/developers
2. Create a new app to get a free access key (50 requests/hour on free tier)
3. Copy `config.example.js` to `config.js`
4. Add your key:

```js
const CONFIG = {
  ACCESS_KEY: 'your_unsplash_access_key_here',
  QUERY: 'hawaii forest beach tropical', // search terms for Unsplash photos
  UNSPLASH_PROBABILITY: 0.5, // 0 = always local, 1 = always Unsplash
  USE_UNSPLASH: true, // set it to `false` to use local image or `true` to use online unsplash image
};
```

Update `QUERY` to change the type of photos shown. Use spaces between words for best results (e.g. `'hawaii beach'`, `'tropical waterfall'`, `'maui sunset'`).

If the Unsplash API is unavailable (rate limit, network error, etc.), the extension automatically falls back to local images.

## Using Local Images Only

The extension uses local images by default. If you previously set up Unsplash, update `config.js` to:

```js
const CONFIG = {
    USE_UNSPLASH: false
};
```

Background images are included in the `imgs/` folder, named `bg1.jpg`, `bg2.jpg`, etc. To add more, drop images in following the same naming pattern and update one line in `clock.js`:

```js
const TOTAL_LOCAL_IMAGES = 23; // set this to however many bg images you have
```

Images cycle in shuffled order — all are shown before any repeats. The sequence resets automatically after every full cycle.

Recommended size: **3024 × 1964 px** or larger for sharp display on Retina and high-DPI screens.

## Changing Motivational Quotes

Open `quotes.js` to add, edit, or remove quotes. A new quote shows on every new tab, cycling through all before repeating.

Reload the extension after any changes.

## Customization

| What | Where | How |
|------|-------|-----|
| Image source | `config.js` | Toggle `USE_UNSPLASH` true/false |
| Unsplash API key | `config.js` | Set `ACCESS_KEY` |
| Unsplash search query | `config.js` | Update `QUERY` |
| Online vs local image mix | `config.js` | Adjust `UNSPLASH_PROBABILITY` (0–1) |
| Number of local images | `clock.js` | Update `TOTAL_LOCAL_IMAGES` |
| Brightness of image | `newtab.html` | Adjust `filter: brightness(0.82)` (0–1) |
| Clock size | `newtab.html` | Change `font-size` on `#time` |
| Clock weight | `newtab.html` | Change `font-weight` on `#time` |
| AM/PM size | `newtab.html` | Change `font-size` on `.ampm` |
| Motivational quotes | `quotes.js` | Add/edit quotes in the `QUOTES` array |
| Quote style | `newtab.html` | Edit CSS on `#today-text` |
| Task text style | `newtab.html` | Edit CSS on `#task-display-text` |
| Task placeholder text | `newtab.html` | Edit `#task-placeholder` text |