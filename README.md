# Metronium

A browser-based metronome PWA with precise audio timing using the Web Audio API.

## Features

- Accurate click scheduling via lookahead scheduler pattern
- BPM range: 20–400
- Configurable beats per bar (1–12)
- Beat subdivisions (dynamically capped at ~800 clicks/min)
- Volume control
- Visual beat indicators
- Dark theme, mobile-friendly

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
bun run preview
```

## License

MIT
