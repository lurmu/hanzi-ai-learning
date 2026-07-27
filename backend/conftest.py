"""pytest configuration"""
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.database import Base
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def db_engine():
    """Create test database"""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    return engine


@pytest.fixture(scope="session")
def db_session_factory(db_engine):
    """Create test session factory"""
    return sessionmaker(autocommit=False, autoflush=False, bind=db_engine)


@pytest.fixture
def test_client():
    """Create test client"""
    return TestClient(app)
