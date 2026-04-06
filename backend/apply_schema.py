from db.tigergraph import get_connection
import os
import time

def apply_schema():
    print("Connecting to TigerGraph to apply schema...")
    conn = get_connection()
    
    # Check if vertices already exist to avoid errors
    try:
        types = conn.getVertexTypes()
        if "Powerplant" in types and "Transformer" in types:
            print("Schema already updated. Skipping...")
            return
    except:
        pass

    # For an existing graph (WattWatchGraph), we use a SCHEMA_CHANGE job.
    # Note: If this fails, the user will need to manually add vertices via GraphStudio.
    schema_job = f"""
    USE GRAPH {conn.graphname}
    CREATE SCHEMA_CHANGE JOB add_grid_hierarchy FOR GRAPH {conn.graphname} {{
        ADD VERTEX Powerplant(PRIMARY_ID id STRING, name STRING, capacity DOUBLE, lat DOUBLE, lng DOUBLE, status STRING) WITH STATS="OUTDEGREE_BY_EDGETYPE", PRIMARY_ID_AS_ATTRIBUTE="true";
        ADD VERTEX Transformer(PRIMARY_ID id STRING, capacity DOUBLE, current_load DOUBLE, lat DOUBLE, lng DOUBLE, status STRING) WITH STATS="OUTDEGREE_BY_EDGETYPE", PRIMARY_ID_AS_ATTRIBUTE="true";
        ADD DIRECTED EDGE SUPPLIES(FROM Powerplant, TO Transformer) WITH REVERSE_EDGE="REVERSE_SUPPLIES";
        ADD DIRECTED EDGE DISTRIBUTES(FROM Transformer, TO Pole) WITH REVERSE_EDGE="REVERSE_DISTRIBUTES";
    }}
    RUN SCHEMA_CHANGE JOB add_grid_hierarchy
    DROP JOB add_grid_hierarchy
    """
    
    print("Executing GSQL Schema Change Job (this may take 20-30 seconds)...")
    try:
        # In version 1.7, gsql() might return the raw response string.
        res = conn.gsql(schema_job)
        print(f"GSQL Output: {res}")
        if "successfully completed" in res.lower() or "The job add_grid_hierarchy" in res:
            print("SUCCESS: SmartGrid Hierarchy schema applied!")
        else:
            print("WARNING: GSQL executed but response was unexpected. Verify in GraphStudio.")
    except Exception as e:
        print(f"ERROR: Could not apply schema via GSQL: {e}")
        print("ACTION REQUIRED: Go to TigerGraph GraphStudio and manually add 'Powerplant' and 'Transformer' vertices.")

if __name__ == "__main__":
    apply_schema()
