import os
from google import genai
from providers.base import LLMClient
from config import MODEL_GEMINI, SYSTEM_PROMPT, TEMPERATURE, MAX_TOKENS


class GeminiClient(LLMClient):
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

    def generate(self, message: str, system_prompt: str | None = None) -> str:
        is_default = system_prompt is None
        response = self.client.models.generate_content(
            model=MODEL_GEMINI,
            contents=message,
            config={
                "system_instruction": system_prompt or SYSTEM_PROMPT,
                **({"response_mime_type": "application/json"} if is_default else {}),
                "temperature": TEMPERATURE,
                "max_output_tokens": MAX_TOKENS,
            },
        )
        return response.text
