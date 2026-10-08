# Very Good Studio Inc. Website

Static site for Very Good Studio Inc. and its featured game, KAIJU CORP.

Live site: https://xuejunyi2002.github.io/VGStudio/

## Structure

- `index.html` — landing page (loading animation, topbar, split hero + video banner, featured game, footer)
- `game.html` — KAIJU CORP info page
- `about.html` — studio / team page
- `css/style.css` — all styling
- `js/main.js` — preloader, menu overlay, scroll reveals, hero ember background, video fallbacks
- `assets/img/IMG_9936(1).PNG` — studio logo, shown in the topbar badge and preloader on every page
- `assets/img/DSCF5137.JPG` / `assets/img/DSCF5141.JPG` — studio photos in the staggered collage on the landing page
- `assets/img/Main_Capsule(1).png` — KAIJU CORP capsule art, shown in the Featured Game card on the landing page (not committed yet — the card degrades gracefully, just showing the text, until it's added)
- `assets/video/playtest.MOV` — original gameplay clip (HEVC), kept as the source file but not referenced by any page, since HEVC/.MOV isn't reliably playable outside Safari
- `assets/video/playtest.mp4` / `assets/video/playtest.webm` — H.264 and VP9 transcodes of the clip above, used (in that order, webm first) in the hero video banner (index) and the full-screen menu overlay (all pages)
- `assets/fonts/ClarityCity-Regular.woff2` / `ClarityCity-Bold.woff2` — self-hosted, used for all "small" text site-wide (`--font-body`): body copy, labels, buttons, nav. Not on Google Fonts, so pulled from VMware's open-source npm package (`@cds/city`, SIL OFL-1.1, see `ClarityCity-LICENSE.txt`) and converted from TTF to WOFF2
- `assets/img/` — additional gallery images go here

The topbar's hamburger button opens a full-screen menu overlay (`.menu-overlay`) with the site nav and social links; there's no longer an inline desktop nav — the hamburger is the only navigation, on every breakpoint.

## Running locally

No build step. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Things to swap in before launch

- Real Instagram / Discord URLs (currently placeholders in the menu overlay and footer of every page) — Steam links are already live at https://store.steampowered.com/app/5256090/Kaiju_Corp/
- Concept art images in `game.html` (currently styled placeholder tiles)

If the gameplay clip is ever replaced, regenerate both transcodes from the new source, e.g.:

```
ffmpeg -i playtest.MOV -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 128k playtest.mp4
ffmpeg -i playtest.MOV -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -pix_fmt yuv420p -c:a libopus -b:a 96k playtest.webm
```
