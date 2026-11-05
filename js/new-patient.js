/* Hudson Valley Dental Medicine – New Patient (Free Consultation) landing page
   Dependency-free: dataLayer events, sticky mobile CTA, reviews ticker, hello video modal,
   consultation form (validation, bot protection, POST to data-endpoint, thank-you state). */
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

  /* ---------- CTA + phone + directions click tracking ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (!a) return;
    var type = a.getAttribute('data-track');
    if (type === 'phone') track('phone_click', { link_location: a.getAttribute('data-location') || 'page', phone_number: PHONE });
    else if (type === 'cta') track('cta_click', { cta_text: a.textContent.replace(/\s+/g, ' ').trim() });
    else if (type === 'directions') track('directions_click', {});
  });

  /* ---------- Subtle reveal for below-the-fold blocks ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll('.benefits, .itero, .services, .doctor, .faq, .final');
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js');
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('reveal'); ro.observe(el); });
  }

  /* ---------- Mobile sticky CTA: show once the hero CTAs scroll away, hide while the form is on screen ---------- */
  var sticky = document.getElementById('stickyCta');
  var heroCta = document.querySelector('.hero__cta');
  var formCard = document.getElementById('consult-form');
  if (sticky && 'IntersectionObserver' in window) {
    if (heroCta) {
      new IntersectionObserver(function (entries) {
        sticky.classList.toggle('is-visible', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
      }, { threshold: 0 }).observe(heroCta);
    } else {
      sticky.classList.add('is-visible');
    }
    if (formCard) {
      new IntersectionObserver(function (entries) {
        sticky.classList.toggle('is-covered', entries[0].isIntersecting);
      }, { threshold: 0 }).observe(formCard);
    }
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

  /* ---------- Dr. Turturro hello video (modal, loads only on open) ---------- */
  var modal = document.getElementById('videoModal');
  var video = document.getElementById('videoEl');
  if (modal && video) {
    var lastOpener = null;
    function openVideo(btn) {
      lastOpener = btn || null;
      if (typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open', '');
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
      track('video_play', { video_title: 'A quick hello from Dr. Turturro' });
    }
    function closeVideo() {
      video.pause();
      if (typeof modal.close === 'function' && modal.open) modal.close(); else modal.removeAttribute('open');
      if (lastOpener && lastOpener.focus) lastOpener.focus();
    }
    Array.prototype.forEach.call(document.querySelectorAll('[data-video-open]'), function (btn) {
      btn.addEventListener('click', function () { openVideo(btn); });
    });
    Array.prototype.forEach.call(modal.querySelectorAll('[data-video-close]'), function (btn) {
      btn.addEventListener('click', closeVideo);
    });
    modal.addEventListener('click', function (e) { if (e.target === modal) closeVideo(); });
    modal.addEventListener('close', function () { video.pause(); });
    modal.addEventListener('cancel', function (e) { e.preventDefault(); closeVideo(); });
  }

  /* ---------- Free consultation form ---------- */
  var form = document.getElementById('consultForm');
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
      Array.prototype.forEach.call(form.querySelectorAll('input[required], textarea[required]'), function (f) {
        var valid = f.type === 'checkbox' ? f.checked : f.checkValidity();
        f.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (!valid && !firstBad) firstBad = f;
      });
      Array.prototype.forEach.call(form.querySelectorAll('[data-chip-group]'), function (group) {
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
        status.focus();
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
