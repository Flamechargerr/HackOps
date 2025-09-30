from typing import List, Dict, Any
from datetime import datetime
from models import Badge, UserAchievement, BadgeType, ChallengeAttempt, User
import uuid

# Define all available badges
AVAILABLE_BADGES = {
    BadgeType.FIRST_LOGIN: Badge(
        type=BadgeType.FIRST_LOGIN,
        name="Welcome Hacker",
        description="Successfully logged in for the first time",
        icon="🎯",
        rarity="Common",
        points=10,
        requirements={"action": "first_login"}
    ),
    BadgeType.PASSWORD_MASTER: Badge(
        type=BadgeType.PASSWORD_MASTER,
        name="Password Master",
        description="Complete all password challenges",
        icon="🔐",
        rarity="Rare",
        points=100,
        requirements={"challenges_completed": 5, "challenge_type": "password"}
    ),
    BadgeType.TERMINAL_HACKER: Badge(
        type=BadgeType.TERMINAL_HACKER,
        name="Terminal Hacker",
        description="Master the art of command-line hacking",
        icon="💻",
        rarity="Rare",
        points=100,
        requirements={"challenges_completed": 3, "challenge_type": "terminal"}
    ),
    BadgeType.XSS_DEFENDER: Badge(
        type=BadgeType.XSS_DEFENDER,
        name="XSS Defender",
        description="Protect against cross-site scripting attacks",
        icon="🛡️",
        rarity="Epic",
        points=150,
        requirements={"challenges_completed": 3, "challenge_type": "xss"}
    ),
    BadgeType.SQL_GUARDIAN: Badge(
        type=BadgeType.SQL_GUARDIAN,
        name="SQL Guardian",
        description="Defend databases from injection attacks",
        icon="🗃️",
        rarity="Epic",
        points=150,
        requirements={"challenges_completed": 3, "challenge_type": "sql_injection"}
    ),
    BadgeType.CRYPTO_EXPERT: Badge(
        type=BadgeType.CRYPTO_EXPERT,
        name="Crypto Expert",
        description="Master encryption and decryption techniques",
        icon="🔑",
        rarity="Legendary",
        points=200,
        requirements={"challenges_completed": 5, "challenge_type": "encryption"}
    ),
    BadgeType.BLOCKCHAIN_PIONEER: Badge(
        type=BadgeType.BLOCKCHAIN_PIONEER,
        name="Blockchain Pioneer",
        description="Explore the depths of blockchain security",
        icon="⛓️",
        rarity="Legendary",
        points=200,
        requirements={"challenges_completed": 3, "challenge_type": "blockchain"}
    ),
    BadgeType.SPEED_DEMON: Badge(
        type=BadgeType.SPEED_DEMON,
        name="Speed Demon",
        description="Complete 10 challenges in under 5 minutes each",
        icon="⚡",
        rarity="Epic",
        points=150,
        requirements={"fast_completions": 10, "time_limit": 300}
    ),
    BadgeType.PERFECTIONIST: Badge(
        type=BadgeType.PERFECTIONIST,
        name="Perfectionist",
        description="Complete 5 challenges without using any hints",
        icon="💎",
        rarity="Legendary",
        points=250,
        requirements={"perfect_completions": 5}
    ),
    BadgeType.SOCIAL_BUTTERFLY: Badge(
        type=BadgeType.SOCIAL_BUTTERFLY,
        name="Social Butterfly",
        description="Share 5 achievements on social media",
        icon="🦋",
        rarity="Rare",
        points=75,
        requirements={"social_shares": 5}
    )
}

