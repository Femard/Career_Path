"""
API endpoints for skills management and extraction.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel

from app.models.graph_models import Skill, OntologySource
from app.core.neo4j_connection import get_neo4j_connection, Neo4jConnection

router = APIRouter()


class SkillExtractionRequest(BaseModel):
    """Request to extract skills from text (CV or job description)."""
    text: str
    source_type: str  # cv, job_description, training


@router.get("/", response_model=List[Skill])
async def list_skills(
    skip: int = 0,
    limit: int = 100,
    category: str = None,
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """List skills from the ontology."""
    # TODO: Query Neo4j for skills
    return []


@router.get("/{skill_id}", response_model=Skill)
async def get_skill(
    skill_id: str,
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """Get detailed information about a specific skill."""
    # TODO: Query Neo4j for skill details
    raise HTTPException(status_code=404, detail="Skill not found")


@router.post("/extract", response_model=List[Skill])
async def extract_skills(
    request: SkillExtractionRequest,
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """
    Extract skills from unstructured text using Domain-BERT model.

    This endpoint analyzes CVs or job descriptions and identifies
    skills based on ESCO/O*NET ontologies.
    """
    # TODO: Implement skills extraction using transformers
    return []


@router.get("/{skill_id}/market-trends")
async def get_skill_market_trends(
    skill_id: str,
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """Get market demand trends for a specific skill."""
    # TODO: Query market data for skill trends
    return {"skill_id": skill_id, "trend": "stable"}
