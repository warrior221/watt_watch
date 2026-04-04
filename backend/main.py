from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
import io

from injection import inject_theft, recompute_loads
from detection import detect_theft
from data_store import grid_data

app = FastAPI(title="Watt Watch Electricity Theft Detection System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TheftInjectionRequest(BaseModel):
    poles: List[str]

@app.get("/")
def read_root():
    return {"status": "online"}

@app.post("/upload-data")
async def upload_data(file: UploadFile = File(...)):
    # Read the file contents
    contents = await file.read()
    
    # Parse CSV
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid CSV file format.")
    
    # Validate required columns
    required_cols = {"id", "type", "lat", "lng", "expected_load", "parent_id", "area"}
    if not required_cols.issubset(set(df.columns)):
        raise HTTPException(status_code=400, detail="Missing required columns in CSV.")
    
    # Reset storage
    grid_data["nodes"].clear()
    grid_data["edges"].clear()
    grid_data["history"].clear()
    
    # Read and store nodes and edges efficiently
    df = df.fillna("")
    records = df.to_dict('records')
    
    for row in records:
        node_id = str(row["id"])
        node_type = str(row["type"]).strip().lower()
        if node_type == "power_plant": node_type = "powerplant"
        
        parent_id = str(row["parent_id"]).strip()
        expected = 0.0
        try:
            if str(row["expected_load"]) != "":
                expected = float(row["expected_load"])
        except ValueError:
            pass
            
        node_data = {
            "id": node_id,
            "type": node_type,
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "expected_load": expected,
            "actual_load": expected if node_type == "pole" else 0.0,
            "parent_id": parent_id if parent_id else None,
            "area": str(row["area"])
        }
        grid_data["nodes"].append(node_data)
        
        if parent_id:
            grid_data["edges"].append({"from": parent_id, "to": node_id})
            
    # Initial load propagation
    recompute_loads()
    grid_data["uploaded"] = True
    
    return {"message": f"Successfully loaded {len(grid_data['nodes'])} grid nodes.", "edges_count": len(grid_data['edges'])}


@app.get("/generate-grid")
def generate_grid_api():
    if not grid_data["uploaded"]:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
        
    return {
        "nodes": grid_data["nodes"],
        "edges": grid_data["edges"],
        "source": "uploaded_file"
    }

@app.post("/inject-theft")
def inject_theft_api(req: TheftInjectionRequest):
    if not grid_data["uploaded"]:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
        
    affected = inject_theft(req.poles)
    return {
        "message": "Theft injected",
        "affected_poles": affected
    }

@app.get("/detect-theft")
def detect_theft_api():
    if not grid_data["uploaded"]:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return detect_theft()

@app.get("/detect-anomaly")
def detect_anomaly_api():
    if not grid_data["uploaded"]:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return detect_theft()

@app.get("/history")
def history_api():
    return grid_data["history"]

@app.get("/metrics")
def metrics_api():
    if not grid_data["uploaded"]:
        return {"total_nodes": 0, "transformers": 0, "system_health": 100}
    
    detection = detect_theft()
    return {
        "total_nodes": len(grid_data["nodes"]),
        "transformers": len([n for n in grid_data["nodes"] if n["type"].lower() == "transformer"]),
        "system_health": round(100 - detection["summary"]["loss_percentage"], 2)
    }

@app.get("/alerts")
def alerts_api():
    if not grid_data["uploaded"]:
        return []
    detection = detect_theft()
    return detection["theft_nodes"]

@app.post("/detect")
def trigger_detect_api():
    if not grid_data["uploaded"]:
        raise HTTPException(status_code=400, detail="No dataset uploaded")
    return detect_theft()

@app.post("/reset")
def reset_api():
    grid_data["nodes"].clear()
    grid_data["edges"].clear()
    grid_data["history"].clear()
    grid_data["uploaded"] = False
    return {"message": "Grid data reset successfully."}
