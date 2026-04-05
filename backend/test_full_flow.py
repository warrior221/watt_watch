import pyTigerGraph as tg
import os
from dotenv import load_dotenv

load_dotenv()

def test_full_flow():
    host = os.getenv("TG_HOST", "").strip()
    graph = os.getenv("TG_GRAPH", "").strip()
    secret = os.getenv("TG_TOKEN", "").strip()
    
    conn = tg.TigerGraphConnection(host=host, graphname=graph, gsqlSecret=secret, tgCloud=True)
    
    try:
        print("Swapping secret for token...")
        token_res = conn.getToken(secret)
        token = token_res[0] if isinstance(token_res, (list, tuple)) else token_res
        conn.apiToken = token
        print("Authorized with token.")

        print("Testing getVertices('Pole')...")
        res = conn.getVertices("Pole", limit=5)
        print("SUCCESS! Poles count:", len(res))
        
        print("Testing getVertexTypes()...")
        print("Server info:", conn.getVertexTypes())
        
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_full_flow()
