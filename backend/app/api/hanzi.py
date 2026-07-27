"""Hanzi API routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.hanzi import Hanzi
from app.schemas.hanzi import HanziResponse

router = APIRouter(prefix="/hanzi")


@router.get("/{hanzi_id}", response_model=HanziResponse)
def get_hanzi(hanzi_id: str, db: Session = Depends(get_db)):
    """Get a hanzi by ID"""
    hanzi = db.query(Hanzi).filter(Hanzi.id == hanzi_id).first()
    
    if not hanzi:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hanzi not found"
        )
    
    return hanzi


@router.get("/", response_model=list[HanziResponse])
def list_hanzi(
    skip: int = 0,
    limit: int = 50,
    difficulty: int = None,
    db: Session = Depends(get_db)
):
    """List all hanzi"""
    query = db.query(Hanzi)
    
    if difficulty:
        query = query.filter(Hanzi.difficulty_level == difficulty)
    
    hanzi_list = query.offset(skip).limit(limit).all()
    return hanzi_list
