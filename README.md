# Ankit Hardware – Static Website

A copy of https://ankithardware.com (WordPress) rebuilt as a plain HTML/CSS/JS site. It needs no WordPress, PHP or database.

## What's included
- Home, About Us, Our Products, Contact Us
- 15 category pages (with pagination, 12 products per page)
- 282 product pages (details table, gallery, Enquire Now, related products)
- Product search (`/search/?s=...`)
- Download Catalogue popup, fixed left sidebar, mobile menu
- All images saved locally in `assets/images/` (1024px copies for hover zoom in `assets/images/products/zoom/`)

## Run locally
```bash
node src/serve.js
```
Open http://localhost:8080

## Edit products / regenerate pages
Product and category data live in `src/data.json`. Page templates live in `src/build.js`.
After editing either one, run:
```bash
node src/build.js
```

## Deploy
Upload the whole folder **except `src/` and `.claude/`** to any static host
(Hostinger File Manager → `public_html`, Netlify, Vercel, GitHub Pages, etc.).

## Note on forms
A static site has no server, so the Contact Us enquiry form is sent through FormSubmit
(https://formsubmit.co, free, no account) to ankit.shah108@gmail.com (`EMAIL` in `assets/js/main.js`).
The very first submission sends an activation email to that address: click its link once and
every enquiry after that arrives as an email. The Catalogue popup downloads
`assets/catalogue/ankit-hardware-catalogue.pdf` as soon as it is submitted (replace that file to
update the catalogue); the details typed into it are not sent anywhere. To receive form details
directly, connect a form service (Formspree, Web3Forms, etc.) in `assets/js/main.js`.
