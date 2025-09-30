#!/usr/bin/env python3
"""
Backend API Testing Script
Tests the FastAPI backend endpoints according to test_result.md requirements
"""

import requests
import json
import sys
from datetime import datetime

# Use the production URL from frontend/.env
BASE_URL = "https://complete-my-project.preview.emergentagent.com/api"

def test_get_root():
    """Test GET /api endpoint"""
    print("Testing GET /api...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("✅ GET /api test PASSED")
                return True
            else:
                print(f"❌ GET /api test FAILED - Expected message 'Hello World', got: {data}")
                return False
        else:
            print(f"❌ GET /api test FAILED - Expected status 200, got: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ GET /api test FAILED - Exception: {str(e)}")
        return False

def test_post_status():
    """Test POST /api/status endpoint"""
    print("\nTesting POST /api/status...")
    try:
        payload = {"client_name": "tester"}
        headers = {"Content-Type": "application/json"}
        
        response = requests.post(f"{BASE_URL}/status", 
                               data=json.dumps(payload), 
                               headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code in [200, 201]:
            data = response.json()
            required_fields = ["id", "client_name", "timestamp"]
            
            # Check if all required fields are present
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"❌ POST /api/status test FAILED - Missing fields: {missing_fields}")
                return False, None
            
            # Validate field values
            if data["client_name"] != "tester":
                print(f"❌ POST /api/status test FAILED - Expected client_name 'tester', got: {data['client_name']}")
                return False, None
            
            # Validate UUID format (basic check)
            if not data["id"] or len(data["id"]) < 32:
                print(f"❌ POST /api/status test FAILED - Invalid ID format: {data['id']}")
                return False, None
            
            # Validate timestamp format
            try:
                datetime.fromisoformat(data["timestamp"].replace('Z', '+00:00'))
            except ValueError:
                print(f"❌ POST /api/status test FAILED - Invalid timestamp format: {data['timestamp']}")
                return False, None
            
            print("✅ POST /api/status test PASSED")
            return True, data
        else:
            print(f"❌ POST /api/status test FAILED - Expected status 200/201, got: {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ POST /api/status test FAILED - Exception: {str(e)}")
        return False, None

def test_get_status():
    """Test GET /api/status endpoint"""
    print("\nTesting GET /api/status...")
    try:
        response = requests.get(f"{BASE_URL}/status")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                print(f"✅ GET /api/status test PASSED - Returned list with {len(data)} items")
                return True, data
            else:
                print(f"❌ GET /api/status test FAILED - Expected list, got: {type(data)}")
                return False, None
        else:
            print(f"❌ GET /api/status test FAILED - Expected status 200, got: {response.status_code}")
            return False, None
    except Exception as e:
        print(f"❌ GET /api/status test FAILED - Exception: {str(e)}")
        return False, None

def test_full_workflow():
    """Test the complete workflow: POST then GET to verify data persistence"""
    print("\n" + "="*50)
    print("RUNNING BACKEND API SMOKE TESTS")
    print("="*50)
    
    # Test 1: GET root endpoint
    root_success = test_get_root()
    
    # Test 2: POST status endpoint
    post_success, created_item = test_post_status()
    
    # Test 3: GET status endpoint
    get_success, status_list = test_get_status()
    
    # Test 4: Verify the created item exists in the list
    if post_success and get_success and created_item and status_list:
        print("\nTesting data persistence...")
        created_id = created_item["id"]
        found_item = None
        
        for item in status_list:
            if item.get("id") == created_id:
                found_item = item
                break
        
        if found_item:
            print("✅ Data persistence test PASSED - Created item found in GET response")
            persistence_success = True
        else:
            print("❌ Data persistence test FAILED - Created item not found in GET response")
            persistence_success = False
    else:
        print("⚠️ Data persistence test SKIPPED - Previous tests failed")
        persistence_success = False
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    print(f"GET /api: {'✅ PASS' if root_success else '❌ FAIL'}")
    print(f"POST /api/status: {'✅ PASS' if post_success else '❌ FAIL'}")
    print(f"GET /api/status: {'✅ PASS' if get_success else '❌ FAIL'}")
    print(f"Data persistence: {'✅ PASS' if persistence_success else '❌ FAIL'}")
    
    all_tests_passed = root_success and post_success and get_success and persistence_success
    print(f"\nOVERALL: {'✅ ALL TESTS PASSED' if all_tests_passed else '❌ SOME TESTS FAILED'}")
    
    return all_tests_passed

if __name__ == "__main__":
    print(f"Testing backend at: {BASE_URL}")
    success = test_full_workflow()
    sys.exit(0 if success else 1)