// Generates every page of the static site from src/data.json.
// Usage: node src/build.js
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const { categories, products, site } = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
const PER_PAGE = 12;
const EMAIL = 'ankit.shah108@gmail.com';
const PHONE = '+91 - 8591483389';
const ADDRESS = 'Unit No. 306, 3rd Floor, Diamond Industrial Estate CHSL, Ketkipada Road, Dahisar, Mumbai - 400068';
const SOCIAL = {
  fb: 'https://www.facebook.com/profile.php?id=61563098851492&mibextid=ZbWKwL',
  ig: 'https://www.instagram.com/ankit.hardware?igsh=bTZmNnJhYXFnbHp6',
  yt: 'https://youtube.com/@ankit.hardware?si=oqAc0YOJv2U4fcSB',
};

// Menu labels exactly as on the live site, mapped to category slugs.
const MENU = [
  ['3/4" SERIES', '3-4-series-roller', 'ankit-2-768x768.png'],
  ['1" SERIES (25 MM)', '1-series-roller-25mm', 'ankit-15-768x768.png'],
  ['1 1/4" SERIES', '1-1-4-series', 'ankit-3-768x768.png'],
  ['1 1/2" SERIES (30 MM SERIES)', '1-1-2-series-30-mm-series', 'ankit-4-768x768.png'],
  ['DOUBLE GLASS SERIES', 'double-glass-series', 'Untitled-design-37.png', 'Untitled-design-3.jpg'],
  ['SLIDING WINDOW LOCKS', 'sliding-window-locks', 'ankit-5-768x768.png'],
  ['22 MM SERIES', '22-mm-series', 'ankit-6-768x768.png'],
  ['27 MM SERIES', '27mmseries-accessories', 'ankit-7-768x768.png'],
  ['35 MM SERIES', '35mm-series', 'ankit-8-768x768.png'],
  ['37 MM SERIES', '37-mm-series', 'ankit-9.png'],
  ['40 MM SERIES', '40-mm-series', 'ankit-10-768x768.png'],
  ['NYLON WHEEL SERIES', 'nylon-wheel-series', 'ankit-11-768x768.png'],
  ['VIKALP SERIES', 'vikalp-series', 'ankit-12-768x768.png'],
  ['NEW PRODUCTS', 'new-products'],
];
// Homepage carousel starts at 37 MM like the original.
const CAROUSEL = [9, 10, 11, 12, 0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => MENU[i]);
const HOME_SECTIONS = [
  ['3/4" SERIES ROLLERS', ['9045', '9044', '9042', '9041', '9040', '3-4-series-roller-9039'], true],
  ['1" SERIES (25 MM)', ['9062', '9061', '1-series-roller-9060-608', '1-series-roller-9059-608', '1-series-roller-9058-608', '1-series-roller-9057-608'], false],
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bySlug = Object.fromEntries(products.map((p) => [p.slug, p]));
const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));
const natural = (a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
const inCat = (slug) => products.filter((p) => p.categories.includes(slug)).sort(natural);

// ---------- Icons (inline SVG) ----------
const ICON = {
  chevL: '<svg viewBox="0 0 1000 1000"><path d="M646 125C629 125 613 133 604 142L308 442C296 454 292 471 292 487 292 504 296 521 308 533L604 854C617 867 629 875 646 875 663 875 679 871 692 858 704 846 713 829 713 812 713 796 708 779 692 767L438 487 692 225C700 217 708 204 708 187 708 171 704 154 692 142 675 129 663 125 646 125Z"/></svg>',
  chevR: '<svg viewBox="0 0 1000 1000"><path d="M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z"/></svg>',
  arrowR: '<svg viewBox="0 0 448 512"><path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"/></svg>',
  up: '<svg viewBox="0 0 320 512"><path d="M177 159.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 255.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 329.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1z"/></svg>',
  phone: '<svg viewBox="0 0 512 512"><path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/></svg>',
  mail: '<svg viewBox="0 0 512 512"><path d="M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"/></svg>',
  mailO: '<svg viewBox="0 0 512 512"><path d="M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm0 48v40.805c-22.422 18.259-58.168 46.651-134.587 106.49-16.841 13.247-50.201 45.072-73.413 44.701-23.208.375-56.579-31.459-73.413-44.701C106.18 199.465 70.425 171.067 48 152.805V112h416zM48 400V214.398c22.914 18.251 55.409 43.862 104.938 82.646 21.857 17.205 60.134 55.186 103.062 54.955 42.717.231 80.509-37.199 103.053-54.947 49.528-38.783 82.032-64.401 104.947-82.653V400H48z"/></svg>',
  pin: '<svg viewBox="0 0 384 512"><path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/></svg>',
  dot: '<svg viewBox="0 0 512 512"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"/></svg>',
  fb: '<svg viewBox="0 0 320 512"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>',
  ig: '<svg viewBox="0 0 448 512"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>',
  yt: '<svg viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="10" cy="10" r="6.5"/><path d="M15 15l6 6"/></svg>',
  // Line icons for the orange features strip
  handshake: '<svg viewBox="0 0 48 48"><path d="M2 14h7l4 3M46 14h-7l-9-3-9 5c-1.5 1-1.5 3 0 4s3 1 4.5 0l4-2 10 9"/><path d="M9 14v16l3 0 8 7c1 1 2.5 1 3.5 0s1-2.5 0-3.5M39 14v16h-2M20 37l2 1.5c1 1 2.5 1 3.5 0s1-2.5 0-3.5l-1-1M24 37.5l1 .8c1 1 2.5 1 3.5 0s1-2.5 0-3.5M29 38c1 1 2.5 1 3.5 0s1-2.5 0-3.5l-5-5M33 34l1 1c1 1 2.5 1 3.5 0s1-2.5 0-3.5l-8-8"/></svg>',
  plant: '<svg viewBox="0 0 48 48"><path d="M24 44V22M24 30c-8 0-13-5-13-13 8 0 13 5 13 13zM24 24c0-8 5-14 14-14 0 9-6 14-14 14z"/><path d="M14 44h20"/></svg>',
  headset: '<svg viewBox="0 0 48 48"><path d="M8 28v-6a16 16 0 0 1 32 0v6"/><rect x="5" y="26" width="7" height="12" rx="2"/><rect x="36" y="26" width="7" height="12" rx="2"/><path d="M40 38c0 4-4 6-10 6h-4"/><circle cx="24" cy="44" r="2"/></svg>',
  support: '<svg viewBox="0 0 48 48"><circle cx="24" cy="16" r="8"/><path d="M8 44c0-9 7-15 16-15s16 6 16 15"/><path d="M14 16a10 10 0 0 1 20 0M34 16v4h-4"/><path d="M19 37l3 3 7-7"/></svg>',
};

// ---------- Layout ----------
function layout({ title, root, active, body, extraHead = '', scripts = '' }) {
  const L = (p) => root + p;
  const menuItem = (href, label, key) => `<li><a href="${L(href)}"${active === key ? ' class="active"' : ''}>${label}</a></li>`;
  const catLinks = (cls) => MENU.map(([label, slug]) =>
    `<li><a href="${L(`product-category/${slug}/`)}"${active === 'cat:' + slug ? ' class="active"' : ''}${cls || ''}>${esc(label)}</a></li>`).join('\n');
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="Ankit Hardware – manufacturer of Sliding Roller Wheels, Sliding Window Locks and System Window Accessories since 1986. Mumbai, India.">
<link rel="icon" href="${L(site['cropped-ankit-hardware-logo2.png-2-32x32.png'])}" sizes="32x32">
<link rel="icon" href="${L(site['cropped-ankit-hardware-logo2.png-2-192x192.png'])}" sizes="192x192">
<link rel="apple-touch-icon" href="${L(site['cropped-ankit-hardware-logo2.png-2-180x180.png'])}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;800;900&family=Hind+Vadodara:wght@500&family=Open+Sans:wght@400;600&family=Roboto+Slab:wght@400&family=Roboto:wght@400;500;700&display=swap">
<link rel="stylesheet" href="${L('assets/css/style.css')}">
${extraHead}</head>
<body data-root="${root}">

<aside class="sidebar">
  <div class="sidebar-inner">
    <h5>Our Products</h5>
    <ul>
${catLinks()}
    </ul>
  </div>
</aside>

<div class="page">
  <header>
    <div class="site-header">
      <a class="logo" href="${L('')}"><img src="${L(site['ankit-hardware-logo2.png-2-150x150.png'])}" alt="Ankit Hardware" width="148" height="148"></a>
      <form class="search-form" action="${L('search/')}" method="get" role="search">
        <input type="search" name="s" placeholder="Search Products" aria-label="Search">
        <button type="submit">Search</button>
      </form>
      <div class="header-spacer"></div>
      <div class="header-cta"><a class="btn-catalogue" href="#" data-open-catalogue>Download Catalogue</a></div>
      <button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
    <nav class="main-nav" aria-label="menu">
      <div class="nav-backdrop"></div>
      <button class="nav-close" aria-label="Close menu">&times;</button>
      <ul>
        ${menuItem('', 'Home', 'home')}
        ${menuItem('about-us/', 'About Us', 'about')}
        ${menuItem('our-products/', 'Our Products', 'products')}
        ${menuItem('contact-us/', 'Contact Us', 'contact')}
${catLinks(' class="mobile-only"').replace(/<li>/g, '<li class="mobile-only">')}
      </ul>
    </nav>
  </header>

  <main>
${body}
  </main>

  <footer>
    <div class="features">
      <div class="feature">${ICON.handshake}<span>Trusted Quality</span></div>
      <div class="feature">${ICON.plant}<span>Authentic Brand</span></div>
      <div class="feature">${ICON.headset}<span>24/7 Support</span></div>
      <div class="feature">${ICON.support}<span>Customised Products</span></div>
    </div>
    <div class="site-footer">
      <div class="footer-grid">
        <div class="footer-about">
          <img src="${L(site['ankit-hardware-logo2.png-2-150x150.png'])}" alt="Ankit Hardware" width="150" height="150" loading="lazy">
          <p>Crafting excellence for 35+ years. Elevating every window experience with Artisanal Sliding Window Accessories of the finest quality.</p>
        </div>
        <div>
          <h4>Useful Links</h4>
          <ul class="footer-links">
            <li><a href="${L('')}">${ICON.arrowR}<span>Home</span></a></li>
            <li><a href="${L('about-us/')}">${ICON.arrowR}<span>About Us</span></a></li>
            <li><a href="${L('our-products/')}">${ICON.arrowR}<span>Our Products</span></a></li>
            <li><a href="${L('contact-us/')}">${ICON.arrowR}<span>Contact Us</span></a></li>
          </ul>
        </div>
        <div>
          <h4>Products List</h4>
          <ul class="footer-links footer-products">
${MENU.slice(0, 13).map(([label, slug]) => `            <li><a href="${L(`product-category/${slug}/`)}">${ICON.arrowR}<span>${esc(label)}</span></a></li>`).join('\n')}
          </ul>
        </div>
        <div>
          <h4>Subscribe Now</h4>
          <a class="footer-mail" href="mailto:${EMAIL}">${ICON.mailO}<span>${EMAIL}</span></a>
          <div class="socials">
            <a class="fb" href="${esc(SOCIAL.fb)}" target="_blank" rel="noopener" aria-label="Facebook">${ICON.fb}</a>
            <a class="ig" href="${esc(SOCIAL.ig)}" target="_blank" rel="noopener" aria-label="Instagram">${ICON.ig}</a>
            <a class="yt" href="${esc(SOCIAL.yt)}" target="_blank" rel="noopener" aria-label="Youtube">${ICON.yt}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <p>© <strong>Ankit Hardware 2025</strong>, All Right Reserved. Design &amp; Developed by <a href="https://greensmedia.in/" target="_blank" rel="noopener">Greens Media.</a></p>
    </div>
  </footer>
</div>

<button class="to-top" aria-label="Scroll to top">${ICON.up}</button>

<div class="modal" id="catalogue-modal" role="dialog" aria-modal="true" aria-label="Download Catalogue">
  <div class="modal-box">
    <button class="modal-close" aria-label="Close">&times;</button>
    <form id="catalogue-form">
      <input type="text" name="name" placeholder="Name">
      <input type="email" name="email" placeholder="Email" required>
      <input type="number" name="phone" placeholder="Contact No">
      <input type="number" name="pincode" placeholder="Pincode">
      <button type="submit">Send</button>
      <p class="form-note"></p>
    </form>
  </div>
</div>

${scripts}<script src="${L('assets/js/main.js')}"></script>
</body>
</html>
`;
}

function card(p, root) {
  const url = `${root}product/${p.slug}/`;
  const img = p.images[0];
  return `<div class="product-card">
  <a class="thumb" href="${url}"><img loading="lazy" src="${root}${img.src}" alt="${esc(img.alt)}"></a>
  <h3><a href="${url}">${esc(p.name)}</a></h3>
  <a class="btn-pill" href="${url}">View Details</a>
</div>`;
}

function write(rel, html) {
  const file = path.join(ROOT, rel, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
}
const depth = (rel) => (rel ? '../'.repeat(rel.split('/').filter(Boolean).length) : '');

// ---------- Home ----------
{
  const root = '';
  const slides = ['Untitled-design-9-1-1.jpg', 'Untitled-design-10-1.jpg', 'Untitled-design-11-1.jpg'].map((f, i) => `
      <div class="slide${i ? '' : ' active'}" style="background-image:url('${site[f]}')">
        <div class="slide-content">
          <h2>Ankit HardWare</h2>
          <p>Artisanal<br>Accessories<br>for Window Artists</p>
          <a class="slide-btn" href="our-products/">Know More</a>
        </div>
      </div>`).join('');
  const carousel = CAROUSEL.map(([label, slug, img, homeImg]) => `
          <div class="carousel-item"><a href="product-category/${slug}/" aria-label="${esc(label)}"><div class="img" style="background-image:url('${site[homeImg || img]}')"></div><div class="overlay">${esc(label)}</div></a></div>`).join('');
  const sections = HOME_SECTIONS.map(([title, slugs, tinted]) => `
    <section class="product-section${tinted ? ' tinted' : ''}">
      <div class="container">
        <h2 class="section-title">${esc(title)}</h2>
        <div class="product-grid">
${slugs.map((s) => card(bySlug[s], root)).join('\n')}
        </div>
      </div>
    </section>`).join('');
  const body = `
    <section class="hero">${slides}
      <button class="slider-arrow prev" aria-label="Previous slide">${ICON.chevL}</button>
      <button class="slider-arrow next" aria-label="Next slide">${ICON.chevR}</button>
      <div class="hero-dots"><button class="active" aria-label="Slide 1"></button><button aria-label="Slide 2"></button><button aria-label="Slide 3"></button></div>
    </section>

    <section class="intro">
      <div class="container">
        <h2>Our Products</h2>
        <hr class="divider">
        <p class="lead">Being a client-centric organization, we are engaged in manufacturing and supplying a commendable gamut of Sliding Roller Wheel and Sliding Window Locks. All our products are manufactured in our in-housed facilities with premier-grade components and required raw material. We tested these products on different quality parameters so as to ensure their suitability for industrial as well as commercial applications. Offered products are appreciated by the patrons for their excellent design, perfect fitting, prolonged service life and quality in accordance with the international standards. Our range is detailed as follows:</p>
        <div class="carousel">
          <div class="carousel-viewport"><div class="carousel-track">${carousel}
          </div></div>
          <button class="slider-arrow prev" aria-label="Previous">${ICON.chevL}</button>
          <button class="slider-arrow next" aria-label="Next">${ICON.chevR}</button>
        </div>
      </div>
    </section>
${sections}`;
  write('', layout({ title: 'Ankit Hardware', root, active: 'home', body }));
}

// ---------- About ----------
{
  const team = ['Engineers', 'Managers', 'Procuring agents', 'Quality analysts', 'Sales and marketing personnel', 'Skilled &amp; semi-skilled laborers', 'Administration personnel', 'Distributor Network'];
  const body = `
    <div class="container-narrow text-page">
      <h2>Profile</h2>
      <div class="body-text"><p>Incorporated in the year 1986, we, “<strong>Ankit Hardware</strong>”, are a noted manufacturer of an exemplary array of System Window Accessories. In order to meet the varied industry requirements, we are offering Conventional Window Accessories and System Window (Domal Series) Accessories. All these products are engineered from our world-class in-house manufacturing facility. We manufactured these products with ultra-grade raw material sourced from the well-established vendors of the market. Our procuring agents conducted comprehensive market research before sourcing the raw material. Therefore, we have been able to manufacture the offered products as per the industry requirements. Advanced technologies are implemented for manufacturing these products so as to ensure their prolonged service life, high efficiency, and suitability for industrial as well as domestic applications. These products are acclaimed by the end users for their high strength, safety, perfect finish, corrosion resistance and various other special features.</p></div>
      <div class="body-text"><p>Supported by a team of diligent professionals, we have been able to set up milestones in our domain. We facilitate our professionals all the advanced tools and flexibility to work in a highly productive environment. For this, we have established a state of the art infrastructure which is well-equipped with latest machines, tools, and technologies. It helps our professionals to manufacture the offered product line in accordance with the international quality standards. To ensure the quality, we tested these products on various parameters. Owing to the quality, our products prove to be highly valuable for the clients to meet their varied requirements. These products are delivered to the clients within given time-frame with the help of our diligent distribution network personnel. It helped us to save their time and achieve optimum client-satisfaction.</p></div>
      <div class="body-text"><p>Under the able guidance of our mentor, “<strong>Mr. Jayantilal Shah</strong>”, we have been able to achieve our business goals within a very short period of time. He is highly experienced, talented and possesses detailed knowledge of every ins &amp; outs of our business. Owing to his excellent managerial skills, we have been able to secure a reputed position in the market.</p></div>
      <h2>Our Team</h2>
      <div class="body-text"><p>We are supported by a team of multi-talented professionals which enables us to manufacture Sliding Window Accessories. Our team is highly adroit to run our business operations in a timely manner so that we fulfill our commitments with the customers. Each member of our team possesses vast industry experience and is a maestro in his respective field. We conduct various training sessions throughout the year so as to keep our professionals up to date with the latest technologies.</p></div>
      <ul class="icon-list">
${team.map((t) => `        <li>${ICON.dot}<span>${t}</span></li>`).join('\n')}
      </ul>
    </div>`;
  write('about-us', layout({ title: 'About Us – Ankit Hardware', root: '../', active: 'about', body }));
}

// ---------- Our Products ----------
{
  const root = '../';
  const cards = MENU.slice(0, 13).map(([label, slug, img]) => {
    const url = `${root}product-category/${slug}/`;
    return `<div class="cat-card">
  <a class="thumb" href="${url}"><img loading="lazy" src="${root}${site[img]}" alt="${esc(label)}"></a>
  <h2>${esc(label)}</h2>
  <a class="btn-pill" href="${url}">View All Products</a>
</div>`;
  }).join('\n');
  const body = `
    <div class="container-narrow wide">
      <h1 class="page-title-hind" style="text-align:center;margin-bottom:50px">Our Products</h1>
      <div class="cat-grid">
${cards}
      </div>
    </div>`;
  write('our-products', layout({ title: 'Our Products – Ankit Hardware', root, active: 'products', body }));
}

// ---------- Contact ----------
{
  const body = `
    <div class="container-narrow" style="padding-top:0;padding-bottom:0">
      <div class="contact-wrap">
        <div class="contact-info">
          <h2>Drop us a Message</h2>
          <h3>We are here to answer your question. Please leave us a message.</h3>
          <div class="info-box"><span class="icon">${ICON.phone}</span><div><h4>Call Us</h4><a href="tel:8591483389">${PHONE}</a></div></div>
          <div class="info-box"><span class="icon">${ICON.mail}</span><div><h4>Mail Us</h4><a href="mailto:${EMAIL}">${EMAIL}</a></div></div>
          <div class="info-box"><span class="icon">${ICON.pin}</span><div><h4>Location</h4><p>${ADDRESS}</p></div></div>
        </div>
        <form class="contact-form" id="contact-form">
          <div class="form-row">
            <input type="text" name="name" placeholder="Full Name" required>
            <input type="tel" name="phone" placeholder="Phone Number" required>
          </div>
          <div class="form-row">
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="subject" placeholder="Subject" required>
          </div>
          <textarea name="message" placeholder="Message"></textarea>
          <input type="text" name="_honey" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button type="submit">Submit</button>
          <p class="form-note"></p>
        </form>
      </div>
    </div>`;
  write('contact-us', layout({ title: 'Contact Us – Ankit Hardware', root: '../', active: 'contact', body }));
}

// ---------- Category archives (paginated) ----------
let pageCount = 0;
for (const cat of categories) {
  const items = inCat(cat.slug);
  const pages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  for (let n = 1; n <= pages; n++) {
    const rel = `product-category/${cat.slug}${n > 1 ? `/page/${n}` : ''}`;
    const root = depth(rel);
    const base = `${root}product-category/${cat.slug}/`;
    const pageUrl = (k) => (k === 1 ? base : `${base}page/${k}/`);
    let pager = '';
    if (pages > 1) {
      pager = `<nav class="pagination" aria-label="Pagination">
  ${n > 1 ? `<a href="${pageUrl(n - 1)}">Previous</a>` : '<span class="disabled">Previous</span>'}
  ${Array.from({ length: pages }, (_, i) => i + 1).map((k) => (k === n ? `<span class="current" aria-current="page">${k}</span>` : `<a href="${pageUrl(k)}">${k}</a>`)).join('\n  ')}
  ${n < pages ? `<a href="${pageUrl(n + 1)}">Next</a>` : '<span class="disabled">Next</span>'}
</nav>`;
    }
    const body = `
    <div class="container-narrow archive">
      <h1 class="archive-title">Category: ${esc(cat.name)}</h1>
      <div class="product-grid">
${items.slice((n - 1) * PER_PAGE, n * PER_PAGE).map((p) => card(p, root)).join('\n')}
      </div>
      ${pager}
    </div>`;
    write(rel, layout({ title: `${cat.name} Archives${n > 1 ? ` – Page ${n}` : ''} – Ankit Hardware`, root, active: 'cat:' + cat.slug, body }));
    pageCount++;
  }
}

// ---------- Single products ----------
for (const p of products) {
  const rel = `product/${p.slug}`;
  const root = depth(rel);
  const cat = catBySlug[p.categories[0]];
  const siblings = inCat(cat.slug).filter((x) => x.slug !== p.slug);
  const start = siblings.length ? (p.id * 7) % siblings.length : 0;
  const related = [0, 1, 2].map((i) => siblings[(start + i) % siblings.length]).filter((x, i, a) => x && a.indexOf(x) === i);
  // Larger copy used for hover zoom and the lightbox (falls back to the normal image)
  const zoom = (src) => {
    const z = 'assets/images/products/zoom/' + path.basename(src);
    return root + (fs.existsSync(path.join(ROOT, z)) ? z : src);
  };
  const thumbs = p.images.length > 1
    ? `<div class="thumbs">${p.images.map((im, i) => `<img src="${root}${im.src}" data-zoom="${zoom(im.src)}" alt="${esc(im.alt)}"${i ? '' : ' class="active"'} loading="lazy">`).join('')}</div>`
    : '';
  const body = `
    <div class="container-narrow wide" style="padding-top:0">
      <nav class="breadcrumb"><a href="${root}">Home</a><span class="sep">&gt;</span><a href="${root}product-category/${cat.slug}/">${esc(cat.name)}</a><span class="sep">&gt;</span>${esc(p.name)}</nav>
      <div class="single">
        <div class="gallery">
          <div class="main-img"><button class="zoom-trigger" aria-label="View full-screen image">${ICON.search}</button><img src="${root}${p.images[0].src}" data-zoom="${zoom(p.images[0].src)}" alt="${esc(p.images[0].alt)}"></div>
          ${thumbs}
        </div>
        <div>
          <h1>${esc(p.name)}</h1>
          <div class="product-content">${p.description.replace(/\{\{root\}\}/g, root)}</div>
          <a class="btn-enquire" href="${root}contact-us/">Enquire Now</a>
        </div>
      </div>
      ${related.length ? `<section class="related">
        <h2>Related Products</h2>
        <div class="product-grid">
${related.map((r) => card(r, root)).join('\n')}
        </div>
      </section>` : ''}
    </div>
    <div class="lightbox"><img alt=""></div>`;
  write(rel, layout({ title: `${p.name} – Ankit Hardware`, root, active: 'cat:' + cat.slug, body }));
}

// ---------- Search ----------
{
  const index = products.map((p) => ({ s: p.slug, n: p.name, i: p.images[0].src, c: p.categories.map((c) => catBySlug[c]?.name || '').join(' ') }));
  fs.writeFileSync(path.join(ROOT, 'assets', 'js', 'search-index.js'), 'window.SEARCH_INDEX=' + JSON.stringify(index) + ';\n');
  const body = `
    <div class="container-narrow archive">
      <h1 class="archive-title" id="search-title">Search results</h1>
      <div class="product-grid" id="search-results"></div>
    </div>`;
  write('search', layout({ title: 'Search – Ankit Hardware', root: '../', active: '', body, scripts: '<script src="../assets/js/search-index.js"></script>\n' }));
}

// ---------- 404 ----------
fs.writeFileSync(path.join(ROOT, '404.html'), layout({
  title: 'Page not found – Ankit Hardware', root: '/', active: '',
  body: `<div class="container-narrow" style="text-align:center"><h1 class="page-title-hind">404</h1><p style="font-family:Heebo,sans-serif;font-size:18px;margin-top:20px">This page could not be found.</p><a class="btn-pill" href="/">Back to Home</a></div>`,
}));

console.log(`Built: home, about, products, contact, search, ${pageCount} category pages, ${products.length} product pages.`);
