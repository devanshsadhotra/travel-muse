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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return parseResponse<ItineraryResponse>(response);
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
