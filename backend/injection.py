from data_store import grid_data

def recompute_loads():
    from collections import defaultdict
    grid_data["detection_cache"] = None # Reset cache as data changed
    
    # Pre-group nodes by their parents
    by_parent = defaultdict(list)
    nodes_by_type = defaultdict(list)
    
    for n in grid_data["nodes"]:
        ntype = n["type"].lower()
        nodes_by_type[ntype].append(n)
        if n.get("parent_id"):
            by_parent[n["parent_id"]].append(n)

    # Recompute Transformer loads from child poles
    for t in nodes_by_type.get("transformer", []):
        child_poles = by_parent.get(t["id"], [])
        t["expected_load"] = round(sum(p.get("expected_load", 0) for p in child_poles if p["type"].lower() == "pole"), 2)
        t["actual_load"] = round(sum(p.get("actual_load", 0) for p in child_poles if p["type"].lower() == "pole"), 2)
        
    # Recompute PowerPlant loads from child transformers
    for pp in nodes_by_type.get("powerplant", []) + nodes_by_type.get("power_plant", []):
        child_tfs = by_parent.get(pp["id"], [])
        pp["expected_load"] = round(sum(t.get("expected_load", 0) for t in child_tfs if t["type"].lower() == "transformer"), 2)
        pp["actual_load"] = round(sum(t.get("actual_load", 0) for t in child_tfs if t["type"].lower() == "transformer"), 2)

def inject_theft(pole_ids):
    # Use a dictionary for fast lookup (O(N) initial, O(1) inside loop)
    node_map = {n["id"]: n for n in grid_data["nodes"] if n["type"].lower() == "pole"}
    affected = []
    
    for p_id in pole_ids:
        if p_id in node_map:
            p = node_map[p_id]
            p["actual_load"] = round(p.get("actual_load", 0) + 10.0, 2)
            affected.append(p_id)
            print(f"DEBUG: Injected theft into {p_id}. New load: {p['actual_load']}")
                
    if affected:
        recompute_loads()
    return affected
