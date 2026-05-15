from abc import ABC, abstractmethod
from typing import Iterator


class LLMClient(ABC):
    @abstractmethod
    def generate(self, message: str, system_prompt: str | None = None) -> str:
        pass

    @abstractmethod
    def generate_stream(self, message: str, system_prompt: str | None = None) -> Iterator[str]:
        pass
