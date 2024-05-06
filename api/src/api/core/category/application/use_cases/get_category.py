from dataclasses import dataclass
from uuid import UUID

from api.core.category.application.use_cases.exceptions import CategoryNotFound
from api.core.category.domain.category_repository import CategoryRepository
from api.core.category.domain.category import Category

@dataclass
class GetCategoryRequest:
    id: UUID


@dataclass
class GetCategoryResponse:
    id: UUID
    name: str


class GetCategory:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def execute(self, request: GetCategoryRequest) -> GetCategoryResponse:
        category = self.repository.get_by_id(request.id)

        if category is None:
            raise CategoryNotFound(f"Category with {request.id} not found")

        return GetCategoryResponse(
            id=category.id,
            name=category.name,
        )

