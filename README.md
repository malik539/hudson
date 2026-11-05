# Hudson Valley Dental Medicine – PPC landing pages

Two static landing pages (HTML/CSS/JS, no framework, no external libraries) for Hudson Valley
Dental Medicine in Cortlandt Manor, NY:

| Page | Path | Campaign | Phone |
|------|------|----------|-------|
| Emergency Dental Treatment | `/` (`index.html`) | Emergency Google Ads campaign | (914) 809-8561 |
| New Patient – Free Consultation | `/new-patient/` (`new-patient/index.html`) | New Patient Google Ads campaign | (914) 350-2622 |

Each page has its own stylesheet and script so one can change without touching the other; fonts and
images in `assets/` are shared.

---

## New Patient – Free Consultation page (`new-patient/`)

Offer: **"Your first visit is on us."** = a complimentary new-patient consultation and personalized
treatment plan (never free treatment). Goal: free-consultation form submissions and calls to
**(914) 350-2622** (`tel:9143502622`).

```
new-patient/index.html   page (6 sections + top bar, header, mobile sticky CTA, hello-video modal)
css/new-patient.css      warm/premium brand styling (Poppins, #007dc3 blue, #0fd8b0 teal, navy)
js/new-patient.js        sticky CTA, reviews ticker, video modal, form submit, dataLayer events (≈9 KB)
NEW-PATIENT-CHECKLIST.md every string / decision that must be verified against the source page
```

| # | Section | Conversion purpose |
|---|---------|--------------------|
| 0 | "Now Welcoming New Patients" bar + compact header | Phone + Book Your Free Consultation |
| 1 | Hero (offer, clarification, 5.0 · 200+ reviews, CTAs, trust points, Dr. Turturro hello video) + the **only** lead form (`#consult-form`) | Explain the offer in 5 seconds and capture the lead |
| 2 | Why Choose Hudson Valley Dental Medicine (3×2 benefits) + iTero feature | Differentiate; CTA |
| 3 | Our Comprehensive Dental Services (5 compact cards) | Show the practice is a long-term dental home |
| 4 | Meet Dr. Francis Turturro (photo, bio, credentials) | Doctor credibility; CTA |
| 5 | Patient stories (reviews ticker) + before/after (hidden until assets arrive) + FAQ accordion | Social proof and objection handling |
| 6 | Final CTA + address, hours, map, directions | Make booking or navigating effortless |
| – | Mobile sticky bar (Call Now / Free Consultation) | Always-available conversion on phones; hides while the form is on screen |

### Connecting the form

Set `data-endpoint` on `<form id="consultForm">` to the practice's LeadConnector / GHL inbound webhook
(or any POST endpoint). Payload (JSON): `first_name`, `last_name`, `phone`, `email`, `preferred_days`
("Monday, Thursday"), `preferred_times` ("Morning"), `comments`, `consent`, `source`, `page_url`, plus
`gclid` / `utm_*` when present on the landing URL. Bot protection: honeypot field + submissions faster
than 2.5 s are dropped silently. Until an endpoint is set the form shows the thank-you state and fires
`form_submit` but sends nothing. To use the LeadConnector embedded form instead, replace the `<form>` with
the iframe and keep the surrounding `.form-card` so the `#consult-form` links keep working.

### Tracking

Paste the GTM container into the marked slots (head and body). dataLayer events (mirrored to `gtag`):
`phone_click` {link_location, phone_number}, `cta_click` {cta_text}, `form_start` {form_id},
`form_submit` {form_id, preferred_days, preferred_times}, `directions_click`, `video_play` {video_title}.
Bump the `?v=` on `css/new-patient.css` and `js/new-patient.js` when you change them.

### Pending assets (see NEW-PATIENT-CHECKLIST.md)

60-second Dr. Turturro hello video (the 14-second HVDM clip is used meanwhile), "Angel" patient story
video, before/after images (block ships hidden), iTero image (illustration used meanwhile).

---

## Emergency Dental Treatment page (`/`)

High-intent PPC landing page for **Emergency Dental Treatment** in Cortlandt Manor, NY.
Goal: phone calls to **(914) 809-8561** and emergency appointment requests.

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
