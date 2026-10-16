/* Rolpoortfix – interactie en animaties */
(function () {
  'use strict';

  // Offerteformulier – verstuurd via Netlify Forms (data-netlify="true" in de HTML).
  // Zonder JavaScript post het formulier gewoon naar Netlify en toont Netlify zijn eigen bedankpagina.
  var form = document.getElementById('offerte-form');
  var ok = document.getElementById('offerte-ok');
  var fout = document.getElementById('offerte-fout');
  var reset = document.getElementById('offerte-reset');
  if (form && ok && fout && reset) {
    var submit = form.querySelector('[type="submit"]');
    var submitLabel = submit.textContent;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      submit.disabled = true;
      submit.textContent = 'Versturen…';
      fout.hidden = true;

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          form.hidden = true;
          ok.hidden = false;
          ok.setAttribute('tabindex', '-1');
          ok.focus();
        })
        .catch(function () {
          fout.hidden = false;
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = submitLabel;
        });
    });

    reset.addEventListener('click', function () {
      form.reset();
      ok.hidden = true;
      form.hidden = false;
    });
  }

  // Hero vult het scherm onder de sticky header
  var header = document.querySelector('.site-header');
  var root = document.documentElement;
  function setHeaderHeight() {
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
  }
  if (header) {
    setHeaderHeight();
    window.addEventListener('resize', setHeaderHeight);
  }

  // Mobiel menu
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (header && toggle && nav) {
    var setMenu = function (open) {
      header.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    };
    var isOpen = function () { return header.classList.contains('is-open'); };

    toggle.addEventListener('click', function () { setMenu(!isOpen()); });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !header.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1001px)').addEventListener('change', function (e) {
      if (e.matches) setMenu(false);
    });
  }

  // Scroll-animaties
  // Volledig weggeknipte foto's (clip-path) tellen niet als zichtbaar, dus observeer hun ouder.
  var targets = [].slice.call(document.querySelectorAll('.reveal'));
  document.querySelectorAll('.reveal-img').forEach(function (el) {
    targets.push(el.parentElement);
  });

  function show(el) { el.classList.add('is-visible'); }

  if (!('IntersectionObserver' in window)) {
    targets.forEach(show);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        show(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });

  targets.forEach(function (el) { observer.observe(el); });
})();
