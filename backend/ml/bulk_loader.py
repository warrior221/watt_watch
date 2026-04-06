import pandas as pd
import os
import sys

# Ensure we map to the root data folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
POLES_FILE = os.path.join(DATA_DIR, "grid_data.csv")
TRANSFORMERS_FILE = os.path.join(DATA_DIR, "transformers.csv")
POWERPLANTS_FILE = os.path.join(DATA_DIR, "powerplants.csv")
EDGES_SUPPLIES = os.path.join(DATA_DIR, "edges_supplies.csv")
EDGES_DISTRIBUTES = os.path.join(DATA_DIR, "edges_distributes.csv")

# Ensure BASE_DIR is in path for db imports
sys.path.append(BASE_DIR)
from db.tigergraph import get_connection

BATCH_SIZE = 1000

def bulk_loader():
    conn = get_connection()
    print("Loading data...")

    # Load Poles First (if run from scratch)
    if os.path.exists(POLES_FILE):
        df = pd.read_csv(POLES_FILE)
        print(f"Loading {len(df)} Poles...")
        for start in range(0, len(df), BATCH_SIZE):
            batch = df.iloc[start:start + BATCH_SIZE]
            vertices = [(str(row["id"]), {"lat": float(row["lat"]), "lng": float(row["lng"]), "load1": float(row["load"]), "expected_load": float(row["expected_load"]), "status": str(row["status"])}) for _, row in batch.iterrows()]
            try:
                conn.upsertVertices("Pole", vertices)
            except Exception as e:
                print(f"Failed loading poles batch: {e}")

    # Load Transformers
    if os.path.exists(TRANSFORMERS_FILE):
        df = pd.read_csv(TRANSFORMERS_FILE)
        print(f"Loading {len(df)} Transformers...")
        for start in range(0, len(df), BATCH_SIZE):
            batch = df.iloc[start:start + BATCH_SIZE]
            vertices = [(str(row["id"]), {"capacity": float(row["capacity"]), "current_load": float(row["current_load"]), "lat": float(row["lat"]), "lng": float(row["lng"]), "status": str(row["status"])}) for _, row in batch.iterrows()]
            try:
                conn.upsertVertices("Transformer", vertices)
            except Exception as e:
                print(f"Failed loading transformers batch: {e}")

    # Load Powerplants
    if os.path.exists(POWERPLANTS_FILE):
        df = pd.read_csv(POWERPLANTS_FILE)
        print(f"Loading {len(df)} Powerplants...")
        for start in range(0, len(df), BATCH_SIZE):
            batch = df.iloc[start:start + BATCH_SIZE]
            vertices = [(str(row["id"]), {"name": str(row["name"]), "capacity": float(row["capacity"]), "lat": float(row["lat"]), "lng": float(row["lng"]), "status": str(row["status"])}) for _, row in batch.iterrows()]
            try:
                conn.upsertVertices("Powerplant", vertices)
            except Exception as e:
                print(f"Failed loading Powerplants batch: {e}")

    # Load Edges: SUPPLIES
    if os.path.exists(EDGES_SUPPLIES):
        df = pd.read_csv(EDGES_SUPPLIES)
        print(f"Loading {len(df)} SUPPLIES edges...")
        for start in range(0, len(df), BATCH_SIZE):
            batch = df.iloc[start:start + BATCH_SIZE]
            edges = [(str(row["source"]), str(row["target"]), {}) for _, row in batch.iterrows()] # from pp to tx
            try:
                conn.upsertEdges("Powerplant", "SUPPLIES", "Transformer", edges)
            except Exception as e:
                print(f"Failed loading SUPPLIES batch: {e}")

    # Load Edges: DISTRIBUTES
    if os.path.exists(EDGES_DISTRIBUTES):
        df = pd.read_csv(EDGES_DISTRIBUTES)
        print(f"Loading {len(df)} DISTRIBUTES edges...")
        for start in range(0, len(df), BATCH_SIZE):
            batch = df.iloc[start:start + BATCH_SIZE]
            edges = [(str(row["source"]), str(row["target"]), {}) for _, row in batch.iterrows()] # from tx to pole
            try:
                conn.upsertEdges("Transformer", "DISTRIBUTES", "Pole", edges)
            except Exception as e:
                print(f"Failed loading DISTRIBUTES batch: {e}")

    print("Bulk load complete.")

if __name__ == "__main__":
    bulk_loader()
