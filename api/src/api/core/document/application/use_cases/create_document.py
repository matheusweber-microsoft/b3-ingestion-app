from dataclasses import dataclass
from uuid import UUID
import datetime

from api.core.document.domain.document import Document
from api.core.document.application.use_cases.exceptions import DocumentAlreadyExists, InvalidDocument
from api.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from api.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository
from api.infra.storageQueue.StorageQueueService import StorageQueueService

@dataclass
class CreateDocumentRequest:
    documentTitle: str
    theme: str
    subtheme: str
    expiryDate: datetime
    documentFile: bytes
    uploadedBy: str

@dataclass
class CreateDocumentResponse:
    id: UUID


class CreateDocument:
    def __init__(self, repository: DocumentRepository, storageRepository: StorageDocumentRepository):
        self.repository = repository
        self.storageRepository = storageRepository
        self.queueService = StorageQueueService("original-docs-action-received")

    def execute(self, request: CreateDocumentRequest) -> CreateDocumentResponse:
        try:
            document = Document(
                documentTitle=request.documentTitle,
                theme=request.theme,
                subtheme=request.subtheme,
                expiryDate=request.expiryDate,
                documentFile=request.documentFile,
                uploadedBy=request.uploadedBy
            )
        except ValueError as err:
            raise InvalidDocument(err)
        
        print(document.to_dict())

        if self.repository.verify_duplicity(document=document):
            raise DocumentAlreadyExists("Document with the same document title, theme and subtheme already exists.")
                
        self.storageRepository.upload_file(document)

        self.repository.save(document)

        self.queueService.send_message(
            message_dict=self.generate_message_from_document(document)
        )
        
        return CreateDocumentResponse(id=document.id)
    
    def generate_message_from_document(self, document: Document):
        message_dict = {
            "action": "index",
            "fileId": str(document.id),
            "storageFilePath": document.storageFilePath,
            "fileName": document.filename,
            "originalFileFormat": document.originalFileFormat,
            "theme": document.theme,
            "subtheme": document.subtheme,
            "language": document.language
        }
        return message_dict

