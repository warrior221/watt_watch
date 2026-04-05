import pandas as pd
import os
import sys

# Ensure we map to the root data folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(BASE_DIR, "data", "grid_data.csv")

# Ensure BASE_DIR is in path for db imports
sys.path.append(BASE_DIR)
from db.tigergraph import get_connection

BATCH_SIZE = 1000

def bulk_loader():
    print(f"Loading data from {DATA_FILE}...")
    if not os.path.exists(DATA_FILE):
        print(f"Data file not found at {DATA_FILE}. Generate it first!")
        return

    df = pd.read_csv(DATA_FILE)
    print(f"Total nodes to be imported: {len(df)}")
    
    conn = get_connection()
    
    # Process in batches
    for start in range(0, len(df), BATCH_SIZE):
        end = start + BATCH_SIZE
        batch = df.iloc[start:end]
        
        vertices = []
        for _, row in batch.iterrows():
            v_id = str(row["id"])
            attrs = {
                "lat": float(row["lat"]),
                "lng": float(row["lng"]),
                "load1": float(row["load"]),
                "expected_load": float(row["expected_load"]),
                "status": str(row["status"])
            }
            vertices.append((v_id, attrs))
        
        # Use upsertVertices to send batch
        try:
            res = conn.upsertVertices("Pole", vertices)
            print(f"Uploaded [{start} -> {end}] | Response: {res}")
        except Exception as e:
            print(f"Failed at batch {start}: {e}")

    print("Bulk load complete.")

if __name__ == "__main__":
    bulk_loader()
