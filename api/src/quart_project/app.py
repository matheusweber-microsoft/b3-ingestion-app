from src.decorators.exceptions import AuthError
from src.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from src.infra.storageQueue.StorageQueueService import StorageQueueService
from quart import Quart, jsonify
from src.quart_project.routes import setup_routes
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
from dotenv import load_dotenv
import os
from quart_cors import cors
from jose.exceptions import ExpiredSignatureError

app = Quart(__name__)
app = cors(app, allow_origin="*")

def run():
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

def create_app():
    load_dotenv()
    app.config['MAX_CONTENT_LENGTH'] = os.getenv("MAX_CONTENT_LENGTH", 100 * 1024 * 1024)
    cosmos_repository_connection_string = os.getenv('MONGODB_CONN_STRING')
    cosmos_database_name = os.getenv('DATABASE_NAME')
    cosmos_repository = CosmosRepository(connection_string=cosmos_repository_connection_string, database_name=cosmos_database_name)
    storage_container_repository = StorageContainerRepository()

    setup_routes(app, cosmos_repository, storage_container_repository)
    return app