from dataclasses import dataclass
from datetime import datetime, timedelta
from uuid import UUID

from src.core.document.domain.document import SingleDocumentOutput
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
import math
from datetime import datetime, timedelta, timezone
from src.core.log import Logger

class ListDocuments:
    def __init__(self, repository: DocumentRepository):
        self.logging = Logger()
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
                current_time = datetime.now(timezone.utc)
                start_time = current_time.replace(hour=0, minute=0, second=0, microsecond=0) - timedelta(days=days)
                query['uploadDate'] = {'$gte': start_time}
                print({'$gte': datetime.now() - timedelta(days=days)})
            if self.theme:
                query['theme'] = self.theme
            if self.subtheme:
                query['subtheme'] = self.subtheme
            if self.onlyExpired and self.onlyExpired == True:
                current_time = datetime.now(timezone.utc)
                query['expiryDate'] = {'$lte': current_time + timedelta(days=7)}
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
        self.logging.info("LE-EX-1 - Executing ListDocuments use case")
        data = self.repository.list(
            filters=input.toQuery(),
            page=input.page,
            limit=input.limit
        )

        return self.Output(data=data[0], count=data[1], pages=math.ceil(data[1] / input.limit))
