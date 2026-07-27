"""Learning API routes"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.learning_record import LearningRecord
from app.models.progress import Progress
from app.schemas.learning import LearningRecordCreate, LearningRecordResponse, LearningStatsResponse

router = APIRouter(prefix="/learning")


@router.post("/record", response_model=LearningRecordResponse)
def record_learning(record: LearningRecordCreate, user_id: str, db: Session = Depends(get_db)):
    """Record a learning attempt"""
    # Create record
    learning_record = LearningRecord(
        id=str(uuid.uuid4()),
        user_id=user_id,
        hanzi_id=record.hanzi_id,
        is_correct=record.is_correct,
        time_spent=record.time_spent,
        attempts=record.attempts,
        confidence=record.confidence
    )
    
    db.add(learning_record)
    db.commit()
    db.refresh(learning_record)
    
    return learning_record


@router.get("/stats/{user_id}", response_model=LearningStatsResponse)
def get_learning_stats(user_id: str, db: Session = Depends(get_db)):
    """Get learning statistics for a user"""
    progress = db.query(Progress).filter(Progress.user_id == user_id).first()
    
    if not progress:
        # Create default progress
        progress = Progress(id=str(uuid.uuid4()), user_id=user_id)
        db.add(progress)
        db.commit()
    
    return {
        "total_hanzi_learned": progress.total_hanzi_learned,
        "accuracy_rate": progress.accuracy_rate,
        "learning_streak": progress.learning_streak,
        "total_study_time": progress.total_study_time,
        "current_level": progress.current_level
    }
