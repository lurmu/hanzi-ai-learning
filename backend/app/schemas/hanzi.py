"""Hanzi schemas"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HanziCreate(BaseModel):
    """Hanzi creation schema"""
    character: str
    pinyin: str
    english: str
    radical: str
    strokes: int
    difficulty_level: int
    grade_level: str
    audio_url: Optional[str] = None
    stroke_order_url: Optional[str] = None
    frequency: Optional[float] = None


class HanziResponse(BaseModel):
    """Hanzi response schema"""
    id: str
    character: str
    pinyin: str
    english: str
    radical: str
    strokes: int
    difficulty_level: int
    grade_level: str
    audio_url: Optional[str]
    stroke_order_url: Optional[str]
    frequency: Optional[float]

    class Config:
        from_attributes = True
