from src.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from src.infra.storageQueue.StorageQueueService import StorageQueueService
from quart import Quart
from src.quart_project.routes import setup_routes
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
from dotenv import load_dotenv
import os
import logging
from quart_cors import cors

app = Quart(__name__)
app = cors(app, allow_origin=os.getenv('ORIGIN_CORS'))


def run():
    logging.basicConfig(level=logging.INFO)
    app = create_app()
    app.run(host='0.0.0.0', port=5000)


def create_app():
    load_dotenv()
    cosmos_repository = CosmosRepository(connection_string=os.getenv(
        'CONNECTION_STRING_COSMOS_DB'), database_name=os.getenv('DATABASE_NAME'))
    storage_container_repository = StorageContainerRepository(
        connection_string=os.getenv('CONNECTION_STRING_STORAGE_CONTAINER'))

    setup_routes(app, cosmos_repository, storage_container_repository)
    return app
