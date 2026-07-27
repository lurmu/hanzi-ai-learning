"""Entry point script"""
#!/bin/bash

set -e

echo "Starting Hanzi AI Learning System..."

# Initialize database
echo "Initializing database..."
python init_db.py

# Run migrations
echo "Running migrations..."
alembic upgrade head

# Start server
echo "Starting FastAPI server..."
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
