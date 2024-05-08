import uuid
from api.core.category.domain.category import Category
from api.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository


class TestSave:
    def test_can_save_category(self):
        repository = InMemoryCategoryRepository()
        category = Category(
            name="Filme",
        )

        repository.save(category)

        assert len(repository.categories) == 1
        assert repository.categories[0] == category


class TestGetById:
    def test_can_get_category_by_id(self):
        category_filme = Category(
            name="Filme",
        )
        category_serie = Category(
            name="Série",
        )
        repository = InMemoryCategoryRepository(
            categories=[
                category_filme,
                category_serie,
            ]
        )

        category = repository.get_by_id(category_filme.id)

        assert category == category_filme

    def test_when_category_does_not_exists_should_return_none(self):
        category_filme = Category(
            name="Filme",
        )
        repository = InMemoryCategoryRepository(
            categories=[
                category_filme,
            ]
        )

        category = repository.get_by_id(uuid.uuid4())

        assert category is None