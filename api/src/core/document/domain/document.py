from datetime import datetime, timedelta, timezone
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
    themeName: str
    subtheme: str
    subthemeName: str
    expiryDate: str
    documentFile: FileStorage  
    language: str
    filename: str = ""
    storageFilePath: str = ""
    indexStatus: str = "Submitted"
    uploadDate: int = 0
    indexCompletionDate: int = 0
    originalFileFormat: str = ""
    uploadedBy: str = ""


    def __post_init__(self):
        self.fill_fields()
        self.validate()

    def fill_fields(self):
        self.filename = self.documentFile.filename
        self.storageFilePath = f"{self.theme}/{self.subtheme}/{self.filename}"        
        self.uploadDate = int(datetime.now().timestamp() * 1000)
        self.expiryDate = int(datetime.strptime(self.expiryDate,'%Y-%m-%d').timestamp() * 1000)
        self.originalFileFormat = os.path.splitext(self.filename)[1][1:].lower()

    def validate(self):
        if len(self.documentTitle) > 255:
            self.notification.add_error("Titulo não pode ter mais de 255 caracteres")

        if not self.themeName: 
            self.notification.add_error("Nome do tema não pode estar vazio")

        if not self.subthemeName:
            self.notification.add_error("Nome do subtema não pode estar vazio")

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
        if datetime.fromtimestamp(date / 1000) >= datetime.now():
            return True
        return False
    
    def to_dict(self):
        return {
            "id": str(self.id),
            "fileName": self.filename,
            "documentTitle": self.documentTitle,
            "theme": self.theme,
            "subtheme": self.subtheme,
            "themeName": self.themeName,
            "subthemeName": self.subthemeName,
            "language": self.language,
            "storageFilePath": self.storageFilePath,
            "indexStatus": self.indexStatus,
            "uploadDate": self.uploadDate,
            "indexCompletionDate": None,
            "expiryDate": self.expiryDate,
            "originalFileFormat": self.originalFileFormat,
            "uploadedBy": self.uploadedBy,
            "documentPages": []
        }
    
    def __str__(self):
        return (
            f"Document Title: {self.documentTitle}\n"
            f"Theme: {self.theme}\n"
            f"Subtheme: {self.subtheme}\n"
            f"Theme Name: {self.themeName}\n"
            f"Subtheme Name: {self.subthemeName}\n"
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
            "indexCompletionDate": str(self.indexCompletionDate),
            "documentURL": self.documentURL
        }

@dataclass
class SingleDocumentOutput:
    id: UUID
    fileName: str
    documentTitle: str
    theme: str
    themeName: str
    subtheme: str
    subthemeName: str
    uploadDate: str
    expiryDate: int
    uploadedBy: str
    documentPages: List[DocumentPage]
    expireStatus: int = 0
    indexStatus: str = "Submitted"
    storageFilePath: str = ""
    originalFileFormat: str = ""
    language: str = ""

    def __init__(self, data: dict):
        self.id = UUID(data.get("id", ""))
        self.fileName = data.get("fileName", "")
        self.documentTitle = data.get("documentTitle", "")
        self.theme = data.get("theme", "")
        self.subtheme = data.get("subtheme", "")
        self.themeName = data.get("themeName", "")
        self.subthemeName = data.get("subthemeName", "")
        self.uploadDate = ""
        self.indexStatus = data.get("indexStatus", "")
        self.storageFilePath = data.get("storageFilePath", "")
        self.originalFileFormat = data.get("originalFileFormat", "")
        self.language = data.get("language", "")
        self.uploadDate = data.get("uploadDate", "")
        self.expiryDate = data.get("expiryDate", None)
        self.uploadedBy = data.get("uploadedBy", "")
        self.documentPages = [DocumentPage(page) for page in data.get("documentPages", [])]

        expiry_date = data.get("expiryDate", None)
        if expiry_date and isinstance(expiry_date, int):
            today = datetime.now().date()
            expiry_date = datetime.fromtimestamp(expiry_date / 1000).date()
            if expiry_date < today:
                self.expireStatus = 2
            elif expiry_date < today + timedelta(days=7):
                self.expireStatus = 1
            else:
                self.expireStatus = 0

    def to_dict(self):
        document_pages = [page.to_dict() for page in self.documentPages]
        dict_to_return = {
            "id": str(self.id),
            "fileName": self.fileName,
            "documentTitle": self.documentTitle,
            "theme": self.theme,
            "subtheme": self.subtheme,
            "themeName": self.themeName,
            "subthemeName": self.subthemeName,
            "uploadDate": self.uploadDate,
            "expiryDate": self.expiryDate,
            "uploadedBy": self.uploadedBy,
            "expireStatus": self.expireStatus,
            "indexStatus": self.indexStatus if self.indexStatus else None 
        }

        if len(document_pages) > 0:
            dict_to_return["documentPages"] = document_pages
        
        return dict_to_return