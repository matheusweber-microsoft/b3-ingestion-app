from datetime import datetime, timezone
from dataclasses import dataclass, field
from typing import List
from uuid import UUID
import uuid
import os
from werkzeug.datastructures import FileStorage
from src.core._shared.domain.entity import Entity
from datetime import datetime

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
            "fileName": self.filename,
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

@dataclass
class DocumentPage:
    filePageName: str
    storageFilePath: str
    indexCompletionDate: str
    documentURL: str = ""

    def __init__(self, data: dict):
        self.filePageName = data.get("filePageName", "")
        self.storageFilePath = data.get("storageFilePath", "")
        self.indexCompletionDate = data.get("indexCompletionDate", "")

    def to_dict(self):
        return {
            "filePageName": self.filePageName,
            "storageFilePath": self.storageFilePath,
            "indexCompletionDate": self.indexCompletionDate.strftime("%d/%m/%Y %H:%M:%S"),
            "documentURL": self.documentURL
        }

@dataclass
class SingleDocumentOutput:
    id: UUID
    fileName: str
    documentTitle: str
    theme: str
    subtheme: str
    uploadDate: str
    expiryDate: str
    uploadedBy: str
    documentPages: List[DocumentPage]

    def __init__(self, data: dict):
        self.id = UUID(data.get("id", ""))
        self.fileName = data.get("fileName", "")
        self.documentTitle = data.get("documentTitle", "")
        self.theme = data.get("theme", "")
        self.subtheme = data.get("subtheme", "")
        
        self.uploadDate = ""

        upload_date = data.get("uploadDate", "")
        if isinstance(upload_date, datetime):
            self.uploadDate = upload_date.strftime("%d/%m/%Y")
        else:
            if not upload_date == "":
                upload_date = upload_date["$date"]
                if upload_date != None:
                    self.uploadDate = datetime.fromtimestamp(int(upload_date) / 1000).strftime("%d/%m/%Y %H:%M:%S")

        self.expiryDate = ""
        expiry_date = data.get("expiryDate", "")
        if isinstance(expiry_date, datetime):
            self.expiryDate = expiry_date.strftime("%d/%m/%Y")
        else:
            if not expiry_date == "":
                expiry_date = expiry_date["$date"]
                if expiry_date != None:
                    self.expiryDate = datetime.fromtimestamp(int(expiry_date) / 1000).strftime("%d/%m/%Y")
        self.uploadedBy = data.get("uploadedBy", "")
        self.documentPages = [DocumentPage(page) for page in data.get("documentPages", [])]

    def to_dict(self):
        document_pages = [page.to_dict() for page in self.documentPages]

        return {
            "id": str(self.id),
            "fileName": self.fileName,
            "documentTitle": self.documentTitle,
            "theme": self.theme,
            "subtheme": self.subtheme,
            "uploadDate": self.uploadDate,
            "expiryDate": self.expiryDate,
            "uploadedBy": self.uploadedBy,
            "documentPages": document_pages
        }