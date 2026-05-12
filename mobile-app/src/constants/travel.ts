export const terrainTitles: Record<string, string> = {
  beach: "Coastal Escape",
  hilly: "Mountain Mood",
  mixed: "City and Nature Blend",
};

export const loaderMessages = [
  "Curating hidden gems for your route.",
  "Matching food stops to your travel style.",
  "Balancing slower mornings with memorable evenings.",
  "Checking the flow between must-see places.",
  "Saving room for serendipity and sunset moments.",
];

export const sectionLabels = ["morning", "afternoon", "evening"] as const;

export const MAX_DAYS = 30;

export const stayTierMeta = [
  { key: "budget", label: "Budget", icon: "wallet-outline" },
  { key: "economy", label: "Economy", icon: "bed-outline" },
  { key: "midRange", label: "Mid-range", icon: "business-outline" },
  { key: "luxury", label: "Luxury", icon: "sparkles-outline" },
] as const;

export const MONTH_NAMES = [
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
] as const;

export function getCurrentMonthName(date = new Date()): string {
  return MONTH_NAMES[date.getMonth()];
}

export function getHeroCopy(cityName: string | undefined) {
  const normalized = cityName?.trim().toLowerCase() || "";

  if (normalized.includes("bali")) {
    return {
      title: "Plan a Bali stay that feels soft, cinematic, and effortless.",
      subtitle:
        "Rice terraces, beach clubs, slower mornings, and beautiful stays, stitched into one calm travel flow.",
      pills: ["Bali escape", "Animated", "Stay-led"],
    };
  }

  if (normalized.includes("kyoto")) {
    return {
      title: "Shape a Kyoto journey with quiet detail and graceful pacing.",
      subtitle:
        "Temple walks, neighborhood cafes, and thoughtful day planning, designed to feel calm rather than crowded.",
      pills: ["Kyoto calm", "Minimal", "Travel-first"],
    };
  }

  if (normalized.includes("lisbon")) {
    return {
      title: "Map a Lisbon trip with light, texture, and easy wander energy.",
      subtitle:
        "Viewpoints, tiled streets, long lunches, and slow evenings, balanced into a relaxed city rhythm.",
      pills: ["Lisbon light", "Editorial", "Travel-first"],
    };
  }

  return {
    title: "Plan a stay that feels beautifully lived-in.",
    subtitle:
      "Clean, calm trip design inspired by modern travel products, with AI-generated pacing, food stops, stays, and day-by-day flow.",
    pills: ["Editorial", "Animated", "Travel-first"],
  };
}
