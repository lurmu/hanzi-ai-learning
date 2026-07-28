"""AI Analysis API routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.advanced_ai_analyzer import AdvancedAIAnalyzer

router = APIRouter(prefix="/ai")


@router.post("/analyze-daily/{user_id}")
def analyze_daily_performance(user_id: str, db: Session = Depends(get_db)):
    """
    使用AI分析每日学习表现
    返回：准确率、错误分析、改进建议
    """
    try:
        analyzer = AdvancedAIAnalyzer()
        analysis = analyzer.analyze_daily_performance(user_id, db)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to analyze performance: {str(e)}"
        )


@router.get("/suggestions/{user_id}")
def get_learning_suggestions(user_id: str, db: Session = Depends(get_db)):
    """
    获取AI学习建议
    基于一周的学习数据
    """
    try:
        analyzer = AdvancedAIAnalyzer()
        suggestions = analyzer.generate_learning_suggestions(user_id, db)
        return suggestions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate suggestions: {str(e)}"
        )


@router.get("/level-up-prediction/{user_id}")
def predict_level_up(user_id: str, db: Session = Depends(get_db)):
    """
    预测是否可以升级
    条件：准确率>=90% 且 最近一个月尝试>=50次
    """
    try:
        analyzer = AdvancedAIAnalyzer()
        prediction = analyzer.predict_next_level(user_id, db)
        return prediction
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to predict level up: {str(e)}"
        )
