# WATVolume

Real-time crowdsourced study spot busyness for University of Waterloo students.

## Features

- **Live occupancy** — See how busy each study spot is, updated every 10 seconds
- **Check in / check out** — Tap when you arrive and leave to help fellow students
- **Auto checkout** — Sessions expire automatically after 4 hours
- **Busyness levels** — Quiet, Moderate, Busy, and Packed indicators
- **Library data** — Links to [waitz.io](https://waitz.io) for detailed floor-by-floor library info

## Study Spots

| Location | Capacity |
|---|---|
| E7 Quiet Study | 75 |
| SLC 3rd Floor Lounge | 50 |
| HLTH Silent Study | 40 |
| MC Lounge | 100 |
| Bloomberg Finance Lab | 25 |

## Run locally

```bash
npm install
npm run dev
```

This starts the API server on port 3001 and the Vite dev server (usually port 5173). Open the Vite URL in your browser.

## Production

```bash
npm run build
npm start
```

Serve the `dist/` folder with any static file server, proxied to the API on port 3001.
