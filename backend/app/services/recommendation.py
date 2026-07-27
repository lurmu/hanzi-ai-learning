"""Recommendation Engine"""
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
import logging

from app.models.learning_record import LearningRecord
from app.models.hanzi import Hanzi
from app.models.progress import Progress

logger = logging.getLogger(__name__)


class RecommendationEngine:
    """Engine for generating personalized learning recommendations"""
    
    def get_recommendations(self, user_id: str, db: Session) -> List[Dict[str, Any]]:
        """Get personalized learning recommendations for a user"""
        # Get user's progress
        progress = db.query(Progress).filter(Progress.user_id == user_id).first()
        
        if not progress:
            return self._get_beginner_recommendations(db)
        
        # Analyze user's weak areas
        weak_hanzi = self._get_weak_hanzi(user_id, db)
        
        # Get next level hanzi
        next_level_hanzi = self._get_next_level_hanzi(progress.current_level, db)
        
        recommendations = []
        
        # Recommend reviewing weak characters
        if weak_hanzi:
            recommendations.append({
                "type": "review",
                "title": "Review challenging characters",
                "hanzi_ids": [h.id for h in weak_hanzi[:5]],
                "reason": "These characters had lower accuracy rates"
            })
        
        # Recommend new characters
        if next_level_hanzi:
            recommendations.append({
                "type": "new",
                "title": "Learn new characters",
                "hanzi_ids": [h.id for h in next_level_hanzi[:10]],
                "reason": f"You're ready for level {progress.current_level + 1}"
            })
        
        return recommendations
    
    def _get_beginner_recommendations(self, db: Session) -> List[Dict[str, Any]]:
        """Get recommendations for beginners"""
        # Get easiest hanzi (difficulty level 1-3)
        beginner_hanzi = db.query(Hanzi).filter(
            Hanzi.difficulty_level <= 3
        ).limit(20).all()
        
        return [{
            "type": "beginner",
            "title": "Start your learning journey",
            "hanzi_ids": [h.id for h in beginner_hanzi],
            "reason": "Perfect for beginners"
        }]
    
    def _get_weak_hanzi(self, user_id: str, db: Session, limit: int = 5) -> List[Hanzi]:
        """Get hanzi with lowest accuracy for a user"""
        # Query for hanzi with lowest success rate
        weak_records = db.query(
            LearningRecord.hanzi_id,
            func.count(LearningRecord.id).label('attempts'),
            func.sum(func.cast(LearningRecord.is_correct, type_=int)).label('correct')
        ).filter(
            LearningRecord.user_id == user_id
        ).group_by(LearningRecord.hanzi_id).all()
        
        # Sort by accuracy
        weak_hanzi_ids = [
            r.hanzi_id for r in sorted(
                weak_records,
                key=lambda x: (x.correct / x.attempts) if x.correct else 0
            )
        ][:limit]
        
        # Get hanzi objects
        if weak_hanzi_ids:
            return db.query(Hanzi).filter(Hanzi.id.in_(weak_hanzi_ids)).all()
        
        return []
    
    def _get_next_level_hanzi(self, current_level: int, db: Session, limit: int = 15) -> List[Hanzi]:
        """Get hanzi for the next level"""
        next_hanzi = db.query(Hanzi).filter(
            Hanzi.difficulty_level == current_level + 1
        ).limit(limit).all()
        
        return next_hanzi
