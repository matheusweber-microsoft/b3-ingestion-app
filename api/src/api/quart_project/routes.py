from api.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from api.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository
from quart import jsonify, request
import json
from api.core.category.application.use_cases.create_category import CreateCategory, CreateCategoryRequest
from api.core.category.infra.in_memory_category_repository import InMemoryCategoryRepository
from api.core.document.application.use_cases.create_document import CreateDocument, CreateDocumentRequest, CreateDocumentResponse


def setup_routes(app, cosmos_repository, storage_container_repository):
    @app.post("/api/v1/document")
    async def create_document():
        data = await request.form
        files = await request.files
        use_case = CreateDocument(DocumentRepository(cosmos_repository), StorageDocumentRepository(storage_container_repository))
        
        if files == None:
            return jsonify({'error': "No file uploaded."}), 400
        
        try:
            response = use_case.execute(CreateDocumentRequest(documentTitle=data["documentTitle"], theme=data["theme"], subtheme=data["subtheme"], expiryDate=data["expiryDate"], documentFile=files["documentFile"], uploadedBy=data["uploadedBy"], language=data["language"]))
            return jsonify({'id': str(response.id)}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 400