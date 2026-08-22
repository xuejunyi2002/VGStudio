# VGSTUDIO Website

Static site for VGSTUDIO and its featured game, KAIJU CORP.

Live site: https://xuejunyi2002.github.io/VGStudio/

## Structure

- `index.html` — landing page (loading animation, hero, featured game, footer)
- `game.html` — KAIJU CORP info page
- `about.html` — studio / team page
- `css/style.css` — all styling
- `js/main.js` — preloader, nav, scroll reveals, hero ember background
- `assets/video/` — drop a hero background video here as `hero-bg.mp4` (the hero section already references it and falls back gracefully to the animated ember background if it's missing)
- `assets/img/` — poster/gallery images go here

## Running locally

No build step. Serve the folder with any static server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Things to swap in before launch

- Real Instagram / Discord / Steam URLs (currently placeholders in the nav and footer of every page, and the Steam links in the buttons)
- Hero background video at `assets/video/hero-bg.mp4`
- Concept art images in `game.html` (currently styled placeholder tiles)
- Studio name (currently "VGSTUDIO") if you'd like something else
