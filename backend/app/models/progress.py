"""User progress model"""
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON
from datetime import datetime
from app.db.database import Base


class Progress(Base):
    """User progress model"""
    __tablename__ = "progress"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    total_hanzi_learned = Column(Integer, default=0)
    accuracy_rate = Column(Float, default=0.0)  # 0-100
    learning_streak = Column(Integer, default=0)  # days
    total_study_time = Column(Integer, default=0)  # seconds
    current_level = Column(Integer, default=1)
    next_recommended_hanzi = Column(String, nullable=True)
    stats = Column(JSON, default={})
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Progress user={self.user_id}>"
