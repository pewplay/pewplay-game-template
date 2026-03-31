# 🎮 PewPlay Game Template

Starter template for creating games on [PewPlay](https://www.pewplay.com). Pure HTML/CSS/JS — no build tools, no dependencies, no frameworks. Just open `index.html` and start coding.

## Quick Start

1. Click **"Use this template"** on GitHub to create your repo
2. Clone it and start editing
3. Open `index.html` in your browser to test
4. When ready, add the topic `web-game` to your repo

That's it — PewPlay's builder will pick it up automatically on the next build.

## Project Structure

```
├── index.html       ← Main page (loaded inside PewPlay's iframe)
├── style.css        ← Styles
├── game.js          ← Game logic
├── seo.json         ← SEO metadata (title, description, keywords)
├── preview.png      ← Card thumbnail (512×512 recommended)
└── screenshot-*.png ← Optional screenshots for rich SEO
```

## Files That Matter

### `seo.json` — How your game appears on PewPlay

```json
{
  "title": "My Game",
  "description": "A fun free browser game.",
  "keywords": ["arcade", "puzzle", "multiplayer"],
  "category": "Arcade",
  "author": "Your Name",
  "image": "preview.png",
  "playMode": "SinglePlayer"
}
```

All fields are optional. If missing, PewPlay generates defaults from the repo name.

| Field         | What it does                                        |
|---------------|-----------------------------------------------------|
| `title`       | Game name in the card, page title, and SEO           |
| `description` | Meta description for search engines                  |
| `keywords`    | Keywords for SEO and structured data                 |
| `category`    | Game category (`Arcade`, `Puzzle`, `Strategy`, etc.) |
| `author`      | Shown in structured data                             |
| `image`       | OG image path (relative to repo root)                |
| `playMode`    | `SinglePlayer` or `MultiPlayer`                      |

### `preview.png` — The card image

This is what users see on the PewPlay homepage grid. Recommendations:
- **512×512** or larger, square aspect ratio
- Keep text minimal — it's displayed small
- Show actual gameplay, not just a logo

### Screenshots (optional)

Add `screenshot-1.png`, `screenshot-2.png`, etc. for richer Google results via JSON-LD.

## The Demo Game

This template includes a working "dodge the blocks" game as a starting point. It demonstrates:

- **Canvas setup** with responsive resizing
- **Game loop** using `requestAnimationFrame`
- **State management** (start → playing → game over)
- **Input handling** for keyboard, mouse, and touch
- **Score + high score** with `localStorage`
- **Collision detection**
- **Overlay system** for menus

Feel free to keep it, modify it, or delete everything and start fresh.

## Development Tips

**Test locally** — just open `index.html` in your browser. No server needed for most games. If you need a local server (for ES modules, fetch, etc.):

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

**Test in an iframe** — PewPlay loads your game inside an iframe. Test this locally:

```html
<iframe src="index.html" width="400" height="600" style="border:none"></iframe>
```

**Keep it lightweight** — no build step, no npm, no frameworks. The game runs on Cloudflare Pages as pure static files.

**Responsive** — games should work on both desktop and mobile. Handle touch input alongside keyboard/mouse.

## Constraints

Since games run on Cloudflare Pages inside PewPlay's iframe:

- ✅ HTML, CSS, JS — anything static
- ✅ Images, audio, fonts — any static assets
- ✅ ES modules (`<script type="module">`)
- ✅ Web APIs (Canvas, WebGL, Web Audio, Gamepad, etc.)
- ✅ CDN libraries (load from cdnjs, unpkg, etc.)
- ❌ No server-side code (no Node, no PHP, no Python)
- ❌ No build step required (keep it deployable as-is)
- ⚠️ `localStorage` works but is scoped to the parent domain

## License

MIT — do whatever you want with it.