class AchievementEngine:
    def __init__(self, db):
        self.db = db

    async def initialize_badges(self):
        """Initialize all badges in the database."""
        for badge in AVAILABLE_BADGES.values():
            existing = await self.db.badges.find_one({"type": badge.type})
            if not existing:
                await self.db.badges.insert_one(badge.dict())

    async def check_achievements(self, user_id: str, action: str, data: Dict[str, Any] = None) -> List[str]:
        """
        Check if user earned any new badges based on their action.
        Returns list of newly earned badge IDs.
        """
        newly_earned = []
        
        # Get user's existing achievements
        user_achievements = await self.db.user_achievements.find({"user_id": user_id}).to_list(1000)
        earned_badge_types = {ach["badge_id"] for ach in user_achievements}
        
        # Check each badge requirement
        for badge_type, badge in AVAILABLE_BADGES.items():
            badge_id = badge.id
            if badge_id in earned_badge_types:
                continue  # Already earned
                
            if await self._check_badge_requirement(user_id, badge, action, data):
                # Award the badge
                user_achievement = UserAchievement(
                    user_id=user_id,
                    badge_id=badge_id
                )
                await self.db.user_achievements.insert_one(user_achievement.dict())
                newly_earned.append(badge_id)
        
        return newly_earned

    async def _check_badge_requirement(self, user_id: str, badge: Badge, action: str, data: Dict[str, Any] = None) -> bool:
        """Check if a specific badge requirement is met."""
        requirements = badge.requirements
        
        # First login badge
        if badge.type == BadgeType.FIRST_LOGIN and action == "first_login":
            return True
        
        # Challenge completion badges
        if "challenge_type" in requirements:
            challenge_type = requirements["challenge_type"]
            required_count = requirements.get("challenges_completed", 1)
            
            completed_challenges = await self.db.challenge_attempts.count_documents({
                "user_id": user_id,
                "is_completed": True,
                "challenge_type": challenge_type
            })
            return completed_challenges >= required_count
        
        # Speed demon badge
        if badge.type == BadgeType.SPEED_DEMON:
            time_limit = requirements["time_limit"]
            required_count = requirements["fast_completions"]
            
            fast_completions = await self.db.challenge_attempts.count_documents({
                "user_id": user_id,
                "is_completed": True,
                "time_taken": {"$lt": time_limit}
            })
            return fast_completions >= required_count
        
        # Perfectionist badge
        if badge.type == BadgeType.PERFECTIONIST:
            required_count = requirements["perfect_completions"]
            
            perfect_completions = await self.db.challenge_attempts.count_documents({
                "user_id": user_id,
                "is_completed": True,
                "hints_used": {"$size": 0}
            })
            return perfect_completions >= required_count
        
        # Social butterfly badge
        if badge.type == BadgeType.SOCIAL_BUTTERFLY and action == "social_share":
            required_shares = requirements["social_shares"]
            
            total_shares = await self.db.social_shares.count_documents({
                "user_id": user_id
            })
            return total_shares >= required_shares
        
        return False

    async def get_user_badges(self, user_id: str) -> List[Dict[str, Any]]:
        """Get all badges earned by a user with details."""
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$lookup": {
                "from": "badges",
                "localField": "badge_id",
                "foreignField": "id",
                "as": "badge_info"
            }},
            {"$unwind": "$badge_info"},
            {"$project": {
                "earned_at": 1,
                "badge": "$badge_info"
            }}
        ]
        
        user_badges = await self.db.user_achievements.aggregate(pipeline).to_list(1000)
        return user_badges

    async def get_user_progress(self, user_id: str) -> Dict[str, Any]:
        """Get user's progress towards all badges."""
        progress = {}
        
        for badge_type, badge in AVAILABLE_BADGES.items():
            requirements = badge.requirements
            current_progress = await self._get_badge_progress(user_id, badge)
            
            progress[badge.type] = {
                "badge": badge.dict(),
                "progress": current_progress,
                "completed": current_progress.get("percentage", 0) >= 100
            }
        
        return progress

    async def _get_badge_progress(self, user_id: str, badge: Badge) -> Dict[str, Any]:
        """Get progress for a specific badge."""
        requirements = badge.requirements
        
        if "challenge_type" in requirements:
            challenge_type = requirements["challenge_type"]
            required_count = requirements.get("challenges_completed", 1)
            
            completed = await self.db.challenge_attempts.count_documents({
                "user_id": user_id,
                "is_completed": True,
                "challenge_type": challenge_type
            })
            
            return {
                "current": completed,
                "required": required_count,
                "percentage": min(100, (completed / required_count) * 100)
            }
        
        # Add progress calculations for other badge types as needed
        return {"current": 0, "required": 1, "percentage": 0}