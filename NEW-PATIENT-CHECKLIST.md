# New Patient (Free Consultation) landing page – content verification checklist

Page: `new-patient/index.html` → published at `https://malik539.github.io/hudson/new-patient/`
Source of truth: the approved MD export of the live page (`smilehub.hudsonvalleydentalmedicine.com/new-patient-834976`, supplied 2026-11-05).
The live page was inspected on 2026-11-05 once its host was allowed: it is a GoHighLevel funnel page with a native
GHL form (Cloudflare Turnstile bot protection), GTM container GTM-KD6LN4MQ, an Elfsight Google Reviews widget, two
GHL-hosted videos and two before/after images. All of that is reflected here except the Elfsight widget (verbatim
static reviews are used instead) and the GHL form itself (see the Form row).

## Verified / approved – used verbatim

- Phone **(914) 350-2622** on every `tel:9143502622` link (10 links); the emergency campaign number does not appear anywhere on the page
- Address 1983 Crompond Rd #202, Cortlandt Manor, NY 10567; Google Maps place, directions and embed URLs (same practice as the emergency page)
- Office hours: Mon/Tue/Thu 8:30 AM – 5:30 PM · Wed closed · Fri 8:30 AM – 2:30 PM · Sat 8:30 AM – 1:00 PM · Sun closed (also in the JSON-LD)
- Offer: H1 "Your first visit is on us." + clarification "New patients receive a complimentary consultation and personalized treatment plan with Dr. Francis Turturro."
- Hero paragraph (from the source paragraph), trust points, "★★★★★ 5.0 · 200+ Google Reviews", "New Patients only"
- Form heading, supporting copy, all seven fields, required marks, consent sentence with the privacy-policy link, bot protection
- Why Choose intro paragraph and the six benefits; iTero sentence "See your new smile before treatment begins, with iTero 3D digital simulation."
- Services heading, intro and the five services with their descriptions
- Doctor bio (both paragraphs) and the three credential bullets
- Reviews heading; final-section heading, paragraph and CTAs; disclaimer "Results vary by patient and case complexity. Treatment lengths are typical but not guaranteed."
- FAQ question wording (five questions)

## Decisions to confirm

| Location | What the page shows | Why |
|----------|--------------------|-----|
| Hero rating, doctor photo caption, reviews badge | **5.0 · 200+ Google Reviews** | Approved wording per the brief. The emergency page uses 4.9 · 220 (from the client's own Google screenshots). Decide which figure both pages should carry. |
| Doctor bio + credential | "practicing in the Bronxville community for more than 12 years" / "12+ years serving Bronxville & Yorktown families" | Kept verbatim as instructed. Flag for content review: it reads inconsistently next to the Cortlandt Manor positioning. |
| Hero video + doctor section "Watch a quick hello" | Dr. Turturro's hello video from the live page (21 s, re-encoded to 540p H.264; poster is the frame at 3.2 s) | Supplied 2026-11-05 from the GHL CDN. The source label says "60 second hello" but the clip is 21 s, so the page says "A quick hello before your visit · 0:21". |
| Patient stories | Angel's video story (25 s, re-encoded from the supplied .mov to H.264) + six verbatim Google reviews from the client's screenshots (same set as the emergency page) | The MD only contains one text review ("Nic Cucchiarella – All good."), omitted as too thin. The story card's one-line intro ("Hear from Angel, one of the families who trust…") is drafted; the video's own words were not transcribed. |
| Proven results (before / after) | The two before/after images from the live page, with the approved disclaimer | Downloaded from the live page's media library; alt text drafted. |
| Form | Popup `<dialog>` opened by every CTA, the skip link and the sticky bar; still one form only | Requested 2026-11-05. The live page uses a native GHL form with Cloudflare Turnstile; this page uses honeypot + timing until a Turnstile key or the GHL embed is supplied. |
| Tracking | GTM-KD6LN4MQ active in head and body | The container the live smilehub page loads. Conversion tags/triggers for `form_submit` and `phone_click` must be added inside GTM. |
| Map | The live page's exact Google Maps embed URL | Replaces the generic `maps?q=` embed. |
| iTero feature | Illustration (inline SVG) | No iTero device/screenshot asset was supplied. Replace `.itero__visual` with the approved image when available. |
| Hero fine print + form note | "New patients only. Your complimentary first visit is a consultation and personalized treatment plan." / "New patients only. We'll reach out by phone or text to confirm." | Added so "Your first visit is on us" cannot be read as free treatment. |
| Form: Preferred Day(s) / Time(s) | Multi-select chips (Mon · Tue · Thu · Fri · Sat · Any day / Morning · Afternoon · Any time), sent as comma-separated text | The MD lists the fields but not their input type. Chips are faster on mobile; swap for text inputs if the CRM field expects free text. |
| Form button | "Book My Free Consultation" | Replaces the source "SUBMIT" per the brief. |
| Thank-you message | "Thanks, {first name}. We received your request and will confirm your free consultation by phone or text. Need us sooner? Call (914) 350-2622." | Drafted; the source confirmation text was not provided. |
| FAQ answers | Written from the approved claim references in the brief (PPO plans + benefit verification; same-week appointments often available, same-day emergency appointments may be available; service list; yes; address + hours) | The MD contains the questions only. No insurance networks or appointment guarantees were added. |
| Services closing line | "Not sure what you need? Start with your complimentary consultation and Dr. Turturro will walk you through a personalized plan." | Drafted bridge copy; remove if not wanted. |

## Deliberately omitted

- Awards, statistics, pricing, guarantees or services that are not in the source
- A second lead form (all "Book Your Free Consultation" buttons scroll to the hero form)
- Repeated trust strips (shown once in the hero)
