from decorators.exceptions import AuthError
from src.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from src.infra.storageQueue.StorageQueueService import StorageQueueService
from quart import Quart, jsonify
from src.quart_project.routes import setup_routes
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
from dotenv import load_dotenv
import os
import logging
from quart_cors import cors
from jose.exceptions import ExpiredSignatureError

app = Quart(__name__)
app = cors(app, allow_origin="*")

@app.errorhandler(AuthError)
async def handle_auth_error(e):
    response = jsonify(e.error)
    response.status_code = e.status_code
    return response

@app.errorhandler(ExpiredSignatureError)
async def handle_expired_signature_error(e):
    response = jsonify({"code": "token_expired", "description": "token is expired"})
    response.status_code = 401
    return response

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