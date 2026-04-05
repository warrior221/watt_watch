import pandas as pd
import numpy as np
import os
import uuid

ML_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(ML_DIR, "grid_data.csv")

def generate_data(num_rows=1000000):
    print(f"Generating {num_rows} realistic nodes in Delhi region...")
    np.random.seed(42)
    
    # Delhi BBox
    lats = np.random.uniform(28.40, 28.90, num_rows)
    lngs = np.random.uniform(76.80, 77.40, num_rows)
    
    expected_load = np.random.uniform(50, 500, num_rows)
    actual_load = expected_load + np.random.normal(0, 5, num_rows)
    
    is_anomaly = np.zeros(num_rows, dtype=int)
    
    # Inject 10% anomalies
    anomaly_indices = np.random.choice(num_rows, size=int(0.1 * num_rows), replace=False)
    is_anomaly[anomaly_indices] = 1
    
    # Some are spikes (1.5x - 3x), some are drops (0.2x - 0.7x)
    spike_indices = anomaly_indices[:len(anomaly_indices)//2]
    drop_indices = anomaly_indices[len(anomaly_indices)//2:]
    
    actual_load[spike_indices] = expected_load[spike_indices] * np.random.uniform(1.5, 3.0, len(spike_indices))
    actual_load[drop_indices] = expected_load[drop_indices] * np.random.uniform(0.2, 0.7, len(drop_indices))
    
    load_diff = actual_load - expected_load
    
    # generate random sequential ids
    ids = [f"pole_{i}" for i in range(num_rows)]
    
    df = pd.DataFrame({
        "id": ids,
        "latitude": lats,
        "longitude": lngs,
        "expected_load": expected_load,
        "actual_load": actual_load,
        "load_diff": load_diff,
        "is_anomaly": is_anomaly
    })
    
    print("Saving dataset...")
    df.to_csv(CSV_PATH, index=False)
    print(f"Dataset successfully created at {CSV_PATH}")

if __name__ == "__main__":
    # Generate default 100k for demonstration speed if run as script
    generate_data(100000)
