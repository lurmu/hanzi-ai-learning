"""Database initialization script"""
import json
import uuid
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, Base, engine
from app.models.hanzi import Hanzi


def init_db():
    """Initialize database with base tables"""
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables created")


def seed_hanzi():
    """Seed hanzi data"""
    db = SessionLocal()
    
    # Sample hanzi data (1200+ in production)
    sample_hanzi = [
        {
            "character": "一",
            "pinyin": "yī",
            "english": "one",
            "radical": "一",
            "strokes": 1,
            "difficulty_level": 1,
            "grade_level": "kindergarten",
            "frequency": 1.0,
        },
        {
            "character": "二",
            "pinyin": "èr",
            "english": "two",
            "radical": "二",
            "strokes": 2,
            "difficulty_level": 1,
            "grade_level": "kindergarten",
            "frequency": 0.98,
        },
        {
            "character": "三",
            "pinyin": "sān",
            "english": "three",
            "radical": "三",
            "strokes": 3,
            "difficulty_level": 1,
            "grade_level": "kindergarten",
            "frequency": 0.96,
        },
        {
            "character": "人",
            "pinyin": "rén",
            "english": "person",
            "radical": "人",
            "strokes": 2,
            "difficulty_level": 1,
            "grade_level": "kindergarten",
            "frequency": 0.99,
        },
        {
            "character": "大",
            "pinyin": "dà",
            "english": "big",
            "radical": "大",
            "strokes": 3,
            "difficulty_level": 1,
            "grade_level": "kindergarten",
            "frequency": 0.95,
        },
    ]
    
    # Add to database
    for hanzi_data in sample_hanzi:
        existing = db.query(Hanzi).filter(Hanzi.character == hanzi_data["character"]).first()
        if not existing:
            hanzi = Hanzi(
                id=str(uuid.uuid4()),
                **hanzi_data
            )
            db.add(hanzi)
    
    db.commit()
    db.close()
    print("✓ Hanzi data seeded")


if __name__ == "__main__":
    init_db()
    seed_hanzi()
    print("\n✓ Database initialization completed!")
