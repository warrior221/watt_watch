import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os
from .generate_data import generate_data, CSV_PATH

ML_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(ML_DIR, "model.pkl")

def train_model():
    print("Starting Training Pipeline...")
    if not os.path.exists(CSV_PATH):
        print("Data not found. Auto-running data generation (1,000,000 rows)...")
        generate_data(1000000)
        
    df = pd.read_csv(CSV_PATH)
    
    features = ["expected_load", "actual_load", "load_diff"]
    X = df[features]
    y = df["is_anomaly"]
    
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1)
    model.fit(X, y)
    
    joblib.dump(model, MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
