from dataclasses import dataclass
from uuid import UUID

from src.core.theme.domain.theme import SubTheme
from src.core.theme.domain.theme_repository import ThemeRepository
import logging

@dataclass
class ThemeOutput:
    themeId: UUID
    themeName: str
    language: str
    subthemes: set[SubTheme]

    def to_dict(self):
        return {
            "themeId": str(self.themeId),
            "themeName": self.themeName,
            "language": self.language,
            "subThemes": [subtheme.to_dict() for subtheme in self.subthemes]
        }


class ListTheme:
    def __init__(self, repository: ThemeRepository):
        self.repository = repository

    @dataclass
    class Input:
        pass

    @dataclass
    class Output:
        data: list[ThemeOutput]

    def execute(self) -> Output:
        logging.info("Executing ListTheme use case")

        themes = self.repository.list()
        data = [
            ThemeOutput(
                themeId=theme.themeId,
                themeName=theme.themeName,
                language=theme.language,
                subthemes=theme.subThemes
            )
            for theme in themes
        ]

        return self.Output(data=data)
