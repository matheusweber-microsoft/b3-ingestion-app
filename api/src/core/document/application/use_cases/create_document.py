from dataclasses import dataclass
from uuid import UUID
import datetime

from src.core.document.domain.document import Document
from src.core.document.application.use_cases.exceptions import DocumentAlreadyExists, InvalidDocument, GenericErrorUploadFile
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from src.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository
from src.infra.storageQueue.StorageQueueService import StorageQueueService
import os
import logging

@dataclass
class CreateDocumentRequest:
    documentTitle: str
    theme: str
    themeName: str
    subtheme: str
    subthemeName: str
    expiryDate: datetime
    documentFile: bytes
    uploadedBy: str
    language: str

@dataclass
class CreateDocumentResponse:
    id: UUID


class CreateDocument:
    def __init__(self, repository: DocumentRepository, storageRepository: StorageDocumentRepository):
        self.repository = repository
        self.storageRepository = storageRepository
        self.queueService = StorageQueueService(os.getenv('DOCUMENTS_QUEUE'))

    def execute(self, request: CreateDocumentRequest) -> CreateDocumentResponse:
        logging.info('Executing CreateDocument...')
        try:
            document = Document(
                documentTitle=request.documentTitle,
                theme=request.theme,
                themeName=request.themeName,
                subtheme=request.subtheme,
                subthemeName=request.subthemeName,
                expiryDate=request.expiryDate,
                documentFile=request.documentFile,
                uploadedBy=request.uploadedBy,
                language=request.language
            )
        except ValueError as err:
            logging.error('InvalidDocument: %s', err)
            raise InvalidDocument(err)
                
        if self.repository.verify_duplicity(document=document):
            logging.warning('DocumentAlreadyExists: Já existe um documento com o mesmo nome, tema e subtema.')
            raise DocumentAlreadyExists("Já existe um documento com o mesmo nome, tema e subtema.")
                
        try:
            self.storageRepository.upload_file(document)
        except Exception as e:
            if e.error_code == "BlobAlreadyExists":
                logging.warning('DocumentAlreadyExists: Já existe um documento com o mesmo nome, tema e subtema.')
                raise DocumentAlreadyExists("Já existe um documento com o mesmo nome, tema e subtema.")
            else:
                logging.error('GenericErrorUploadFile: %s', e)
                raise GenericErrorUploadFile(e) 

        self.repository.save(document)

        self.queueService.send_message(
            message_dict=self.generate_message_from_document(document)
        )

        logging.info('Document created successfully.')
        
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

