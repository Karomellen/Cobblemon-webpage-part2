# Cobblemon Part 2 event page
 
Event page for our Cobblemon Part 2 server: intro screen, announcements, newspaper archive, rules, support and live online status.
 
> **Disclaimer**
> This is a fan-made, non-commercial event page. No profit is made from it.
> PokÃ©mon and its sprites belong to Nintendo, Creatures Inc., GAME FREAK inc. and The PokÃ©mon Company. Minecraft belongs to Mojang Studios and Microsoft. Cobblemon is made by the Cobblemon team.
> This page is not affiliated with or endorsed by any of them. The sprites are small decorations only and are not covered by this project's license.
> If you are a rights holder and want something removed, contact karoline.rasmussenroed@gmail.com and it will be taken down.
 
## Run locally
 
 
```
npm install
npm run server
npm run dev
```

Copy `.env.example` to `.env` and fill in the server settings. Apply `supabase/schema.sql` in the Supabase SQL editor. Keep the Supabase service role key and Discord bot token private.

Register `/archive` with `npm run register:commands`, then invite the bot with the `bot` and `applications.commands` scopes. It needs permission to view and send messages and embed links in the archive channel. Only the configured Cobblemon role can upload; new entries show the uploader's Discord server name linked to their profile. Deleting the bot's archive post removes its entry and image.

## Deploy

Host the site on Netlify and the API/bot on an always-on Node host. Set the server environment variables from `.env.example`, adding the Netlify site URL to `CLIENT_ORIGIN`. Set Netlify's `VITE_API_BASE` to the API host URL, then build with `npm run build`.

Run `npm test` for archive validation tests.
## Credits
 
PokÃ©mon sprites: Nintendo, Creatures Inc., GAME FREAK inc., The PokÃ©mon Company.
Cobblemon: the Cobblemon team. Minecraft: Mojang Studios and Microsoft.
Pixelify Sans: Google Fonts (SIL Open Font License).
 
