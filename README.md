# Very Good Studio Inc. Website

Static site for Very Good Studio Inc. and its featured game, KAIJU CORP.

Live site: https://xuejunyi2002.github.io/VGStudio/

## Structure

- `index.html` — landing page (loading animation, topbar, split hero + video banner, featured game, footer)
- `game.html` — KAIJU CORP info page
- `about.html` — studio / team page
- `css/style.css` — all styling
- `js/main.js` — preloader, menu overlay, scroll reveals, hero ember background, video fallbacks
- `assets/img/IMG_9936(1).PNG` — studio logo, shown in the topbar badge on every page
- `assets/video/playtest.MOV` — gameplay video, used in the hero video banner (index) and the full-screen menu overlay (all pages). `.MOV` isn't reliably playable in Chrome/Firefox — export an `assets/video/playtest.mp4` alongside it (the markup already has an `.mp4` fallback `<source>`) for it to actually play outside Safari.
- `assets/img/` — additional gallery images go here

The topbar's hamburger button opens a full-screen menu overlay (`.menu-overlay`) with the site nav and social links; there's no longer an inline desktop nav — the hamburger is the only navigation, on every breakpoint.

## Running locally

No build step. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Things to swap in before launch

- Real Instagram / Discord / Steam URLs (currently placeholders in the menu overlay and footer of every page, and the Steam links in the buttons)
- `assets/img/IMG_9936(1).PNG` and `assets/video/playtest.MOV` (+ an `.mp4` version of the video, see above) — neither file is committed yet, so the logo badge and video banners are empty until they're added
- Concept art images in `game.html` (currently styled placeholder tiles)
