from providers.base import LLMClient

_CLASSIFY_PROMPT = (
    "You are a geography classifier. "
    "Given a city or place name, classify its primary terrain. "
    "Reply with exactly one word — 'beach' for coastal/beach destinations, "
    "'hilly' for mountain/hill destinations, or 'mixed' for anything else. "
    "No punctuation, no explanation, just one word."
)

_VALID = ("beach", "hilly", "mixed")


def classify_terrain(city: str, client: LLMClient) -> str:
    try:
        result = client.generate(
            f"Classify the terrain of: {city}",
            system_prompt=_CLASSIFY_PROMPT,
        ).strip().lower().rstrip(".")
        if result in _VALID:
            return result
    except Exception:
        pass
    return "mixed"
