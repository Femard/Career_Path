from fastapi import APIRouter, HTTPException
from app.schemas import MarketInsightRequest, MarketInsight
from app.services.ai_service import generate_market_insights

router = APIRouter(prefix="/api/market", tags=["market"])


@router.post("/insights", response_model=MarketInsight)
async def get_market_insights(request: MarketInsightRequest):
    try:
        insights = await generate_market_insights(
            career_history=request.career_history,
            objectives=request.objectives,
        )
        return insights
    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Erreur de parsing IA : {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur d'analyse marché : {str(e)}")
