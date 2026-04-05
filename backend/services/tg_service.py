import logging
from db.tigergraph import get_connection
import os
import pandas as pd
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ CONNECTION CHECK
def check_connection():
    try:
        conn = get_connection()
        try:
             ver = conn.getVersion()
             return {"status": "ok", "version": ver}
        except:
             types = conn.getVertexTypes()
             return {"status": "ok", "types": types}
    except Exception as e:
        logger.error(f"TigerGraph Connection Failed: {e}")
        return {"status": "error", "error": str(e)}

# ✅ FETCH NODES
def get_nodes():
    try:
        conn = get_connection()
        nodes = conn.getVertices("Pole")
        return nodes
    except Exception as e:
        logger.error(f"Failed to fetch nodes: {e}")
        return {"error": str(e)}

# ✅ ANOMALY DETECTION (RATIO BASED)
def run_detection():
    try:
        conn = get_connection()
        logger.info("Starting Anomaly Detection (Ratio Based)...")
        
        nodes = conn.getVertices("Pole")
        if not nodes:
            return {"error": "No nodes found to analyze."}
            
        updates = []
        for n in nodes:
            v_id = str(n.get("v_id"))
            attrs = n.get("attributes", {})
            load = float(attrs.get("load1", 0))
            expected = float(attrs.get("expected_load", 1)) # Guard against div by zero

            if expected <= 0: expected = 1 # Fallback
            
            ratio = load / expected
            status = "normal"
            if ratio > 1.5:
                status = "high_anomaly"
            elif ratio >= 1.2:
                status = "medium_anomaly"
            
            # NOTE: We only push back the status, not lat/lng/load
            updates.append((v_id, {"status": status}))
            
        # Bulk Update in batches
        BATCH_SIZE = 5000
        for i in range(0, len(updates), BATCH_SIZE):
            batch = updates[i:i+BATCH_SIZE]
            conn.upsertVertices("Pole", batch)
            
        return {"status": "success", "count": len(updates)}
    except Exception as e:
        logger.error(f"Detection failed: {e}")
        return {"error": str(e)}

# ✅ BULK LOAD UPDATE (CSV)
def update_load_from_csv(csv_content):
    try:
        conn = get_connection()
        df = pd.read_csv(io.StringIO(csv_content))
        
        if 'id' not in df.columns or 'load' not in df.columns:
            return {"error": "CSV must have 'id' and 'load' columns"}

        logger.info(f"Updating load for {len(df)} nodes...")
        updates = []
        for _, row in df.iterrows():
            v_id = str(row['id'])
            load_val = float(row['load'])
            # NOTE: We use load1 as the attribute name determined from schema
            updates.append((v_id, {"load1": load_val}))
            
        BATCH_SIZE = 5000
        for i in range(0, len(updates), BATCH_SIZE):
            batch = updates[i:i+BATCH_SIZE]
            conn.upsertVertices("Pole", batch)
            
        return {"status": "success", "count": len(updates)}
    except Exception as e:
        logger.error(f"Upload-load failed: {e}")
        return {"error": str(e)}