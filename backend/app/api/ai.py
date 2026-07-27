"""AI Analysis API routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.ai_service import DeepSeekService
from app.services.recommendation import RecommendationEngine

router = APIRouter(prefix="/ai")


@router.post("/analyze")
def analyze_learning(user_id: str, db: Session = Depends(get_db)):
    """Analyze user's learning progress using DeepSeek AI"""
    try:
        ai_service = DeepSeekService()
        analysis = ai_service.analyze_user_progress(user_id, db)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI analysis failed: {str(e)}"
        )


@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: str, db: Session = Depends(get_db)):
    """Get AI-powered learning recommendations"""
    try:
        recommendation_engine = RecommendationEngine()
        recommendations = recommendation_engine.get_recommendations(user_id, db)
        return {"recommendations": recommendations}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get recommendations: {str(e)}"
        )
