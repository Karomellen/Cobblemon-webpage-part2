# Cobblemon Part 2 event page
 
Event page for our Cobblemon Part 2 server: intro screen, announcements, newspaper archive, rules, support and live online status.
 
> **Disclaimer**
> This is a fan-made, non-commercial event page. No profit is made from it.
> PokÃ©mon and its sprites belong to Nintendo, Creatures Inc., GAME FREAK inc. and The PokÃ©mon Company. Minecraft belongs to Mojang Studios and Microsoft. Cobblemon is made by the Cobblemon team.
> This page is not affiliated with or endorsed by any of them. The sprites are small decorations only and are not covered by this project's license.
> If you are a rights holder and want something removed, contact [CONTACT] and it will be taken down.
 
## Run it
 
```
npm install
cp .env.example .env
npm run server
npm run dev
```
 
## Edit content
 
- `src/data/*.json`: announcements, rules, archive, faq
- `src/config.js`: server name, intro text, Discord profiles
- `public/images/archive/`: newspaper images, listed in `archive.json`
## Deploy
 
1. `npm run build`, then host `dist/` on any static host (Netlify, Vercel, Cloudflare Pages).
2. Run `npm run server` on a small Node host and set the `.env` values there.
3. Set `VITE_API_BASE` to the server URL before building.
## Credits
 
PokÃ©mon sprites: Nintendo, Creatures Inc., GAME FREAK inc., The PokÃ©mon Company.
Cobblemon: the Cobblemon team. Minecraft: Mojang Studios and Microsoft.
Pixelify Sans: Google Fonts (SIL Open Font License).
 