from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import os

load_dotenv()

# Configure logging — visible dans le terminal uvicorn
logging.basicConfig(
    level=logging.INFO,
    format="\033[36m%(asctime)s\033[0m \033[1m%(name)s\033[0m %(levelname)s  %(message)s",
    datefmt="%H:%M:%S",
)

from app.database import create_tables
from app.api.events import router as events_router
from app.api.paths import router as paths_router
from app.api.market import router as market_router
from app.services.ai_service import get_ai_info

app = FastAPI(
    title="Career Path API",
    description="API de visualisation et planification de carrière avec IA",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(events_router)
app.include_router(paths_router)
app.include_router(market_router)


@app.on_event("startup")
async def startup():
    create_tables()
    info = get_ai_info()
    logger = logging.getLogger("career_path")
    logger.info(f"🚀 Fournisseur IA : {info['provider'].upper()} — modèle : {info['model']}")


@app.get("/")
def root():
    return {"name": "Career Path API", "version": "1.0.0", "status": "running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/config")
def config():
    return get_ai_info()
