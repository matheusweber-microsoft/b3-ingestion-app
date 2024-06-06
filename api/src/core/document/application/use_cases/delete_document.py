from dataclasses import dataclass
from datetime import datetime
import os
from uuid import UUID

from src.core.log import Logger
from src.decorators.models.User import User

from src.infra.storageQueue.StorageQueueService import StorageQueueService

from src.core.document.domain.document import Document, DocumentOutput, SingleDocumentOutput
from src.infra.cosmosDB.repositories.cosmosDB_document_repository import DocumentRepository
from src.core.document.application.use_cases.exceptions import DocumentNotDeleted, DocumentNotIndexedDelete

class DeleteDocument:    
    def __init__(self, user: User, repository: DocumentRepository):
        self.logging = Logger()
        self.repository = repository
        self.queueService = StorageQueueService(os.getenv('DOCUMENTS_QUEUE'))
        self.user = user
    
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
        message: str

        def to_dict(self):
            return {
                "message": self.message
            }

    def execute(self, input: Input) -> Output:
        self.logging.info("DD-EX-1 - Executing DeleteDocument use case")
        document = self.repository.get_by_id(UUID(input.id))
        
        if document.indexStatus != "Indexed":
            self.logging.error("DD-EX-2 - Document is not in indexed status")
            raise DocumentNotIndexedDelete("Documento não está indexado. Não é possível deletar.")
        
        if not self.user.isAdmin() and document.uploadedBy != self.user.username:
            self.logging.error("DD-EX-3 - User is not authorized to delete the document")
            raise DocumentNotDeleted("Usuário não autorizado a deletar o documento")
        
        self.logging.info("DD-EX-4 - Updating document with id: %s", input.id)
        self.repository.update(UUID(input.id), {"indexStatus": "Deleting"})

        self.logging.info("DD-EX-5 - Sending message to the queue to delete the document")
        self.queueService.send_message(
            message_dict=self.generate_message_from_document(document)
        )
           
        return self.Output(message="Documento está sendo deletado.")

    def generate_message_from_document(self, document: Document):
        message_dict = {
            "action": "delete",
            "fileId": str(document.id),
            "storageFilePath": document.storageFilePath,
            "fileName": document.fileName,
            "originalFileFormat": document.originalFileFormat,
            "theme": document.theme,
            "subtheme": document.subtheme,
            "language": document.language
        }
        return message_dict