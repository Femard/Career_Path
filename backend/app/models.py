from sqlalchemy import Column, String, Integer, Boolean, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.database import Base
import uuid


class CareerEventModel(Base):
    __tablename__ = "career_events"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String, nullable=False)  # study, work, training, other
    title = Column(String, nullable=False)
    institution = Column(String, nullable=True)
    start_year = Column(Integer, nullable=False)
    end_year = Column(Integer, nullable=True)
    is_current = Column(Boolean, default=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ObjectiveModel(Base):
    __tablename__ = "objectives"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    location = Column(String, nullable=False)
    color = Column(String, nullable=False)
    path_data = Column(JSON, nullable=True)  # Serialized CareerPath
    created_at = Column(DateTime(timezone=True), server_default=func.now())
