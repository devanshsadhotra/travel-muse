from providers import REGISTRY
from config import TRIP_TYPES, FOOD_PREFERENCES


def prompt_menu(label: str, options: list) -> str:
    print(f"\n{label}")
    for i, option in enumerate(options, 1):
        print(f"  {i}. {option}")
    while True:
        choice = input("Enter number or name: ").strip().lower()
        if choice in options:
            return choice
        if choice.isdigit() and 1 <= int(choice) <= len(options):
            return options[int(choice) - 1]
        print(f"Invalid choice. Pick from {options}.")


def prompt_provider() -> str:
    return prompt_menu("Select a provider:", list(REGISTRY))


def prompt_city() -> str:
    while True:
        city = input("\nEnter city name: ").strip()
        if city:
            return city
        print("City name cannot be empty.")


def prompt_days() -> int:
    while True:
        value = input("\nNumber of days: ").strip()
        if value.isdigit() and int(value) > 0:
            return int(value)
        print("Please enter a valid number of days (e.g. 3).")


def prompt_trip_type() -> str:
    return prompt_menu("Select trip type:", TRIP_TYPES)


def prompt_food_preference() -> str:
    return prompt_menu("Select food preference:", FOOD_PREFERENCES)
