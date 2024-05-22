from dataclasses import dataclass
from datetime import datetime, timedelta
from uuid import UUID

from src.core.document.domain.document import SingleDocumentOutput
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
import logging
import math

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
        uploadedBy: int = None
        page: int = 1
        limit: int = 10

        def toQuery(self) -> dict:
            query = {}
            if self.documentTitle:
                query['documentTitle'] = {
                    '$regex': self.documentTitle, '$options': 'i'}
            if self.fileName:
                query['fileName'] = {'$regex': self.fileName, '$options': 'i'}
            if self.uploadDate:
                days = int(self.uploadDate)
                print("Days: ", days)
                query['uploadDate'] = {'$gte': datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=days)}
                print({'$gte': datetime.now() - timedelta(days=days)})
            if self.theme:
                query['theme'] = self.theme
            if self.subtheme:
                query['subtheme'] = self.subtheme
            if self.onlyExpired and self.onlyExpired == True:
                query['expiryDate'] = {'$lte': datetime.now() + timedelta(days=6)}
            if self.uploadedBy:
                query['uploadedBy'] = {
                    '$regex': self.uploadedBy, '$options': 'i'}
            return query

    @dataclass
    class Output:
        data: list[SingleDocumentOutput]
        count: int
        pages: int

        def toDict(self) -> dict:
            return {
                "data": [document.to_dict() for document in self.data],
                "metadata": {
                    "totalCount": self.count,
                    "totalPages": self.pages
                }
            }

    def execute(self, input: Input) -> Output:
        logging.info("Executing ListDocuments use case")
        data = self.repository.list(
            filters=input.toQuery(),
            page=input.page,
            limit=input.limit
        )

        return self.Output(data=data[0], count=data[1], pages=math.ceil(data[1] / input.limit))
