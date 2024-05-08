```bash
python3 -m venv .venv
.venv/Scripts/Activate.ps1
pip install poetry
poetry install
```

to run tests

```bash
poetry run pytest
```

to run api

```bash
cd api
poetry run start
```