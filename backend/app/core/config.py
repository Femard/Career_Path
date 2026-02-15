"""
Application configuration management using Pydantic Settings.
Loads configuration from environment variables.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Dynamic Career Pathing SaaS"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # Neo4j Database
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    NEO4J_DATABASE: str = "neo4j"

    # API Keys - External Integrations
    THEIRSTACK_API_KEY: Optional[str] = None
    CORESIGNAL_API_KEY: Optional[str] = None
    NUMBEO_API_KEY: Optional[str] = None
    LEVELSFYI_API_KEY: Optional[str] = None
    LINKEDIN_LEARNING_API_KEY: Optional[str] = None
    COURSERA_API_KEY: Optional[str] = None

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Cache TTL (seconds)
    CACHE_TTL_MARKET_DATA: int = 3600  # 1 hour
    CACHE_TTL_SALARY_DATA: int = 86400  # 24 hours
    CACHE_TTL_LMS_DATA: int = 43200  # 12 hours

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


settings = Settings()
