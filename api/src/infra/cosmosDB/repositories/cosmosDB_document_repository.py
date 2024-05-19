from typing import List
from uuid import UUID
from src.core.document.application.use_cases.exceptions import DocumentNotFound, DocumentWithWrongFormat
from src.core.document.domain.document import Document, DocumentOutput, SingleDocumentOutput
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
import logging

class DocumentRepository():
    collection_name = "documentskb"

    def __init__(self, repository: CosmosRepository):
        self.repository = repository

    def save(self, document: Document) -> None:
        logging.info("Saving document: %s", document)
        self.repository.save(self.collection_name, document.to_dict())
 
    def verify_duplicity(self, document: Document):
        query = {
            "theme": document.theme,
            "subtheme": document.subtheme,
            "fileName": document.documentFile.filename
        }
        logging.debug("Verifying duplicity for document: %s", document)
        return self.repository.verify_by_query(collectionName=self.collection_name, query=query)

    def list(self, filters, page=1, limit=100) -> tuple[List[SingleDocumentOutput], int]:
        logging.info("Listing documents with filters: %s, page: %s, limit: %s", filters, page, limit)
        documents = self.repository.list_all(self.collection_name, filters, {"fileName": 1, "documentTitle": 1, "theme": 1, "themeName": 1, "subthemeName": 1, "subtheme": 1, "indexStatus": 1, "id": 1, "uploadDate": 1, "expiryDate": 1, "storageFilePath": 1, "uploadedBy": 1, "originalFileFormat": 1, "language": 1, "_id": 0}, page=page, limit=limit)
        number_of_documents = self.repository.count(self.collection_name, filters)

        list_of_documents = []

        for document in documents:
            if all(field in document for field in ["id", "fileName", "documentTitle", "theme", "subtheme", "indexStatus", "uploadDate", "expiryDate", "uploadedBy"]):
                documentToSave = SingleDocumentOutput(document)
                list_of_documents.append(documentToSave)

        return [list_of_documents, number_of_documents]
    
    def get_by_id(self, id: UUID) -> SingleDocumentOutput:
        logging.info("Getting document by id: %s", id)
        try:
            document = SingleDocumentOutput(self.repository.get_by_id(self.collection_name, str(id)))
        except:
            logging.error("Unable to create object with this document id: %s", id)
            return None

        if document == None:
            logging.error("Document not found with id: %s", id)
            raise DocumentNotFound("Nenhum documento com esse id foi encontrado.")
            
        return document
    
    def update(self, id: UUID, updated_data: dict) -> None:
        logging.info("Updating document with id: %s", id)
        existing_document = self.repository.get_by_id(self.collection_name, str(id))

        if existing_document is None:
            logging.error("Document not found with id: %s", id)
            raise DocumentNotFound("Nenhum documento com esse id foi encontrado.")

        self.repository.update(self.collection_name, str(id), updated_data)
       