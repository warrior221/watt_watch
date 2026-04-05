import pyTigerGraph as tg
import os
from dotenv import load_dotenv

load_dotenv()

def test_secret():
    host = os.getenv("TG_HOST", "").strip()
    graph = os.getenv("TG_GRAPH", "").strip()
    secret = os.getenv("TG_TOKEN", "").strip() # Assuming this is a secret
    
    print(f"Connecting to {host} using GRAPH {graph} and SECRET {secret}...")
    conn = tg.TigerGraphConnection(
        host=host,
        graphname=graph,
        gsqlSecret=secret,
        tgCloud=True
    )
    
    try:
        print("Attempting to get token using secret...")
        token = conn.getToken(secret)
        print(f"SUCCESS! Received Token: {token}")
        
        # Now try to use this token
        conn.apiToken = token
        print("Fetching vertex types...")
        print(conn.getVertexTypes())
    except Exception as e:
        print(f"Failed with secret: {e}")

if __name__ == "__main__":
    test_secret()
