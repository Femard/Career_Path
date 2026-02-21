from pydantic import BaseModel
from typing import Optional, List, Literal
from datetime import datetime


# --- Career Events ---

class CareerEventCreate(BaseModel):
    type: Literal["study", "work", "training", "other"]
    title: str
    institution: Optional[str] = None
    startYear: int
    endYear: Optional[int] = None
    isCurrent: bool = False
    description: Optional[str] = None


class CareerEventResponse(BaseModel):
    id: str
    type: str
    title: str
    institution: Optional[str] = None
    startYear: int
    endYear: Optional[int] = None
    isCurrent: bool
    description: Optional[str] = None

    model_config = {"from_attributes": True}


# --- Career Path (AI-generated) ---

class PathStep(BaseModel):
    type: Literal["job", "formation"]
    title: str
    provider: Optional[str] = None
    duration_months: int
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    cost: Optional[int] = None
    year_estimate: Optional[int] = None
    description: Optional[str] = None


class CareerPath(BaseModel):
    steps: List[PathStep]
    market_insights: str
    confidence_score: float


# --- Path Generation Request ---

class PathGenerateRequest(BaseModel):
    career_history: List[CareerEventCreate]
    objective_title: str
    location: str


# --- Market Insights ---

class JobDemand(BaseModel):
    title: str
    demand: str
    growth: str


class SalaryByCity(BaseModel):
    city: str
    min: int
    max: int
    avg: int


class TrendingFormation(BaseModel):
    title: str
    provider: str
    relevance: str


class MarketInsight(BaseModel):
    topJobs: List[JobDemand]
    salaryByCity: List[SalaryByCity]
    trendingFormations: List[TrendingFormation]
    summary: str


class MarketInsightRequest(BaseModel):
    career_history: List[CareerEventCreate]
    objectives: List[dict]  # [{title, location}]
