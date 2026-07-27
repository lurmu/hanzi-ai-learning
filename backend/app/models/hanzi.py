"""Hanzi model"""
from sqlalchemy import Column, String, Integer, Text, DateTime, Float
from datetime import datetime
from app.db.database import Base


class Hanzi(Base):
    """Hanzi (Chinese character) model"""
    __tablename__ = "hanzi"

    id = Column(String, primary_key=True, index=True)
    character = Column(String, unique=True, index=True)
    pinyin = Column(String)
    english = Column(String)
    radical = Column(String)
    strokes = Column(Integer)
    difficulty_level = Column(Integer)  # 1-10
    grade_level = Column(String)  # kindergarten, elementary, etc.
    audio_url = Column(String, nullable=True)
    stroke_order_url = Column(String, nullable=True)
    frequency = Column(Float, nullable=True)  # Usage frequency
    created_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<Hanzi {self.character}>"
