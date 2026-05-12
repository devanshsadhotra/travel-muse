from providers.openai_client import OpenAIClient
from providers.gemini_client import GeminiClient

REGISTRY: dict = {
    "openai": OpenAIClient,
    "gemini": GeminiClient,
}
