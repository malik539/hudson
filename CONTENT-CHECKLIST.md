# Content verification checklist

The source landing page (`smilehub.hudsonvalleydentalmedicine.com/emergency-treatment`) and the
practice website were **blocked by the build environment's network policy**, so the approved copy
could not be copied verbatim. Everything below is either (a) authoritative data from the brief,
(b) approved elements the brief itself listed, or (c) placeholder text wrapped in `[[double brackets]]`
that must be replaced with the exact source-page wording before launch.

## Verified / authoritative (from the brief) – no action needed

- Phone (914) 809-8561 and every `tel:9148098561` link (16 occurrences)
- Address 1983 Crompond Rd #202, Cortlandt Manor, NY 10567
- Office hours (Mon/Tue/Thu 8:30–5:30, Fri 8:30–2:30, Sat 8:30–1:00, Wed/Sun closed)
- Google Maps place URL and Get Directions URL (used exactly as supplied)
- Emergency conditions list (8 items, section 2 and the form's dropdown)
- Process step names: Reach Out · Get Seen Fast · Leave With a Plan
- Trust signals: Google reviews, New patients welcome, Same-day appointments, Digital X-rays, Dr. Francis Turturro
- Credentials: DDS, Columbia University College of Dental Medicine; General Practice Residency, Westchester Medical Center
- CTA labels: Call Now · Call (914) 809-8561 · Get Emergency Care Today · Emergency Appointment · Get Directions
- Form fields: First Name, Last Name, Phone, Email, Nature of Dental Emergency + consent
- Google rating 4.9 / 220 reviews and six reviews (Laureen Treacy, Maribel Tapia, Rachele Siniscalchi, Mike Cartolano, Jeff Silver, Anitha) copied verbatim from the Google screenshots supplied by the client

## Must be replaced with source-page copy (search `[[` in index.html)

| Location | Placeholder | What to paste |
|----------|-------------|---------------|
| FAQ: knocked-out tooth | `[[Approved answer…]]` | Source answer (do not add medical guidance) |
| FAQ: emergency extractions | `[[Approved answer…]]` | Source answer |
| FAQ: insurance | `[[Approved insurance answer…]]` | Source answer |
| FAQ: payment options | `[[Approved payment-options answer…]]` | Source answer |
| FAQ: after hours | `[[Approved after-hours answer…]]` | Source answer |
| Final CTA paragraph | `[[Approved after-hours emergency messaging…]]` | Source after-hours sentence |

## Drafted to match approved meaning – confirm wording against the source page

| Location | Current text | Note |
|----------|--------------|------|
| Status bar | "Same-day emergency appointments available." | Mirrors the approved same-day messaging |
| Hero eyebrow | "Emergency Dental Treatment · Cortlandt Manor, NY" | Swap for the existing eyebrow if different |
| Hero H1 | "Dental Emergency? Get Seen Today." | Swap for the existing H1 |
| Hero supporting copy | Uses only the approved conditions + same-day claim | Swap for existing paragraph |
| Step descriptions (01–03) | Short drafts referencing call/form, same-day visit, digital X-rays, insurance & payment | Swap for existing step copy |
| Doctor bio paragraph | Columbia DDS + Westchester GPR + "cared for patients in Cortlandt Manor and the surrounding Hudson Valley communities for years" | Replace with the page's bio; confirm the local-experience sentence |
| Trust strip subtitles | "Columbia-trained · Local dentist", "Fast, accurate diagnosis", "No referral needed" | Edit/remove if not on the source page |
| Form consent text | Standard SMS/phone consent sentence | Replace with the existing consent language |
| FAQ: what qualifies | Built from the approved conditions list | Confirm |
| Section intros | "If it hurts, is broken, or is swelling, don't wait it out…", "Three simple steps…" | Editorial connectors; trim if preferred |

## Deliberately omitted (not on the approved landing page as far as known)

- Awards (e.g. Westchester Magazine Top Dentist), statistics, pricing, guarantees, extra treatments.
- The approved video (if one exists on the source page) – add it inside section 4 as a lazy-loaded
  `<iframe>` or a poster-click embed to keep the page compact.
