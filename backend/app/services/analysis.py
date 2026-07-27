"""Analysis Engine"""
import numpy as np
from typing import Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.models.learning_record import LearningRecord
from app.models.progress import Progress


class AnalysisEngine:
    """Engine for analyzing learning data"""
    
    @staticmethod
    def calculate_user_stats(user_id: str, db: Session) -> Dict[str, Any]:
        """Calculate user's learning statistics"""
        # Get all records
        records = db.query(LearningRecord).filter(
            LearningRecord.user_id == user_id
        ).all()
        
        if not records:
            return {}
        
        # Calculate metrics
        total_attempts = len(records)
        correct_attempts = sum(1 for r in records if r.is_correct)
        accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0
        
        total_time = sum(r.time_spent for r in records)
        avg_time = total_time / total_attempts if total_attempts > 0 else 0
        
        # Calculate learning streak
        streak = AnalysisEngine._calculate_streak(records)
        
        return {
            "total_attempts": total_attempts,
            "correct_attempts": correct_attempts,
            "accuracy": accuracy,
            "total_study_time": total_time,
            "average_time_per_attempt": avg_time,
            "learning_streak": streak
        }
    
    @staticmethod
    def _calculate_streak(records: list) -> int:
        """Calculate learning streak (consecutive days)"""
        if not records:
            return 0
        
        # Sort by date
        sorted_records = sorted(records, key=lambda x: x.created_at)
        
        # Calculate streak
        streak = 1
        last_date = sorted_records[-1].created_at.date()
        
        for record in reversed(sorted_records[:-1]):
            record_date = record.created_at.date()
            diff = (last_date - record_date).days
            
            if diff == 1:
                streak += 1
                last_date = record_date
            else:
                break
        
        return streak
