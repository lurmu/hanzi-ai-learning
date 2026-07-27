"""DeepSeek AI Service"""
import requests
import json
from typing import Dict, Any
from sqlalchemy.orm import Session
import logging

from app.core.config import settings
from app.models.learning_record import LearningRecord
from app.models.progress import Progress

logger = logging.getLogger(__name__)


class DeepSeekService:
    """Service for interacting with DeepSeek API"""
    
    def __init__(self):
        self.api_key = settings.DEEPSEEK_API_KEY
        self.api_url = settings.DEEPSEEK_API_URL
        self.model = settings.DEEPSEEK_MODEL
        
    def analyze_user_progress(self, user_id: str, db: Session) -> Dict[str, Any]:
        """Analyze user's learning progress"""
        # Get user's learning records
        records = db.query(LearningRecord).filter(
            LearningRecord.user_id == user_id
        ).all()
        
        # Get user's progress
        progress = db.query(Progress).filter(Progress.user_id == user_id).first()
        
        if not records:
            return {"message": "No learning records found", "analysis": {}}
        
        # Calculate statistics
        total_attempts = len(records)
        correct_attempts = sum(1 for r in records if r.is_correct)
        accuracy = (correct_attempts / total_attempts * 100) if total_attempts > 0 else 0
        
        # Prepare analysis prompt
        analysis_prompt = f"""
        Analyze the following student's Chinese character learning progress:
        
        Total attempts: {total_attempts}
        Correct attempts: {correct_attempts}
        Accuracy rate: {accuracy:.1f}%
        Current level: {progress.current_level if progress else 1}
        Total study time: {progress.total_study_time if progress else 0} seconds
        
        Based on this data, provide:
        1. Assessment of the student's current level
        2. Strengths and areas for improvement
        3. Recommendations for next steps
        4. Suggested study strategies
        
        Keep the response concise and suitable for a children's learning system.
        """
        
        # Call DeepSeek API
        try:
            response = self._call_deepseek_api(analysis_prompt)
            return {
                "analysis": response,
                "statistics": {
                    "total_attempts": total_attempts,
                    "accuracy": accuracy,
                    "correct_attempts": correct_attempts
                }
            }
        except Exception as e:
            logger.error(f"Error calling DeepSeek API: {str(e)}")
            return {
                "error": "Failed to analyze progress",
                "statistics": {
                    "total_attempts": total_attempts,
                    "accuracy": accuracy
                }
            }
    
    def _call_deepseek_api(self, prompt: str) -> str:
        """Call DeepSeek API"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": settings.DEEPSEEK_TEMPERATURE,
            "max_tokens": settings.DEEPSEEK_MAX_TOKENS
        }
        
        response = requests.post(
            f"{self.api_url}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"DeepSeek API error: {response.text}")
        
        result = response.json()
        return result["choices"][0]["message"]["content"]
