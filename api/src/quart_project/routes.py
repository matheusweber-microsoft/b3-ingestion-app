from quart_cors import route_cors
import logging
import os
from src.core.theme.application.use_cases.list_themes import ListTheme
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from src.infra.cosmosDB.repositories.cosmosDB_theme_repository import ThemeRepository
from src.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository
from quart import jsonify, request
import json
from src.core.document.application.use_cases.create_document import CreateDocument, CreateDocumentRequest, CreateDocumentResponse
from src.core.document.application.use_cases.list_documents import ListDocuments
from src.core.document.application.use_cases.get_document import GetDocument
from quart_cors import route_cors
import logging

def setup_routes(app, cosmos_repository, storage_container_repository):
    @app.post("/api/v1/document")
    @route_cors(allow_origin=os.getenv('ORIGIN_CORS'))
    async def create_document():
        logging.info("Received request to create document")
        data = await request.form
        files = await request.files
        use_case = CreateDocument(DocumentRepository(cosmos_repository), StorageDocumentRepository(storage_container_repository))
        
        if files == None:
            logging.error("No file was sent in the request")
            return jsonify({'error': "Nenhum arquivo foi enviado."}), 400
        
        try:
            response = use_case.execute(CreateDocumentRequest(documentTitle=data["documentTitle"], theme=data["theme"], themeName=data["themeName"], subtheme=data["subtheme"], subthemeName=data["subthemeName"], expiryDate=data["expiryDate"], documentFile=files["documentFile"], uploadedBy=data["uploadedBy"], language=data["language"]))
            logging.info("Document created successfully")
            return jsonify({'id': str(response.id)}), 201
        except Exception as e:
            logging.error(f"Error creating document: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.get("/api/v1/themes")
    @route_cors(allow_origin=os.getenv('ORIGIN_CORS'))
    async def get_themes():
        logging.info("Received request to get themes")
        data = await request.form
        use_case = ListTheme(ThemeRepository(cosmos_repository))

        try:
            response = use_case.execute()
            themes_json = [theme.to_dict() for theme in response.data]
            logging.info("Themes retrieved successfully")
            return themes_json, 200
        except Exception as e:
            logging.error(f"Error getting themes: {str(e)}")
            return jsonify({'error': str(e)}), 400
    
    @app.get("/api/v1/documents")
    @route_cors(allow_origin=os.getenv('ORIGIN_CORS'))
    async def get_documents():
        logging.info("Received request to get documents")
        data = await request.json

        documentTitle = request.args.get("documentTitle")
        fileName = request.args.get("fileName")
        uploadDate = request.args.get("uploadDate")
        onlyExpired = request.args.get("onlyExpired")
        theme = request.args.get("theme")
        subtheme = request.args.get("subtheme")
        uploadedBy = request.args.get("uploadedBy")
        page = request.args.get("page")
        if page == '' or page == None:
            page = 1
        input = ListDocuments.Input(documentTitle=documentTitle, fileName=fileName, uploadDate=uploadDate, onlyExpired=onlyExpired, theme=theme, subtheme=subtheme, uploadedBy=uploadedBy, page=int(page))
        use_case = ListDocuments(DocumentRepository(cosmos_repository))

        try:
            response = use_case.execute(input)
            documents_json = [document.to_dict() for document in response.data]
            logging.info("Documents retrieved successfully")
            return documents_json, 200
        except Exception as e:
            logging.error(f"Error getting documents: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.get("/api/v1/document/<id>")
    @route_cors(allow_origin=os.getenv('ORIGIN_CORS'))
    async def get_document(id):
        logging.info(f"Received request to get document with id: {id}")
        use_case = GetDocument(DocumentRepository(cosmos_repository), StorageDocumentRepository(storage_container_repository))

        try:
            response = use_case.execute(GetDocument.Input(id))
            logging.info("Document retrieved successfully")
            return (response.data.to_dict(), 200)
        except Exception as e:
            logging.error(f"Error getting document: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.get("/")
    async def hello_world():
        logging.info("Received request for hello world")
        return jsonify({'message': "Hello world!"}), 200