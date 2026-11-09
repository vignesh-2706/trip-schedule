# Manipal Convocation Family Trip — GitHub Pages

A phone-friendly static trip dashboard for 18–20 November 2026.

## What it does

- Shows the three-day itinerary and stop-by-stop timeline.
- Opens stop directions in Google Maps.
- Uses phone GPS for the route origin when you tap **Use my location**.
- Optionally shows traffic-aware distance and travel time with Google Routes API.
- Opens uploaded PDFs and images directly; no QR code is required.
- Lets you mark stops reached, undo progress, and correct times with the pen beside each stop.
- Automatically marks earlier stops reached if you mark a later stop, keeping progress in itinerary order.
- Clears the selected stop and all later stops when you undo/clear a checkpoint, so the next stop remains consistent.
- Lets you edit meal-plan entries and add, edit, check off, or remove travel essentials.
- Saves checkpoint, meal-plan, and checklist edits in this browser's `localStorage`; data is not shared across devices.

## Documents

The uploaded documents are already listed in `config.js`. To add a document, put it in `docs/` and add an entry to the `documents` array. The link opens the file in a new tab; PDFs can be viewed, printed, or downloaded from the browser.

## Optional Google Routes API

Google Maps directions work without an API key. A key is only needed for the live distance and travel-time estimates shown on this page.

1. Enable **Routes API** in a Google Cloud project.
2. Create an API key restricted to your GitHub Pages HTTP referrer and Routes API.
3. Set `googleRoutesApiKey` in `config.js`.

Do not commit an unrestricted API key.

## Locations and GPS

Browser geolocation requires HTTPS (GitHub Pages provides HTTPS) or localhost, and permission from the user. Location is used on this page and is not sent to a site-owned server. If Routes API is configured, coordinates are sent to Google to calculate the estimate. Google Maps navigation remains available without the API key.

The route origin uses the latest GPS reading when available, otherwise the latest reached checkpoint, then the configured Bengaluru home location. Some destination coordinates in `config.js` are approximate; verify important stops and booking details before departure.

## Deploy to GitHub Pages

Upload `index.html`, `style.css`, `app.js`, `config.js`, `docs/`, and `README.md`. In **GitHub → Repository → Settings → Pages**, choose **Deploy from branch**, select `main` and `/(root)`, then save. Open the published Pages URL on the family phone.
