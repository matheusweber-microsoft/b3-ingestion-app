from api.infra.storageContainer.exceptions import FileNotUploaded
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
from werkzeug.datastructures import FileStorage

class StorageContainerRepository:
    container_name = "originaldocuments"

    def __init__(self, connection_string):
        self.blob_service_client = BlobServiceClient.from_connection_string(connection_string)
    
    def upload_blob(self, container_name, blob_name, data):
        container_client = self.blob_service_client.get_container_client(container_name)
        container_client.upload_blob(name=blob_name, data=data)

    def save_file_to_azure(self, file_storage: FileStorage, container_path: str):
        container_names = container_path.split("/")
        container_names.insert(0, self.container_name)
        container_name = container_names[0]
       
        for sub_container in container_names[1:]:
            container_name += "/" + sub_container
            try:
                self.blob_service_client.create_container(container_name)
            except Exception as e:
                print(f"Container '{container_name}' already exists. Skipping creation.")  
        
        self.upload_blob(container_name[:-1], file_storage.filename, file_storage)

        if not self.verify_blob(container_name[:-1], file_storage.filename):
            raise FileNotUploaded

    def verify_blob(self, container_name: str, blob_name: str) -> bool:
        try:
            blob_client = self.blob_service_client.get_blob_client(container_name, blob_name)
            return blob_client.exists()
        except Exception as e:
            print(f"An exception occurred: {e}")
            return False
        
    def get_document_url(self, container_path: str) -> str:
        container_names = container_path.split("/")
        container_name = container_names[0]
        filename = container_names[-1]
        if len(container_names) > 1:
            container_name += "/" + "/".join(container_names[1:-1])
        blob_client = self.blob_service_client.get_blob_client(container_path, filename)
        blob_url = blob_client.url
        return blob_url