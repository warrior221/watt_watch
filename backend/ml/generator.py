import pandas as pd
import numpy as np
import os

# CONFIG
NUM_NODES = 7000
# Ensure we map to the root data folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(BASE_DIR, "data", "grid_data.csv")

# Delhi Bounding Box
LAT_MIN, LAT_MAX = 28.4, 28.9
LNG_MIN, LNG_MAX = 76.8, 77.4

def generate_grid_data():
    print(f"Generating {NUM_NODES} nodes for Delhi region...")
    
    # Randomly generate poles across Delhi
    lats = np.random.uniform(LAT_MIN, LAT_MAX, NUM_NODES)
    lngs = np.random.uniform(LNG_MIN, LNG_MAX, NUM_NODES)
    
    # Realistic consumption loads (kW)
    # Expected load is what we 'think' should be used (historical average)
    expected_load = np.random.uniform(50, 250, NUM_NODES)
    
    # Actual load is what is currently measured
    # Normally, it should be very close to expected load (e.g., +/- 10%)
    actual_load = expected_load * np.random.uniform(0.9, 1.1, NUM_NODES)
    
    # Injecting Anomaly (Theft simulation)
    # 5-10% of nodes will have much higher actual load than expected (meter bypass/theft)
    num_anomalies = int(NUM_NODES * np.random.uniform(0.05, 0.10))
    anomaly_indices = np.random.choice(NUM_NODES, num_anomalies, replace=False)
    
    # For anomalies, actual load is 1.5x to 3x higher than expected
    actual_load[anomaly_indices] = expected_load[anomaly_indices] * np.random.uniform(1.5, 3.0, len(anomaly_indices))
    
    df = pd.DataFrame({
        "id": [f"pole_{i}" for i in range(NUM_NODES)],
        "lat": lats,
        "lng": lngs,
        "expected_load": expected_load,
        "load": actual_load,
        "status": "normal"
    })
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Success! Dataset saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    generate_grid_data()
