from ml.predict import predict_nodes
from services.tg_service import insert_nodes

def run_detection(nodes):
    if not nodes:
        return []
        
    # High-performance batch ML prediction directly on all nodes
    updated_nodes = predict_nodes(nodes)
        
    # Upsert results concurrently into TigerGraph DB
    try:
        insert_nodes(updated_nodes)
    except Exception as e:
        print(f"Failed to insert anomalies to TigerGraph: {e}")
        
    return updated_nodes
