from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class ChallengeType(str, Enum):
    PASSWORD = "password"
    TERMINAL = "terminal"
    XSS = "xss"
    SQL_INJECTION = "sql_injection"
    ENCRYPTION = "encryption"
    BLOCKCHAIN = "blockchain"

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class BadgeType(str, Enum):
    FIRST_LOGIN = "first_login"
    PASSWORD_MASTER = "password_master"
    TERMINAL_HACKER = "terminal_hacker"
    XSS_DEFENDER = "xss_defender"
    SQL_GUARDIAN = "sql_guardian"
    CRYPTO_EXPERT = "crypto_expert"
    BLOCKCHAIN_PIONEER = "blockchain_pioneer"
    SPEED_DEMON = "speed_demon"
    PERFECTIONIST = "perfectionist"
    SOCIAL_BUTTERFLY = "social_butterfly"

# User Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: EmailStr
    hashed_password: str
    role: UserRole = UserRole.USER
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True
    profile: Optional[Dict[str, Any]] = None

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: UserRole
    created_at: datetime
    is_active: bool
    profile: Optional[Dict[str, Any]] = None

class UserUpdate(BaseModel):
    profile: Optional[Dict[str, Any]] = None

# Achievement Models
class Badge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: BadgeType
    name: str
    description: str
    icon: str
    rarity: str
    points: int
    requirements: Dict[str, Any]

class UserAchievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    badge_id: str
    earned_at: datetime = Field(default_factory=datetime.utcnow)
    progress: Dict[str, Any] = Field(default_factory=dict)

# Challenge Models
class Challenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    type: ChallengeType
    title: str
    description: str
    difficulty: DifficultyLevel
    points: int
    time_limit: Optional[int] = None  # in seconds
    hints: List[str] = Field(default_factory=list)
    solution: Dict[str, Any]
    test_cases: List[Dict[str, Any]] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = True

class ChallengeAttempt(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    challenge_id: str
    started_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    is_completed: bool = False
    score: int = 0
    time_taken: Optional[int] = None  # in seconds
    attempts: int = 0
    hints_used: List[str] = Field(default_factory=list)
    solution_data: Optional[Dict[str, Any]] = None

class ChallengeResponse(BaseModel):
    challenge_id: str
    user_answer: Dict[str, Any]

class ChallengeResult(BaseModel):
    is_correct: bool
    score: int
    feedback: str
    time_taken: int
    badges_earned: List[str] = Field(default_factory=list)

# Social Models
class ShareableContent(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    challenge_id: str
    achievement_id: Optional[str] = None
    content_type: str  # "challenge_completion", "badge_earned", "leaderboard_position"
    title: str
    description: str
    image_url: Optional[str] = None
    share_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    is_public: bool = True

class SocialShare(BaseModel):
    content_id: str
    platform: str  # "twitter", "linkedin", "facebook", "discord"
    shared_at: datetime = Field(default_factory=datetime.utcnow)

# Leaderboard Models
class LeaderboardEntry(BaseModel):
    user_id: str
    username: str
    total_score: int
    challenges_completed: int
    badges_earned: int
    average_time: float
    rank: int
    profile_image: Optional[str] = None

class GlobalStats(BaseModel):
    total_users: int
    total_challenges_completed: int
    total_badges_earned: int
    average_completion_time: float
    most_popular_challenge: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Status Check (existing)
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Token Models
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None