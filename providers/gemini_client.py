import os
from typing import Iterator

from google import genai

from config import MAX_TOKENS, MODEL_GEMINI, SYSTEM_PROMPT, TEMPERATURE
from providers.base import LLMClient


class GeminiClient(LLMClient):
    def __init__(self):
        self.client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

    def _config(self, system_prompt: str | None) -> dict:
        is_default = system_prompt is None
        return {
            "system_instruction": system_prompt or SYSTEM_PROMPT,
            "temperature": TEMPERATURE,
            "max_output_tokens": MAX_TOKENS,
            **({"response_mime_type": "application/json"} if is_default else {}),
        }

    def generate(self, message: str, system_prompt: str | None = None) -> str:
        response = self.client.models.generate_content(
            model=MODEL_GEMINI,
            contents=message,
            config=self._config(system_prompt),
        )
        return response.text

    def generate_stream(self, message: str, system_prompt: str | None = None) -> Iterator[str]:
        for chunk in self.client.models.generate_content_stream(
            model=MODEL_GEMINI,
            contents=message,
            config=self._config(system_prompt),
        ):
            if chunk.text:
                yield chunk.text
