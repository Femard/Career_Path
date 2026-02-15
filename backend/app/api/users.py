"""
API endpoints for user profile management.
"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List

from app.models.graph_models import User
from app.core.neo4j_connection import get_neo4j_connection, Neo4jConnection

router = APIRouter()


@router.post("/", response_model=User)
async def create_user(
    user: User,
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """Create a new user profile in the graph."""
    # TODO: Create user node in Neo4j
    return user


@router.get("/{user_id}", response_model=User)
async def get_user(
    user_id: str,
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """Get user profile by ID."""
    # TODO: Query Neo4j for user
    raise HTTPException(status_code=404, detail="User not found")


@router.put("/{user_id}/skills")
async def update_user_skills(
    user_id: str,
    skill_ids: List[str],
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """Update the skills associated with a user."""
    # TODO: Update HAS_SKILL relationships in Neo4j
    return {"status": "updated", "skill_count": len(skill_ids)}


@router.put("/{user_id}/target-professions")
async def set_target_professions(
    user_id: str,
    profession_ids: List[str],
    db: Neo4jConnection = Depends(get_neo4j_connection)
):
    """Set target professions for career path generation."""
    # TODO: Update user's target professions
    return {"status": "updated", "targets": len(profession_ids)}
