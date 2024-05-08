from typing import List
from uuid import UUID
from api.core.document.domain.document import Document
from api.core.theme.domain.theme import SubTheme, Theme
from api.infra.cosmosDB.cosmosRepository import CosmosRepository
 
class ThemeRepository():
    collection_name = "themes"

    def __init__(self, repository: CosmosRepository):
        self.repository = repository

    def list(self) -> List[Theme]:

        documents = self.repository.list_all(self.collection_name, {"active": True}, {"language": 1, "subThemes": 1, "themeId": 1, "themeName": 1, "_id": 0})
        list_of_themes = [Theme(theme) for theme in documents]
        
        return list_of_themes