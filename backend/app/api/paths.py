from fastapi import APIRouter, HTTPException
from app.schemas import PathGenerateRequest, CareerPath
from app.services.ai_service import generate_career_path

router = APIRouter(prefix="/api/paths", tags=["paths"])


@router.post("/generate", response_model=CareerPath)
async def generate_path(request: PathGenerateRequest):
    try:
        path = await generate_career_path(
            career_history=request.career_history,
            objective_title=request.objective_title,
            location=request.location,
        )
        return path
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Erreur de parsing IA : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de génération : {str(e)}")
