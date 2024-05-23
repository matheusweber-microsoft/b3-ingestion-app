from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from src.core.document.application.use_cases.exceptions import DocumentNotFound

from src.core.document.domain.document import Document, DocumentOutput, SingleDocumentOutput
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from src.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository
from src.core.log import Logger

class GetDocument:
    def __init__(self, repository: DocumentRepository, storageRepository: StorageDocumentRepository):
        self.logging = Logger()
        self.repository = repository
        self.storageRepository = storageRepository

    @dataclass
    class Input:
        id: str
    
        def toQuery(self) -> dict:
            query = {}
            if self.id:
                query['id'] = self.id
            return query


    @dataclass
    class Output:
        data: SingleDocumentOutput

    def execute(self, input: Input) -> Output:
        self.logging.info("GD-EX-1 - Executing GetDocument use case")
        document = self.repository.get_by_id(UUID(input.id))
        if document == None:
            self.logging.error("GD-EX-2 - Document not found")
            raise DocumentNotFound("Document not found")
        for page in document.documentPages:
            page.documentURL = self.storageRepository.get_document_url("documentpages/"+page.storageFilePath)
               
        return self.Output(data=document)
