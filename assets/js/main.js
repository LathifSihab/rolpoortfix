/* Rolpoortfix – interactie en animaties */
(function () {
  'use strict';

  // Offerteformulier
  // TODO live: koppel aan een formulierdienst (bv. Formspree) of eigen backend via het action-attribuut.
  var form = document.getElementById('offerte-form');
  var ok = document.getElementById('offerte-ok');
  var reset = document.getElementById('offerte-reset');
  if (form && ok && reset) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.hidden = true;
      ok.hidden = false;
      ok.setAttribute('tabindex', '-1');
      ok.focus();
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
