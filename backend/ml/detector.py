from sklearn.ensemble import IsolationForest
import pandas as pd
import numpy as np
import joblib
import os

MODEL_PATH = "backend/ml/anomaly_model.joblib"

def train_isolation_forest(data):
    """
    Trains an Isolation Forest model to detect theft.
    Features: [load, expected_load]
    """
    X = data[['load', 'expected_load']].values
    
    # Contamination set to 7% approx mean of our synthetic data injection
    model = IsolationForest(contamination=0.07, random_state=42)
    model.fit(X)
    
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}")
    return model

def predict_anomalies(model, data):
    """
    Returns 1 for normal, -1 for anomaly.
    """
    X = data[['load', 'expected_load']].values
    preds = model.predict(X)
    
    # Map -1 (IsolationForest anomaly) to "anomaly" and 1 to "normal"
    return ["anomaly" if p == -1 else "normal" for p in preds]

def load_or_train_model(df):
    if os.path.exists(MODEL_PATH):
        print("Loading pre-trained model...")
        return joblib.load(MODEL_PATH)
    else:
        print("Model not found. Training from scratch...")
        return train_isolation_forest(df)

if __name__ == "__main__":
    # Test training
    DATA_FILE = "backend/data/grid_data.csv"
    if os.path.exists(DATA_FILE):
        df = pd.read_csv(DATA_FILE)
        train_isolation_forest(df)
    else:
        print("No training data found. Run generator first!")
