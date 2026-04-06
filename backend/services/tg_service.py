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
        nodes = conn.getVertices("Pole", limit=50000)
        return nodes
    except Exception as e:
        logger.error(f"Failed to fetch nodes: {e}")
        return {"error": str(e)}

def get_full_graph_data():
    try:
        conn = get_connection()
        
        # Robust fetching: If vertex types don't exist, return empty lists instead of crashing
        try:
            power_plants = conn.getVertices("Powerplant")
        except:
            power_plants = []
            
        try:
            transformers = conn.getVertices("Transformer")
        except:
            transformers = []
            
        try:
            poles = conn.getVertices("Pole", limit=50000)
        except:
            poles = []
        
        supplies_edges = []
        try:
            for pp in power_plants:
                pp_id = str(pp.get("v_id"))
                edges = conn.getEdges("Powerplant", pp_id, "SUPPLIES", "Transformer")
                supplies_edges.extend(edges)
        except:
            pass
            
        distributes_edges = []
        try:
            for tx in transformers:
                tx_id = str(tx.get("v_id"))
                edges = conn.getEdges("Transformer", tx_id, "DISTRIBUTES", "Pole")
                distributes_edges.extend(edges)
        except:
            pass

        return {
            "Powerplants": power_plants,
            "transformers": transformers,
            "poles": poles,
            "supplies": supplies_edges,
            "distributes": distributes_edges
        }
    except Exception as e:
        logger.error(f"Critical failure in get_full_graph: {e}")
        return {"error": str(e), "Powerplants": [], "transformers": [], "poles": []}

def get_pole(pole_id):
    try:
        conn = get_connection()
        return conn.getVerticesById("Pole", pole_id)
    except Exception as e:
        return {"error": str(e)}

def get_transformer(tx_id):
    try:
        conn = get_connection()
        return conn.getVerticesById("Transformer", tx_id)
    except Exception as e:
        return {"error": str(e)}


def run_detection():
    try:
        conn = get_connection()
        logger.info("Starting Hierarchy Detection Engine...")
        
        try:
            poles = conn.getVertices("Pole", limit=50000)
        except:
            poles = []

        if not poles:
            return {"error": "No poles found to analyze."}
            
        pole_updates = []
        pole_load_map = {}
        
        for n in poles:
            v_id = str(n.get("v_id"))
            attrs = n.get("attributes", {})
            load = float(attrs.get("load1", 0))
            expected = float(attrs.get("expected_load", 1))
            pole_load_map[v_id] = load
            ratio = load / (expected or 1)
            
            status = "normal"
            if ratio > 1.5: status = "high_anomaly"
            elif ratio >= 1.2: status = "medium_anomaly"
            pole_updates.append((v_id, {"status": status}))
        
        for i in range(0, len(pole_updates), BATCH_SIZE):
            batch = pole_updates[i:i+BATCH_SIZE]
            conn.upsertVertices("Pole", batch)

        # Transformer Logic (Robust)
        try:
            transformers = conn.getVertices("Transformer")
            tx_updates = []
            tx_load_map = {}
            for tx in transformers:
                tx_id = str(tx.get("v_id"))
                capacity = float(tx.get("attributes", {}).get("capacity", 0))
                
                edges = conn.getEdges("Transformer", tx_id, "DISTRIBUTES", "Pole")
                total_load = sum([pole_load_map.get(e.get("to_id"), 0.0) for e in edges])
                tx_load_map[tx_id] = total_load
                
                status = "normal"
                if total_load > capacity:
                    status = "anomaly"
                tx_updates.append((tx_id, {"status": status, "current_load": total_load}))
                
            for i in range(0, len(tx_updates), BATCH_SIZE):
                batch = tx_updates[i:i+BATCH_SIZE]
                conn.upsertVertices("Transformer", batch)
        except:
            logger.warning("Transformer detection skipped (Vertex type missing).")
            transformers = []
            tx_load_map = {}

        # Powerplant Logic (Robust)
        try:
            Powerplants = conn.getVertices("Powerplant")
            pp_updates = []
            for pp in Powerplants:
                pp_id = str(pp.get("v_id"))
                capacity = float(pp.get("attributes", {}).get("capacity", 0))
                
                edges = conn.getEdges("Powerplant", pp_id, "SUPPLIES", "Transformer")
                total_load = sum([tx_load_map.get(e.get("to_id"), 0.0) for e in edges])
                
                status = "normal"
                if total_load > capacity:
                    status = "critical"
                pp_updates.append((pp_id, {"status": status}))

            for i in range(0, len(pp_updates), BATCH_SIZE):
                batch = pp_updates[i:i+BATCH_SIZE]
                conn.upsertVertices("Powerplant", batch)
        except:
            logger.warning("Powerplant detection skipped (Vertex type missing).")
            Powerplants = []

        return {
            "status": "success", 
            "poles_analyzed": len(pole_updates), 
            "tx_analyzed": len(transformers), 
            "pp_analyzed": len(Powerplants)
        }
    except Exception as e:
        logger.error(f"Detection critical failure: {e}")
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
