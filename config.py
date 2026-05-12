MODEL: str = "gpt-4.1-mini"
MODEL_GEMINI: str = "gemini-3-flash-preview"
DEFAULT_PROVIDER: str = "openai"
TRIP_TYPES: list = ["family", "solo", "backpacker", "couple", "romantic", "adventure"]
FOOD_PREFERENCES: list = [
    "veg",
    "non-veg",
    "jain",
    "veg - no meat",
    "veg with eggs",
    "seafood - no meat",
    "non-veg - no seafood",
    "no restrictions",
]

SYSTEM_PROMPT: str = """
You are a JSON API.

Rules:
- Always return valid JSON
- No markdown
- No explanations
- No extra text
"""

MESSAGE_TEMPLATE: str = (
    "Create a detailed {days}-day {trip_type} travel itinerary for {city} "
    "for someone with {food_pref} food preferences. "
    "Include day-by-day activities, must-visit places, restaurants and dishes suited to their diet, and practical tips."
)
TEMPERATURE: float = 0.5
MAX_TOKENS: int = 10000