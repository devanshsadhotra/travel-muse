from abc import ABC, abstractmethod


class LLMClient(ABC):
    @abstractmethod
    def generate(self, message: str, system_prompt: str | None = None) -> str:
        pass
