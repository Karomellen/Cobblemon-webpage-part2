# Cobblemon Part 2 site

Vite + React Router (JavaScript) with a small Express server for the online status.

## Run it

```
npm install
cp .env.example .env     # fill in MC_HOST
npm run server           # terminal 1, API on :3001
npm run dev              # terminal 2, site on :5173
```

## Where things are

- `src/config.js`: server name, intro text, Discord profiles (each profile's `sprite` picks its card image)
- `public/images/sprites/`: Pokémon sprites. Sprites that aren't `.png` (e.g. `.webp`) must be listed in `src/sprites.js`.
  `node scripts/trim-sprites.mjs` regenerates the `.png` sprites from `public/images/<name>.png`; it doesn't touch the `.webp` ones.
- `src/data/*.json`: announcements, rules, archive, faq (edit these, no code needed)
- `public/images/archive/`: newspaper images, listed in `src/data/archive.json`
- `server/index.js`: `/api/status`, the API key stays here and never reaches the browser

## Intro screen

The book intro plays on every page load (including refresh), then continues to the page you opened (`/` goes to `/home`).
The footer has a "Replay intro" link.

## Deploy

1. `npm run build` creates `dist/`. Host it on any static host (Netlify, Vercel, Cloudflare Pages).
   `public/_redirects` makes routes like `/rules` work on Netlify. Other hosts need an "all routes to index.html" rewrite.
2. Run `npm run server` on a small Node host (Render, Railway, Fly.io) and set the `.env` values there.
3. Set `VITE_API_BASE` to that host's URL before building, and `CLIENT_ORIGIN` on the server to your site's URL.

The status server calls mcstatus.io. Check their docs once to confirm the endpoint and field names still match `server/index.js`.
