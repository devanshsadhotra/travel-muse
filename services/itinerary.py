import concurrent.futures
import json
from datetime import datetime
from typing import Any, Iterator

from config import FOOD_PREFERENCES, TRIP_TYPES
from providers import REGISTRY

DAYS_CHUNK_SIZE = 4

TRAVEL_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

SEASONAL_DESTINATIONS = {
    "May": [
        {"city": "Goa", "country": "India", "vibe": "Beach stays and relaxed coastal cafés", "whyNow": "Early monsoon shoulder timing can bring softer prices and a slower pace before heavier rains settle in.", "season": "shoulder season"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Beach clubs and rice terraces", "whyNow": "Dry season is settling in, with warm days and lower humidity than peak summer.", "season": "good to go"},
        {"city": "Shimla", "country": "India", "vibe": "Cool hills and old-world mountain charm", "whyNow": "May is a classic heat-escape month for North Indian hill stations.", "season": "peak season"},
        {"city": "Kyoto", "country": "Japan", "vibe": "Temples, gardens, and slow neighborhood walks", "whyNow": "Late spring keeps the weather comfortable and the gardens especially photogenic.", "season": "shoulder season"},
    ],
    "June": [
        {"city": "Ladakh", "country": "India", "vibe": "High-altitude roads and dramatic landscapes", "whyNow": "Road-trip season begins opening up, making June a strong month for big mountain scenery.", "season": "good to go"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Surf mornings and sunset dinners", "whyNow": "June is one of the most reliable months for dry weather and great beach conditions.", "season": "peak season"},
        {"city": "Munnar", "country": "India", "vibe": "Tea estates and misty hill retreats", "whyNow": "The monsoon starts bringing lush scenery that works especially well for slower stays.", "season": "shoulder season"},
        {"city": "Santorini", "country": "Greece", "vibe": "Cliffside stays and sea views", "whyNow": "Early summer is bright and lively before the hottest, busiest stretch peaks.", "season": "peak season"},
    ],
    "July": [
        {"city": "Coorg", "country": "India", "vibe": "Rainy coffee estates and green escapes", "whyNow": "Monsoon transforms Coorg into a lush, atmospheric retreat if you enjoy rain-washed scenery.", "season": "good to go"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Tropical resort season", "whyNow": "This is classic Bali weather with sunshine, beach time, and strong demand.", "season": "peak season"},
        {"city": "Valley of Flowers", "country": "India", "vibe": "Trekking and alpine meadows", "whyNow": "July begins a beautiful window for lush Himalayan trail scenery.", "season": "good to go"},
        {"city": "Reykjavik", "country": "Iceland", "vibe": "Road trips and dramatic landscapes", "whyNow": "Summer opens up longer drives, milder weather, and maximum daylight.", "season": "peak season"},
    ],
    "August": [
        {"city": "Udaipur", "country": "India", "vibe": "Lake views and romantic heritage stays", "whyNow": "Monsoon can make the city greener and more atmospheric, often with better hotel value.", "season": "shoulder season"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Polished resort weather and island hopping", "whyNow": "August stays dry and vibrant, though you should expect busier hotspots.", "season": "peak season"},
        {"city": "Wayanad", "country": "India", "vibe": "Forest stays and monsoon greenery", "whyNow": "A great pick if you want a cooler, slower monsoon nature break.", "season": "good to go"},
        {"city": "Edinburgh", "country": "Scotland", "vibe": "Culture, festivals, and dramatic city views", "whyNow": "Festival season brings energy, long days, and plenty happening in the city.", "season": "peak season"},
    ],
    "September": [
        {"city": "Spiti Valley", "country": "India", "vibe": "Raw mountain roads and high-desert views", "whyNow": "September often brings clearer roads and strong post-monsoon mountain travel conditions.", "season": "good to go"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Warm beaches with slightly softer crowds", "whyNow": "You still get strong weather with a gentler pace than midsummer.", "season": "shoulder season"},
        {"city": "Goa", "country": "India", "vibe": "Post-monsoon coast and quieter stays", "whyNow": "September can be a value-forward shoulder period before the heavier festive rush begins.", "season": "shoulder season"},
        {"city": "Rome", "country": "Italy", "vibe": "Historic streets and slower evening dining", "whyNow": "September usually eases the harshest heat while keeping the city lively.", "season": "shoulder season"},
    ],
    "October": [
        {"city": "Rishikesh", "country": "India", "vibe": "Riverfront cafés and mountain-edge calm", "whyNow": "October is one of the nicest months for outdoor time before winter sharpens.", "season": "good to go"},
        {"city": "Kyoto", "country": "Japan", "vibe": "Seasonal color and reflective temple walks", "whyNow": "Autumn starts to bring calmer air and some of the year’s prettiest scenery.", "season": "peak season"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Late dry-season villas and easy beach days", "whyNow": "A strong balance of weather, value, and manageable crowds for island stays.", "season": "good to go"},
        {"city": "Jodhpur", "country": "India", "vibe": "Blue-city stays and heritage hotels", "whyNow": "The weather starts becoming more comfortable for walking-heavy Rajasthan trips.", "season": "shoulder season"},
    ],
    "November": [
        {"city": "Jaipur", "country": "India", "vibe": "Palaces, bazaars, and boutique stays", "whyNow": "November is one of the strongest windows for Rajasthan weather and city breaks.", "season": "peak season"},
        {"city": "Dubai", "country": "UAE", "vibe": "Desert luxury and warm winter sun", "whyNow": "November is one of the more comfortable months to be outdoors there.", "season": "peak season"},
        {"city": "Varanasi", "country": "India", "vibe": "River rituals and layered cultural travel", "whyNow": "Cooler weather makes immersive city exploration much more comfortable.", "season": "good to go"},
        {"city": "Bangkok", "country": "Thailand", "vibe": "Street food and city breaks", "whyNow": "The rainy season usually eases, making city exploring much smoother.", "season": "good to go"},
    ],
    "December": [
        {"city": "Goa", "country": "India", "vibe": "Festive beaches and lively coastal stays", "whyNow": "December is prime Goa season for weather, nightlife, and holiday travel energy.", "season": "peak season"},
        {"city": "Swiss Alps", "country": "Switzerland", "vibe": "Snowy resort stays and festive villages", "whyNow": "December brings classic winter scenery and holiday atmosphere.", "season": "peak season"},
        {"city": "Auli", "country": "India", "vibe": "Snowy slopes and winter mountain stays", "whyNow": "Auli works well for a domestic winter escape as snow season begins building.", "season": "peak season"},
        {"city": "Vienna", "country": "Austria", "vibe": "Markets, music, and winter elegance", "whyNow": "A strong pick for festive city breaks and classic seasonal atmosphere.", "season": "peak season"},
    ],
    "January": [
        {"city": "Kerala", "country": "India", "vibe": "Backwaters, resorts, and easy tropical travel", "whyNow": "January is one of the most comfortable months for a relaxed South India escape.", "season": "peak season"},
        {"city": "Phuket", "country": "Thailand", "vibe": "Beach resets and island sunshine", "whyNow": "January is one of the easiest months for warm-weather coastal trips there.", "season": "peak season"},
        {"city": "Rann of Kutch", "country": "India", "vibe": "Salt desert festivals and open landscapes", "whyNow": "Winter is the signature season for this region’s atmosphere and events.", "season": "peak season"},
        {"city": "Dubai", "country": "UAE", "vibe": "Sunshine and polished city stays", "whyNow": "Comfortable daytime temperatures make it especially popular.", "season": "peak season"},
    ],
    "February": [
        {"city": "Udaipur", "country": "India", "vibe": "Romantic lakeside stays and heritage hotels", "whyNow": "February is especially comfortable for couples and slower city wandering.", "season": "peak season"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Spa retreats and green tropical scenery", "whyNow": "Rain can still appear, but this can work well for slower resort-focused trips.", "season": "off season"},
        {"city": "Andaman", "country": "India", "vibe": "Island beaches and clear-water days", "whyNow": "This is a strong time for sea conditions, sunshine, and tropical escapes.", "season": "peak season"},
        {"city": "Maldives", "country": "Maldives", "vibe": "Water villas and clear lagoon days", "whyNow": "Dry, sunny conditions make this a classic high-demand beach month.", "season": "peak season"},
    ],
    "March": [
        {"city": "Darjeeling", "country": "India", "vibe": "Tea hills and spring mountain air", "whyNow": "Spring starts to brighten the hills and makes for a lighter, scenic getaway.", "season": "good to go"},
        {"city": "Kyoto", "country": "Japan", "vibe": "Early blossom season and cultural stays", "whyNow": "Late March starts to edge into one of the year’s most anticipated travel windows.", "season": "peak season"},
        {"city": "Meghalaya", "country": "India", "vibe": "Waterfalls, living root bridges, and cool air", "whyNow": "March offers pleasant travel conditions before heavier rains build later in the year.", "season": "good to go"},
        {"city": "Lisbon", "country": "Portugal", "vibe": "Bright spring city wandering", "whyNow": "Spring begins to lift the weather before the bigger tourist surge arrives.", "season": "good to go"},
    ],
    "April": [
        {"city": "Kashmir", "country": "India", "vibe": "Spring valleys and scenic stays", "whyNow": "April is one of the prettiest months for blooms, gardens, and fresh mountain air.", "season": "peak season"},
        {"city": "Kyoto", "country": "Japan", "vibe": "Spring gardens and photogenic streets", "whyNow": "A signature season for the city, with very strong travel appeal.", "season": "peak season"},
        {"city": "Ooty", "country": "India", "vibe": "Cool hills and garden-season charm", "whyNow": "A dependable warm-weather escape when the plains start heating up.", "season": "peak season"},
        {"city": "Bali", "country": "Indonesia", "vibe": "Drying days and villa stays", "whyNow": "April often marks a strong transition into more reliable island weather.", "season": "good to go"},
    ],
}


def get_client(provider: str):
    if provider not in REGISTRY:
        raise ValueError(f"Unknown provider '{provider}'. Available: {list(REGISTRY)}")
    return REGISTRY[provider]()


def get_available_options() -> dict[str, list[str]]:
    return {
        "providers": list(REGISTRY),
        "tripTypes": TRIP_TYPES,
        "foodPreferences": FOOD_PREFERENCES,
        "travelMonths": TRAVEL_MONTHS,
    }


def get_seasonal_suggestions(reference_date: datetime | None = None) -> dict[str, object]:
    current = reference_date or datetime.now()
    suggestions = []

    for offset in range(4):
        month_index = (current.month - 1 + offset) % 12
        year = current.year + ((current.month - 1 + offset) // 12)
        month_name = TRAVEL_MONTHS[month_index]
        suggestions.append(
            {
                "month": month_name,
                "year": year,
                "destinations": SEASONAL_DESTINATIONS.get(month_name, []),
            }
        )

    return {
        "currentDate": current.strftime("%Y-%m-%d"),
        "windowMonths": suggestions,
    }


def _extract_json_payload(raw_text: str) -> dict[str, Any]:
    text = raw_text.strip()

    # Strip markdown code fences (```json ... ``` or ``` ... ```)
    if text.startswith("```"):
        lines = text.splitlines()
        end_fence = next((i for i in range(len(lines) - 1, 0, -1) if lines[i].strip() == "```"), None)
        text = "\n".join(lines[1:end_fence] if end_fence else lines[1:])

    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    # Bracket-match to extract the first complete JSON object,
    # ignoring any trailing text or extra objects the model appended.
    start = text.find("{")
    if start == -1:
        raise ValueError("Model did not return a valid JSON object.")

    depth = 0
    in_string = False
    escape_next = False
    for i, ch in enumerate(text[start:], start):
        if escape_next:
            escape_next = False
            continue
        if ch == "\\" and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                try:
                    parsed = json.loads(text[start : i + 1])
                    if isinstance(parsed, dict):
                        return parsed
                except json.JSONDecodeError:
                    break

    raise ValueError("Model did not return a valid JSON object.")


def _trip_food_parts(trip_type: str | None, food_pref: str | None) -> tuple[str, str]:
    return (
        f"{trip_type} " if trip_type else "",
        f" for someone with {food_pref} food preferences" if food_pref else "",
    )


def _build_metadata_prompt(
    city: str, days: int, trip_type: str | None, food_pref: str | None,
    travel_month: str, user_currency: str,
) -> str:
    trip_part, food_part = _trip_food_parts(trip_type, food_pref)
    return f"""Travel overview for a {days}-day {trip_part}trip to {city}{food_part}. Visit month: {travel_month}. All prices in {user_currency}.

Return JSON:
{{
  "destination": {{"city": "string", "country": "string", "tagline": "string", "terrain": "beach | hilly | mixed", "bestTimeToVisit": "string"}},
  "overview": {{"tripType": "string", "foodPreference": "string", "travelMonth": "string", "pace": "relaxed | balanced | packed", "vibe": ["string"], "highlights": ["string"]}},
  "travelInsights": {{"season": "off season | shoulder season | peak season | good to go", "seasonSummary": "string", "weather": "string", "temperatureRange": "string", "flightEstimate": {{"economyRoundTrip": "string", "notes": "string"}}}},
  "stays": {{
    "budget": [{{"name": "string", "type": "hotel | hostel | guesthouse | resort | villa", "area": "string", "priceRange": "string/night", "whyStayHere": "string", "bestFor": ["string"]}}],
    "economy": [], "midRange": [], "luxury": []
  }},
  "practical": {{"budgetTips": ["string"], "packingTips": ["string"], "localEtiquette": ["string"], "transport": ["string"]}}
}}
Include 2-3 real stays per tier. Express all prices in {user_currency}."""


def _build_days_prompt(
    city: str, days_total: int, day_start: int, day_end: int,
    trip_type: str | None, food_pref: str | None, travel_month: str,
) -> str:
    trip_part, food_part = _trip_food_parts(trip_type, food_pref)
    food_rule = f" Tailor all food to {food_pref} preferences." if food_pref else ""
    return f"""Day plans for days {day_start}–{day_end} of a {days_total}-day {trip_part}trip to {city}{food_part}. Visit month: {travel_month}.

Return JSON:
{{
  "days": [
    {{
      "day": {day_start},
      "title": "string",
      "theme": "string",
      "morning": [{{"time": "9:00 AM", "title": "string", "description": "string", "location": "string"}}],
      "afternoon": [],
      "evening": [],
      "food": [{{"name": "string", "type": "breakfast | lunch | dinner | snack", "mustTry": ["string"]}}],
      "tips": ["string"]
    }}
  ]
}}
Include exactly days {day_start} through {day_end}. 2-3 activities per slot. Keep descriptions concise.{food_rule}"""


def _sse(event: dict) -> str:
    return f"data: {json.dumps(event)}\n\n"


def _postprocess(payload: dict, city: str, trip_type: str | None, food_pref: str | None, travel_month: str) -> dict:
    destination = payload.setdefault("destination", {})
    destination.setdefault("city", city)
    destination.setdefault("terrain", "mixed")

    overview = payload.setdefault("overview", {})
    overview.setdefault("tripType", trip_type or "")
    overview.setdefault("foodPreference", food_pref or "")
    overview.setdefault("travelMonth", travel_month)

    travel_insights = payload.setdefault("travelInsights", {})
    travel_insights.setdefault("season", "good to go")
    travel_insights.setdefault("seasonSummary", "")
    travel_insights.setdefault("weather", "")
    travel_insights.setdefault("temperatureRange", "")
    flight_estimate = travel_insights.setdefault("flightEstimate", {})
    flight_estimate.setdefault("economyRoundTrip", "")
    flight_estimate.setdefault("notes", "")

    stays = payload.setdefault("stays", {})
    stays.setdefault("budget", [])
    stays.setdefault("economy", [])
    stays.setdefault("midRange", [])
    stays.setdefault("luxury", [])

    payload.setdefault("days", [])
    payload.setdefault("practical", {})
    return payload


def _chunk_ranges(days: int) -> list[tuple[int, int]]:
    return [(s, min(s + DAYS_CHUNK_SIZE - 1, days)) for s in range(1, days + 1, DAYS_CHUNK_SIZE)]


def _fetch_metadata(client, city, days, trip_type, food_pref, travel_month, user_currency) -> dict:
    prompt = _build_metadata_prompt(city, days, trip_type, food_pref, travel_month, user_currency)
    return _extract_json_payload(client.generate(prompt))


def _fetch_days_chunk(client, city, days_total, day_start, day_end, trip_type, food_pref, travel_month) -> list:
    prompt = _build_days_prompt(city, days_total, day_start, day_end, trip_type, food_pref, travel_month)
    return _extract_json_payload(client.generate(prompt)).get("days", [])


def stream_itinerary(
    provider: str,
    city: str,
    days: int,
    trip_type: str | None,
    food_pref: str | None,
    travel_month: str,
    user_currency: str = "INR",
) -> Iterator[str]:
    client = get_client(provider)
    ranges = _chunk_ranges(days)
    results: dict[str, Any] = {}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures: dict[concurrent.futures.Future, str] = {
            executor.submit(_fetch_metadata, client, city, days, trip_type, food_pref, travel_month, user_currency): "metadata",
            **{
                executor.submit(_fetch_days_chunk, client, city, days, s, e, trip_type, food_pref, travel_month): f"{s}_{e}"
                for s, e in ranges
            },
        }

        for future in concurrent.futures.as_completed(futures):
            key = futures[future]
            try:
                results[key] = future.result()
            except Exception:
                results[key] = {} if key == "metadata" else []

            if key == "metadata":
                yield _sse({"type": "status", "message": "Overview and insights ready…"})
            else:
                s, e = key.split("_")
                yield _sse({"type": "status", "message": f"Days {s}–{e} planned…"})

    metadata = results.get("metadata", {})
    all_days: list = []
    for s, e in ranges:
        chunk = results.get(f"{s}_{e}", [])
        if isinstance(chunk, list):
            all_days.extend(chunk)

    metadata["days"] = sorted(all_days, key=lambda d: d.get("day", 0))
    payload = _postprocess(metadata, city=city, trip_type=trip_type, food_pref=food_pref, travel_month=travel_month)

    yield _sse({
        "type": "done",
        "meta": {
            "provider": provider,
            "city": city,
            "days": days,
            "travelMonth": travel_month,
            "tripType": trip_type,
            "foodPreference": food_pref,
        },
        "itinerary": payload,
    })


def generate_itinerary(
    provider: str,
    city: str,
    days: int,
    trip_type: str | None,
    food_pref: str | None,
    travel_month: str,
    user_currency: str = "INR",
) -> dict[str, Any]:
    client = get_client(provider)
    ranges = _chunk_ranges(days)

    with concurrent.futures.ThreadPoolExecutor() as executor:
        metadata_fut = executor.submit(
            _fetch_metadata, client, city, days, trip_type, food_pref, travel_month, user_currency
        )
        day_futs = [
            (s, e, executor.submit(_fetch_days_chunk, client, city, days, s, e, trip_type, food_pref, travel_month))
            for s, e in ranges
        ]
        metadata = metadata_fut.result()
        all_days: list = []
        for s, e, fut in day_futs:
            all_days.extend(fut.result())

    metadata["days"] = sorted(all_days, key=lambda d: d.get("day", 0))
    return _postprocess(metadata, city=city, trip_type=trip_type, food_pref=food_pref, travel_month=travel_month)
