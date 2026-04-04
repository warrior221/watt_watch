from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from data_loader import load_data
from injection import inject_theft
from detection import detect_theft
from data_store import grid_data

app = FastAPI(title="City-Based Electricity Theft Detection System")

# Ensure cross-origin stability for our React frontend 
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "system": "PhantomNode Electricity Theft Detection",
        "documentation": "/docs",
        "endpoints": ["/generate-grid", "/detect-theft", "/inject-theft", "/history"]
    }

class TheftInjectionRequest(BaseModel):
    poles: List[str]

@app.on_event("startup")
def startup_event():
    load_data()

@app.get("/generate-grid")
def generate_grid_api(city: str = "Delhi"):
    # Load CSV data and recreate
    load_data()
    
    nodes = []
    nodes.extend([{**p, "type": "power_plant"} for p in grid_data["power_plants"]])
    nodes.extend([{**t, "type": "transformer"} for t in grid_data["transformers"]])
    nodes.extend([{**p, "type": "pole"} for p in grid_data["poles"]])

    # Shift coordinates depending on city
    lat_shift = 0
    lng_shift = 0
    
    if city == "Mumbai":
        lat_shift = 19.0760 - 28.6139  # -9.5379
        lng_shift = 72.8777 - 77.2090  # -4.3313
    elif city == "Bangalore":
        lat_shift = 12.9716 - 28.6139  # -15.6423
        lng_shift = 77.5946 - 77.2090  # 0.3856
        
    if lat_shift != 0 or lng_shift != 0:
        for n in nodes:
            n["lat"] += lat_shift
            n["lng"] += lng_shift
    
    return {
        "nodes": nodes,
        "edges": grid_data["edges"]
    }

@app.post("/inject-theft")
def inject_theft_api(req: TheftInjectionRequest):
    affected = inject_theft(req.poles)
    return {
        "message": "Theft injected",
        "affected_poles": affected
    }

@app.get("/detect-theft")
def detect_theft_api():
    return detect_theft()

@app.get("/history")
def history_api():
    return grid_data["history"]

@app.get("/metrics")
def metrics_api():
    detection = detect_theft()
    total_nodes = len(grid_data["power_plants"]) + len(grid_data["transformers"]) + len(grid_data["poles"])
    return {
        "total_nodes": total_nodes,
        "transformers": len(grid_data["transformers"]),
        "system_health": round(100 - detection["summary"]["loss_percentage"], 2)
    }

@app.get("/alerts")
def alerts_api():
    detection = detect_theft()
    return detection["theft_nodes"]

@app.post("/detect")
def trigger_detect_api():
    # In this logic, it just re-runs the detection
    return detect_theft()
