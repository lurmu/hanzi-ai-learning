"""Learning schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LearningRecordCreate(BaseModel):
    """Learning record creation schema"""
    hanzi_id: str
    is_correct: bool
    time_spent: int
    attempts: int = 1
    confidence: Optional[float] = None


class LearningRecordResponse(BaseModel):
    """Learning record response schema"""
    id: str
    user_id: str
    hanzi_id: str
    is_correct: bool
    time_spent: int
    attempts: int
    confidence: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class LearningStatsResponse(BaseModel):
    """Learning statistics response schema"""
    total_hanzi_learned: int
    accuracy_rate: float
    learning_streak: int
    total_study_time: int
    current_level: int
