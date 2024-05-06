from quart import jsonify, request
from api.core.category.application.use_cases.create_category import CreateCategory, CreateCategoryRequest
from api.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository

async def create_category():
    data = await request.get_json()
    use_case = CreateCategory(InMemoryCategoryRepository())
    response = use_case.execute(CreateCategoryRequest(name=data['name']))
    return jsonify({'id': str(response.id)}), 201

def setup_routes(app):
    app.add_url_rule('/categories', 'create_category', create_category, methods=['POST'])
