# StadiumPilot AI

> AI-powered matchday navigation assistant for MetLife Stadium fans.  
> Educational reference only — not affiliated with FIFA or MetLife Stadium.

## Overview

StadiumPilot AI is a production-quality Generative AI application that helps fans navigate MetLife Stadium using real AI reasoning over backend tools — not a simple chatbot.

The AI uses **Gemini function-calling** to invoke routing, crowd estimation, and POI search tools, then synthesises the results into clear, step-by-step guidance.

---

## Features

| Feature | Description |
|---|---|
| AI Route Guidance | Step-by-step walking directions from gate to seat |
| Accessible Routing | Elevator-only paths for wheelchair and mobility users |
| Crowd-Aware Routing | Routes that avoid high-density concourses |
| Nearest Amenity Search | Find food, restrooms, medical, security, merchandise |
| Interactive Map | Leaflet map with route overlay and node markers |
| Nearby Transport | NJ Transit rail, bus, rideshare and parking |
| Multilingual UI | English, Spanish, French, Hindi |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| State | Zustand |
| i18n | i18next + react-i18next |
| Maps | Leaflet + react-leaflet |
| Backend | Node.js + Express 5 + TypeScript |
| AI | Google Gemini (`gemini-2.0-flash`) function-calling |
| Validation | Zod |
| Testing | Vitest (58 tests) |

---

## Project Structure

```
stadium/
├── frontend/           # React + Vite app
│   └── src/
│       ├── api/        # Axios API client
│       ├── components/ # Navbar, AIAssistant, StadiumMap, RoutePanel, CrowdPanel, AmenitiesPanel, TransportPanel
│       ├── i18n/       # en, es, fr, hi translations
│       ├── pages/      # LandingPage, DashboardPage
│       └── store/      # Zustand app state
└── backend/            # Express API
    └── src/
        ├── ai/         # Gemini provider + system prompt + tool declarations
        ├── data/       # Stadium JSON datasets
        ├── engines/    # Routing (A* / Dijkstra) + Crowd generator
        ├── routes/     # /api/ai, /api/crowd, /api/stadium
        └── tools/      # Tool handlers with Zod validation
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- A Gemini API key

### 1. Clone / open the project

```bash
# The workspace is already at c:/stadium
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
npm install
npm run dev
```

Backend runs at `http://localhost:3001`.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/ai/query` | Send a message to the AI assistant |
| GET | `/api/crowd` | Get live crowd status for all sections |
| GET | `/api/stadium/amenities?type=food` | Get amenities (filterable by type) |
| GET | `/api/stadium/transport` | Get transport info |
| GET | `/api/stadium/parking` | Get parking lot info |
| GET | `/api/health` | Health check |

### AI Query Request

```json
{
  "message": "How do I get to Section 300 from Gate A?",
  "accessible": false,
  "history": []
}
```

### AI Query Response

```json
{
  "reply": "From Gate A, proceed to the South Concourse...",
  "toolsUsed": ["find_route"],
  "routeData": { "path": [...], "instructions": [...], "estimatedMinutes": 4 }
}
```

---

## AI Tools (Gemini Function-Calling)

| Tool | Description |
|---|---|
| `find_route` | Compute indoor walking route with optional accessibility and crowd-aware flags |
| `find_nearest_amenity` | Find closest food / restroom / medical / security / merchandise |
| `get_crowd_status` | Return live crowd density by section with hotspot alerts |
| `get_transport_info` | Rail, bus, rideshare and general travel notes |
| `get_section_info` | Metadata for any stadium section |
| `get_parking_info` | Parking lots with accessible space counts |

---

## Running Tests

```bash
cd backend
npm test
```

**58 tests across 4 suites:**
- `routing.test.ts` — 13 tests (A* pathfinding, resolution, accessibility)
- `crowd.test.ts` — 12 tests (phase multipliers, seeded density, determinism)
- `handlers.test.ts` — 17 tests (all 6 tools, error paths)
- `validators.test.ts` — 16 tests (all Zod schemas, edge cases)

---

## Security

- API keys are backend-only, never sent to the client
- All AI tool call inputs are validated with Zod before execution
- Helmet.js sets secure HTTP headers
- CORS is restricted to the frontend origin
- Input size limited to 50 KB request body / 2000 char message
- `.env` is gitignored; `.env.example` has placeholders only

---

## Accessibility

- WCAG 2.1 AA compliant
- Skip-to-content link on every page
- All interactive elements have `aria-label`, `aria-pressed`, `aria-live`, `role` attributes
- Keyboard navigable (tab order, focus rings)
- Crowd progress bars have `role="progressbar"` with `aria-valuenow`
- Language selector has `aria-expanded` and `role="listbox"`
- No colour as the sole conveyor of information (text labels always accompany colour badges)

---

## Internationalisation

Switch languages using the globe icon in the navbar. Supported languages:

- English (`en`)
- Español (`es`)
- Français (`fr`)
- हिंदी (`hi`)

---

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key |
| `PORT` | No | `3001` | Backend server port |
| `FRONTEND_ORIGIN` | No | `http://localhost:5173` | CORS allowed origin |
| `AI_PROVIDER` | No | `mock` | `gemini` or `mock` |

Set `AI_PROVIDER=mock` to run without a real API key (returns canned responses).

---

## License

Educational reference only. Not affiliated with or endorsed by MetLife Stadium, the NFL, or FIFA.
