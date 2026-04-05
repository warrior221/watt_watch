from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from services.tg_service import get_nodes, check_connection, run_detection, update_load_from_csv
from db.tigergraph import get_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/tg-test")
def test_connection():
    try:
        return check_connection()
    except Exception as e:
        return {"error": str(e)}

@app.get("/debug-tg")
def debug_tigergraph():
    try:
        conn_status = check_connection()
        data = get_nodes() if conn_status.get("status") == "ok" else None
        
        return {
            "connection": conn_status,
            "data": data
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/nodes")
def fetch_nodes():
    try:
        return get_nodes()
    except Exception as e:
        return {"error": str(e)}

@app.post("/detect")
def detect_anomalies():
    try:
        return run_detection()
    except Exception as e:
        return {"error": str(e)}

@app.post("/upload-load")
async def upload_load(file: UploadFile = File(...)):
    try:
        content = await file.read()
        return update_load_from_csv(content.decode("utf-8"))
    except Exception as e:
        return {"error": str(e)}

@app.get("/generate-data")
def generate_sample_data():
    try:
        from ml.generator import generate_grid_data
        # Bulk load now handles mapping data correctly
        from ml.bulk_loader import bulk_loader
        generate_grid_data()
        bulk_loader()
        return {"status": "Data generation and bulk load complete."}
    except Exception as e:
        return {"error": str(e)}
