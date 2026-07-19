# GeoLocator

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Status](https://img.shields.io/badge/status-experimental-orange?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

> Drop a photo. AI tells you where it was taken.

Built with Next.js 15, powered by OpenRouter AI vision models. Analyzes any image and returns the probable country, city/region, confidence level, and visual clues — with an interactive globe that zooms into the detected location.

---

## Features

- **Drag & drop** or click to upload — JPG, PNG, WEBP, GIF
- **AI-powered analysis** via OpenRouter vision models
- Returns **country**, **city/region**, **confidence level**, and **visual clues**
- **Monument recognition** — identifies landmarks (Eiffel Tower, Big Ben…)
- **Interactive 3D globe** that flies to the detected location
- **Open in Google Maps** — one click to see the exact spot (city/monument only)
- **Country flag** displayed alongside the result
- **Progress bar** during analysis
- **Auto retry** on failure
- Clean dark UI, no signup required

---

## Stack

| | |
|---|---|
| [Next.js 15](https://nextjs.org) | App Router, API Routes |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [MapLibre GL](https://maplibre.org) | Interactive globe |
| [OpenRouter](https://openrouter.ai) | AI vision API |
| [Nominatim](https://nominatim.org) | Free geocoding |

---

## Getting started

**1. Clone and install**

```bash
git clone https://github.com/your-username/photo-geolocator
cd photo-geolocator
npm install
```

**2. Add your API key**

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

Get a free key at [openrouter.ai](https://openrouter.ai).

**3. Run**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
├── app/
│   ├── api/geolocate/route.ts   # AI analysis endpoint
│   ├── page.tsx                  # Main page
│   └── globals.css
├── components/
│   ├── DropZone.tsx              # Drag & drop upload
│   ├── GlobeView.tsx             # MapLibre GL globe
│   └── ResultCard.tsx            # Analysis results
└── types/
    └── index.ts
```

---

## Disclaimer

> **This is an experimental project built for learning purposes.**
> Results may be inaccurate, features may break, and the AI model can be wrong — especially with free-tier vision models. Do not use this for anything critical.

## Notes

- API key is server-side only — never exposed to the client
- Images are sent as base64 in the POST body — no file storage
- Geocoding via OpenStreetMap Nominatim — no API key needed

