"""
Main FastAPI application entry point.
Handles startup, shutdown, and route registration.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.neo4j_connection import neo4j_conn
from app.api import paths, skills, users, market_data

# Configure logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events."""
    # Startup
    logger.info("Starting Dynamic Career Pathing SaaS...")
    try:
        neo4j_conn.connect()
        logger.info("Neo4j connection established")
    except Exception as e:
        logger.error(f"Failed to connect to Neo4j: {e}")
        raise

    yield

    # Shutdown
    logger.info("Shutting down...")
    neo4j_conn.close()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Detailed health check including database connectivity."""
    try:
        # Test Neo4j connection
        result = neo4j_conn.execute_query("RETURN 1 as test")
        db_status = "connected" if result else "disconnected"
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        db_status = "error"

    return {
        "status": "healthy" if db_status == "connected" else "unhealthy",
        "database": db_status
    }


# Register API routers
app.include_router(paths.router, prefix="/api/v1/paths", tags=["Career Paths"])
app.include_router(skills.router, prefix="/api/v1/skills", tags=["Skills"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(market_data.router, prefix="/api/v1/market", tags=["Market Data"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
