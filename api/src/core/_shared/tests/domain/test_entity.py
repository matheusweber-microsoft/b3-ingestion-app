from dataclasses import dataclass
from unittest.mock import create_autospec

from src.core._shared.domain.entity import Entity

import pytest

@dataclass(kw_only=True)
class DummyEntity(Entity):
    def validate(self):
        pass

