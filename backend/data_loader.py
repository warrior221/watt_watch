import pandas as pd
import os
from data_store import grid_data

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

def recompute_loads():
    # Recompute Transformer loads
    for t in grid_data["transformers"]:
        child_poles = [p for p in grid_data["poles"] if p["parent_id"] == t["id"]]
        t_actual = sum(p["actual_load"] for p in child_poles)
        t["actual_load"] = round(t_actual, 2)
        
    # Recompute PowerPlant loads
    for pp in grid_data["power_plants"]:
        child_tfs = [t for t in grid_data["transformers"] if t["parent_id"] == pp["id"]]
        pp_actual = sum(t["actual_load"] for t in child_tfs)
        pp["actual_load"] = round(pp_actual, 2)

def load_data():
    grid_data["poles"].clear()
    grid_data["transformers"].clear()
    grid_data["power_plants"].clear()
    grid_data["edges"].clear()
    grid_data["history"].clear()
    
    # Load powerplants
    df_pp = pd.read_csv(os.path.join(DATA_DIR, "powerplant.csv"))
    for _, row in df_pp.iterrows():
        grid_data["power_plants"].append({
            "id": row["id"],
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "actual_load": 0.0,
            "expected_load": 0.0,
        })
        
    # Load transformers
    df_tf = pd.read_csv(os.path.join(DATA_DIR, "transformers.csv"))
    for _, row in df_tf.iterrows():
        grid_data["transformers"].append({
            "id": row["id"],
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "parent_id": row["parent_id"],
            "area": row["area"],
            "actual_load": 0.0,
            "expected_load": 0.0,
        })
        grid_data["edges"].append({
            "from": row["parent_id"],
            "to": row["id"]
        })

    # Load poles
    df_poles = pd.read_csv(os.path.join(DATA_DIR, "poles.csv"))
    for _, row in df_poles.iterrows():
        expected_load = float(row["expected_load"])
        grid_data["poles"].append({
            "id": row["id"],
            "lat": float(row["lat"]),
            "lng": float(row["lng"]),
            "parent_id": row["parent_id"],
            "area": row["area"],
            "expected_load": expected_load,
            "actual_load": expected_load,
        })
        grid_data["edges"].append({
            "from": row["parent_id"],
            "to": row["id"]
        })

    # Initially setting transformer and powerplant expected loads
    for t in grid_data["transformers"]:
        child_poles = [p for p in grid_data["poles"] if p["parent_id"] == t["id"]]
        t_expected = sum(p["expected_load"] for p in child_poles)
        t["expected_load"] = round(t_expected, 2)
        
    for pp in grid_data["power_plants"]:
        child_tfs = [t for t in grid_data["transformers"] if t["parent_id"] == pp["id"]]
        pp_expected = sum(t["expected_load"] for t in child_tfs)
        pp["expected_load"] = round(pp_expected, 2)
        
    recompute_loads()
