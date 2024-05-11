from typing import List
from uuid import UUID
from api.core.document.domain.document import Document, DocumentOutput
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
            "fileName": document.documentFile.filename
        }
        return self.repository.verify_by_query(collectionName=self.collection_name, query=query)

    def get_by_id(self, id: UUID) -> Document | None:
        item = self.repository.get_by_id(id)
        if item:
            return Document(id=UUID(item["id"]), title=item["title"])
        return None
    
    def list(self, filters) -> List[DocumentOutput]:
        documents = self.repository.list_all(self.collection_name, filters, {"fileName": 1, "documentTitle": 1, "theme": 1, "subtheme": 1, "indexStatus": 1, "id": 1, "uploadDate": 1, "expiryDate": 1, "uploadedBy": 1, "_id": 0})
        list_of_documents = []

        for document in documents:
            if all(field in document for field in ["id", "fileName", "documentTitle", "theme", "subtheme", "indexStatus", "uploadDate", "expiryDate", "uploadedBy"]):
                documentToSave = DocumentOutput(UUID(document["id"]), document["fileName"], document["documentTitle"], document["theme"], document["subtheme"], document["indexStatus"], document["uploadDate"], document["expiryDate"], document["uploadedBy"])
                list_of_documents.append(documentToSave)

        print(documents)
        return list_of_documents