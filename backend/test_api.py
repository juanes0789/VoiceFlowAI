#!/usr/bin/env python
"""
Quick test script to verify backend API is working correctly
"""

import requests
import json
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_chat():
    """Test chat endpoint"""
    print("\n💬 Testing chat endpoint...")
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        print("❌ OPENROUTER_API_KEY not found in .env")
        return False

    try:
        payload = {
            "message": "Hello, I'm learning English. Can you help me?",
            "mode": "casual"
        }
        response = requests.post(
            f"{BASE_URL}/chat",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_reset():
    """Test reset endpoint"""
    print("\n🔄 Testing reset endpoint...")
    try:
        response = requests.post(f"{BASE_URL}/reset")
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 50)
    print("VoiceBot Pro API Test Suite")
    print("=" * 50)

    try:
        results = []
        results.append(("Health Check", test_health()))
        results.append(("Chat", test_chat()))
        results.append(("Reset", test_reset()))

        print("\n" + "=" * 50)
        print("Test Summary:")
        print("=" * 50)

        for test_name, passed in results:
            status = "✅ PASSED" if passed else "❌ FAILED"
            print(f"{test_name}: {status}")

        all_passed = all(result[1] for result in results)
        if all_passed:
            print("\n✅ All tests passed!")
        else:
            print("\n⚠️ Some tests failed. Check your configuration.")

    except Exception as e:
        print(f"❌ Unexpected error: {e}")

