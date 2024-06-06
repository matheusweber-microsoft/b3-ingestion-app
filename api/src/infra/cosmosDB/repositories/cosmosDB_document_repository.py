from typing import List
from uuid import UUID
from src.core.document.application.use_cases.exceptions import DocumentNotFound, DocumentWithWrongFormat
from src.core.document.domain.document import Document, DocumentOutput, SingleDocumentOutput
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
from src.core.log import Logger

class DocumentRepository():
    collection_name = "documentskb"

    def __init__(self, repository: CosmosRepository):
        self.logging = Logger()
        self.repository = repository

    def save(self, document: Document) -> None:
        self.logging.info("CDB-DR-1-SA - Saving document: %s", document)
        self.repository.save(self.collection_name, document.to_dict())
 
    def verify_duplicity(self, document: Document):
        query = {
            "theme": document.theme,
            "subtheme": document.subtheme,
            "fileName": document.documentFile.filename
        }
        self.logging.info("CDB-DR-1-VD - Verifying duplicity for document: %s", document)
        return self.repository.verify_by_query(collectionName=self.collection_name, query=query)

    def list(self, filters, page=1, limit=100) -> tuple[List[SingleDocumentOutput], int]:
        # sort=[("indexCompletionDate", -1), ("uploadDate", -1)]
        self.logging.info(f"CDB-DR-1-LI - Listing documents with filters: {filters}, page: {page}, limit: {limit}")
        documents = self.repository.list_all(
            self.collection_name,
            filters,
            {"fileName": 1, "documentTitle": 1, "theme": 1, "themeName": 1, "subthemeName": 1, "subtheme": 1, "indexStatus": 1, "id": 1, "uploadDate": 1, "expiryDate": 1, "storageFilePath": 1, "uploadedBy": 1, "originalFileFormat": 1, "language": 1, "_id": 0},
            sort=[("uploadDate", -1)],
            page=page,
            limit=limit
        )
        number_of_documents = self.repository.count(self.collection_name, filters)

        list_of_documents = []

        for document in documents:
            if all(field in document for field in ["id", "fileName", "documentTitle", "theme", "subtheme", "indexStatus", "uploadDate", "expiryDate", "uploadedBy"]):
                documentToSave = SingleDocumentOutput(document)
                list_of_documents.append(documentToSave)

        return [list_of_documents, number_of_documents]
    
    def get_by_id(self, id: UUID) -> SingleDocumentOutput:
        self.logging.info("CDB-DR-1-GBI - Getting document by id: %s", id)
        try:
            document = SingleDocumentOutput(self.repository.get_by_id(self.collection_name, str(id)))
        except:
            self.logging.error("CDB-DR-2-GBI - Unable to create object with this document id: %s", id)
            return None

        if document == None:
            self.logging.error("CDB-DR-3-GBI - Document not found with id: %s", id)
            raise DocumentNotFound("Nenhum documento com esse id foi encontrado.")
            
        return document
    
    def update(self, id: UUID, updated_data: dict) -> None:
        self.logging.info("CDB-DR-1-UP - Updating document with id: %s", id)
        existing_document = self.repository.get_by_id(self.collection_name, str(id))

        if existing_document is None:
            self.logging.error("CDB-DR-2-UP - Document not found with id: %s", id)
            raise DocumentNotFound("Nenhum documento com esse id foi encontrado.")

        self.repository.update(self.collection_name, str(id), updated_data)
       