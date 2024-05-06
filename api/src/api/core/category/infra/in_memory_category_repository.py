from uuid import UUID

from api.core.category.domain.category import Category
from api.core.category.domain.category_repository import CategoryRepository

class InMemoryCategoryRepository(CategoryRepository):
    def __init__(self, categories: list[Category]=None):
        self.categories: list[Category] = categories or []

    def save(self, category: Category) -> None:
        self.categories.append(category)

    def get_by_id(self, id: UUID) -> Category | None:
        return next(
            (category for category in self.categories if category.id == id), None
        )
