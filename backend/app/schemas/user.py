"""User schemas"""
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


class UserCreate(BaseModel):
    """User creation schema"""
    username: str
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    """User login schema"""
    username: str
    password: str


class UserResponse(BaseModel):
    """User response schema"""
    id: str
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
