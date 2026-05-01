# WanderVoice

An AI-powered audio guide for urban explorers. As you walk, WanderVoice detects nearby landmarks and narrates them in real time — as immersive stories, sharp facts, or hidden secrets — spoken aloud using the browser's built-in voice synthesis.

---

## What it does

- Detects your GPS location and finds nearby points of interest via Google Places
- Runs an agentic search loop before generating each narration: queries Wikipedia and Tavily web search in parallel to ground the narrative in real, verified knowledge
- Generates a narrative using Gemini 2.5 Flash (via OpenRouter) with the search results injected as context
- Speaks the narrative using the **Web Speech API** — free, unlimited, no API key required
- Runs an automatic loop: search → narrate → speak → wait 10s → repeat
- Shows a search bubble on the map during the knowledge lookup phase, animating through Wikipedia → Web → AI grounding steps
- Saves all narrations to a history tab
- Shows a live SVG map with road polylines from Google Directions and a pinned POI marker

Three narrative modes:
- **Story** — immersive, second-person storytelling with history and sensory detail
- **Facts** — verifiable statistics, dates, records, and surprising figures
- **Secrets** — hidden legends, local lore, and things most tourists never notice

---

## Stack

| | |
|---|---|
| Runtime | Bun |
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Monorepo | Bun workspaces + Turborepo |
| Database | SQLite via Drizzle ORM |
| LLM | Gemini 2.5 Flash via OpenRouter |
| TTS | Web Speech API (browser-native, free) |
| Knowledge search | Wikipedia API (free) + Tavily Search API |
| Maps | Google Places API + Google Directions API |
| Tunnel | ngrok (`@ngrok/ngrok`) |

---

## Project structure

```
wandervoice/
├── apps/
│   ├── web/          # Next.js app — UI + all API routes
│   └── server/       # Standalone backend (tsdown)
├── packages/
│   ├── db/           # Drizzle schema + migrations
│   ├── env/          # Environment variable validation
│   └── config/       # Shared TypeScript / tooling config
└── tunnel.ts         # ngrok tunnel script
```

The web app is a single-page mobile UI rendered inside a phone frame. Navigation is handled by a `useReducer`-based context (`AppProvider`) — no router, just state transitions between named screens.

---

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Create `apps/web/.env`:

```env
# App
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
DATABASE_URL="file:./dev.db"

# Google Maps (Places + Directions + Photos)
GMAPS_API_KEY=your_key_here

# AI narrator
OPENROUTER_API_KEY=your_key_here

# Knowledge search (Tavily — optional, falls back to Wikipedia only if omitted)
TAVILY_API_KEY=your_key_here

# Demo mode — spoof GPS to a fixed location (optional)
NEXT_PUBLIC_FAKE_LAT=13.7516435
NEXT_PUBLIC_FAKE_LNG=100.4927041

# Mock mode — skip all live API calls, use hardcoded data (optional)
NEXT_PUBLIC_MOCK_MODE=false

# ngrok tunnel (optional)
NGROK_AUTHTOKEN=your_token_here
NGROK_DOMAIN=your-domain.ngrok-free.app
```

### 3. Run

```bash
# Start the web app on port 3001
bun run dev:web

# In another terminal — expose via ngrok for mobile testing
bun run tunnel
```

Open `http://localhost:3001` in your browser, or use the ngrok URL on your phone.

---

## Agentic narration flow

Each narration cycle runs a two-round LLM loop:

```
1. LLM offered search_place tool
        ↓
2. LLM calls search_place("Wat Phra Kaew Bangkok")
        ↓
3. Server runs in parallel:
     Wikipedia extract (free, cached 1hr)
   + Tavily web search (synthesized answer + snippets)
        ↓
4. Merged context injected into round 2
        ↓
5. LLM writes grounded narrative
        ↓
6. Web Speech API speaks it
```

The search bubble shown on the map during step 3 animates through three stages: Wikipedia → Web search → AI grounding.

---

## API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/ai/narrate` | POST | Agentic loop: search → ground → generate narrative (Gemini 2.5 Flash) |
| `/api/ai/search` | POST | Wikipedia + Tavily parallel search for a place query |
| `/api/ai/speak` | POST | Deprecated (410) — speech handled client-side via Web Speech API |
| `/api/ai/voices` | GET | Deprecated (410) — voices listed client-side via `speechSynthesis.getVoices()` |
| `/api/maps/nearby` | GET | POIs near coordinates (Google Places nearbysearch) |
| `/api/maps/photo` | GET | Proxy place photos (Google Places photo API) |
| `/api/maps/directions` | GET | Walking route polylines (Google Directions API) |

---

## Demo mode

Set `NEXT_PUBLIC_FAKE_LAT` and `NEXT_PUBLIC_FAKE_LNG` to spoof your GPS position to any coordinate. The app will skip geolocation and fetch live POI data for that location instead. Useful for demos when you're not physically at the target location.

Set `NEXT_PUBLIC_MOCK_MODE=true` to skip all external API calls entirely and use hardcoded Wat Phra Kaew, Bangkok data.

---

## Available scripts

| Script | Description |
|---|---|
| `bun run dev` | Start all packages in development mode |
| `bun run dev:web` | Start only the web app (port 3001) |
| `bun run dev:server` | Start only the backend server |
| `bun run build` | Build all packages |
| `bun run check-types` | TypeScript type check across all packages |
| `bun run tunnel` | Start ngrok tunnel for mobile testing |
| `bun run db:push` | Push Drizzle schema to database |
| `bun run db:generate` | Generate Drizzle types |
| `bun run db:migrate` | Run database migrations |
| `bun run db:studio` | Open Drizzle Studio |

---

## Prototype viewer

`/prototype` — a standalone screen gallery showing all UI variants side by side, useful for design review without navigating through the full app flow.
