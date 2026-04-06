import pandas as pd
import numpy as np
import os
import glob

# CONFIG: Compact Grid (2 Plants, 3000 Poles)
NUM_POLES = 3000
NUM_TRANSFORMERS = 40
NUM_POWERPLANTS = 2

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
POLES_FILE = os.path.join(DATA_DIR, "grid_data.csv")
TRANSFORMERS_FILE = os.path.join(DATA_DIR, "transformers.csv")
POWERPLANTS_FILE = os.path.join(DATA_DIR, "powerplants.csv")
EDGES_SUPPLIES = os.path.join(DATA_DIR, "edges_supplies.csv")
EDGES_DISTRIBUTES = os.path.join(DATA_DIR, "edges_distributes.csv")

# Delhi Bounding Box
LAT_MIN, LAT_MAX = 28.4, 28.9
LNG_MIN, LNG_MAX = 76.8, 77.4

def generate_grid_data():
    print(f"Generating Scaled Grid Hierarchy (2 Plants, ~6.6K Poles)...")
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # 1. Generate Poles
    print(f"Generating {NUM_POLES} poles...")
    pole_ids = [f"pole_{i}" for i in range(NUM_POLES)]
    lats = np.random.uniform(LAT_MIN, LAT_MAX, NUM_POLES)
    lngs = np.random.uniform(LNG_MIN, LNG_MAX, NUM_POLES)
    expected_load = np.random.uniform(50, 250, NUM_POLES)
    actual_load = expected_load * np.random.uniform(0.9, 1.1, NUM_POLES)
    num_anomalies = int(NUM_POLES * np.random.uniform(0.05, 0.10))
    anomaly_indices = np.random.choice(NUM_POLES, num_anomalies, replace=False)
    actual_load[anomaly_indices] = expected_load[anomaly_indices] * np.random.uniform(1.5, 3.0, len(anomaly_indices))
    
    poles_df = pd.DataFrame({
        "id": pole_ids,
        "lat": lats,
        "lng": lngs,
        "expected_load": expected_load,
        "load": actual_load,
        "status": "normal"
    })
    poles_df.to_csv(POLES_FILE, index=False)

    # 2. Generate Powerplants
    print(f"Generating {NUM_POWERPLANTS} powerplants...")
    pp_ids = [f"pp_{i}" for i in range(NUM_POWERPLANTS)]
    pp_lats = np.random.uniform(LAT_MIN, LAT_MAX, NUM_POWERPLANTS)
    pp_lngs = np.random.uniform(LNG_MIN, LNG_MAX, NUM_POWERPLANTS)
    pp_capacity = np.random.uniform(500000, 1000000, NUM_POWERPLANTS)
    
    pp_df = pd.DataFrame({
        "id": pp_ids,
        "name": [f"Plant {i}" for i in range(NUM_POWERPLANTS)],
        "capacity": pp_capacity,
        "lat": pp_lats,
        "lng": pp_lngs,
        "status": "normal"
    })
    pp_df.to_csv(POWERPLANTS_FILE, index=False)

    # 3. Generate Transformers
    print(f"Generating {NUM_TRANSFORMERS} transformers...")
    tx_ids = [f"tx_{i}" for i in range(NUM_TRANSFORMERS)]
    tx_lats = np.random.uniform(LAT_MIN, LAT_MAX, NUM_TRANSFORMERS)
    tx_lngs = np.random.uniform(LNG_MIN, LNG_MAX, NUM_TRANSFORMERS)
    tx_capacity = np.random.uniform(20000, 50000, NUM_TRANSFORMERS)
    
    tx_df = pd.DataFrame({
        "id": tx_ids,
        "capacity": tx_capacity,
        "current_load": 0.0,
        "lat": tx_lats,
        "lng": tx_lngs,
        "status": "normal"
    })
    tx_df.to_csv(TRANSFORMERS_FILE, index=False)

    # 4. Generate Edges: Powerplant -> Transformer (SUPPLIES)
    supplies_sources = []
    supplies_targets = []
    for tx_id in tx_ids:
        pp_target = np.random.choice(pp_ids)
        supplies_sources.append(pp_target)
        supplies_targets.append(tx_id)
        
    supplies_df = pd.DataFrame({
        "source": supplies_sources,
        "target": supplies_targets
    })
    supplies_df.to_csv(EDGES_SUPPLIES, index=False)

    # 5. Generate Edges: Transformer -> Pole (DISTRIBUTES)
    dist_sources = []
    dist_targets = []
    for pole_id in pole_ids:
        tx_target = np.random.choice(tx_ids)
        dist_sources.append(tx_target)
        dist_targets.append(pole_id)
        
    dist_df = pd.DataFrame({
        "source": dist_sources,
        "target": dist_targets
    })
    dist_df.to_csv(EDGES_DISTRIBUTES, index=False)

    print("Generation complete.")

if __name__ == "__main__":
    generate_grid_data()
