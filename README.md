# Zeesha Collection — Website

**Live storefront (static demo):** https://zeeshanshaikh95.github.io/zeesha-collection/

A mobile-first storefront for **Zeesha Collection**, a Surat-based abaya house. Premium abayas, jacket abayas, embroidered pieces, burkhas, hijabs and pashmina — built around a single conversion path: browse → bag → **enquire personally** (Instagram DM, or WhatsApp once a number is configured).

The collection and photography come from the brand's own Instagram, [@zeesha.collection](https://www.instagram.com/zeesha.collection/). Prices are intentionally **"on request"** because the brand does not publish a price list (its bio says *DM for details*). Nothing is invented — the owner can add prices and a WhatsApp number in the admin panel at any time.

> The GitHub Pages build runs with `VITE_DEMO_MODE=true`, so browsing, product pages, the bag and the enquiry flow work from a bundled catalogue without an API. Admin edits, reviews moderation and analytics require the Express API + MongoDB (see Deployment).

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + Vite 6 + TypeScript, Tailwind CSS 3, React Router 6, react-helmet-async |
| Backend | Node.js + Express 4 + TypeScript, Zod validation |
| Database | MongoDB + Mongoose 8 (Atlas free tier for production) |
| Auth | JWT bearer tokens + bcrypt hashing, protected `/api/admin/*` routes |
| Security | Helmet, CORS allow-list, rate limiting, input validation, secrets via env |
| Images | Cloudinary (server-side uploads) with local-disk fallback |
| Hosting | GitHub Pages (frontend) + Render free tier (API) + MongoDB Atlas |

## Design

A distinct emerald-and-gold identity derived from the house mark, deliberately different from the reference project:

- **Palette** — deep emerald (`#073A2F`), antique gold (`#D3AE65`) and warm ivory (`#FCF9F2`)
- **Type** — Cormorant Garamond (editorial display) with Jost (UI and body)
- **Motifs** — arch-framed imagery, hairline gold rules, generous ivory space
- **Sliders** — an arch-framed editorial hero slider and a snap-scrolling "new edit" product rail

## Pages

- **Home** — hero slider, house promises, category edit, product rail, brand band, house favourites, occasion edit, story teaser, reviews (when approved), journal strip, enquiry CTA
- **Shop** — search, category filter, sort, responsive grid
- **Category** — arch hero + filtered pieces
- **Product** — gallery lightbox, variants, quantity, details, fabric & care, related pieces
- **About** — brand story and promises
- **Reviews** — approved customer notes only
- **Journal** — Instagram gallery managed from the admin
- **Contact** — Instagram DM, WhatsApp (when configured), location and how ordering works
- **Admin** — dashboard analytics, product CRUD, categories + reorder, review moderation, gallery manager, settings

## Quick start (local)

**Prerequisites:** Node 20+ and MongoDB — either a local/Atlas instance you already have, or the bundled dev database (no installation required).

```
# 1 — install
npm install

# 2 — configure the server
cp .env.example server/.env
# → edit server/.env: set MONGODB_URI, JWT_SECRET (long random string),
#   ADMIN_EMAIL and ADMIN_PASSWORD before any real deployment.

# 3 — start a database (skip if you already run MongoDB / use Atlas)
npm run dev:db

# 4 — bootstrap admin, settings and the catalogue
npm run seed                 # or: npm run seed:reset to rebuild the catalogue

# 5 — run the API and the client
npm run dev
# Client: http://localhost:5173     API: http://localhost:4000/api/health
```

`npm run dev:all` runs the dev database, API and client together in one terminal.

**Admin panel:** `http://localhost:5173/admin` → log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`. A freshly bootstrapped account must change its password before the panel becomes usable.

### Catalogue & contact defaults

The seed creates:

- 6 categories: Signature Abayas, Jacket Abayas, Embroidered Abayas, Burkhas & Naqabs, Hijabs & Dupattas, Pashmina & Shawls
- 16 pieces with names, descriptions and photography derived from the brand's own Instagram reels
- Instagram `@zeesha.collection`; WhatsApp left unset on purpose
- Prices left as **price on request**

All of it is editable in **Admin → Products / Categories / Settings**. Re-running `npm run seed` never overwrites edits.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run API + client together (concurrently) |
| `npm run dev:all` | Dev database + API + client in one command |
| `npm run dev:db` | Local dev MongoDB (data persisted in `server/.data/mongo`) |
| `npm run dev:server` / `npm run dev:client` | Run one side |
| `npm run build` | Typecheck + build both workspaces |
| `npm run typecheck` | TypeScript project-wide |
| `npm run seed` / `npm run seed:reset` | Seed / rebuild admin, settings and catalogue |
| `node server/scripts/api-smoke.mjs` | End-to-end API test (public + admin CRUD + auth) |

## Environment variables

See [.env.example](.env.example) → copied to `server/.env` (never committed):

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | Mongo connection string (local or Atlas) |
| `JWT_SECRET` | Long random signing secret |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `PUBLIC_SITE_URL` | Canonical site URL |
| `CLOUDINARY_*` | Server-side image storage (optional; local disk fallback) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First-admin bootstrap credentials |
| `VITE_API_BASE_URL` | Frontend build-time API origin (unset in demo mode) |
| `VITE_DEMO_MODE` | `true` serves the bundled catalogue (GitHub Pages) |
| `VITE_BASE` | Vite base path (`/` locally, `/zeesha-collection/` on Pages) |

## Deployment

The proven free-tier path from the reference project is reused:

1. **MongoDB Atlas** — free M0 cluster; copy the connection string into `server/.env`.
2. **Render** — New → Blueprint → this repo. `render.yaml` provisions the API (`zeesha-collection-api`), sets `AUTO_SEED=true`, and asks for `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` in the dashboard.
3. **GitHub Pages** — push to `main`. `.github/workflows/deploy-pages.yml` builds the client with `VITE_BASE=/zeesha-collection/` and `VITE_DEMO_MODE=true`, then publishes it.
4. To go live against the real API: add a repository variable `VITE_API_BASE_URL` (the Render URL), set `VITE_DEMO_MODE=false` in the workflow, and add `https://zeeshanshaikh95.github.io` to `CORS_ORIGINS`.

## Asset provenance

- **Brand mark** — the client's own Instagram profile image, used as the header, favicon and social-card mark.
- **Product & editorial photography** — frames extracted from the brand's public reels. They are compressed to WebP and committed under `client/public/images/`.
- **Copy** — written from the brand's public captions and bio. Policy lines (no exchange, no returns, no COD; delivery all over India) are the brand's own. No prices, awards or testimonials are invented.

## Licence

Private client project. All brand imagery and content belong to Zeesha Collection.
