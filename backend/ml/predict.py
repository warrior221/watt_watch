import joblib
import numpy as np
import os

# Relative path resolution for internal module loading
BASE_ML_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_FILENAME = "model.pkl"
MODEL_PATH = os.path.join(BASE_ML_DIR, MODEL_FILENAME)

_cached_model = None

def load_model():
    global _cached_model
    if _cached_model is None:
        if not os.path.exists(MODEL_PATH):
            return None
        
        try:
            _cached_model = joblib.load(MODEL_PATH)
        except Exception as e:
            print(f"Error loading model: {e}")
            return None
            
    return _cached_model

def predict_nodes(nodes):
    model = load_model()
    if model is None:
        return nodes
    
    if not nodes:
        return []
        
    features_list = []
    
    for node in nodes:
        attrs = node.get("attributes", node)
        
        actual = float(attrs.get("load1", attrs.get("load", 0)))
        expected = float(attrs.get("expected_load", actual * 0.9)) # Historical baseline approx
        diff = actual - expected
        
        features_list.append([expected, actual, diff])
        
    features_array = np.array(features_list)
    
    try:
        # Prediction: 1 for anomaly, 0 or 1 depending on model training
        # We assume 1 is anomaly based on common IsolationForest/Binary patterns
        predictions = model.predict(features_array)
        
        for idx, node in enumerate(nodes):
            node["status"] = "anomaly" if predictions[idx] == 1 else "normal"
            
    except Exception as e:
        print(f"Prediction failed: {e}")
        
    return nodes

if __name__ == "__main__":
    test_node = {"id": "test", "load1": 500, "expected_load": 100}
    print(f"Test Result: {predict_nodes([test_node])}")
