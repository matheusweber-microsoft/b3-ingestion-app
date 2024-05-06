import uuid

import pytest
from api.core.category.application.use_cases.exceptions import CategoryNotFound
from api.core.category.domain.category import Category
from api.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository
from api.core.category.application.use_cases.get_category import GetCategory, GetCategoryRequest, GetCategoryResponse


class TestGetCategory:
    def test_get_category(self):
        category_filme = Category(
            id=uuid.uuid4(),
            name="Filme",
        )
        category_serie = Category(
            id=uuid.uuid4(),
            name="Série",
        )
        repository = InMemoryCategoryRepository(
            categories=[
                category_filme,
                category_serie,
            ]
        )

        use_case = GetCategory(repository=repository)
        request = GetCategoryRequest(id=category_filme.id)
        response = use_case.execute(request)

        assert response == GetCategoryResponse(
            id=category_filme.id,
            name="Filme",
        )

    def test_when_category_with_id_does_not_exist_then_raise_not_found(self):
        category_filme = Category(
            id=uuid.uuid4(),
            name="Filme",
        )
        category_serie = Category(
            id=uuid.uuid4(),
            name="Série",
        )
        repository = InMemoryCategoryRepository(
            categories=[
                category_filme,
                category_serie,
            ]
        )

        use_case = GetCategory(repository=repository)
        request = GetCategoryRequest(id="non-existent-id")

        with pytest.raises(CategoryNotFound) as exc:
            use_case.execute(request)
