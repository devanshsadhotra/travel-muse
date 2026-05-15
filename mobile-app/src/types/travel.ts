export type ApiOptions = {
  providers: string[];
  tripTypes: string[];
  foodPreferences: string[];
  travelMonths: string[];
};

export type SeasonalDestination = {
  city: string;
  country: string;
  vibe: string;
  whyNow: string;
  season: string;
};

export type SeasonalWindow = {
  month: string;
  year: number;
  destinations: SeasonalDestination[];
};

export type SeasonalSuggestionsResponse = {
  currentDate: string;
  windowMonths: SeasonalWindow[];
};

export type ActivityItem = {
  time: string;
  title: string;
  description: string;
  location: string;
};

export type FoodItem = {
  name: string;
  type: string;
  mustTry: string[];
};

export type DayPlan = {
  day: number;
  title: string;
  theme: string;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  food: FoodItem[];
  tips: string[];
};

export type StayOption = {
  name: string;
  type: string;
  area: string;
  priceRange: string;
  whyStayHere: string;
  bestFor: string[];
};

export type TravelChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export type ItineraryResponse = {
  meta: {
    provider: string;
    city: string;
    days: number;
    travelMonth: string;
    tripType: string;
    foodPreference: string;
  };
  itinerary: {
    destination: {
      city: string;
      country?: string;
      tagline?: string;
      terrain: "beach" | "hilly" | "mixed";
      bestTimeToVisit?: string;
    };
    overview: {
      tripType: string;
      foodPreference: string;
      travelMonth?: string;
      pace?: string;
      vibe?: string[];
      highlights?: string[];
    };
    travelInsights: {
      season?: string;
      seasonSummary?: string;
      weather?: string;
      temperatureRange?: string;
      flightEstimate?: {
        economyRoundTrip?: string;
        notes?: string;
      };
    };
    stays: {
      budget?: StayOption[];
      economy?: StayOption[];
      midRange?: StayOption[];
      luxury?: StayOption[];
    };
    days: DayPlan[];
    practical: {
      budgetTips?: string[];
      packingTips?: string[];
      localEtiquette?: string[];
      transport?: string[];
    };
  };
};

export type ItineraryRequest = {
  provider: string;
  city: string;
  days: number;
  travelMonth: string;
  tripType?: string[];
  foodPreference?: string[];
  userCurrency?: string;
};

export type TravelAssistantRequest = {
  provider: string;
  question: string;
  history?: TravelChatMessage[];
  city?: string;
  travelMonth?: string;
  tripType?: string;
  foodPreference?: string;
};

export type TravelAssistantResponse = {
  answer: string;
};
