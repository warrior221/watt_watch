from db.tigergraph import get_connection

conn = get_connection()
try:
    print(conn.getVertices("Pole", limit=5))
except Exception as e:
    import traceback
    with open("traceback.txt", "w") as f:
        traceback.print_exc(file=f)
