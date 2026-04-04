from data_store import grid_data
from config import THRESHOLD
import datetime

def detect_theft():
    suspicious_transformers = []
    theft_nodes = []
    
    total_expected = sum(p["expected_load"] for p in grid_data["poles"])
    total_actual = sum(p["actual_load"] for p in grid_data["poles"])
    
    total_expected = round(total_expected, 2)
    total_actual = round(total_actual, 2)
    
    total_loss = round(total_actual - total_expected, 2)
    loss_percentage = 0.0
    if total_expected > 0:
        loss_percentage = round((total_loss / total_expected) * 100, 2)

    for t in grid_data["transformers"]:
        child_poles = [p for p in grid_data["poles"] if p["parent_id"] == t["id"]]
        sum_poles_expected = sum(p["expected_load"] for p in child_poles)
        
        # Check mismatch for transformer
        if abs(sum_poles_expected - t["actual_load"]) > THRESHOLD:
            suspicious_transformers.append(t["id"])
            print(f"DEBUG: Mark transformer {t['id']} suspicious.")
            
            # Inside suspicious transformer:
            for p in child_poles:
                diff = round(p["actual_load"] - p["expected_load"], 2)
                if diff > THRESHOLD:
                    confidence = diff / p["expected_load"] if p["expected_load"] > 0 else 1.0
                    confidence = min(confidence, 1.0)
                    confidence = round(confidence, 2)
                    
                    print(f"DEBUG: Mark pole {p['id']} as theft.")
                    theft_nodes.append({
                        "id": p["id"],
                        "area": p["area"],
                        "lat": p["lat"],
                        "lng": p["lng"],
                        "actual_load": p["actual_load"],
                        "expected_load": p["expected_load"],
                        "mismatch": diff,
                        "confidence": confidence,
                        "transformer": t["id"]
                    })
                    
                    grid_data["history"].append({
                        "time": datetime.datetime.now().isoformat(),
                        "pole": p["id"],
                        "confidence": confidence
                    })
                    
    return {
        "city": "Delhi",
        "theft_nodes": theft_nodes,
        "suspicious_transformers": suspicious_transformers,
        "summary": {
            "total_expected_load": total_expected,
            "total_actual_load": total_actual,
            "total_loss": total_loss,
            "loss_percentage": loss_percentage,
            "severity": "high" if loss_percentage > 20 else "medium" if loss_percentage > 5 else "low",
            "theft_count": len(theft_nodes)
        }
    }
