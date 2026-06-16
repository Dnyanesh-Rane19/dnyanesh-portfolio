# Dnyanesh Rane — Portfolio v2.0
Supply Chain & Procurement Professional

## Quick Start

```bash
npm install
npm run dev        # opens at http://localhost:3000
```

## Build & Deploy

```bash
npm run build      # production build → /dist
npm run preview    # preview the production build
```

## Deploy to Vercel (zero config)

1. Push this folder to a GitHub repository
2. Go to vercel.com → New Project → import the repo
3. Vercel auto-detects Vite — click **Deploy**
4. `vercel.json` handles SPA routing automatically

## Checklist before going live

- [ ] **Resume PDF** — place at `public/Dnyanesh_Rane_Resume.pdf`
  - The "Download Resume" button links to this file automatically
- [ ] **GitHub username** — update `GITHUB` constant in `src/App.jsx` (line 14)
- [ ] **Google Analytics** — uncomment the GA block in `index.html` and replace `G-XXXXXXXXXX`
  - Create a free account at analytics.google.com → get your Measurement ID
- [ ] **Custom domain** — add in Vercel project settings under "Domains"
- [ ] **OG image** — add `public/og-image.jpg` (1200×630px) for social previews

## File structure

```
dnyanesh-portfolio/
├── index.html              ← SEO, JSON-LD, GA placeholder, favicons
├── package.json            ← React 18 + Vite 5 (minimal deps)
├── vite.config.js          ← esbuild minification, code splitting
├── vercel.json             ← SPA routing for Vercel
├── public/
│   ├── favicon.svg         ← DR monogram with gradient ring
│   ├── apple-touch-icon.svg
│   ├── site.webmanifest
│   └── Dnyanesh_Rane_Resume.pdf   ← ADD YOUR RESUME HERE
└── src/
    ├── main.jsx            ← React entry point
    ├── headshot.js         ← Professional photo (base64 embedded)
    └── App.jsx             ← Complete portfolio (single file)
```

## Customization

All personal data lives at the top of `src/App.jsx` in clearly labeled sections:

| Constant | What to change |
|----------|---------------|
| `EMAIL`  | Your email address |
| `PHONE`  | Your phone number |
| `LINKEDIN` | Your LinkedIn URL |
| `GITHUB` | Your GitHub profile URL |
| `RESUME` | Path to your PDF (default: `/Dnyanesh_Rane_Resume.pdf`) |
| `EXPERIENCES` | Add/edit job entries |
| `PROJECTS` | Add/edit project case studies |
| `SKILLS` | Adjust skill names and percentages |
| `CERTS` | Add/edit education and certifications |

## Tech stack

- React 18 — UI framework
- Vite 5 — build tool (fast HMR in dev, esbuild minification in prod)
- Pure inline styles — no CSS framework dependency, no extra bundle weight
- HTML5 Canvas — live supply chain network animation
- IntersectionObserver — scroll-triggered animations
- Base64 headshot — zero additional network requests for the photo

## Performance notes

- No external UI library dependencies (Tailwind, MUI, etc.)
- Single JS bundle split into vendor chunk (React) + app chunk
- Font loaded via Google Fonts with `display=swap`
- All animations respect `prefers-reduced-motion` via CSS
- Images use explicit `width` and `height` to prevent layout shift
