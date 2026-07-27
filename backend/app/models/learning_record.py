"""Learning record model"""
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, Float
from datetime import datetime
from app.db.database import Base


class LearningRecord(Base):
    """Learning record model"""
    __tablename__ = "learning_records"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    hanzi_id = Column(String, ForeignKey("hanzi.id"), index=True)
    is_correct = Column(Boolean)
    time_spent = Column(Integer)  # seconds
    attempts = Column(Integer, default=1)
    confidence = Column(Float, nullable=True)  # 0-1
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    def __repr__(self):
        return f"<LearningRecord user={self.user_id} hanzi={self.hanzi_id}>"
