/* Hudson Valley Dental Medicine – emergency landing page
   Minimal, dependency-free behaviour: sticky mobile CTA, form submission, dataLayer events. */
(function () {
  'use strict';

  var dl = (window.dataLayer = window.dataLayer || []);
  function track(event, data) {
    var payload = { event: event };
    for (var k in data) if (Object.prototype.hasOwnProperty.call(data, k)) payload[k] = data[k];
    dl.push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', event, data);
  }

  /* ---------- CTA + phone click tracking ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-track]');
    if (!a) return;
    var type = a.getAttribute('data-track');
    if (type === 'phone') track('phone_click', { link_location: a.getAttribute('data-location') || 'page', phone_number: '9148098561' });
    else if (type === 'cta') track('cta_click', { cta_text: a.textContent.trim() });
    else if (type === 'directions') track('directions_click', {});
  });

  /* ---------- Mobile sticky CTA: show after the hero CTAs scroll out of view ---------- */
  var sticky = document.getElementById('stickyCta');
  var heroCta = document.querySelector('.hero__cta');
  if (sticky && heroCta && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      sticky.classList.toggle('is-visible', !entries[0].isIntersecting && entries[0].boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(heroCta);
  } else if (sticky) {
    sticky.classList.add('is-visible');
  }

  /* ---------- Reviews: reveal the extra cards ---------- */
  var more = document.getElementById('moreReviews');
  if (more) {
    more.addEventListener('click', function () {
      var hidden = document.querySelectorAll('.review--more');
      var open = more.getAttribute('aria-expanded') === 'true';
      for (var i = 0; i < hidden.length; i++) hidden[i].hidden = open;
      more.setAttribute('aria-expanded', String(!open));
      more.textContent = open ? 'Show 3 more reviews' : 'Show fewer reviews';
    });
  }

  /* ---------- "Tooth pain? Watch this" video: load on demand ---------- */
  var playBtn = document.getElementById('videoPlay');
  var videoEl = document.getElementById('videoEl');
  var strip = document.getElementById('videoBox');
  if (playBtn && videoEl && strip) {
    playBtn.addEventListener('click', function () {
      strip.classList.add('is-playing');
      videoEl.hidden = false;
      videoEl.load();
      var p = videoEl.play();
      if (p && p.catch) p.catch(function () {});
      track('video_play', {});
    });
  }

  /* ---------- Emergency appointment form ---------- */
  var form = document.getElementById('emergencyForm');
  if (!form) return;
  var status = form.querySelector('.form__status');
  var started = false;

  form.addEventListener('input', function () {
    if (started) return;
    started = true;
    track('form_start', { form_id: form.id });
  }, { once: true });

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = 'form__status' + (type ? ' is-' + type : '');
  }

  function validate() {
    var ok = true;
    var fields = form.querySelectorAll('[required]');
    for (var i = 0; i < fields.length; i++) {
      var f = fields[i];
      var valid = f.type === 'checkbox' ? f.checked : f.checkValidity();
      f.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid && ok) { f.focus(); ok = false; }
    }
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('.hp').value) return; // honeypot
    if (!validate()) { setStatus('Please complete the highlighted fields.', 'error'); return; }

    var endpoint = form.getAttribute('data-endpoint');
    var btn = form.querySelector('button[type="submit"]');
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== 'website') data[k] = v; });
    data.source = 'Emergency Treatment landing page';
    data.page_url = location.href;

    function done() {
      track('form_submit', { form_id: form.id, nature_of_emergency: data.nature_of_emergency });
      form.classList.add('is-sent');
      setStatus('Thanks, ' + data.first_name + '. We received your request and will call you back as soon as possible. If you need help right away, call (914) 809-8561.', 'success');
      status.setAttribute('tabindex', '-1');
      status.focus();
    }

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
        setStatus('Something went wrong sending your request. Please call (914) 809-8561.', 'error');
      });
  });

  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
