from db.tigergraph import get_connection

def clear_grid():
    conn = get_connection()
    print("Clearing all grid vertices and edges...")
    
    # In older versions, delVertices requires a where clause or specific vertex type.
    # We clear vertex types by their IDs.
    try:
        # Note: In version 1.7, we can't easily pass 'where' for all, so we might need a safer way.
        # But we'll try to use a bulk delete if available.
        # Actually, if we just want to scale down, the easiest way is a GSQL query.
        conn.gsql("USE GRAPH WattWatchGraph\nDELETE FROM Pole\nDELETE FROM Transformer\nDELETE FROM Powerplant")
        print("Clear Complete.")
    except Exception as e:
        print(f"Error clearing nodes: {e}")
        # Alternative: Try to delete by type
        try:
            conn.delVertices("Powerplant")
            conn.delVertices("Transformer")
            conn.delVertices("Pole")
            print("Fallback: Clear via direct type deletion complete.")
        except:
             print("Clear failed. Continuing with upsert load...")

if __name__ == "__main__":
    clear_grid()
