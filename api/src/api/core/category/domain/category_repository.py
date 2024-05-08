from abc import ABC, abstractmethod
from uuid import UUID

from api.core.category.domain.category import Category

class CategoryRepository(ABC):
    @abstractmethod
    def save(self, category: Category):
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Category | None:
        raise NotImplementedError
