import requests
import os
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("TG_HOST", "").strip()
graph = os.getenv("TG_GRAPH", "").strip()
token = os.getenv("TG_TOKEN", "").strip()

def test_auth():
    # URL version
    url = f"{host}/restpp/version?token={token}"
    try:
        res = requests.get(url)
        print(f"URL param: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"URL param Error: {e}")

    # Header version
    url = f"{host}/restpp/version"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.get(url, headers=headers)
        print(f"Bearer: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Bearer Error: {e}")

    # Header version - with Token prefix
    headers = {"Authorization": f"Token {token}"}
    try:
        res = requests.get(url, headers=headers)
        print(f"Token Prefix: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Token Prefix Error: {e}")

if __name__ == "__main__":
    print(f"Testing Auth for host: {host}")
    test_auth()
