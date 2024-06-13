from typing import List
from uuid import UUID
from src.core.document.domain.document import Document
from src.core.theme.domain.theme import SubTheme, Theme
from src.infra.cosmosDB.cosmosRepository import CosmosRepository
from src.core.log import Logger

class ThemeRepository():
    collection_name = "themes"

    def __init__(self, repository: CosmosRepository):
        self.logging = Logger()
        self.repository = repository

    def list(self) -> List[Theme]:
        self.logging.info("CDB-TR-1-LI - Listing themes")
        documents = self.repository.list_all(self.collection_name, {"active": True}, {"language": 1, "subThemes": 1, "themeId": 1, "themeName": 1, "active": 1, "_id": 0})
        list_of_themes = [Theme(theme) for theme in documents]
        
        return list_of_themes
    
    def get_theme_by_id(self, theme_id: UUID) -> Theme:
        self.logging.info("CDB-TR-1-GTI - Getting theme by id")
        theme = self.repository.get_by_id(self.collection_name, theme_id)
        theme = Theme(theme)
        
        return theme