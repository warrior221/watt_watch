import requests
import os
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("TG_HOST", "").strip()
token = os.getenv("TG_TOKEN", "").strip()

def test_headers():
    url = f"{host}/restpp/version"
    
    test_cases = [
        ("Authorization", f"Bearer {token}"),
        ("Authorization", f"Token {token}"),
        ("Token", token),
        ("X-Token", token)
    ]
    
    for h_name, h_val in test_cases:
        headers = {h_name: h_val}
        try:
            res = requests.get(url, headers=headers)
            print(f"Header '{h_name}: {h_val[:5]}...': {res.status_code} - {res.text}")
        except Exception as e:
            print(f"Error {h_name}: {e}")

if __name__ == "__main__":
    test_headers()
