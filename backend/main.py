from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import logging
from services.tg_service import get_nodes, get_full_graph_data, get_pole, get_transformer, check_connection, run_detection, update_load_from_csv

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Watt Watch Core API", version="1.1.0")

# High-performance Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tg-test")
def test_connection():
    # Dynamic TigerGraph health check
    return check_connection()

@app.get("/nodes")
def fetch_nodes():
    # Main grid data retrieval endpoint (legacy, keep for backward compatibility)
    data = get_nodes()
    if isinstance(data, dict) and "error" in data:
        return data
    return {"nodes": data}

@app.get("/graph/full")
def fetch_full_graph():
    data = get_full_graph_data()
    if "error" in data:
        return data
    return data

@app.get("/graph/pole/{id}")
def fetch_pole(id: str):
    data = get_pole(id)
    return {"node": data}

@app.get("/graph/transformer/{id}")
def fetch_transformer(id: str):
    data = get_transformer(id)
    return {"node": data}

@app.post("/detect")
def detect_anomalies():
    # Hybrid Detection Engine (ML/Ratio based)
    return run_detection()

@app.post("/upload-load")
async def upload_load(file: UploadFile = File(...)):
    # Stream telemetry data from external CSVs
    try:
        content = await file.read()
        return update_load_from_csv(content.decode("utf-8"))
    except Exception as e:
        logger.error(f"Upload-load failure: {e}")
        return {"error": str(e)}

@app.get("/reset-grid")
def reset_grid():
    # Infrastructure Lifecycle Management
    try:
        from ml.generator import generate_grid_data
        from ml.bulk_loader import bulk_loader
        from db.tigergraph import get_connection
        
        conn = get_connection()
        logger.info("Purging grid data...")
        conn.delVertices('Pole')
        
        generate_grid_data()
        bulk_loader()
        return {"status": "success", "message": "Grid infrastructure reset and reloaded with 7,000 poles."}
    except Exception as e:
        logger.error(f"Reset failure: {e}")
        return {"error": str(e)}
