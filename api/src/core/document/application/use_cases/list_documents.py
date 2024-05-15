from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from src.core.document.domain.document import SingleDocumentOutput
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
import logging

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
        page: int = 1
        limit: int = 5

        def toQuery(self) -> dict:
            query = {}
            if self.documentTitle:
                query['documentTitle'] = {
                    '$regex': self.documentTitle, '$options': 'i'}
            if self.fileName:
                query['fileName'] = {'$regex': self.fileName, '$options': 'i'}
            if self.uploadDate:
                start_of_day = datetime.strptime(
                    self.uploadDate, '%Y-%m-%d').replace(hour=0, minute=0, second=0)
                end_of_day = start_of_day.replace(
                    hour=23, minute=59, second=59)
                query['uploadDate'] = {
                    '$gte': start_of_day, '$lte': end_of_day}
            if self.theme:
                query['theme'] = self.theme
            if self.subtheme:
                query['subtheme'] = self.subtheme
            if self.onlyExpired and self.onlyExpired == True:
                query['expiryDate'] = {'$lt': datetime.now()}
            if self.uploadedBy:
                query['uploadedBy'] = {
                    '$regex': self.uploadedBy, '$options': 'i'}
            return query

    @dataclass
    class Output:
        data: list[SingleDocumentOutput]

    def execute(self, input: Input) -> Output:
        logging.info("Executing ListDocuments use case")
        documents = self.repository.list(
            filters=input.toQuery(),
            page=input.page,
            limit=input.limit
        )

        return self.Output(data=documents)
