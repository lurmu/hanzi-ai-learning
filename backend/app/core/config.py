"""Application configuration"""
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    
    # Basic
    APP_NAME: str = "Hanzi AI Learning"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/hanzi_db"
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost"]
    
    # DeepSeek API
    DEEPSEEK_API_KEY: str = ""
    DEEPSEEK_API_URL: str = "https://api.deepseek.com/v1"
    DEEPSEEK_MODEL: str = "deepseek-chat"
    DEEPSEEK_MAX_TOKENS: int = 2000
    DEEPSEEK_TEMPERATURE: float = 0.7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
