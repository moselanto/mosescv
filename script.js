document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {
  // Download PDF -> browser print dialog ("Save as PDF")
  var btn = document.getElementById('download-btn');
  if (btn) btn.addEventListener('click', function () { window.print(); });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Live website screenshots for any element with data-site
  document.querySelectorAll('[data-site]').forEach(function (el) {
    var site = el.getAttribute('data-site');
    var thumb = el.querySelector('.thumb');
    if (!thumb || thumb.classList.contains('fallback')) return;
    var heading = el.querySelector('h3') || (el.closest('article') && el.closest('article').querySelector('h3'));
    var label = heading ? heading.childNodes[0].textContent.trim() : site;
    var src = 'https://s.wordpress.com/mshots/v1/' + encodeURIComponent(site) + '?w=1000&h=625';
    var img = new Image();
    var tries = 0;
    function fallback() {
      thumb.classList.add('fallback');
      thumb.textContent = label;
    }
    img.onload = function () {
      // mshots returns a small placeholder while generating; retry a few times
      if (img.naturalWidth < 400 && tries < 4) {
        tries++;
        setTimeout(function () { img.src = src + '&r=' + tries; }, 3000);
        return;
      }
      if (img.naturalWidth < 400) { fallback(); return; }
      thumb.style.backgroundImage = 'url("' + img.src + '")';
    };
    img.onerror = fallback;
    img.src = src;
  });

  // Portfolio filters
  var buttons = document.querySelectorAll('.filters button');
  var cards = document.querySelectorAll('.grid .card');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      buttons.forEach(function (x) { x.classList.remove('active'); x.setAttribute('aria-pressed', 'false'); });
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
      var f = b.getAttribute('data-filter');
      cards.forEach(function (c) {
        c.classList.toggle('hidden', f !== 'all' && c.getAttribute('data-cat') !== f);
      });
    });
  });

  // Reveal on scroll + active nav link
  var reveals = document.querySelectorAll('.reveal');
  var navLinks = document.querySelectorAll('.nav ul a[href^="#"]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (r) { io.observe(r); });

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  } else {
    reveals.forEach(function (r) { r.classList.add('in'); });
  }

  // Make sure everything is visible before printing
  window.addEventListener('beforeprint', function () {
    reveals.forEach(function (r) { r.classList.add('in'); });
  });
});
