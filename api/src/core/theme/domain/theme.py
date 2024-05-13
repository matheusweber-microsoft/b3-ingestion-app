from datetime import datetime
from dataclasses import dataclass, field
from typing import List
from uuid import UUID
import os
from werkzeug.datastructures import FileStorage
from uuid import uuid4

from src.core._shared.domain.entity import Entity

@dataclass(eq=False)
class SubTheme:
    subthemeName: str
    subthemeId: str
    allowedForGroups: List[str]

    def __init__(self, subtheme: dict):
        self.subthemeName = subtheme["subthemeName"]
        self.subthemeId = subtheme["subthemeId"]
        self.allowedForGroups = subtheme["allowedForGroups"]
    
    def to_dict(self):
        return {
            "subthemeId": str(self.subthemeId),
            "subthemeName": self.subthemeName,
            "allowedForGroups": [group for group in self.allowedForGroups]
        }

@dataclass
class Theme:
    themeName: str
    themeId: str
    language: str
    active: bool
    subThemes: List[SubTheme]

    def __init__(self, theme: dict):
        self.themeName = theme["themeName"]
        self.themeId = theme["themeId"]
        self.language = theme["language"]
        self.subThemes = [SubTheme(subtheme) for subtheme in theme["subThemes"]]
