from datetime import datetime
from dataclasses import dataclass, field
from uuid import UUID
import os
from werkzeug.datastructures import FileStorage
from uuid import uuid4

from api.core._shared.domain.entity import Entity

@dataclass(eq=False)
class Document(Entity):
    filename: str #n
    documentTitle: str
    theme: str
    subtheme: str
    language: str #n
    storageFilePath: str #n
    indexStatus: str #n
    uploadDate: str #n
    indexCompletionDate: str #n
    expiryDate: str
    originalFileFormat: str #n
    uploadedBy: str #n
    documentFile: FileStorage

    def __init__(
        self,
        documentTitle: str,
        theme: str,
        subtheme: str,
        expiryDate: str,
        documentFile: FileStorage,
        uploadedBy: str
    ):
        self.documentTitle = documentTitle
        self.theme = theme
        self.subtheme = subtheme
        self.expiryDate = expiryDate
        self.documentFile = documentFile
        self.filename = documentFile.filename
        self.language = "eng"
        self.storageFilePath = f"{self.theme}/{self.subtheme}/"
        self.indexStatus = "Submitted"
        self.uploadDate = datetime.now().isoformat()
        self.indexCompletionDate = ""
        self.originalFileFormat = documentFile.content_type
        self.uploadedBy = uploadedBy

    def __post_init__(self):
        self.validate()

    def validate(self):
        if len(self.documentTitle) > 255:
            self.notification.add_error("documentTitle cannot be longer than 255")

        if not self.documentTitle:  # len(self.name) == 0
            self.notification.add_error("documentTitle cannot be empty")

        if not self.theme:  # len(self.name) == 0
            self.notification.add_error("theme cannot be empty")

        if not self.subtheme:  # len(self.name) == 0
            self.notification.add_error("theme cannot be empty")

        if not self.expiryDate:  # len(self.name) == 0
            self.notification.add_error("expiry date cannot be empty")

        if not self.is_valid_date(self.expiryDate):     
            self.notification.add_error("expiryDate must be a valid date")

        ext = os.path.splitext(self.title)[1].lower()
        if ext not in ('.doc', '.pdf'):
            self.notification.add_error("Only .doc and .pdf files are accepted")

        if self.notification.has_errors:
            raise ValueError(self.notification.messages)

    def is_valid_date(self, date_str):
        try:
            date_from_str = datetime.fromisoformat(date_str)
            if date_from_str > datetime.now():
                return True
            return False
        except ValueError:
            return False
    
    def to_dict(self):
        return {
            "filename": self.filename,
            "documentTitle": self.documentTitle,
            "theme": self.theme,
            "subtheme": self.subtheme,
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