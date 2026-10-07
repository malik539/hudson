# Hudson Valley Dental Medicine – Emergency Dental Treatment landing page

High-intent PPC landing page for **Emergency Dental Treatment** in Cortlandt Manor, NY.
Static HTML/CSS/JS, no framework, no external libraries. Goal: phone calls to
**(914) 809-8561** and emergency appointment requests.

```
index.html            page (7 sections + header, status bar, mobile sticky CTA)
css/styles.css        brand styling (Poppins, #007dc3 blue, #0fd8b0 teal)
js/main.js            sticky CTA, form submit, dataLayer events (≈3 KB)
assets/fonts/         self-hosted Poppins 400/600/700 (woff2)
assets/img/           optimised WebP/JPEG/PNG derived from the approved assets
assets/video/         "Tooth pain? Watch this" clip (540p H.264, loads only on play)
scripts/optimize-images.py   regenerates assets/img from the originals
CONTENT-CHECKLIST.md  every string that must be verified against the source page
```

## Page structure

| # | Section | Conversion purpose |
|---|---------|--------------------|
| 0 | Status bar + compact header | Same-day messaging, phone, Call Now / Get Emergency Care Today |
| 1 | Hero (copy left, "Tooth pain? Watch this" video right) + trust badges | Answer "can you help, how fast, who, where" and drive the call |
| 2 | Common dental emergencies we treat | Confirm the visitor's problem is covered; urgency call CTA |
| 3 | Emergency appointment form (`#emergency-form`) | Capture the lead; "Skip the Form – Call Now", hours, after-hours note |
| 4 | What Happens Next (3 steps) | Reduce anxiety; form CTA |
| 5 | Meet your doctor + credentials | Trust; call + form CTAs |
| 6 | Reviews + FAQ accordion | Social proof and objection handling in one compact block |
| 7 | Final CTA + address, hours, map, directions, after-hours | Make calling or navigating effortless |
| – | Mobile sticky bar (Call Now / Emergency Appointment) | Always-available conversion on phones |

## Running locally

Any static server works, e.g. `python3 -m http.server 8080` then open `http://localhost:8080/`.

## Connecting the form (LeadConnector / GoHighLevel)

This repository was empty before this build, so no existing form integration or tracking
code could be preserved. The form posts JSON to whatever you put in the `data-endpoint`
attribute of `<form id="emergencyForm">`:

```html
<form ... data-endpoint="https://services.leadconnectorhq.com/hooks/XXXX/webhook-trigger/YYYY">
```

Payload fields: `first_name`, `last_name`, `phone`, `email`, `nature_of_emergency`, `consent`,
`source`, `page_url`. Until an endpoint is set, the form shows the thank-you state and fires the
`form_submit` dataLayer event but sends nothing.

If the practice prefers the existing LeadConnector embedded form, replace the `<form>` element
with the LeadConnector `<iframe>` embed and keep the surrounding `.form-card` markup so the
CTAs that scroll to `#emergency-form` keep working.

## Tracking

Paste the practice's existing GTM container into the marked slots in `index.html` (head and
body). The page pushes these dataLayer events (and mirrors them to `gtag` when present):

| Event | Params | Fired on |
|-------|--------|----------|
| `phone_click` | `link_location`, `phone_number` | any `tel:` link |
| `cta_click` | `cta_text` | appointment CTAs |
| `form_start` | `form_id` | first interaction with the form |
| `form_submit` | `form_id`, `nature_of_emergency` | successful submit |
| `directions_click` | – | Get Directions |
| `video_play` | – | "Tooth pain? Watch this" |

## Performance notes

* Fonts self-hosted, `font-display: swap`, only 700/400 preloaded.
* All images have explicit dimensions (no layout shift); below-the-fold images are lazy-loaded
  with WebP + JPEG fallbacks and responsive `srcset`.
* The Google Maps iframe is lazy-loaded at the bottom of the page; the video only loads when played.
* Stylesheet and script URLs carry a `?v=` query string. Bump it when you change them so GitHub Pages / browser caches pick up the new file.
* JavaScript is deferred and dependency-free; FAQ accordion uses native `<details>`.
* Animations are limited to two subtle pulses and button hover, all disabled under
  `prefers-reduced-motion`.

## Regenerating images

Place the approved originals (logo JPG, `Hudson Valley - Doctor`, `Hudson Valley - building`)
in a folder and run `python3 scripts/optimize-images.py <folder>` (requires Pillow).
