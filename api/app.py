from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field, field_validator

from config import DEFAULT_PROVIDER, FOOD_PREFERENCES, TRIP_TYPES
from services import answer_travel_question, generate_itinerary, get_available_options, get_seasonal_suggestions
from services.itinerary import stream_itinerary

load_dotenv()


class GenerateItineraryRequest(BaseModel):
    provider: str = Field(default=DEFAULT_PROVIDER)
    city: str = Field(min_length=1, description="Destination city name")
    days: int = Field(ge=1, le=30)
    travelMonth: str = Field(min_length=3)
    tripType: list[str] | None = None
    foodPreference: list[str] | None = None
    userCurrency: str = Field(default="INR", min_length=3, max_length=3)

    @field_validator("tripType")
    @classmethod
    def validate_trip_types(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        invalid = [t for t in v if t not in TRIP_TYPES]
        if invalid:
            raise ValueError(f"Invalid trip type(s): {invalid}")
        return v or None

    @field_validator("foodPreference")
    @classmethod
    def validate_food_preferences(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        invalid = [f for f in v if f not in FOOD_PREFERENCES]
        if invalid:
            raise ValueError(f"Invalid food preference(s): {invalid}")
        return v or None


class TravelAssistantRequest(BaseModel):
    provider: str = Field(default=DEFAULT_PROVIDER)
    question: str = Field(min_length=3)
    history: list[dict[str, str]] | None = None
    city: str | None = None
    travelMonth: str | None = None
    tripType: str | None = None
    foodPreference: str | None = None


app = FastAPI(
    title="Travel Planner API",
    version="0.1.0",
    description="Backend API for a travel itinerary mobile app.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:19006",
        "http://127.0.0.1:19006",
        "http://localhost:8081",
        "http://127.0.0.1:8081",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, object]:
    return {
        "name": "Travel Planner API",
        "status": "running",
        "docs": "/docs",
        "routes": {
            "health": "/health",
            "options": "/api/options",
            "seasonalSuggestions": "/api/suggestions/seasonal",
            "createItinerary": "/api/itineraries",
            "travelAssistant": "/api/travel-assistant",
        },
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/options")
def options() -> dict[str, list[str]]:
    return get_available_options()


@app.get("/api/suggestions/seasonal")
def seasonal_suggestions() -> dict[str, object]:
    return get_seasonal_suggestions()


@app.post("/api/itineraries")
def create_itinerary(request: GenerateItineraryRequest) -> dict:
    try:
        itinerary = generate_itinerary(
            provider=request.provider,
            city=request.city.strip(),
            days=request.days,
            trip_type=", ".join(request.tripType) if request.tripType else None,
            food_pref=", ".join(request.foodPreference) if request.foodPreference else None,
            travel_month=request.travelMonth,
            user_currency=request.userCurrency,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {exc}") from exc

    return {
        "meta": {
            "provider": request.provider,
            "city": request.city.strip(),
            "days": request.days,
            "travelMonth": request.travelMonth,
            "tripType": ", ".join(request.tripType) if request.tripType else None,
            "foodPreference": ", ".join(request.foodPreference) if request.foodPreference else None,
        },
        "itinerary": itinerary,
    }


@app.post("/api/itineraries/stream")
def create_itinerary_stream(request: GenerateItineraryRequest) -> StreamingResponse:
    trip_type = ", ".join(request.tripType) if request.tripType else None
    food_pref = ", ".join(request.foodPreference) if request.foodPreference else None

    def event_stream():
        try:
            yield from stream_itinerary(
                provider=request.provider,
                city=request.city.strip(),
                days=request.days,
                trip_type=trip_type,
                food_pref=food_pref,
                travel_month=request.travelMonth,
                user_currency=request.userCurrency,
            )
        except ValueError as exc:
            import json
            yield f"data: {json.dumps({'type': 'error', 'detail': str(exc)})}\n\n"
        except Exception as exc:
            import json
            yield f"data: {json.dumps({'type': 'error', 'detail': f'Failed to generate itinerary: {exc}'})}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@app.post("/api/travel-assistant")
def travel_assistant(request: TravelAssistantRequest) -> dict[str, str]:
    try:
        return answer_travel_question(
            provider=request.provider,
            question=request.question,
            history=request.history,
            city=request.city,
            travel_month=request.travelMonth,
            trip_type=request.tripType,
            food_preference=request.foodPreference,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Failed to answer travel question: {exc}") from exc
