from src.core.document.domain.document import Document
from src.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from werkzeug.datastructures import FileStorage

class StorageDocumentRepository():
    def __init__(self, repository: StorageContainerRepository):
        self.repository = repository

    def upload_file(self, document: Document):
        self.repository.save_file_to_azure(document.documentFile, container_path=document.get_container_path())

    def get_document_url(self, path: str):
        return self.repository.get_document_url(path)
