"""
Pydantic models representing Neo4j graph entities.
These models define the structure of nodes and relationships.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class NodeType(str, Enum):
    """Types of nodes in the career graph."""
    PROFESSION = "Profession"
    SKILL = "Skill"
    TRAINING = "Training"
    USER = "User"
    COMPANY = "Company"
    CAREER_EVENT = "CareerEvent"


class OntologySource(str, Enum):
    """Ontology standard sources."""
    ESCO = "ESCO"  # European Skills, Competences, Qualifications
    ONET = "O*NET"  # USA Occupational Information Network


class Skill(BaseModel):
    """Skill node in the graph."""
    id: str
    name: str
    description: Optional[str] = None
    category: str  # Technical, Soft, Domain-specific
    ontology_source: OntologySource
    esco_id: Optional[str] = None
    onet_id: Optional[str] = None
    automation_risk: Optional[float] = Field(None, ge=0.0, le=1.0)
    market_demand: Optional[float] = Field(None, ge=0.0)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Profession(BaseModel):
    """Profession/Job role node in the graph."""
    id: str
    title: str
    description: Optional[str] = None
    ontology_source: OntologySource
    esco_id: Optional[str] = None
    onet_id: Optional[str] = None
    avg_salary: Optional[float] = None
    market_demand: Optional[float] = None
    automation_risk: Optional[float] = Field(None, ge=0.0, le=1.0)
    required_skills: List[str] = []  # Skill IDs
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Training(BaseModel):
    """Training/Course node in the graph."""
    id: str
    title: str
    provider: str  # LinkedIn Learning, Coursera, etc.
    description: Optional[str] = None
    duration_hours: Optional[float] = None
    cost: Optional[float] = None
    url: Optional[str] = None
    skills_taught: List[str] = []  # Skill IDs
    difficulty_level: Optional[str] = None  # Beginner, Intermediate, Advanced
    created_at: datetime = Field(default_factory=datetime.utcnow)


class User(BaseModel):
    """User profile node in the graph."""
    id: str
    email: str
    current_profession: Optional[str] = None  # Profession ID
    current_skills: List[str] = []  # Skill IDs
    target_professions: List[str] = []  # Profession IDs
    location: Optional[str] = None
    experience_years: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CareerEvent(BaseModel):
    """
    Intermediate node representing a career transition event.
    Links users, companies, and roles over time.
    """
    id: str
    user_id: str
    company_id: Optional[str] = None
    profession_id: str
    start_date: datetime
    end_date: Optional[datetime] = None
    is_current: bool = False
    salary: Optional[float] = None
    skills_acquired: List[str] = []  # Skill IDs


class RelationshipType(str, Enum):
    """Types of relationships in the graph."""
    REQUIRES = "REQUIRES"  # Profession -> Skill
    TEACHES = "TEACHES"  # Training -> Skill
    HAS_SKILL = "HAS_SKILL"  # User -> Skill
    TRANSITIONS_TO = "TRANSITIONS_TO"  # Profession -> Profession
    WORKED_AT = "WORKED_AT"  # User -> CareerEvent
    AT_COMPANY = "AT_COMPANY"  # CareerEvent -> Company


class CareerPath(BaseModel):
    """Represents a calculated career trajectory (Plan A, B, or C)."""
    plan_id: str  # A, B, or C
    current_profession_id: str
    target_profession_id: str
    steps: List[Dict[str, Any]]  # Ordered list of transitions
    total_cost: float  # Training costs
    total_time_months: int
    expected_salary_gain: float
    roi: float  # Return on investment
    automation_risk: float
    required_trainings: List[str]  # Training IDs
    skills_to_acquire: List[str]  # Skill IDs
    confidence_score: float = Field(ge=0.0, le=1.0)
