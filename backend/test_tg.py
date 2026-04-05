from db.tigergraph import get_connection

try:
    conn = get_connection()
    res = conn.getVertices("Pole")
    print("SUCCESS:", len(res), "records")
except Exception as e:
    print("FAILED:", e)
