# Manipal Convocation Family Trip — GitHub Pages

A phone-friendly static trip dashboard for 18–20 November 2026.

## What it does

- Shows the three-day itinerary and stop-by-stop timeline.
- Opens stop directions in Google Maps with no Google API key.
- Uses phone GPS as the Maps directions origin when you tap **Use my location** and then **Directions to next in Maps**.
- Opens uploaded documents directly; no QR code is required.
- Lets you mark stops reached, undo progress, and correct times with the pen beside each stop.
- Automatically marks earlier stops reached if you mark a later stop, keeping progress in itinerary order.
- Clears the selected stop and all later stops when you undo/clear a checkpoint.
- Lets you edit meal-plan entries and add, edit, check off, or remove travel essentials.
- Saves trip progress and edits in this browser's `localStorage`; data is not shared across devices.

## Google Maps and location privacy

The site makes no Routes API calls and contains no Google API key. Google Maps calculates distance and traffic after you open directions. Browser geolocation requires HTTPS (GitHub Pages provides HTTPS) and your permission. The site stores the selected coordinates in this browser; tapping **Directions to next in Maps** passes the origin and destination to Google Maps.

## Booking PDF password warning

Both booking PDFs in `docs/` are encrypted with AES-256 and prompt for the passcode in a PDF reader. The passcode is intentionally not present in the website source. Share it through a separate private channel.

**Important:** the requested six-digit passcode is weak and can be guessed offline. AES-256 does not make a short passcode strong. This provides a barrier against casual viewing, not strong protection for sensitive booking details. GitHub Pages and the repository still expose the encrypted PDF files, filenames, and file sizes publicly. For genuinely private information, do not put the booking PDFs in a public repository or public Pages site; use private storage with access controls instead. Prefer a long, unique passphrase if you continue hosting encrypted PDFs publicly.

If you replace either booking PDF, encrypt it again before adding it to `docs/`; otherwise the replacement will be public and unprotected. The document links open PDFs in the browser, which will show its password prompt.

## Documents and locations

The uploaded documents are listed in `config.js`. To add a document, place it in `docs/` and add an entry to the `documents` array. Update approximate stop coordinates or Maps links there as needed. The Blue Wave Homestay stops use the supplied Google Travel link.

## Day 1 drive estimate

Day 1 now has lunch at home at 2:00 PM, a flexible 2:30–3:00 PM departure, a Hassan break/early dinner, and an estimated Dharmasthala arrival window of 8:30–9:30 PM. Google Maps showed about 3h 15m Bengaluru–Hassan and 2h 18m Hassan–Dharmasthala when checked on 9 November 2026; this is roughly 5h 45m of driving before the break. Traffic and the actual starting address can change the timing, so check live directions on the day. The first-day itinerary migration clears old test checkpoints and planned-time overrides so the updated schedule displays correctly.

## Deploy to GitHub Pages

Upload `index.html`, `style.css`, `app.js`, `config.js`, `docs/`, and `README.md`. In **GitHub → Repository → Settings → Pages**, choose **Deploy from branch**, select `main` and `/(root)`, then save. Open the published Pages URL on the family phone.
