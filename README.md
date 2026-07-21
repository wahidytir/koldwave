# KOLDWAVE.dz

Y2K streetwear, fashion & accessories — designed in Algeria, shipped to all 58 wilayas with cash on delivery.

A fully static, dependency-free storefront. No build step, no framework — just HTML, CSS and vanilla JS (plus a bundled copy of [anime.js](https://animejs.com) v3.2.2 for motion).

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home — hero, categories, featured drop, piece of the week |
| `shop.html` | Full product grid with category filters (`?cat=`) and search (`?q=`) |
| `lookbook.html` | SS26 editorial lookbook |
| `about.html` | Brand story, stats, customer reviews |
| `contact.html` | Contact details + message form |
| `shipping.html` | Yalidine delivery info + per-wilaya rate table |
| `returns.html` | Returns & exchanges policy |
| `size-guide.html` | Measurement tables |
| `track.html` | Order tracking |
| `stores.html` | Pickup / stores info |
| `careers.html` | Open roles |
| `checkout.html` | Cash-on-delivery checkout (wilaya → commune → stop desk / home) |
| `404.html` | Not-found page |

## Structure

```
css/styles.css     — all styling (dark Y2K chrome theme, responsive to 360px)
js/data.js         — product catalog, lookbook, reviews, shipping rates
js/dz-data.js      — all 58 Algerian wilayas + communes (checkout & shipping pages)
js/anime.min.js    — anime.js v3.2.2 (MIT), bundled
js/main.js         — shared site script; features self-activate per page
assets/            — logos + favicon
legacy/            — the original single-file version of the site
```

Cart, wishlist, drop countdown and saved delivery details persist in `localStorage`, so they follow the visitor across pages and visits.

## Run locally

```
node serve.js          # http://localhost:8613
node serve.js 8080     # any port
```

Or use any static file server — there is nothing to build.

## Deploy

The site is fully static and uses relative paths, so it works on GitHub Pages (including project pages under a subpath), Netlify, Vercel, or any static host as-is.
