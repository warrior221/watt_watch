import logging
import os
import pandas as pd
import io
from db.tigergraph import get_connection

# Conditional ML Import
try:
    from ml.predict import predict_nodes
    ML_AVAILABLE = True
except (ImportError, ModuleNotFoundError):
    ML_AVAILABLE = False

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ CONFIG
BATCH_SIZE = 5000

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

def get_nodes():
    try:
        conn = get_connection()
        nodes = conn.getVertices("Pole")
        return nodes
    except Exception as e:
        logger.error(f"Failed to fetch nodes: {e}")
        return {"error": str(e)}

def run_detection():
    try:
        conn = get_connection()
        logger.info("Starting Detection Engine...")
        
        nodes = conn.getVertices("Pole")
        if not nodes:
            return {"error": "No nodes found to analyze."}
            
        if ML_AVAILABLE:
            logger.info("Using ML-driven prediction model...")
            # Predict using our model (returns nodes with "status" attached)
            predicted = predict_nodes(nodes)
            updates = []
            for n in predicted:
                v_id = str(n.get("v_id") or n.get("id"))
                status = n.get("status", "normal")
                # Map binary prediction to our dashboard risk level logic
                # We'll use a mix of ratio and ML prediction for better accuracy
                load = float(n.get("attributes", n).get("load1", 0))
                expected = float(n.get("attributes", n).get("expected_load", 1))
                ratio = load / (expected or 1)
                
                final_status = "normal"
                if status == "anomaly":
                    final_status = "high_anomaly"
                elif ratio >= 1.2:
                    final_status = "medium_anomaly"
                
                updates.append((v_id, {"status": final_status}))
        else:
            logger.info("ML model missing. Falling back to Ratio-Based logic.")
            updates = []
            for n in nodes:
                v_id = str(n.get("v_id"))
                attrs = n.get("attributes", {})
                load = float(attrs.get("load1", 0))
                expected = float(attrs.get("expected_load", 1))
                ratio = load / (expected or 1)
                
                status = "normal"
                if ratio > 1.5: status = "high_anomaly"
                elif ratio >= 1.2: status = "medium_anomaly"
                updates.append((v_id, {"status": status}))

        # Bulk Update
        for i in range(0, len(updates), BATCH_SIZE):
            batch = updates[i:i+BATCH_SIZE]
            conn.upsertVertices("Pole", batch)
            
        return {"status": "success", "count": len(updates), "method": "ML" if ML_AVAILABLE else "Ratio"}
    except Exception as e:
        logger.error(f"Detection failed: {e}")
        return {"error": str(e)}

def update_load_from_csv(csv_content):
    try:
        conn = get_connection()
        df = pd.read_csv(io.StringIO(csv_content))
        if 'id' not in df.columns or 'load' not in df.columns:
            return {"error": "CSV must have 'id' and 'load' columns"}

        updates = []
        for _, row in df.iterrows():
            updates.append((str(row['id']), {"load1": float(row['load'])}))
            
        for i in range(0, len(updates), BATCH_SIZE):
            batch = updates[i:i+BATCH_SIZE]
            conn.upsertVertices("Pole", batch)
            
        return {"status": "success", "count": len(updates)}
    except Exception as e:
        logger.error(f"Telemetry sync failed: {e}")
        return {"error": str(e)}