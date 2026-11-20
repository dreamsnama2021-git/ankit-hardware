(function () {
  'use strict';
  var EMAIL = 'ankit.shah108@gmail.com';
  var root = document.body.getAttribute('data-root') || '';

  // Opened straight from disk: folder links need an explicit index.html.
  if (location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (/^(https?:|mailto:|tel:|#)/.test(h)) return;
      if (h === '' || /\/$/.test(h)) a.setAttribute('href', h + 'index.html');
    });
  }

  // ---------- Hero slider ----------
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = hero.querySelectorAll('.slide');
    var dots = hero.querySelectorAll('.hero-dots button');
    var cur = 0, timer;
    var go = function (i) {
      slides[cur].classList.remove('active');
      dots[cur].classList.remove('active');
      cur = (i + slides.length) % slides.length;
      slides[cur].classList.add('active');
      dots[cur].classList.add('active');
    };
    var auto = function () { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 5000); };
    hero.querySelector('.prev').onclick = function () { go(cur - 1); auto(); };
    hero.querySelector('.next').onclick = function () { go(cur + 1); auto(); };
    dots.forEach(function (d, i) { d.onclick = function () { go(i); auto(); }; });
    auto();
  }

  // ---------- Category carousel (infinite loop) ----------
  document.querySelectorAll('.carousel').forEach(function (car) {
    var track = car.querySelector('.carousel-track');
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (it) { track.appendChild(it.cloneNode(true)); });
    var idx = 0, n = items.length;
    var step = function () {
      var first = track.children[0];
      return first.getBoundingClientRect().width + 20;
    };
    var move = function (anim) {
      track.style.transition = anim ? 'transform .5s ease' : 'none';
      track.style.transform = 'translateX(' + (-idx * step()) + 'px)';
    };
    var next = function () {
      idx++;
      move(true);
      if (idx >= n) setTimeout(function () { idx = 0; move(false); }, 520);
    };
    var prev = function () {
      if (idx <= 0) { idx = n; move(false); track.offsetWidth; }
      idx--;
      move(true);
    };
    car.querySelector('.next').onclick = function () { next(); restart(); };
    car.querySelector('.prev').onclick = function () { prev(); restart(); };
    var t;
    var restart = function () { clearInterval(t); t = setInterval(next, 3000); };
    window.addEventListener('resize', function () { move(false); });
    restart();
  });

  // ---------- Mobile nav ----------
  var nav = document.querySelector('.main-nav');
  var toggle = document.querySelector('.menu-toggle');
  if (nav && toggle) {
    var close = function () { nav.classList.remove('open'); };
    toggle.onclick = function () { nav.classList.add('open'); };
    nav.querySelector('.nav-close').onclick = close;
    nav.querySelector('.nav-backdrop').onclick = close;
  }

  // ---------- Scroll to top ----------
  var top = document.querySelector('.to-top');
  window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 100); });
  top.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  // ---------- Catalogue popup ----------
  var modal = document.getElementById('catalogue-modal');
  document.querySelectorAll('[data-open-catalogue]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); modal.classList.add('open'); });
  });
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.classList.contains('modal-close')) modal.classList.remove('open');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { modal.classList.remove('open'); var lb = document.querySelector('.lightbox'); if (lb) lb.classList.remove('open'); }
  });

  // Forms have no server behind them: FormSubmit (formsubmit.co) emails each submission to EMAIL.
  // The very first submission sends an activation email to EMAIL; click its link once to start receiving forms.
  var sendForm = function (form, subject, fields) {
    var note = form.querySelector('.form-note');
    var btn = form.querySelector('[type=submit]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity() || btn.disabled) return;
      var data = { _subject: subject(form), _template: 'table', _honey: form.elements._honey ? form.elements._honey.value : '' };
      fields.forEach(function (f) { data[f[0]] = form.elements[f[1]].value || '-'; });
      data['Page'] = location.href;
      btn.disabled = true;
      note.className = 'form-note';
      note.textContent = 'Sending...';
      fetch('https://formsubmit.co/ajax/' + EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (String(res.success) !== 'true') throw new Error(res.message);
        note.textContent = 'Thank you for your message. It has been sent.';
        form.reset();
      }).catch(function () {
        note.className = 'form-note error';
        note.textContent = 'There was an error trying to send your message. Please try later or call us.';
      }).then(function () { btn.disabled = false; });
    });
  };
  // Catalogue form: once filled, download the PDF straight away.
  var cat = document.getElementById('catalogue-form');
  if (cat) cat.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!cat.reportValidity()) return;
    var a = document.createElement('a');
    a.href = root + 'assets/catalogue/ankit-hardware-catalogue.pdf';
    a.download = 'Ankit-Hardware-Catalogue.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    cat.querySelector('.form-note').textContent = 'Thank you! Your catalogue is downloading.';
    cat.reset();
    setTimeout(function () { modal.classList.remove('open'); cat.querySelector('.form-note').textContent = ''; }, 2500);
  });
  var contact = document.getElementById('contact-form');
  if (contact) sendForm(contact, function (f) { return 'Website Enquiry: ' + f.elements.subject.value; },
    [['Full Name', 'name'], ['Phone Number', 'phone'], ['Email', 'email'], ['Subject', 'subject'], ['Message', 'message']]);

  // ---------- Product gallery ----------
  var gallery = document.querySelector('.gallery');
  if (gallery) {
    var box = gallery.querySelector('.main-img');
    var main = box.querySelector('img');
    gallery.querySelectorAll('.thumbs img').forEach(function (t) {
      t.onclick = function () {
        main.src = t.src;
        main.setAttribute('data-zoom', t.getAttribute('data-zoom'));
        gallery.querySelectorAll('.thumbs img').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
      };
    });

    // Hover zoom: a larger copy follows the cursor inside the image box (like WooCommerce).
    var zoom = document.createElement('img');
    zoom.className = 'zoom-img';
    zoom.alt = '';
    box.appendChild(zoom);
    var lastX = 0, lastY = 0, over = false;
    var place = function () {
      if (!over) return;
      var r = box.getBoundingClientRect();
      if (!zoom.naturalWidth) return;
      // Small source images are scaled up so every product still zooms at least 2x.
      var zw = Math.max(zoom.naturalWidth, r.width * 2);
      var zh = zw * zoom.naturalHeight / zoom.naturalWidth;
      zoom.style.width = zw + 'px';
      var dx = Math.min(Math.max((lastX - r.left) / r.width, 0), 1);
      var dy = Math.min(Math.max((lastY - r.top) / r.height, 0), 1);
      zoom.style.left = -dx * (zw - r.width) + 'px';
      zoom.style.top = -dy * (zh - r.height) + 'px';
      box.classList.add('zooming');
    };
    zoom.onload = place;
    box.addEventListener('mouseenter', function (e) {
      over = true; lastX = e.clientX; lastY = e.clientY;
      var src = main.getAttribute('data-zoom') || main.src;
      if (zoom.getAttribute('src') !== src) zoom.src = src; else place();
    });
    box.addEventListener('mousemove', function (e) { lastX = e.clientX; lastY = e.clientY; if (zoom.complete) place(); });
    box.addEventListener('mouseleave', function () { over = false; box.classList.remove('zooming'); });

    var lb = document.querySelector('.lightbox');
    box.onclick = function () { lb.querySelector('img').src = main.getAttribute('data-zoom') || main.src; lb.classList.add('open'); };
    lb.onclick = function () { lb.classList.remove('open'); };
  }

  // ---------- Search results ----------
  var results = document.getElementById('search-results');
  if (results && window.SEARCH_INDEX) {
    var q = (new URLSearchParams(location.search).get('s') || '').trim();
    document.querySelectorAll('.search-form input').forEach(function (i) { i.value = q; });
    document.getElementById('search-title').textContent = 'Search results for: ' + q;
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = window.SEARCH_INDEX.filter(function (p) {
      var hay = (p.n + ' ' + p.c).toLowerCase();
      return words.length && words.every(function (w) { return hay.indexOf(w) > -1; });
    });
    if (!hits.length) {
      results.outerHTML = '<p class="search-empty">Nothing found. Please try again with some different keywords.</p>';
    } else {
      var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      results.innerHTML = hits.map(function (p) {
        var url = root + 'product/' + p.s + '/' + (location.protocol === 'file:' ? 'index.html' : '');
        return '<div class="product-card"><a class="thumb" href="' + url + '"><img loading="lazy" src="' + root + p.i + '" alt="' + esc(p.n) + '"></a>' +
          '<h3><a href="' + url + '">' + esc(p.n) + '</a></h3><a class="btn-pill" href="' + url + '">View Details</a></div>';
      }).join('');
    }
  }
})();
