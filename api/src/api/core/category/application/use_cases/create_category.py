from dataclasses import dataclass
from uuid import UUID

from api.core.category.application.use_cases.exceptions import InvalidCategory
from api.core.category.domain.category import Category
from api.core.category.domain.category_repository import CategoryRepository

@dataclass
class CreateCategoryRequest:
    name: str

@dataclass
class CreateCategoryResponse:
    id: UUID


class CreateCategory:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def execute(self, request: CreateCategoryRequest) -> CreateCategoryResponse:
        try:
            category = Category(
                name=request.name,
            )
        except ValueError as err:
            raise InvalidCategory(err)

        self.repository.save(category)
        return CreateCategoryResponse(id=category.id)

