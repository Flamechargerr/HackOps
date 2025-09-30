#!/usr/bin/env python3
"""
HackOps Phase 2 Backend API Testing Script
Comprehensive testing for JWT authentication, achievements, challenges, social features, and blockchain
"""

import requests
import json
import sys
import time
from datetime import datetime
from typing import Dict, Any, Optional

# Use the production URL from frontend/.env
BASE_URL = "https://complete-my-project.preview.emergentagent.com/api"

# Global test state
test_user_token = None
test_user_id = None
test_challenge_id = None
test_username = None

class TestResults:
    def __init__(self):
        self.results = {}
        self.failed_tests = []
        
    def add_result(self, test_name: str, passed: bool, details: str = ""):
        self.results[test_name] = {"passed": passed, "details": details}
        if not passed:
            self.failed_tests.append(f"{test_name}: {details}")
    
    def get_summary(self):
        total = len(self.results)
        passed = sum(1 for r in self.results.values() if r["passed"])
        return total, passed, self.failed_tests

results = TestResults()

def make_request(method: str, endpoint: str, data: Dict[str, Any] = None, 
                headers: Dict[str, str] = None, auth_token: str = None) -> requests.Response:
    """Make HTTP request with proper headers and authentication."""
    url = f"{BASE_URL}{endpoint}"
    
    # Default headers
    request_headers = {"Content-Type": "application/json"}
    if headers:
        request_headers.update(headers)
    
    # Add authentication if token provided
    if auth_token:
        request_headers["Authorization"] = f"Bearer {auth_token}"
    
    try:
        if method.upper() == "GET":
            return requests.get(url, headers=request_headers)
        elif method.upper() == "POST":
            return requests.post(url, json=data, headers=request_headers)
        elif method.upper() == "PUT":
            return requests.put(url, json=data, headers=request_headers)
        else:
            raise ValueError(f"Unsupported method: {method}")
    except Exception as e:
        print(f"❌ Request failed: {str(e)}")
        raise

# ==================== AUTHENTICATION TESTS ====================

