# Metronome Web App

## Project Overview
A browser-based metronome PWA (Progressive Web App) hosted on GitHub Pages. No backend. Pure frontend.

## Tech Stack
- **TypeScript** with **Bun** as runtime/package manager
- **Vite** for bundling (use `bun create vite` with vanilla-ts template)
- Static site — deployable to GitHub Pages from `dist/`

## Core Features

### Metronome Engine
- Use the **Web Audio API** (`AudioContext`) for precise timing
- Use the **lookahead scheduler pattern**: a `setInterval` on the main thread that schedules audio events ahead of time on the audio thread. Do NOT rely on `setInterval` alone for tick timing — it drifts.
- BPM range: **20–400 BPM**
- Support **time signatures**: 4/4, 3/4, 6/8, etc.
- Accent the first beat of each measure (use a different sound or pitch)
- Tap tempo: user taps a button repeatedly to set BPM from their tapping rhythm

### Sound
- Load custom click sounds from `.wav` or `.mp3` files in an `assets/sounds/` directory
- Use `AudioBuffer` (decode with `AudioContext.decodeAudioData`) — not `<audio>` elements
- Include at least 2-3 built-in click sound options the user can choose from (e.g., wood block, hi-hat, classic click)
- Accent beat should use a distinct sound variant

### UI/UX
- Clean, minimal, mobile-friendly design
- Large BPM display, easy +/- controls and a slider
- Start/Stop button — prominent and obvious
- Visual beat indicator (flash or pulse on each beat, highlight current beat in the measure)
- Dark theme preferred
- Responsive — works on phone and desktop
- Ko-fi donation link/button in the footer or a small corner — non-intrusive

### PWA Support
- Add `manifest.json` with app name, icons, theme color, `"display": "standalone"`
- Add a **service worker** that caches all assets for offline use
- App must work fully offline once installed

## Project Structure
```
├── index.html
├── src/
│   ├── main.ts          # Entry point
│   ├── metronome.ts     # Audio engine (scheduling, Web Audio API)
│   ├── ui.ts            # DOM manipulation, controls, visual feedback
│   └── styles.css       # All styles
├── public/
│   ├── manifest.json
│   ├── sw.js            # Service worker
│   ├── icons/           # PWA icons (192x192, 512x512)
│   └── sounds/          # Click sound assets (.wav/.mp3)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── CLAUDE.md
```

## Build & Dev Commands
```bash
bun install            # Install dependencies
bun run dev            # Local dev server
bun run build          # Production build to dist/
bun run preview        # Preview production build locally
```

## GitHub Pages Deployment
- Build output goes to `dist/`
- Configure Vite `base` option to `"/<repo-name>/"` for GitHub Pages
- Deploy `dist/` folder via GitHub Pages (Settings → Pages → GitHub Actions or manually)

## Guidelines
- No backend, no server-side code, no databases
- Keep dependencies minimal — prefer vanilla Web APIs
- Prioritize audio timing accuracy above all else
- All sounds must be bundled as static assets, not fetched from external URLs
- Test on mobile browsers — audio autoplay policies require user gesture to start AudioContext
