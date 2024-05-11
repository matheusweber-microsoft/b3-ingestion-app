from datetime import datetime, timezone
from dataclasses import dataclass, field
from uuid import UUID
import uuid
import os
from werkzeug.datastructures import FileStorage
from api.core._shared.domain.entity import Entity

@dataclass(eq=False)
class Document(Entity):
    documentTitle: str
    theme: str
    subtheme: str
    expiryDate: datetime
    documentFile: FileStorage  
    language: str
    filename: str = ""
    storageFilePath: str = ""
    indexStatus: str = "Submitted"
    uploadDate: datetime = datetime.now(timezone.utc)
    indexCompletionDate: str = ""
    originalFileFormat: str = ""
    uploadedBy: str = ""


    def __post_init__(self):
        self.fill_fields()
        self.validate()

    def fill_fields(self):
        self.filename = self.documentFile.filename
        self.storageFilePath = f"{self.theme}/{self.subtheme}/{self.filename}"        
        self.uploadDate = datetime.now(timezone.utc)
        self.originalFileFormat = os.path.splitext(self.filename)[1][1:].lower()
        self.expiryDate = datetime.fromisoformat(self.expiryDate)

    def validate(self):
        if len(self.documentTitle) > 255:
            self.notification.add_error("Titulo não pode ter mais de 255 caracteres")

        if not self.documentTitle: 
            self.notification.add_error("Titulo não pode estar vazio")

        if not self.theme: 
            self.notification.add_error("Tema não pode estar vazio")

        if not self.subtheme:
            self.notification.add_error("Subtema não pode estar vazio")

        if not self.expiryDate:
            self.notification.add_error("Data de validade não pode estar vazia")

        if not self.is_valid_date(self.expiryDate):     
            self.notification.add_error("Data de validade deve ser uma data válida")

        if not self.documentFile:
            self.notification.add_error("Arquivo não pode estar vazio")

        if not self.language:
            self.notification.add_error("Idioma não pode estar vazio")
            
        ext = self.documentFile.filename.split('.')[-1].lower()     
        if ext not in ('doc', 'docx', 'pdf'):
            self.notification.add_error("Apenas arquivos .doc e .pdf são aceitos")

        if self.notification.has_errors:
            raise ValueError(self.notification.messages)

    def is_valid_date(self, date):
        if date > datetime.now():
            return True
        return False
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "filename": self.filename,
            "documentTitle": self.documentTitle,
            "theme": self.theme,
            "subtheme": self.subtheme,
            "language": self.language,
            "storageFilePath": self.storageFilePath,
            "indexStatus": self.indexStatus,
            "uploadDate": {
                "$date": int(self.uploadDate.timestamp()  * 1000)
            },
            "indexCompletionDate": None,
            "expiryDate": {
                "$date": int(self.expiryDate.timestamp()  * 1000)
            },
            "originalFileFormat": self.originalFileFormat,
            "uploadedBy": self.uploadedBy,
            "documentPages": []
        }
    
    def __str__(self):
        return (
            f"Document Title: {self.documentTitle}\n"
            f"Theme: {self.theme}\n"
            f"Subtheme: {self.subtheme}\n"
            f"Expiry Date: {self.expiryDate}\n"
            f"Filename: {self.filename}\n"
            f"Language: {self.language}\n"
            f"Storage File Path: {self.storageFilePath}\n"
            f"Index Status: {self.indexStatus}\n"
            f"Upload Date: {self.uploadDate}\n"
            f"Index Completion Date: {self.indexCompletionDate}\n"
            f"Original File Format: {self.originalFileFormat}\n"
            f"Uploaded By: {self.uploadedBy}"
        )
    
    def get_container_path(self):
        return f"{self.theme}/{self.subtheme}/"
    

@dataclass
class DocumentOutput:
    id: UUID
    fileName: str
    documentTitle: str
    theme: str
    subtheme: str
    indexStatus: str
    uploadDate: str
    expiryDate: str
    uploadedBy: str

    def to_dict(self):
        return {
            "id": str(self.id),
            "fileName": self.fileName,
            "documentTitle": self.documentTitle,
            "theme": self.theme,
            "subtheme": self.subtheme,
            "indexStatus": self.indexStatus,
            "uploadDate": str(self.uploadDate),
            "expiryDate": str(self.expiryDate),
            "uploadedBy": self.uploadedBy
        }
