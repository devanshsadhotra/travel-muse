from providers import REGISTRY


TRAVEL_ASSISTANT_SYSTEM_PROMPT = """
You are a travel planning assistant embedded inside a travel app.

Rules:
- Only answer travel-related questions.
- Stay within travel planning topics such as destinations, visas at a high level, packing, budgets, local transport, weather, timing, food, stays, safety, etiquette, and itinerary advice.
- If the user asks something unrelated to travel, politely refuse and redirect them back to travel planning.
- Keep answers concise, practical, and mobile-friendly.
- Do not claim live prices or real-time data. If discussing prices, frame them as indicative guidance.
- Do not use markdown headings or long lists unless needed.
""".strip()


def _get_client(provider: str):
    if provider not in REGISTRY:
        raise ValueError(f"Unknown provider '{provider}'. Available: {list(REGISTRY)}")
    return REGISTRY[provider]()


def answer_travel_question(
    provider: str,
    question: str,
    history: list[dict[str, str]] | None = None,
    city: str | None = None,
    travel_month: str | None = None,
    trip_type: str | None = None,
    food_preference: str | None = None,
) -> dict[str, str]:
    client = _get_client(provider)

    context_lines = []
    if city:
        context_lines.append(f"Destination: {city}")
    if travel_month:
        context_lines.append(f"Travel month: {travel_month}")
    if trip_type:
        context_lines.append(f"Trip type: {trip_type}")
    if food_preference:
        context_lines.append(f"Food preference: {food_preference}")

    context_block = "\n".join(context_lines) if context_lines else "No extra trip context provided."
    history_lines = []
    for item in history or []:
        role = item.get("role", "user")
        text = item.get("text", "").strip()
        if text:
            history_lines.append(f"{role.title()}: {text}")
    history_block = "\n".join(history_lines) if history_lines else "No prior messages."
    prompt = (
        "Use the trip context below when relevant.\n\n"
        f"{context_block}\n\n"
        "Conversation so far:\n"
        f"{history_block}\n\n"
        "User question:\n"
        f"{question.strip()}"
    )

    answer = client.generate(prompt, system_prompt=TRAVEL_ASSISTANT_SYSTEM_PROMPT).strip()
    return {"answer": answer}
