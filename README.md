# Travel Muse

An AI-powered travel itinerary generator. Pick a destination, trip style, and food preference and get a fully structured day-by-day plan, curated stays across four price tiers, seasonal destination suggestions, and a conversational travel assistant — all powered by your choice of LLM provider.

Ships as a **FastAPI backend** + **React Native (Expo) mobile frontend**.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Backend | Python 3.12+, FastAPI, uv |
| LLM providers | OpenAI (`gpt-4.1-mini`), Google Gemini (`gemini-2.0-flash`) |
| Mobile | React Native 0.79, Expo 53, TypeScript |

---

## Project structure

```
.
├── api/            # FastAPI app and route definitions
├── cli/            # Interactive CLI prompts
├── providers/      # LLM provider clients (OpenAI, Gemini)
├── services/       # Core itinerary and assistant logic
├── utils/          # Terrain classifier, spinner loader
├── mobile-app/
│   └── src/        # React Native screens and components
├── config.py       # App-wide constants and defaults
└── main.py         # CLI entry point
```

---

## Prerequisites

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) — Python package manager
- Node.js 18+ and npm
- [Expo Go](https://expo.dev/client) app on your phone (optional, for physical device testing)

---

## Backend

### Setup

```bash
uv sync
```

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
```

### Run the API

```bash
uv run uvicorn api.app:app --reload
```

API docs available at `http://127.0.0.1:8000/docs`.

### Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/options` | Available providers, trip types, food prefs |
| `GET` | `/api/suggestions/seasonal` | Destination suggestions for the next 4 months |
| `POST` | `/api/itineraries` | Generate a full itinerary |
| `POST` | `/api/travel-assistant` | Ask a follow-up travel question |

### Example itinerary request

```json
{
  "provider": "openai",
  "city": "Kyoto",
  "days": 4,
  "travelMonth": "October",
  "tripType": "romantic",
  "foodPreference": "veg",
  "userCurrency": "INR"
}
```

### CLI usage

```bash
uv run python main.py
# or with flags
uv run python main.py --provider openai --city Goa --days 3 --trip-type solo --food-pref veg
```

---

## Mobile app

### Setup

```bash
cd mobile-app
npm install
```

### Run

```bash
npm run start
```

Scan the QR code with Expo Go, or press `i` / `a` to launch in a simulator.

> By default the app targets `http://127.0.0.1:8000`. When running on a physical device, update the API base URL in `mobile-app/src/api.ts`.

---

## Providers

| Key | Model |
|-----|-------|
| `openai` | `gpt-4.1-mini` |
| `gemini` | `gemini-2.0-flash` |
