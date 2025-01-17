import os
from src.infra.storageContainer.exceptions import FileNotUploaded
from azure.storage.blob import generate_blob_sas, BlobSasPermissions, BlobServiceClient, generate_blob_sas, ContentSettings
from werkzeug.datastructures import FileStorage
from datetime import datetime, timedelta
from src.core.log import Logger

class StorageContainerRepository:
    container_name = "originaldocuments"

    def __init__(self):
        self.logging = Logger()
        azure_storage_connection_string = os.getenv('AZURE_STORAGE_ACCOUNT_CONN_STRING')
        self.blob_service_client = BlobServiceClient.from_connection_string(azure_storage_connection_string)

    def upload_blob(self, container_name, blob_name, data, content_settings):
        container_client = self.blob_service_client.get_container_client(container_name)
        container_client.upload_blob(name=blob_name, data=data, content_settings=content_settings)
        self.logging.info(f"SCR-1-UB - Blob '{blob_name}' uploaded to container '{container_name}'")

    def save_file_to_azure(self, file_storage: FileStorage, container_path: str, content_type: str = None):
        self.logging.info(f"SCR-1-SFTA - Saving file {content_type}")
        container_names = container_path.split("/")
        container_names.insert(0, self.container_name)
        container_name = container_names[0]
        cnt_settings = ContentSettings(content_type=content_type)

        for sub_container in container_names[1:]:
            container_name += "/" + sub_container
            try:
                self.blob_service_client.create_container(container_name)
                self.logging.info(f"SCR-1-SFTA - Container '{container_name}' created")
            except Exception as e:
                self.logging.warning(f"SCR-2-SFTA - Container '{container_name}' already exists. Skipping creation.")
        
        self.upload_blob(container_name[:-1], file_storage.filename, file_storage, content_settings=cnt_settings)
        
        if not self.verify_blob(container_name[:-1], file_storage.filename):
            self.logging.error(f"SCR-1-UB-2 - Blob '{file_storage.filename}' was not uploaded successfully")
            raise FileNotUploaded

    def verify_blob(self, container_name: str, blob_name: str) -> bool:
        try:
            blob_client = self.blob_service_client.get_blob_client(container_name, blob_name)
            exists = blob_client.exists()
            if exists:
                self.logging.info(f"SCR-1-VB - Blob '{blob_name}' exists in container '{container_name}'")
            else:
                self.logging.warning(f"SCR-2-VB - Blob '{blob_name}' does not exist in container '{container_name}'")
            return exists
        except Exception as e:
            self.logging.error(f"SCR-3-VB - An exception occurred: {e}")
            return False
        
    def get_document_url(self, container_path: str) -> str:
        container_name, blob_name = os.path.split(container_path)
        blob_client = self.blob_service_client.get_blob_client(container_name, blob_name)
 
        # Generate SAS token
        sas_token = generate_blob_sas(
            account_name=blob_client.account_name,
            container_name=blob_client.container_name,
            blob_name=blob_client.blob_name,
            account_key=self.blob_service_client.credential.account_key,
            permission=BlobSasPermissions(read=True),
            expiry=datetime.utcnow() + timedelta(minutes=30)  # Token valid for 30 mins
        )  
        
        blob_url = blob_client.url + "?" + sas_token
        self.logging.info(f"SCR-1-GDU - Generated URL for blob '{blob_name}' in container '{container_name}'")
        return blob_url