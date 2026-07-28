"""Enhanced Learning API routes with LSRW (Listen, Speak, Read, Write)"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.enhanced_learning_record import EnhancedLearningRecord, LearningMode
from app.models.daily_plan import DailyPlan
from app.schemas.learning import LearningRecordCreate, LearningRecordResponse
from app.services.learning_plan import LearningPlanGenerator
from app.services.spaced_repetition import EbbinghausAlgorithm
from app.services.advanced_ai_analyzer import AdvancedAIAnalyzer

router = APIRouter(prefix="/learning")


@router.post("/record-enhanced")
def record_enhanced_learning(
    user_id: str,
    hanzi_id: str,
    mode: LearningMode,
    is_correct: bool,
    time_spent: int,
    attempts: int = 1,
    confidence: float = None,
    db: Session = Depends(get_db)
):
    """
    记录增强学习记录 (包含听说读写四个维度)
    
    Args:
        mode: 学习模式 (listen/speak/read/write)
        is_correct: 是否正确
        time_spent: 耗时(秒)
        confidence: 自信度(0-1)
    """
    # 计算遗忘曲线下一次复习时间
    now = datetime.utcnow()
    review_info = EbbinghausAlgorithm.calculate_next_review(
        hanzi_id, is_correct, now
    )
    
    # 计算难度评分
    difficulty_score = EbbinghausAlgorithm.calculate_difficulty(
        time_spent, is_correct
    )
    
    # 创建记录
    record = EnhancedLearningRecord(
        id=str(uuid.uuid4()),
        user_id=user_id,
        hanzi_id=hanzi_id,
        mode=mode,
        is_correct=is_correct,
        time_spent=time_spent,
        attempts=attempts,
        confidence=confidence,
        review_stage=review_info['stage'],
        next_review_time=review_info['next_review'],
        difficulty_score=difficulty_score
    )
    
    db.add(record)
    db.commit()
    db.refresh(record)
    
    return {
        "id": record.id,
        "mode": record.mode,
        "is_correct": record.is_correct,
        "review_stage": record.review_stage,
        "next_review_time": record.next_review_time,
        "difficulty_score": record.difficulty_score
    }


@router.get("/daily-plan/{user_id}")
def get_daily_plan(user_id: str, db: Session = Depends(get_db)):
    """
    获取今日学习计划
    
    返回:
    - 70% 新字 (今天学7个新汉字)
    - 30% 复习字 (复习3个旧汉字)
    """
    try:
        plan = LearningPlanGenerator.generate_daily_plan(user_id, db)
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate daily plan: {str(e)}"
        )


@router.get("/weekly-plan/{user_id}")
def get_weekly_plan(user_id: str, db: Session = Depends(get_db)):
    """
    获取周学习计划
    基于Ebbinghaus遗忘曲线调整
    """
    try:
        plan = LearningPlanGenerator.generate_weekly_plan(user_id, db)
        return plan
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate weekly plan: {str(e)}"
        )


@router.get("/stats/daily/{user_id}")
def get_daily_stats(user_id: str, db: Session = Depends(get_db)):
    """
    获取今日学习统计
    按学习模式分类
    """
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_records = db.query(EnhancedLearningRecord).filter(
        EnhancedLearningRecord.user_id == user_id,
        EnhancedLearningRecord.created_at >= today_start
    ).all()
    
    if not today_records:
        return {
            "date": today_start.date(),
            "total": 0,
            "by_mode": {}
        }
    
    # 按模式统计
    by_mode = {}
    for mode in LearningMode:
        mode_records = [r for r in today_records if r.mode == mode]
        if mode_records:
            correct = sum(1 for r in mode_records if r.is_correct)
            by_mode[mode.value] = {
                "total": len(mode_records),
                "correct": correct,
                "accuracy": (correct / len(mode_records)) * 100
            }
    
    return {
        "date": today_start.date(),
        "total": len(today_records),
        "correct": sum(1 for r in today_records if r.is_correct),
        "accuracy": (sum(1 for r in today_records if r.is_correct) / len(today_records)) * 100,
        "by_mode": by_mode
    }


@router.get("/review-schedule/{user_id}")
def get_review_schedule(
    user_id: str,
    days: int = Query(7, ge=1, le=30),
    db: Session = Depends(get_db)
):
    """
    获取复习日程
    显示未来N天需要复习的汉字
    """
    now = datetime.utcnow()
    future = now.replace(hour=23, minute=59, second=59)
    future = future + __import__('datetime').timedelta(days=days)
    
    schedule = db.query(EnhancedLearningRecord).filter(
        EnhancedLearningRecord.user_id == user_id,
        EnhancedLearningRecord.next_review_time >= now,
        EnhancedLearningRecord.next_review_time <= future
    ).order_by(EnhancedLearningRecord.next_review_time).all()
    
    # 按日期分组
    by_date = {}
    for record in schedule:
        date = record.next_review_time.date()
        if date not in by_date:
            by_date[date] = []
        by_date[date].append({
            "hanzi_id": record.hanzi_id,
            "mode": record.mode,
            "review_stage": record.review_stage
        })
    
    return {
        "schedule_days": days,
        "by_date": by_date
    }
