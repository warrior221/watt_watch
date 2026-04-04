from data_store import grid_data
from config import THRESHOLD
import datetime

def detect_theft(force=False):
    from collections import defaultdict
    
    if not force and grid_data.get("detection_cache"):
        return grid_data["detection_cache"]

    suspicious_transformers = []
    theft_nodes = []
    
    # Group poles by parent transformer
    by_parent = defaultdict(list)
    poles = []
    transformers = []
    
    for n in grid_data["nodes"]:
        ntype = n["type"].lower()
        if ntype == "pole":
            poles.append(n)
            if n.get("parent_id"):
                by_parent[n["parent_id"]].append(n)
        elif ntype == "transformer":
            transformers.append(n)
    
    total_expected = sum(p.get("expected_load", 0) for p in poles)
    total_actual = sum(p.get("actual_load", 0) for p in poles)
    
    total_expected = round(total_expected, 2)
    total_actual = round(total_actual, 2)
    
    total_loss = round(total_actual - total_expected, 2)
    loss_percentage = 0.0
    if total_expected > 0:
        loss_percentage = round((total_loss / total_expected) * 100, 2)

    for t in transformers:
        child_poles = by_parent.get(t["id"], [])
        sum_poles_expected = sum(p.get("expected_load", 0) for p in child_poles)
        
        # Check mismatch for transformer
        if abs(sum_poles_expected - t.get("actual_load", 0)) > THRESHOLD:
            suspicious_transformers.append(t["id"])
            
            # Inside suspicious transformer:
            for p in child_poles:
                diff = round(p.get("actual_load", 0) - p.get("expected_load", 0), 2)
                if diff > THRESHOLD:
                    confidence = diff / p["expected_load"] if p.get("expected_load", 0) > 0 else 1.0
                    confidence = round(min(confidence, 1.0), 2)
                    
                    theft_nodes.append({
                        "id": p["id"],
                        "area": p.get("area", ""),
                        "lat": p["lat"],
                        "lng": p["lng"],
                        "actual_load": p.get("actual_load", 0),
                        "expected_load": p.get("expected_load", 0),
                        "mismatch": diff,
                        "confidence": confidence,
                        "transformer": t["id"]
                    })
                    
                    # Log to history for persistent view
                    grid_data["history"].append({
                        "time": datetime.datetime.now().isoformat(),
                        "pole": p["id"],
                        "confidence": confidence
                    })
                    
                    # Cap history to prevent memory issues (last 200 items)
                    if len(grid_data["history"]) > 200:
                        grid_data["history"] = grid_data["history"][-200:]
    
    result = {
        "city": "Uploaded Grid",
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
    
    # Cache the result to prevent multiple computations and history duplication on polling
    grid_data["detection_cache"] = result
    return result
