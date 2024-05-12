from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from api.core.document.domain.document import Document, DocumentOutput, SingleDocumentOutput
from api.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from api.infra.storageContainer.repositories.storage_container_document_repository import StorageDocumentRepository

class GetDocument:
    def __init__(self, repository: DocumentRepository, storageRepository: StorageDocumentRepository):
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
        document = self.repository.get_by_id(UUID(input.id))
        for page in document.documentPages:
            page.documentURL = self.storageRepository.get_document_url("documentpages/"+page.storageFilePath)
               
        return self.Output(data=document)
