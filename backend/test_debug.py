import pyTigerGraph as tg
import os
from dotenv import load_dotenv

load_dotenv()

def test_debug():
    host = os.getenv("TG_HOST", "").strip()
    graph = os.getenv("TG_GRAPH", "").strip()
    token = os.getenv("TG_TOKEN", "").strip()
    
    print(f"Connecting to {host} graph {graph}...")
    conn = tg.TigerGraphConnection(
        host=host,
        graphname=graph,
        apiToken=token,
        tgCloud=True,
        debug=True
    )
    
    try:
        print("Getting vertex types...")
        print(conn.getVertexTypes())
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_debug()
