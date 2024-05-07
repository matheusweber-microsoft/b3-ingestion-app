from api.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from api.infra.storageQueue.StorageQueueService import StorageQueueService
from quart import Quart
from api.quart_project.routes import setup_routes
from api.infra.cosmosDB.cosmosRepository import CosmosRepository
from api.infra.secrets import Secrets

app = Quart(__name__)

def run():
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

def create_app():
    secrets = Secrets.getInstance()
    cosmos_repository = CosmosRepository(connection_string=secrets.connection_string_cosmos_db, database_name="b3-gpt-db", container_name="b3-gpt-container")
    storage_container_repository = StorageContainerRepository(connection_string=secrets.connection_string_storage_container)
    
    setup_routes(app, cosmos_repository, storage_container_repository)
    return app
