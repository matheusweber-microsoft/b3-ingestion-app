from typing import List
from uuid import UUID
from src.core.document.application.use_cases.exceptions import DocumentNotFound
from src.core.document.domain.document import Document, DocumentOutput, SingleDocumentOutput
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
 
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

    def list(self, filters, page=1, limit=100) -> List[SingleDocumentOutput]:
        documents = self.repository.list_all(self.collection_name, filters, {"fileName": 1, "documentTitle": 1, "theme": 1, "subtheme": 1, "indexStatus": 1, "id": 1, "uploadDate": 1, "expiryDate": 1, "uploadedBy": 1, "_id": 0}, page=page, limit=limit)
        list_of_documents = []

        for document in documents:
            if all(field in document for field in ["id", "fileName", "documentTitle", "theme", "subtheme", "indexStatus", "uploadDate", "expiryDate", "uploadedBy"]):
                documentToSave = SingleDocumentOutput(document)
                list_of_documents.append(documentToSave)

        return list_of_documents
    
    def get_by_id(self, id: UUID) -> SingleDocumentOutput:
        document = SingleDocumentOutput(self.repository.get_by_id(self.collection_name, str(id)))

        if document == None:
            raise DocumentNotFound("Nenhum documento com esse id foi encontrado.")
            
        return document