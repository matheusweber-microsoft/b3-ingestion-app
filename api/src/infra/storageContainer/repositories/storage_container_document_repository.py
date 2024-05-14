import logging
from src.core.document.domain.document import Document
from src.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from werkzeug.datastructures import FileStorage

class StorageDocumentRepository():
    def __init__(self, repository: StorageContainerRepository):
        self.repository = repository

    def upload_file(self, document: Document):
        logging.info(f"Uploading file: {document.documentFile.filename}")
        self.repository.save_file_to_azure(document.documentFile, container_path=document.get_container_path())

    def get_document_url(self, path: str):
        logging.info(f"Getting document URL for path: {path}")
        return self.repository.get_document_url(path)
