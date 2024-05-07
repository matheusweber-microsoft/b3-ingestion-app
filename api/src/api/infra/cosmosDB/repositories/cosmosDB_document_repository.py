from uuid import UUID
from api.core.document.domain.document import Document
from api.infra.cosmosDB.cosmosRepository import CosmosRepository
 
class DocumentRepository():
    collection_name = "documentskb"

    def __init__(self, repository: CosmosRepository):
        self.repository = repository

    def save(self, document: Document) -> None:
        self.repository.save(self.collection_name, document.to_dict())
 
    def verify_duplicity(self, document: Document):
        query = {
            "theme": document.theme,
            "subtheme": document.subtheme,
            "documentTitle": document.documentTitle
        }
        return self.repository.verify_by_query(collectionName=self.collection_name, query=query)

    def get_by_id(self, id: UUID) -> Document | None:
        item = self.repository.get_by_id(id)
        if item:
            return Document(id=UUID(item["id"]), title=item["title"])
        return None