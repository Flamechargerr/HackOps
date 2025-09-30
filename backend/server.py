from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import uuid

# Import our custom modules
from models import *
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    create_user_dependency,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from achievements import AchievementEngine, AVAILABLE_BADGES

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Initialize achievement engine
achievement_engine = AchievementEngine(db)

# Create the main app without a prefix
app = FastAPI(
    title="HackOps Cybersecurity Platform API",
    description="Advanced cybersecurity learning platform with challenges, achievements, and social features",
    version="2.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Create user dependency
get_current_user = create_user_dependency(db)

# ==================== AUTHENTICATION ROUTES ====================

@api_router.post("/auth/register", response_model=UserResponse)
async def register_user(user_data: UserCreate):
    """Register a new user."""
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"username": user_data.username}, {"email": user_data.email}]})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Create new user
    user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password),
        profile={
            "display_name": user_data.username,
            "bio": "",
            "avatar_url": "",
            "total_score": 0,
            "challenges_completed": 0,
            "badges_earned": 0,
            "joined_challenges": []
        }
    )
    
    await db.users.insert_one(user.dict())
    
    # Award first login badge
    await achievement_engine.check_achievements(user.id, "first_login")
    
    return UserResponse(**user.dict())

@api_router.post("/auth/login", response_model=Token)
async def login_user(login_data: UserLogin):
    """Authenticate user and return access token."""
    user_doc = await db.users.find_one({"username": login_data.username})
    if not user_doc or not verify_password(login_data.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    user = User(**user_doc)
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Get current user profile."""
    return UserResponse(**current_user.dict())

@api_router.put("/auth/profile", response_model=UserResponse)
async def update_user_profile(profile_update: UserUpdate, current_user: User = Depends(get_current_user)):
    """Update user profile."""
    update_data = {}
    if profile_update.profile:
        update_data["profile"] = {**current_user.profile, **profile_update.profile}
    
    await db.users.update_one(
        {"id": current_user.id},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"id": current_user.id})
    return UserResponse(**updated_user)

# ==================== CHALLENGE ROUTES ====================

@api_router.get("/challenges", response_model=List[Challenge])
async def get_challenges(
    challenge_type: Optional[ChallengeType] = None,
    difficulty: Optional[DifficultyLevel] = None,
    limit: int = 50
):
    """Get available challenges with optional filtering."""
    query = {"is_active": True}
    if challenge_type:
        query["type"] = challenge_type
    if difficulty:
        query["difficulty"] = difficulty
    
    challenges = await db.challenges.find(query).limit(limit).to_list(1000)
    return [Challenge(**challenge) for challenge in challenges]

@api_router.get("/challenges/{challenge_id}", response_model=Challenge)
async def get_challenge(challenge_id: str):
    """Get specific challenge details."""
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return Challenge(**challenge)

@api_router.post("/challenges/{challenge_id}/attempt", response_model=ChallengeAttempt)
async def start_challenge_attempt(challenge_id: str, current_user: User = Depends(get_current_user)):
    """Start a new challenge attempt."""
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Check if user has an active attempt
    active_attempt = await db.challenge_attempts.find_one({
        "user_id": current_user.id,
        "challenge_id": challenge_id,
        "is_completed": False
    })
    
    if active_attempt:
        return ChallengeAttempt(**active_attempt)
    
    # Create new attempt
    attempt = ChallengeAttempt(
        user_id=current_user.id,
        challenge_id=challenge_id
    )
    
    await db.challenge_attempts.insert_one(attempt.dict())
    return attempt

@api_router.post("/challenges/{challenge_id}/submit", response_model=ChallengeResult)
async def submit_challenge_solution(
    challenge_id: str,
    response_data: ChallengeResponse,
    current_user: User = Depends(get_current_user)
):
    """Submit solution for a challenge."""
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    attempt = await db.challenge_attempts.find_one({
        "user_id": current_user.id,
        "challenge_id": challenge_id,
        "is_completed": False
    })
    
    if not attempt:
        raise HTTPException(status_code=400, detail="No active attempt found")
    
    # Simple solution validation (expand based on challenge type)
    is_correct = await _validate_solution(challenge, response_data.user_answer)
    
    # Calculate score and time
    time_taken = int((datetime.utcnow() - datetime.fromisoformat(attempt["started_at"])).total_seconds())
    base_score = challenge["points"]
    score = base_score if is_correct else 0
    
    # Update attempt
    update_data = {
        "attempts": attempt["attempts"] + 1,
        "solution_data": response_data.user_answer,
        "time_taken": time_taken
    }
    
    if is_correct:
        update_data.update({
            "is_completed": True,
            "completed_at": datetime.utcnow(),
            "score": score
        })
        
        # Update user profile
        await db.users.update_one(
            {"id": current_user.id},
            {
                "$inc": {
                    "profile.total_score": score,
                    "profile.challenges_completed": 1
                }
            }
        )
    
    await db.challenge_attempts.update_one(
        {"id": attempt["id"]},
        {"$set": update_data}
    )
    
    # Check for new achievements
    newly_earned_badges = []
    if is_correct:
        newly_earned_badges = await achievement_engine.check_achievements(
            current_user.id,
            "challenge_completed",
            {
                "challenge_type": challenge["type"],
                "time_taken": time_taken,
                "hints_used": attempt["hints_used"]
            }
        )
    
    return ChallengeResult(
        is_correct=is_correct,
        score=score,
        feedback="Correct solution!" if is_correct else "Incorrect solution. Try again!",
        time_taken=time_taken,
        badges_earned=newly_earned_badges
    )

# ==================== ACHIEVEMENT ROUTES ====================

@api_router.get("/badges", response_model=List[Badge])
async def get_available_badges():
    """Get all available badges."""
    return list(AVAILABLE_BADGES.values())

@api_router.get("/users/{user_id}/badges")
async def get_user_badges(user_id: str):
    """Get badges earned by a specific user."""
    return await achievement_engine.get_user_badges(user_id)

@api_router.get("/users/me/badges")
async def get_my_badges(current_user: User = Depends(get_current_user)):
    """Get badges earned by current user."""
    return await achievement_engine.get_user_badges(current_user.id)

@api_router.get("/users/me/progress")
async def get_my_progress(current_user: User = Depends(get_current_user)):
    """Get current user's progress towards all badges."""
    return await achievement_engine.get_user_progress(current_user.id)

# ==================== SOCIAL ROUTES ====================

@api_router.post("/social/share", response_model=ShareableContent)
async def create_shareable_content(
    challenge_id: str,
    achievement_id: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Create shareable content for social media."""
    challenge = await db.challenges.find_one({"id": challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    content = ShareableContent(
        user_id=current_user.id,
        challenge_id=challenge_id,
        achievement_id=achievement_id,
        content_type="challenge_completion",
        title=f"I just completed {challenge['title']} on HackOps!",
        description=f"Check out this cybersecurity challenge: {challenge['description'][:100]}...",
        share_url=f"https://flamechargerr.github.io/HackOps/challenges/{challenge_id}"
    )
    
    await db.shareable_content.insert_one(content.dict())
    
    # Track social share achievement
    await achievement_engine.check_achievements(current_user.id, "social_share")
    
    return content

@api_router.post("/social/track-share")
async def track_social_share(
    content_id: str,
    platform: str,
    current_user: User = Depends(get_current_user)
):
    """Track when content is shared on social media."""
    share = SocialShare(
        content_id=content_id,
        platform=platform
    )
    
    await db.social_shares.insert_one(share.dict())
    return {"message": "Share tracked successfully"}

# ==================== LEADERBOARD ROUTES ====================

@api_router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(limit: int = 50):
    """Get global leaderboard."""
    pipeline = [
        {
            "$lookup": {
                "from": "user_achievements",
                "localField": "id",
                "foreignField": "user_id",
                "as": "achievements"
            }
        },
        {
            "$addFields": {
                "badges_earned": {"$size": "$achievements"}
            }
        },
        {
            "$project": {
                "user_id": "$id",
                "username": 1,
                "total_score": {"$ifNull": ["$profile.total_score", 0]},
                "challenges_completed": {"$ifNull": ["$profile.challenges_completed", 0]},
                "badges_earned": 1,
                "profile_image": {"$ifNull": ["$profile.avatar_url", None]}
            }
        },
        {"$sort": {"total_score": -1, "challenges_completed": -1}},
        {"$limit": limit}
    ]
    
    leaderboard_data = await db.users.aggregate(pipeline).to_list(1000)
    
    # Add ranks
    leaderboard = []
    for i, entry in enumerate(leaderboard_data):
        leaderboard_entry = LeaderboardEntry(
            user_id=entry["user_id"],
            username=entry["username"],
            total_score=entry["total_score"],
            challenges_completed=entry["challenges_completed"],
            badges_earned=entry["badges_earned"],
            average_time=0.0,  # Calculate if needed
            rank=i + 1,
            profile_image=entry.get("profile_image")
        )
        leaderboard.append(leaderboard_entry)
    
    return leaderboard

@api_router.get("/stats", response_model=GlobalStats)
async def get_global_stats():
    """Get global platform statistics."""
    total_users = await db.users.count_documents({})
    total_challenges_completed = await db.challenge_attempts.count_documents({"is_completed": True})
    total_badges_earned = await db.user_achievements.count_documents({})
    
    # Calculate average completion time
    avg_time_pipeline = [
        {"$match": {"is_completed": True, "time_taken": {"$gt": 0}}},
        {"$group": {"_id": None, "avg_time": {"$avg": "$time_taken"}}}
    ]
    avg_time_result = await db.challenge_attempts.aggregate(avg_time_pipeline).to_list(1)
    average_completion_time = avg_time_result[0]["avg_time"] if avg_time_result else 0.0
    
    # Most popular challenge
    popular_challenge_pipeline = [
        {"$group": {"_id": "$challenge_id", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    popular_result = await db.challenge_attempts.aggregate(popular_challenge_pipeline).to_list(1)
    most_popular_challenge = popular_result[0]["_id"] if popular_result else "N/A"
    
    return GlobalStats(
        total_users=total_users,
        total_challenges_completed=total_challenges_completed,
        total_badges_earned=total_badges_earned,
        average_completion_time=average_completion_time,
        most_popular_challenge=most_popular_challenge
    )

# ==================== HELPER FUNCTIONS ====================

async def _validate_solution(challenge: Dict[str, Any], user_answer: Dict[str, Any]) -> bool:
    """Validate user solution against challenge."""
    # This is a simplified validation - expand based on challenge types
    solution = challenge.get("solution", {})
    
    if challenge["type"] == "password":
        return user_answer.get("password", "").strip() == solution.get("expected_password", "")
    elif challenge["type"] == "terminal":
        return user_answer.get("command", "").strip() == solution.get("expected_command", "")
    elif challenge["type"] == "xss":
        expected_payload = solution.get("expected_payload", "")
        return expected_payload.lower() in user_answer.get("payload", "").lower()
    elif challenge["type"] == "sql_injection":
        expected_query = solution.get("expected_query", "")
        return expected_query.lower() in user_answer.get("query", "").lower()
    
    return False

# ==================== EXISTING ROUTES ====================
# ==================== EXISTING ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "HackOps API v2.0 - Advanced Cybersecurity Platform"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# ==================== BLOCKCHAIN CHALLENGE ROUTES ====================

@api_router.get("/blockchain/challenges", response_model=List[Challenge])
async def get_blockchain_challenges():
    """Get blockchain-specific challenges."""
    challenges = await db.challenges.find({"type": "blockchain", "is_active": True}).to_list(100)
    return [Challenge(**challenge) for challenge in challenges]

@api_router.post("/blockchain/validate-transaction")
async def validate_blockchain_transaction(
    transaction_data: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    """Validate a blockchain transaction for advanced challenges."""
    # Simplified blockchain validation logic
    required_fields = ["from", "to", "amount", "signature"]
    
    if not all(field in transaction_data for field in required_fields):
        return {"valid": False, "error": "Missing required fields"}
    
    # Mock validation - replace with actual blockchain logic
    is_valid = transaction_data.get("signature") == "valid_signature"
    
    return {
        "valid": is_valid,
        "transaction_hash": str(uuid.uuid4()) if is_valid else None,
        "message": "Transaction valid" if is_valid else "Invalid signature"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db():
    """Initialize database collections and default data."""
    try:
        # Initialize achievement badges
        await achievement_engine.initialize_badges()
        
        # Create default challenges if they don't exist
        await _create_default_challenges()
        
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")

async def _create_default_challenges():
    """Create default challenges for each type."""
    default_challenges = [
        {
            "type": "password",
            "title": "Password Security Basics",
            "description": "Create a password that meets basic security requirements",
            "difficulty": "beginner",
            "points": 50,
            "time_limit": 300,
            "hints": ["Include uppercase and lowercase letters", "Add numbers and special characters"],
            "solution": {"expected_password": "SecurePass123!"},
            "tags": ["password", "security", "basics"]
        },
        {
            "type": "terminal",
            "title": "Basic Directory Navigation",
            "description": "Navigate to the hidden directory and find the secret file",
            "difficulty": "beginner", 
            "points": 75,
            "hints": ["Use 'ls -la' to see hidden files", "Look for directories starting with '.'"],
            "solution": {"expected_command": "cd .hidden && cat secret.txt"},
            "tags": ["terminal", "linux", "navigation"]
        },
        {
            "type": "xss",
            "title": "Cross-Site Scripting Detection",
            "description": "Identify and exploit a simple XSS vulnerability",
            "difficulty": "intermediate",
            "points": 100,
            "hints": ["Look for user input fields", "Try basic script tags"],
            "solution": {"expected_payload": "<script>alert('XSS')</script>"},
            "tags": ["xss", "web", "security"]
        },
        {
            "type": "sql_injection",
            "title": "SQL Injection Basics",
            "description": "Extract data using SQL injection techniques",
            "difficulty": "intermediate",
            "points": 125,
            "hints": ["Try single quotes", "Use UNION SELECT"],
            "solution": {"expected_query": "' UNION SELECT username, password FROM users--"},
            "tags": ["sql", "injection", "database"]
        },
        {
            "type": "encryption",
            "title": "Caesar Cipher Decryption", 
            "description": "Decrypt a message encoded with Caesar cipher",
            "difficulty": "beginner",
            "points": 60,
            "hints": ["Try different shift values", "Common shift is 13 (ROT13)"],
            "solution": {"expected_text": "HELLO WORLD", "shift": 13},
            "tags": ["encryption", "cipher", "crypto"]
        },
        {
            "type": "blockchain",
            "title": "Smart Contract Security",
            "description": "Identify vulnerabilities in a smart contract",
            "difficulty": "advanced",
            "points": 200,
            "hints": ["Check for reentrancy attacks", "Look for integer overflow"],
            "solution": {"vulnerability_type": "reentrancy", "line_number": 42},
            "tags": ["blockchain", "smart-contract", "security"]
        }
    ]
    
    for challenge_data in default_challenges:
        # Check if challenge already exists
        existing = await db.challenges.find_one({"title": challenge_data["title"]})
        if not existing:
            challenge = Challenge(**challenge_data)
            await db.challenges.insert_one(challenge.dict())

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
