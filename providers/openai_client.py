import os
from typing import Iterator

from openai import OpenAI

from config import MAX_TOKENS, MODEL, SYSTEM_PROMPT, TEMPERATURE
from providers.base import LLMClient


class OpenAIClient(LLMClient):
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def _messages(self, message: str, system_prompt: str | None) -> list[dict]:
        return [
            {"role": "system", "content": system_prompt or SYSTEM_PROMPT},
            {"role": "user", "content": message},
        ]

    def _kwargs(self, system_prompt: str | None) -> dict:
        is_default = system_prompt is None
        return {
            "model": MODEL,
            "temperature": TEMPERATURE,
            "max_tokens": MAX_TOKENS,
            **({"response_format": {"type": "json_object"}} if is_default else {}),
        }

    def generate(self, message: str, system_prompt: str | None = None) -> str:
        response = self.client.chat.completions.create(
            messages=self._messages(message, system_prompt),
            **self._kwargs(system_prompt),
        )
        return response.choices[0].message.content

    def generate_stream(self, message: str, system_prompt: str | None = None) -> Iterator[str]:
        stream = self.client.chat.completions.create(
            messages=self._messages(message, system_prompt),
            **self._kwargs(system_prompt),
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content
            if delta:
                yield delta
