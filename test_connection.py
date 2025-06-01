import requests
import json
import sys

def test_health_endpoint():
    print("Testing connection to backend health endpoint...")
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        print(f"Status code: {response.status_code}")
        if response.status_code == 200:
            print("✅ Connection successful!")
            print(f"Response: {json.dumps(response.json(), indent=2)}")
            return True
        else:
            print(f"❌ Connection failed with status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Connection error: {e}")
        return False

def test_cors_preflight():
    print("\nTesting CORS preflight request...")
    try:
        headers = {
            "Origin": "http://localhost:5175",
            "Access-Control-Request-Method": "GET",
            "Access-Control-Request-Headers": "Content-Type"
        }
        response = requests.options("http://localhost:8000/health", headers=headers, timeout=5)
        print(f"Status code: {response.status_code}")
        print("Response headers:")
        for key, value in response.headers.items():
            if key.lower().startswith("access-control"):
                print(f"  {key}: {value}")
        
        if "access-control-allow-origin" in response.headers.keys():
            print("✅ CORS headers are present!")
            return True
        else:
            print("❌ CORS headers are missing!")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ CORS test error: {e}")
        return False

def main():
    print("Backend Connection Test Script")
    print("=============================")
    health_result = test_health_endpoint()
    cors_result = test_cors_preflight()
    
    print("\nSummary:")
    print(f"Health endpoint test: {'✅ PASSED' if health_result else '❌ FAILED'}")
    print(f"CORS preflight test: {'✅ PASSED' if cors_result else '❌ FAILED'}")
    
    if not health_result:
        print("\nTroubleshooting tips for health endpoint:")
        print("1. Make sure the backend server is running")
        print("2. Check if the server is listening on port 8000")
        print("3. Verify the /health endpoint is implemented correctly")
    
    if not cors_result:
        print("\nTroubleshooting tips for CORS:")
        print("1. Check if CORS middleware is properly configured in the backend")
        print("2. Ensure 'http://localhost:5175' is in the allowed origins list")
        print("3. Verify the CORS middleware is correctly applied to the FastAPI app")

if __name__ == "__main__":
    main()
