from src.infra.keyVault.keyVault import KeyVault
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
    keyVault = KeyVault()
    cosmos_repository = CosmosRepository(connection_string=keyVault.get_secret(os.getenv('KEY_VAULT_COSMOS_DB_CONN_NAME')), database_name=os.getenv('DATABASE_NAME'))
    storage_container_repository = StorageContainerRepository()

    setup_routes(app, cosmos_repository, storage_container_repository)
    return app