def test_user_registration():
    """Test POST /api/auth/register"""
    print("\n🔐 Testing User Registration...")
    
    import time
    timestamp = int(time.time())
    global test_username
    test_username = f"cybersec_expert_{timestamp}"
    
    user_data = {
        "username": test_username,
        "email": f"expert_{timestamp}@hackops.com", 
        "password": "SecureHackOps2024!"
    }
    
    try:
        response = make_request("POST", "/auth/register", user_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "username", "email", "role", "created_at", "is_active"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("user_registration", False, f"Missing fields: {missing_fields}")
                return False, None
            
            if data["username"] != user_data["username"] or data["email"] != user_data["email"]:
                results.add_result("user_registration", False, "User data mismatch")
                return False, None
            
            global test_user_id
            test_user_id = data["id"]
            
            print("✅ User registration PASSED")
            results.add_result("user_registration", True)
            return True, data
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("user_registration", False, error_msg)
            return False, None
            
    except Exception as e:
        results.add_result("user_registration", False, f"Exception: {str(e)}")
        return False, None

def test_user_login():
    """Test POST /api/auth/login"""
    print("\n🔑 Testing User Login...")
    
    if not test_username:
        results.add_result("user_login", False, "No username from registration")
        return False, None
    
    login_data = {
        "username": test_username,
        "password": "SecureHackOps2024!"
    }
    
    try:
        response = make_request("POST", "/auth/login", login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["access_token", "token_type"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("user_login", False, f"Missing fields: {missing_fields}")
                return False, None
            
            if data["token_type"] != "bearer":
                results.add_result("user_login", False, f"Invalid token type: {data['token_type']}")
                return False, None
            
            global test_user_token
            test_user_token = data["access_token"]
            
            print("✅ User login PASSED")
            results.add_result("user_login", True)
            return True, data
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("user_login", False, error_msg)
            return False, None
            
    except Exception as e:
        results.add_result("user_login", False, f"Exception: {str(e)}")
        return False, None

def test_protected_endpoint():
    """Test GET /api/auth/me with JWT token"""
    print("\n🛡️ Testing Protected Endpoint Access...")
    
    if not test_user_token:
        results.add_result("protected_endpoint", False, "No auth token available")
        return False
    
    try:
        response = make_request("GET", "/auth/me", auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "username", "email", "profile"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("protected_endpoint", False, f"Missing fields: {missing_fields}")
                return False
            
            if data["username"] != test_username:
                results.add_result("protected_endpoint", False, "Username mismatch")
                return False
            
            print("✅ Protected endpoint access PASSED")
            results.add_result("protected_endpoint", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("protected_endpoint", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("protected_endpoint", False, f"Exception: {str(e)}")
        return False

def test_unauthorized_access():
    """Test protected endpoint without token"""
    print("\n🚫 Testing Unauthorized Access...")
    
    try:
        response = make_request("GET", "/auth/me")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Unauthorized access properly blocked")
            results.add_result("unauthorized_access", True)
            return True
        else:
            error_msg = f"Expected 401, got {response.status_code}"
            results.add_result("unauthorized_access", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("unauthorized_access", False, f"Exception: {str(e)}")
        return False

# ==================== CHALLENGE SYSTEM TESTS ====================

def test_get_challenges():
    """Test GET /api/challenges"""
    print("\n🎯 Testing Challenge Listing...")
    
    try:
        response = make_request("GET", "/challenges")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if not isinstance(data, list):
                results.add_result("get_challenges", False, "Response is not a list")
                return False
            
            if len(data) > 0:
                challenge = data[0]
                required_fields = ["id", "type", "title", "description", "difficulty", "points"]
                missing_fields = [field for field in required_fields if field not in challenge]
                
                if missing_fields:
                    results.add_result("get_challenges", False, f"Missing fields: {missing_fields}")
                    return False
                
                global test_challenge_id
                test_challenge_id = challenge["id"]
            
            print(f"✅ Challenge listing PASSED - Found {len(data)} challenges")
            results.add_result("get_challenges", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("get_challenges", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("get_challenges", False, f"Exception: {str(e)}")
        return False

def test_challenge_attempt():
    """Test POST /api/challenges/{id}/attempt"""
    print("\n🚀 Testing Challenge Attempt...")
    
    if not test_user_token or not test_challenge_id:
        results.add_result("challenge_attempt", False, "Missing auth token or challenge ID")
        return False
    
    try:
        response = make_request("POST", f"/challenges/{test_challenge_id}/attempt", 
                              auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "user_id", "challenge_id", "started_at", "is_completed"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("challenge_attempt", False, f"Missing fields: {missing_fields}")
                return False
            
            if data["challenge_id"] != test_challenge_id:
                results.add_result("challenge_attempt", False, "Challenge ID mismatch")
                return False
            
            print("✅ Challenge attempt PASSED")
            results.add_result("challenge_attempt", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("challenge_attempt", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("challenge_attempt", False, f"Exception: {str(e)}")
        return False

def test_challenge_submission():
    """Test POST /api/challenges/{id}/submit"""
    print("\n📝 Testing Challenge Submission...")
    
    if not test_user_token or not test_challenge_id:
        results.add_result("challenge_submission", False, "Missing auth token or challenge ID")
        return False
    
    # Submit a solution (using password challenge format)
    solution_data = {
        "challenge_id": test_challenge_id,
        "user_answer": {"password": "SecurePass123!"}
    }
    
    try:
        response = make_request("POST", f"/challenges/{test_challenge_id}/submit", 
                              solution_data, auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["is_correct", "score", "feedback", "time_taken"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("challenge_submission", False, f"Missing fields: {missing_fields}")
                return False
            
            print(f"✅ Challenge submission PASSED - Correct: {data['is_correct']}, Score: {data['score']}")
            results.add_result("challenge_submission", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("challenge_submission", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("challenge_submission", False, f"Exception: {str(e)}")
        return False

# ==================== ACHIEVEMENT SYSTEM TESTS ====================

def test_get_badges():
    """Test GET /api/badges"""
    print("\n🏆 Testing Badge Listing...")
    
    try:
        response = make_request("GET", "/badges")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if not isinstance(data, list):
                results.add_result("get_badges", False, "Response is not a list")
                return False
            
            if len(data) > 0:
                badge = data[0]
                required_fields = ["id", "type", "name", "description", "icon", "rarity", "points"]
                missing_fields = [field for field in required_fields if field not in badge]
                
                if missing_fields:
                    results.add_result("get_badges", False, f"Missing fields: {missing_fields}")
                    return False
            
            print(f"✅ Badge listing PASSED - Found {len(data)} badges")
            results.add_result("get_badges", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("get_badges", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("get_badges", False, f"Exception: {str(e)}")
        return False

def test_user_badges():
    """Test GET /api/users/me/badges"""
    print("\n🎖️ Testing User Badges...")
    
    if not test_user_token:
        results.add_result("user_badges", False, "No auth token available")
        return False
    
    try:
        response = make_request("GET", "/users/me/badges", auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if not isinstance(data, list):
                results.add_result("user_badges", False, "Response is not a list")
                return False
            
            print(f"✅ User badges PASSED - User has {len(data)} badges")
            results.add_result("user_badges", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("user_badges", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("user_badges", False, f"Exception: {str(e)}")
        return False

def test_user_progress():
    """Test GET /api/users/me/progress"""
    print("\n📊 Testing User Progress...")
    
    if not test_user_token:
        results.add_result("user_progress", False, "No auth token available")
        return False
    
    try:
        response = make_request("GET", "/users/me/progress", auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if not isinstance(data, dict):
                results.add_result("user_progress", False, "Response is not a dict")
                return False
            
            print(f"✅ User progress PASSED - Tracking {len(data)} badge types")
            results.add_result("user_progress", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("user_progress", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("user_progress", False, f"Exception: {str(e)}")
        return False

# ==================== SOCIAL & LEADERBOARD TESTS ====================

def test_social_sharing():
    """Test POST /api/social/share"""
    print("\n📱 Testing Social Sharing...")
    
    if not test_user_token or not test_challenge_id:
        results.add_result("social_sharing", False, "Missing auth token or challenge ID")
        return False
    
    try:
        response = make_request("POST", f"/social/share?challenge_id={test_challenge_id}", 
                              auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "user_id", "challenge_id", "title", "description", "share_url"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("social_sharing", False, f"Missing fields: {missing_fields}")
                return False
            
            print("✅ Social sharing PASSED")
            results.add_result("social_sharing", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("social_sharing", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("social_sharing", False, f"Exception: {str(e)}")
        return False

def test_leaderboard():
    """Test GET /api/leaderboard"""
    print("\n🏅 Testing Leaderboard...")
    
    try:
        response = make_request("GET", "/leaderboard")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if not isinstance(data, list):
                results.add_result("leaderboard", False, "Response is not a list")
                return False
            
            print(f"✅ Leaderboard PASSED - Found {len(data)} entries")
            results.add_result("leaderboard", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("leaderboard", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("leaderboard", False, f"Exception: {str(e)}")
        return False

def test_global_stats():
    """Test GET /api/stats"""
    print("\n📈 Testing Global Statistics...")
    
    try:
        response = make_request("GET", "/stats")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["total_users", "total_challenges_completed", "total_badges_earned"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("global_stats", False, f"Missing fields: {missing_fields}")
                return False
            
            print("✅ Global statistics PASSED")
            results.add_result("global_stats", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("global_stats", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("global_stats", False, f"Exception: {str(e)}")
        return False

# ==================== BLOCKCHAIN TESTS ====================

def test_blockchain_challenges():
    """Test GET /api/blockchain/challenges"""
    print("\n⛓️ Testing Blockchain Challenges...")
    
    try:
        response = make_request("GET", "/blockchain/challenges")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            if not isinstance(data, list):
                results.add_result("blockchain_challenges", False, "Response is not a list")
                return False
            
            print(f"✅ Blockchain challenges PASSED - Found {len(data)} challenges")
            results.add_result("blockchain_challenges", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("blockchain_challenges", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("blockchain_challenges", False, f"Exception: {str(e)}")
        return False

def test_transaction_validation():
    """Test POST /api/blockchain/validate-transaction"""
    print("\n🔗 Testing Transaction Validation...")
    
    if not test_user_token:
        results.add_result("transaction_validation", False, "No auth token available")
        return False
    
    transaction_data = {
        "from": "0x1234567890abcdef",
        "to": "0xfedcba0987654321", 
        "amount": 100,
        "signature": "valid_signature"
    }
    
    try:
        response = make_request("POST", "/blockchain/validate-transaction", 
                              transaction_data, auth_token=test_user_token)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["valid", "message"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                results.add_result("transaction_validation", False, f"Missing fields: {missing_fields}")
                return False
            
            print(f"✅ Transaction validation PASSED - Valid: {data['valid']}")
            results.add_result("transaction_validation", True)
            return True
        else:
            error_msg = f"Expected 200, got {response.status_code}: {response.text}"
            results.add_result("transaction_validation", False, error_msg)
            return False
            
    except Exception as e:
        results.add_result("transaction_validation", False, f"Exception: {str(e)}")
        return False

# ==================== LEGACY TESTS ====================

def test_legacy_endpoints():
    """Test existing status endpoints for backward compatibility"""
    print("\n🔄 Testing Legacy Endpoints...")
    
    # Test root endpoint
    try:
        response = make_request("GET", "/")
        if response.status_code == 200:
            data = response.json()
            if "HackOps API v2.0" in data.get("message", ""):
                results.add_result("legacy_root", True)
            else:
                results.add_result("legacy_root", False, f"Unexpected message: {data}")
        else:
            results.add_result("legacy_root", False, f"Status {response.status_code}")
    except Exception as e:
        results.add_result("legacy_root", False, f"Exception: {str(e)}")
    
    # Test status endpoints
    try:
        # POST status
        status_data = {"client_name": "hackops_tester"}
        response = make_request("POST", "/status", status_data)
        if response.status_code == 200:
            results.add_result("legacy_post_status", True)
        else:
            results.add_result("legacy_post_status", False, f"Status {response.status_code}")
        
        # GET status
        response = make_request("GET", "/status")
        if response.status_code == 200:
            results.add_result("legacy_get_status", True)
        else:
            results.add_result("legacy_get_status", False, f"Status {response.status_code}")
            
    except Exception as e:
        results.add_result("legacy_status", False, f"Exception: {str(e)}")

# ==================== MAIN TEST RUNNER ====================

def run_comprehensive_tests():
    """Run all Phase 2 backend tests"""
    print("=" * 80)
    print("🚀 HACKOPS PHASE 2 BACKEND COMPREHENSIVE TESTING")
    print("=" * 80)
    print(f"Testing backend at: {BASE_URL}")
    
    # Authentication System Tests
    print("\n" + "=" * 50)
    print("🔐 AUTHENTICATION SYSTEM TESTS")
    print("=" * 50)
    
    test_user_registration()
    test_user_login()
    test_protected_endpoint()
    test_unauthorized_access()
    
    # Challenge System Tests  
    print("\n" + "=" * 50)
    print("🎯 CHALLENGE SYSTEM TESTS")
    print("=" * 50)
    
    test_get_challenges()
    test_challenge_attempt()
    test_challenge_submission()
    
    # Achievement System Tests
    print("\n" + "=" * 50)
    print("🏆 ACHIEVEMENT SYSTEM TESTS")
    print("=" * 50)
    
    test_get_badges()
    test_user_badges()
    test_user_progress()
    
    # Social & Leaderboard Tests
    print("\n" + "=" * 50)
    print("📱 SOCIAL & LEADERBOARD TESTS")
    print("=" * 50)
    
    test_social_sharing()
    test_leaderboard()
    test_global_stats()
    
    # Blockchain Tests
    print("\n" + "=" * 50)
    print("⛓️ BLOCKCHAIN TESTS")
    print("=" * 50)
    
    test_blockchain_challenges()
    test_transaction_validation()
    
    # Legacy Compatibility Tests
    print("\n" + "=" * 50)
    print("🔄 LEGACY COMPATIBILITY TESTS")
    print("=" * 50)
    
    test_legacy_endpoints()
    
    # Final Summary
    print("\n" + "=" * 80)
    print("📊 COMPREHENSIVE TEST RESULTS")
    print("=" * 80)
    
    total, passed, failed = results.get_summary()
    
    print(f"Total Tests: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if failed:
        print("\n❌ FAILED TESTS:")
        for failure in failed:
            print(f"  • {failure}")
    
    success_rate = (passed / total) * 100
    if success_rate >= 90:
        print(f"\n🎉 EXCELLENT: {success_rate:.1f}% success rate!")
        return True
    elif success_rate >= 75:
        print(f"\n✅ GOOD: {success_rate:.1f}% success rate")
        return True
    else:
        print(f"\n⚠️ NEEDS ATTENTION: {success_rate:.1f}% success rate")
        return False

if __name__ == "__main__":
    success = run_comprehensive_tests()
    sys.exit(0 if success else 1)