import uuid
from dataclasses import dataclass, field
from uuid import UUID

from api.core._shared.domain.entity import Entity

@dataclass(eq=False)
class Category(Entity):
    name: str

    def __post_init__(self):
        self.validate()

    def validate(self):
        if len(self.name) > 255:
            # raise ValueError("name cannot be longer than 255")
            self.notification.add_error("name cannot be longer than 255")

        if not self.name:  # len(self.name) == 0
            # raise ValueError("name cannot be empty")
            self.notification.add_error("name cannot be empty")

        if self.notification.has_errors:
            # Não interrompemos o fluxo e acumulamos os erros
            # Poderíamos não retornar `ValueError` e deixar como responsabilidade do cliente verificar se há erros.
            raise ValueError(self.notification.messages)

    def __str__(self):
        return f"{self.name})"

    def __repr__(self):
        return f"<Category {self.name} ({self.id})>"

    def update_category(self, name):
        self.name = name

        self.validate()

