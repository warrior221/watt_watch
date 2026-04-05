import joblib
import numpy as np
import os
from .train import train_model

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "model.pkl")
model = None

def load_model():
    global model
    if model is None:
        if not os.path.exists(MODEL_PATH):
            print("Model missing, triggering auto-training...")
            train_model()
        
        print("Loading Model into memory...")
        model = joblib.load(MODEL_PATH)
        print("Model Loaded!")

# Vectorized batch prediction for optimal performance
def predict_nodes(nodes):
    load_model()
    
    if not nodes:
        return []
        
    features_list = []
    
    for node in nodes:
        attrs = node.get("attributes", node)
        
        actual = float(attrs.get("actual_load", attrs.get("load", 0)))
        expected = float(attrs.get("expected_load", actual * 0.9)) # Historical baseline approx
        diff = actual - expected
        
        features_list.append([expected, actual, diff])
        
    features_array = np.array(features_list)
    
    # Batch predict
    predictions = model.predict(features_array)
    
    # Map predictions back to node objects
    for idx, node in enumerate(nodes):
        node["status"] = "anomaly" if predictions[idx] == 1 else "normal"
        node["load"] = float(node.get("attributes", node).get("actual_load", node.get("load", 0)))
        
    return nodes
