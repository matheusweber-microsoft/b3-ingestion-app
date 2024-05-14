from typing import List
from uuid import UUID
from src.core.document.domain.document import Document
from src.core.theme.domain.theme import SubTheme, Theme
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
import logging

class ThemeRepository():
    collection_name = "themes"

    def __init__(self, repository: CosmosRepository):
        self.repository = repository

    def list(self) -> List[Theme]:
        logging.debug("Listing themes")
        documents = self.repository.list_all(self.collection_name, {"active": True}, {"language": 1, "subThemes": 1, "themeId": 1, "themeName": 1, "_id": 0})
        list_of_themes = [Theme(theme) for theme in documents]
        
        return list_of_themes