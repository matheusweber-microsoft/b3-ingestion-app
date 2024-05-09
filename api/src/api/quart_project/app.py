from api.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from api.infra.storageQueue.StorageQueueService import StorageQueueService
from quart import Quart
from api.quart_project.routes import setup_routes
from api.infra.cosmosDB.cosmosRepository import CosmosRepository
from dotenv import load_dotenv
import os

app = Quart(__name__)

def run():
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

def create_app():
    load_dotenv()
    cosmos_repository = CosmosRepository(connection_string=os.getenv('CONNECTION_STRING_COSMOS_DB'), database_name=os.getenv('DATABASE_NAME'))
    storage_container_repository = StorageContainerRepository(connection_string=os.getenv('CONNECTION_STRING_STORAGE_CONTAINER'))
    
    setup_routes(app, cosmos_repository, storage_container_repository)
    return app
