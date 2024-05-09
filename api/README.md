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

```configuration

Provide a .env file with the follow values:

CONNECTION_STRING_AZURE_QUEUE=
CONNECTION_STRING_COSMOS_DB=
CONNECTION_STRING_STORAGE_CONTAINER=
DATABASE_NAME=
DOCUMENTS_QUEUE = 
```