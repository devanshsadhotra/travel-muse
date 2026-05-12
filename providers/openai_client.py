import os
from openai import OpenAI
from providers.base import LLMClient
from config import MODEL, SYSTEM_PROMPT, TEMPERATURE, MAX_TOKENS


class OpenAIClient(LLMClient):
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def generate(self, message: str, system_prompt: str | None = None) -> str:
        is_default = system_prompt is None
        response = self.client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt or SYSTEM_PROMPT},
                {"role": "user", "content": message},
            ],
            **({"response_format": {"type": "json_object"}} if is_default else {}),
            temperature=TEMPERATURE,
            max_tokens=MAX_TOKENS,
        )
        return response.choices[0].message.content
