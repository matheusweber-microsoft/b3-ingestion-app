# Stage 1: Build the frontend
FROM node:16 as frontend-builder
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the backend using Poetry
FROM python:3.10 as backend-builder
WORKDIR /app
COPY api/pyproject.toml api/poetry.lock ./
# Install Poetry and configure it not to create a virtual environment
RUN pip install poetry
RUN poetry config virtualenvs.create false
# Install dependencies without creating a virtual environment
RUN poetry install --no-dev
COPY api/ .

# Stage 3: Final image
FROM python:3.10
WORKDIR /app

# Install Poetry in the final image
RUN pip install poetry
RUN poetry config virtualenvs.create false

# Copy backend from backend-builder
COPY --from=backend-builder /app /app

# Copy frontend build artifacts to the public directory of Quart
COPY --from=frontend-builder /app/dist /app/static

# Expose port 5000 for the application
EXPOSE 5000

# Run the Quart application using Poetry
CMD ["poetry", "run", "python", "-m", "quart_project", "api", "src", "api" "app:create_app", "--bind", "0.0.0.0:5000"]
