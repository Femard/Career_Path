from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import CareerEventModel
from app.schemas import CareerEventCreate, CareerEventResponse
import uuid

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/", response_model=List[CareerEventResponse])
def list_events(db: Session = Depends(get_db)):
    events = db.query(CareerEventModel).order_by(CareerEventModel.start_year).all()
    return [
        CareerEventResponse(
            id=e.id,
            type=e.type,
            title=e.title,
            institution=e.institution,
            startYear=e.start_year,
            endYear=e.end_year,
            isCurrent=e.is_current,
            description=e.description,
        )
        for e in events
    ]


@router.post("/", response_model=CareerEventResponse, status_code=201)
def create_event(event: CareerEventCreate, db: Session = Depends(get_db)):
    db_event = CareerEventModel(
        id=str(uuid.uuid4()),
        type=event.type,
        title=event.title,
        institution=event.institution,
        start_year=event.startYear,
        end_year=event.endYear,
        is_current=event.isCurrent,
        description=event.description,
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return CareerEventResponse(
        id=db_event.id,
        type=db_event.type,
        title=db_event.title,
        institution=db_event.institution,
        startYear=db_event.start_year,
        endYear=db_event.end_year,
        isCurrent=db_event.is_current,
        description=db_event.description,
    )


@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: str, db: Session = Depends(get_db)):
    event = db.query(CareerEventModel).filter(CareerEventModel.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
