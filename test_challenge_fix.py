#!/usr/bin/env python3
"""
Test the challenge submission fix
"""

import requests
import json

BASE_URL = "https://complete-my-project.preview.emergentagent.com/api"

def test_challenge_flow():
    """Test the complete challenge flow"""
    
    # 1. Register user
    print("1. Registering user...")
    user_data = {
        "username": "test_challenger",
        "email": "challenger@hackops.com", 
        "password": "TestChallenge2024!"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=user_data)
    if response.status_code != 200:
        print(f"❌ Registration failed: {response.status_code} - {response.text}")
        return False
    print("✅ User registered")
    
    # 2. Login
    print("2. Logging in...")
    login_data = {
        "username": "test_challenger",
        "password": "TestChallenge2024!"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if response.status_code != 200:
        print(f"❌ Login failed: {response.status_code} - {response.text}")
        return False
    
    token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("✅ User logged in")
    
    # 3. Get challenges
    print("3. Getting challenges...")
    response = requests.get(f"{BASE_URL}/challenges")
    if response.status_code != 200:
        print(f"❌ Get challenges failed: {response.status_code} - {response.text}")
        return False
    
    challenges = response.json()
    if not challenges:
        print("❌ No challenges found")
        return False
    
    challenge = challenges[0]
    challenge_id = challenge["id"]
    print(f"✅ Found challenge: {challenge['title']}")
    
    # 4. Start attempt
    print("4. Starting challenge attempt...")
    response = requests.post(f"{BASE_URL}/challenges/{challenge_id}/attempt", headers=headers)
    if response.status_code != 200:
        print(f"❌ Start attempt failed: {response.status_code} - {response.text}")
        return False
    
    attempt = response.json()
    print(f"✅ Challenge attempt started: {attempt['id']}")
    
    # 5. Submit solution
    print("5. Submitting solution...")
    solution_data = {
        "challenge_id": challenge_id,
        "user_answer": {"password": "SecurePass123!"}
    }
    
    response = requests.post(f"{BASE_URL}/challenges/{challenge_id}/submit", 
                           json=solution_data, headers=headers)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Challenge submission successful!")
        print(f"   Correct: {result['is_correct']}")
        print(f"   Score: {result['score']}")
        print(f"   Time taken: {result['time_taken']} seconds")
        return True
    else:
        print(f"❌ Challenge submission failed: {response.status_code} - {response.text}")
        return False

if __name__ == "__main__":
    success = test_challenge_flow()
    print(f"\nResult: {'✅ SUCCESS' if success else '❌ FAILED'}")