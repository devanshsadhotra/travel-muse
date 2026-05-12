import argparse
import sys
import json
from dotenv import load_dotenv

from config import DEFAULT_PROVIDER, TRIP_TYPES, FOOD_PREFERENCES
from providers import REGISTRY
from cli.prompts import prompt_provider, prompt_city, prompt_days, prompt_trip_type, prompt_food_preference
from services import generate_itinerary
from utils.loader import Loader

load_dotenv()


def main():
    parser = argparse.ArgumentParser(description="AI travel itinerary generator")
    parser.add_argument("--provider", choices=list(REGISTRY), help="LLM provider (skips prompt)")
    parser.add_argument("--city", help="Destination city (skips prompt)")
    parser.add_argument("--days", type=int, help="Number of days (skips prompt)")
    parser.add_argument("--trip-type", choices=TRIP_TYPES, dest="trip_type", help="Trip type (skips prompt)")
    parser.add_argument("--food-pref", choices=FOOD_PREFERENCES, dest="food_pref", help="Food preference (skips prompt)")
    args = parser.parse_args()

    provider = args.provider or prompt_provider()
    city = args.city or prompt_city()
    days = args.days or prompt_days()
    trip_type = args.trip_type or prompt_trip_type()
    food_pref = args.food_pref or prompt_food_preference()

    try:
        with Loader():
            result = generate_itinerary(
                provider=provider,
                city=city,
                days=days,
                trip_type=trip_type,
                food_pref=food_pref,
            )
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()
