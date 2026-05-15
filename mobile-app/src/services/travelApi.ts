import { Platform } from "react-native";
import {
  ApiOptions,
  ItineraryRequest,
  ItineraryResponse,
  SeasonalSuggestionsResponse,
  TravelAssistantRequest,
  TravelAssistantResponse,
} from "../types/travel";

const API_BASE_URL = Platform.select({
  android: "http://10.0.2.2:8000",
  default: "http://127.0.0.1:8000",
});

export const fallbackOptions: ApiOptions = {
  providers: ["openai", "gemini"],
  tripTypes: ["family", "solo", "backpacker", "couple", "romantic", "adventure"],
  foodPreferences: [
    "veg",
    "non-veg",
    "jain",
    "veg - no meat",
    "veg with eggs",
    "seafood - no meat",
    "non-veg - no seafood",
    "no restrictions",
  ],
  travelMonths: [
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
  ],
};

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.detail || "Something went wrong while contacting the travel planner.");
  }
  return payload as T;
}

export async function fetchOptions(): Promise<ApiOptions> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/options`);
    return await parseResponse<ApiOptions>(response);
  } catch {
    return fallbackOptions;
  }
}

export async function generateItinerary(body: ItineraryRequest): Promise<ItineraryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/itineraries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<ItineraryResponse>(response);
}

export async function generateItineraryStream(
  body: ItineraryRequest,
  onStatus: (message: string) => void,
): Promise<ItineraryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/itineraries/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any).detail || "Unable to generate your itinerary right now.");
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;
      const event = JSON.parse(part.slice(6));
      if (event.type === "error") throw new Error(event.detail);
      if (event.type === "status") onStatus(event.message);
      if (event.type === "done") return event as ItineraryResponse;
    }
  }

  throw new Error("Stream ended unexpectedly.");
}

export async function fetchSeasonalSuggestions(): Promise<SeasonalSuggestionsResponse | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/suggestions/seasonal`);
    return await parseResponse<SeasonalSuggestionsResponse>(response);
  } catch {
    return null;
  }
}

export async function askTravelAssistant(body: TravelAssistantRequest): Promise<TravelAssistantResponse> {
  const response = await fetch(`${API_BASE_URL}/api/travel-assistant`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return parseResponse<TravelAssistantResponse>(response);
}
