from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from api.core.document.domain.document import Document, DocumentOutput
from api.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository

class ListDocuments:
    def __init__(self, repository: DocumentRepository):
        self.repository = repository

    @dataclass
    class Input:
        documentTitle: str = None
        fileName: str = None
        uploadDate: str = None
        onlyExpired: bool = None
        theme: str = None
        subtheme: str = None
        uploadedBy: str = None
    
        def toQuery(self) -> dict:
            query = {}
            if self.documentTitle:
                query['documentTitle'] = self.documentTitle
            if self.fileName:
                query['fileName'] = self.fileName
            if self.uploadDate:
                query['uploadDate'] = self.uploadDate
            if self.theme:
                query['theme'] = self.theme
            if self.subtheme:
                query['subtheme'] = self.subtheme
            if self.onlyExpired and self.onlyExpired == True:
                query['expiryDate'] = {'$lt': datetime.now()}
            if self.uploadedBy:
                query['uploadedBy'] = self.uploadedBy
            return query


    @dataclass
    class Output:
        data: list[DocumentOutput]

    def execute(self, input: Input) -> Output:
        documents = self.repository.list(
            filters=input.toQuery()
        )
       
        return self.Output(data=documents)
