from abc import ABC, abstractmethod
from uuid import UUID

from api.core.document.domain.document import Document

class DocumentRepository(ABC):
    @abstractmethod
    def save(self, document: Document):
        raise NotImplementedError

    @abstractmethod
    def get_by_id(self, id: UUID) -> Document | None:
        raise NotImplementedError
    
    @abstractmethod
    def list(self) -> list[Document]:
        raise NotImplementedError

    @abstractmethod
    def update(self, document: Document) -> None:
        raise NotImplementedError

    @abstractmethod
    def delete(self, id: UUID) -> None:
        raise NotImplementedError