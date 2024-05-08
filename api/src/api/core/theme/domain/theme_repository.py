from abc import ABC, abstractmethod
from uuid import UUID

from api.core.theme.domain.theme import Theme

class ThemeRepository(ABC):
    @abstractmethod
    def list(self) -> list[Theme]:
        raise NotImplementedError