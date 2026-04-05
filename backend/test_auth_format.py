import requests
import os
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("TG_HOST", "").strip()
graph = os.getenv("TG_GRAPH", "").strip()
token = os.getenv("TG_TOKEN", "").strip()

def test_auth(prefix):
    url = f"{host}/restpp/version"
    headers = {"Authorization": f"{prefix}{token}"}
    try:
        res = requests.get(url, headers=headers)
        print(f"Prefix '{prefix}': {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Prefix '{prefix}' Error: {e}")

if __name__ == "__main__":
    print(f"Testing Auth for host: {host}")
    test_auth("Token ")
    test_auth("Bearer ")
    test_auth("") # No prefix
