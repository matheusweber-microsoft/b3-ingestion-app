from src.core.document.domain.document import Document
from src.infra.storageContainer.storageContainerRepository import StorageContainerRepository
from werkzeug.datastructures import FileStorage
from src.core.log import Logger

class StorageDocumentRepository():
    def __init__(self, repository: StorageContainerRepository):
        self.logging = Logger()
        self.repository = repository

    def upload_file(self, document: Document):
        self.logging.info(f"SDR-1-UF - Uploading file: {document.documentFile.filename}")
        if document.originalFileFormat == "pdf":
            content_type = "application/pdf"
        elif document.originalFileFormat == "docx":
            content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        else:
            content_type = "application/octet-stream"
        self.repository.save_file_to_azure(document.documentFile, container_path=document.get_container_path(), content_type=content_type)

    def get_document_url(self, path: str):
        self.logging.info(f"SDR-1-GDU - Getting document URL for path: {path}")
        return self.repository.get_document_url(path)
