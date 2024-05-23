from src.core.log import Logger
from src.decorators.models.User import User
from src.decorators.exceptions import AuthError
from quart_cors import route_cors
from src.decorators.authentication import requires_auth, requires_role
from src.core.theme.application.use_cases.list_themes import ListTheme
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from src.infra.cosmosDB.repositories.cosmosDB_theme_repository import ThemeRepository
from src.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository
from quart import jsonify, request
from src.core.document.application.use_cases.create_document import CreateDocument, CreateDocumentRequest, CreateDocumentResponse
from src.core.document.application.use_cases.list_documents import ListDocuments
from src.core.document.application.use_cases.get_document import GetDocument
from src.core.document.application.use_cases.delete_document import DeleteDocument

def setup_routes(app, cosmos_repository, storage_container_repository):
    @app.post("/api/v1/document")
    @requires_auth
    @requires_role(['DocumentsManager.User', 'DocumentsManager.Admin'])
    async def create_document(user: User):
        logging = Logger()
        logging.info("RO-SR-1-CD - Received request to create document")
        data = await request.form
        files = await request.files
        use_case = CreateDocument(DocumentRepository(cosmos_repository), StorageDocumentRepository(storage_container_repository))
        
        if files == None:
            logging.error("RO-SR-2-CD - No file was sent in the request")
            return jsonify({'error': "Nenhum arquivo foi enviado."}), 400
        
        try:
            response = use_case.execute(CreateDocumentRequest(
                documentTitle=data["documentTitle"],
                theme=data["theme"],
                themeName=data["themeName"],
                subtheme=data["subtheme"],
                subthemeName=data["subthemeName"],
                expiryDate=data["expiryDate"],
                documentFile=files["documentFile"],
                uploadedBy=user.username,
                language=data["language"]
            ))
            logging.info("RO-SR-3-CD - Document created successfully")
            return jsonify({'id': str(response.id)}), 201
        except Exception as e:
            logging.error(f"RO-SR-4-CD - Error creating document: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.get("/api/v1/themes")
    @requires_auth
    @requires_role(['DocumentsManager.User', 'DocumentsManager.Admin'])
    async def get_themes(user: User):
        logging = Logger()
        logging.info("RO-SR-1-GT - Received request to get themes")
        data = await request.form
        use_case = ListTheme(ThemeRepository(cosmos_repository))

        try:
            response = use_case.execute()
            themes_json = [theme.to_dict() for theme in response.data]
            logging.info("RO-SR-2-GT - Themes retrieved successfully")
            return themes_json, 200
        except Exception as e:
            logging.error(f"RO-SR-3-GT - Error getting themes: {str(e)}")
            return jsonify({'error': str(e)}), 400
    
    @app.get("/api/v1/documents")
    @requires_auth
    @requires_role(['DocumentsManager.User', 'DocumentsManager.Admin'])
    async def get_documents(user: User):
        logging = Logger()
        logging.info("RO-SR-1-GTH - Received request to get documents")
        data = await request.json

        documentTitle = request.args.get("documentTitle")
        fileName = request.args.get("fileName")
        uploadDate = request.args.get("uploadDate")
        onlyExpired = request.args.get("onlyExpired")
        
        if onlyExpired == 'false':
            onlyExpired = False
        elif onlyExpired == 'true':
            onlyExpired = True

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
            logging.info("RO-SR-2-GTH - Documents retrieved successfully")
            return response.toDict(), 200
        except Exception as e:
            logging.error(f"RO-SR-3-GTH - Error getting documents: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.get("/api/v1/documents/<id>")
    @requires_auth
    @requires_role(['DocumentsManager.User', 'DocumentsManager.Admin'])
    async def get_document(id, user: User):
        logging = Logger()
        logging.info(f"RO-SR-1-DO - Received request to get document with id: {id}")
        use_case = GetDocument(DocumentRepository(cosmos_repository), StorageDocumentRepository(storage_container_repository))

        try:
            response = use_case.execute(GetDocument.Input(id))
            logging.info("RO-SR-2-DO - Document retrieved successfully")
            return (response.data.to_dict(), 200)
        except Exception as e:
            logging.error(f"RO-SR-3-DO - Error getting document: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.delete("/api/v1/documents/<id>")
    @requires_auth
    @requires_role(['DocumentsManager.User', 'DocumentsManager.Admin'])
    async def delete_document(id, user: User):
        logging = Logger()
        logging.info(f"RO-SR-1-DD - Received request to delete document with id: {id}")
        use_case = DeleteDocument(user, DocumentRepository(cosmos_repository))

        try:
            response = use_case.execute(DeleteDocument.Input(id))
            logging.info("RO-SR-2-DD - Document deleted successfully")
            return (response.to_dict(), 200)
        except Exception as e:
            logging.error(f"RO-SR-3-DD - Error getting document: {str(e)}")
            return jsonify({'error': str(e)}), 400
        
    @app.get("/")
    async def hello_world():
        logging = Logger()
        logging.info("RO-SR-1-HW - Received request for hello world")
        return jsonify({'message': "Hello world!"}), 200