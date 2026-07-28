"""Enhanced learning schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any
from enum import Enum


class LearningModeEnum(str, Enum):
    """Learning mode"""
    LISTEN = "listen"
    SPEAK = "speak"
    READ = "read"
    WRITE = "write"


class EnhancedLearningRecordCreate(BaseModel):
    """Enhanced learning record creation"""
    hanzi_id: str
    mode: LearningModeEnum
    is_correct: bool
    time_spent: int
    attempts: int = 1
    confidence: Optional[float] = None


class EnhancedLearningRecordResponse(BaseModel):
    """Enhanced learning record response"""
    id: str
    user_id: str
    hanzi_id: str
    mode: LearningModeEnum
    is_correct: bool
    time_spent: int
    attempts: int
    confidence: Optional[float]
    review_stage: int
    next_review_time: Optional[datetime]
    difficulty_score: float
    created_at: datetime

    class Config:
        from_attributes = True


class DailyPlanResponse(BaseModel):
    """Daily plan response"""
    date: str
    review_hanzi: List[str]
    new_hanzi: List[str]
    total_count: int
    plan: Dict[str, Any]


class WeeklyPlanResponse(BaseModel):
    """Weekly plan response"""
    week_start: str
    plans: List[DailyPlanResponse]
    total_new_hanzi: int
    total_review: int


class DailyStatsResponse(BaseModel):
    """Daily statistics response"""
    date: str
    total: int
    correct: int
    accuracy: float
    by_mode: Dict[str, Any]


class AIAnalysisResponse(BaseModel):
    """AI analysis response"""
    date: str
    statistics: Dict[str, Any]
    wrong_hanzi: List[str]
    ai_analysis: str
