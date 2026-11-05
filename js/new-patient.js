/* Hudson Valley Dental Medicine – New Patient (Free Consultation) landing page
   Dependency-free: dataLayer events, sticky mobile CTA, reviews ticker, hero hello video,
   video modal (patient story / hello), popup consultation form (validation, bot protection,
   POST to data-endpoint, thank-you state). */
(function () {
  'use strict';

  var PHONE = '9143502622';
  var dl = (window.dataLayer = window.dataLayer || []);
  function track(event, data) {
    var payload = { event: event };
    for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) payload[k] = data[k];
    dl.push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', event, data);
  }
  function text(el) { return el.textContent.replace(/\s+/g, ' ').trim(); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  /* ---------- CTA + phone + directions click tracking ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a) return;
    var type = a.getAttribute('data-track');
    if (type === 'phone') track('phone_click', { link_location: a.getAttribute('data-location') || 'page', phone_number: PHONE });
    else if (type === 'cta') track('cta_click', { cta_text: text(a) });
    else if (type === 'directions') track('directions_click', {});
  });

  /* ---------- Dialog helpers (popup form + video modal) ---------- */
  var lastOpener = null;
  function openDialog(dialog, opener) {
    lastOpener = opener || null;
    document.body.classList.add('modal-open');
    if (typeof dialog.showModal === 'function') { if (!dialog.open) dialog.showModal(); }
    else dialog.setAttribute('open', '');
  }
  function closeDialog(dialog) {
    if (typeof dialog.close === 'function') { if (dialog.open) dialog.close(); }
    else dialog.removeAttribute('open');
    document.body.classList.remove('modal-open');
    if (lastOpener && lastOpener.focus) lastOpener.focus();
  }
  function wireDialog(dialog, onClose) {
    dialog.addEventListener('click', function (e) { if (e.target === dialog) closeDialog(dialog); });
    dialog.addEventListener('cancel', function (e) { e.preventDefault(); closeDialog(dialog); });
    dialog.addEventListener('close', function () { document.body.classList.remove('modal-open'); if (onClose) onClose(); });
  }

  /* ---------- Subtle reveal for below-the-fold blocks ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    each(document.querySelectorAll('.benefits, .itero, .services, .doctor, .story, .results, .faq, .final'), function (el) { el.classList.add('reveal'); ro.observe(el); });
  }

  /* ---------- Mobile sticky CTA: show once the hero CTAs scroll away ---------- */
  var sticky = document.getElementById('stickyCta');
  var heroCta = document.querySelector('.hero__cta');
  if (sticky && heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle('is-visible', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(heroCta);
  } else if (sticky) {
    sticky.classList.add('is-visible');
  }

  /* ---------- Reviews ticker: duplicate the track for a seamless loop (~30px/s) ---------- */
  var ticker = document.getElementById('reviewTicker');
  var tickerTrack = ticker && ticker.querySelector('.ticker__track');
  if (tickerTrack && !reduceMotion) {
    Array.prototype.slice.call(tickerTrack.children).forEach(function (card) {
      var clone = card.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      tickerTrack.appendChild(clone);
    });
    var half = tickerTrack.scrollWidth / 2;
    ticker.style.setProperty('--ticker-duration', Math.max(40, Math.round(half / 30)) + 's');
    ticker.classList.add('is-ready');
  }

  /* ---------- Hero hello video: plays in place, loads only on play ---------- */
  var heroVideo = document.getElementById('heroVideo');
  var heroPlay = document.getElementById('heroVideoPlay');
  var heroEl = document.getElementById('heroVideoEl');
  if (heroVideo && heroPlay && heroEl) {
    heroPlay.addEventListener('click', function () {
      heroVideo.classList.add('is-playing');
      heroEl.hidden = false;
      heroEl.load();
      var p = heroEl.play();
      if (p && p.catch) p.catch(function () {});
      track('video_play', { video_title: 'A quick hello from Dr. Turturro' });
    });
  }

  /* ---------- Video modal: hello video / patient story (source set on open) ---------- */
  var vModal = document.getElementById('videoModal');
  var video = document.getElementById('videoEl');
  var vCaption = document.getElementById('videoCaption');
  if (vModal && video) {
    each(document.querySelectorAll('[data-video-open]'), function (btn) {
      btn.addEventListener('click', function () {
        if (heroEl && !heroEl.paused) heroEl.pause();
        var src = btn.getAttribute('data-video-src');
        var landscape = btn.getAttribute('data-video-orientation') === 'landscape';
        vModal.classList.toggle('is-landscape', landscape);
        vModal.setAttribute('aria-label', btn.getAttribute('data-video-title') || 'Video');
        if (vCaption) vCaption.textContent = btn.getAttribute('data-video-caption') || '';
        if (video.getAttribute('src') !== src) {
          video.setAttribute('poster', btn.getAttribute('data-video-poster') || '');
          video.setAttribute('src', src);
          video.load();
        }
        openDialog(vModal, btn);
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
        track('video_play', { video_title: btn.getAttribute('data-video-title') || 'video' });
      });
    });
    each(vModal.querySelectorAll('[data-video-close]'), function (btn) { btn.addEventListener('click', function () { closeDialog(vModal); }); });
    wireDialog(vModal, function () { video.pause(); });
  }

  /* ---------- Popup consultation form ---------- */
  var fModal = document.getElementById('consult-form');
  var form = document.getElementById('consultForm');
  if (fModal && form) {
    each(document.querySelectorAll('[data-form-open]'), function (el) {
      el.addEventListener('click', function (e) {
        if (typeof fModal.showModal !== 'function') return; // no <dialog> support: let the anchor scroll to the inline form
        e.preventDefault();
        if (vModal && vModal.open) closeDialog(vModal);
        openDialog(fModal, el);
        track('form_open', { cta_text: text(el) });
        var first = form.querySelector('input:not([type="hidden"]):not(.hp)');
        if (first && !form.classList.contains('is-sent')) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
      });
    });
    each(fModal.querySelectorAll('[data-form-close]'), function (btn) { btn.addEventListener('click', function () { closeDialog(fModal); }); });
    wireDialog(fModal);
  }

  if (form) {
    var status = form.querySelector('.form__status');
    var loadedAt = Date.now();
    var loadedField = form.querySelector('[name="form_loaded_at"]');
    if (loadedField) loadedField.value = String(loadedAt);
    var started = false;

    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      track('form_start', { form_id: form.id });
    });

    function setStatus(msg, type) {
      status.textContent = msg;
      status.className = 'form__status' + (type ? ' is-' + type : '');
    }

    function validate() {
      var firstBad = null;
      each(form.querySelectorAll('input[required], textarea[required]'), function (f) {
        var valid = f.type === 'checkbox' ? f.checked : f.checkValidity();
        f.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid && !firstBad) firstBad = f;
      });
      each(form.querySelectorAll('[data-chip-group]'), function (group) {
        var any = group.querySelector('input:checked');
        var chips = group.querySelector('.chips');
        group.setAttribute('aria-invalid', any ? 'false' : 'true');
        if (chips) chips.classList.toggle('is-invalid', !any);
        if (!any && !firstBad) firstBad = group.querySelector('input');
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    function collect() {
      var data = {};
      var fd = new FormData(form);
      fd.forEach(function (v, k) {
        if (k === 'website' || k === 'form_loaded_at') return;
        if (k === 'preferred_days' || k === 'preferred_times') { data[k] = data[k] ? data[k] + ', ' + v : v; return; }
        data[k] = v;
      });
      data.source = 'New Patient – Free Consultation landing page';
      data.page_url = location.href;
      // Pass ad attribution through to the CRM when present on the landing URL.
      var q = new URLSearchParams(location.search);
      ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
        if (q.get(k)) data[k] = q.get(k);
      });
      return data;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('.hp').value) return; // honeypot filled: bot
      if (!validate()) { setStatus('Please complete the highlighted fields.', 'error'); return; }

      var data = collect();
      var endpoint = form.getAttribute('data-endpoint');
      var btn = form.querySelector('button[type="submit"]');

      function done() {
        track('form_submit', { form_id: form.id, preferred_days: data.preferred_days, preferred_times: data.preferred_times });
        form.classList.add('is-sent');
        setStatus('Thanks, ' + data.first_name + '. We received your request and will confirm your free consultation by phone or text. Need us sooner? Call (914) 350-2622.', 'success');
        status.setAttribute('tabindex', '-1');
        status.focus({ preventScroll: true });
      }

      // Submitted faster than a person can type: treat as a bot (confirm visually, send nothing, no conversion).
      if (Date.now() - loadedAt < 2500) { form.classList.add('is-sent'); setStatus('Thanks. We received your request.', 'success'); return; }

      if (!endpoint) {
        // No backend configured yet (see README): still record the conversion and confirm to the visitor.
        done();
        return;
      }

      btn.disabled = true;
      setStatus('Sending…');
      fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); done(); })
        .catch(function () {
          btn.disabled = false;
          setStatus('Something went wrong sending your request. Please call (914) 350-2622.', 'error');
        });
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
