import itertools
import sys
import threading
import time

GENERAL_MESSAGES = [
    "Folding the maps (and actually getting them back together).",
    "Chasing horizons... please hold.",
    "Trading screen time for sunshine.",
    "Finding the best hidden gems for you.",
    "Pack your bags, we're doing the heavy lifting.",
]

BEACH_MESSAGES = [
    "Shaking the sand out of your itinerary.",
    "Checking the tide charts for you.",
    "Waxing the surfboard for a smooth ride.",
    "Applying virtual sunscreen... please hold.",
    "Scouting the best spots for a sunset view.",
    "Collecting shells and scanning for dolphins.",
    "Testing the water temperature.",
    "Adjusting your watch to island time.",
    "Mapping out the hidden coves.",
    "Inflating the beach balls.",
]

HILLY_MESSAGES = [
    "Gaining altitude... hold onto your hat!",
    "Lacing up the hiking boots for your trek.",
    "Chasing the clouds for the perfect peak view.",
    "Boiling the kettle for some mountain chai.",
    "Checking the trail conditions ahead.",
    "Finding the steepest shortcuts.",
    "Warming up the campfire.",
    "Scanning the horizon for pine trees.",
    "Acclimatizing your itinerary.",
    "Mapping out the best hairpin bends.",
]

_MESSAGES_BY_TERRAIN = {
    "beach": BEACH_MESSAGES,
    "hilly": HILLY_MESSAGES,
    "mixed": GENERAL_MESSAGES,
}

SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]


class Loader:
    def __init__(self, terrain: str = "mixed", message_interval: float = 2.5):
        self.messages = _MESSAGES_BY_TERRAIN.get(terrain, GENERAL_MESSAGES)
        self.message_interval = message_interval
        self._stop = threading.Event()
        self._thread = threading.Thread(target=self._run, daemon=True)

    def _run(self):
        spinner = itertools.cycle(SPINNER_FRAMES)
        messages = itertools.cycle(self.messages)
        current_msg = next(messages)
        last_switch = time.time()

        while not self._stop.is_set():
            sys.stdout.write(f"\r{next(spinner)}  {current_msg}   ")
            sys.stdout.flush()
            time.sleep(0.1)

            if time.time() - last_switch >= self.message_interval:
                current_msg = next(messages)
                last_switch = time.time()

        sys.stdout.write("\r" + " " * 70 + "\r")
        sys.stdout.flush()

    def __enter__(self):
        self._thread.start()
        return self

    def __exit__(self, *_):
        self._stop.set()
        self._thread.join()
