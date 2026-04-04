from data_store import grid_data
from data_loader import recompute_loads

def inject_theft(pole_ids):
    affected = []
    for pole_id in pole_ids:
        for p in grid_data["poles"]:
            if p["id"] == pole_id:
                p["actual_load"] = round(p["actual_load"] + 10.0, 2)
                affected.append(pole_id)
                print(f"DEBUG: Injected theft into {pole_id}. New load: {p['actual_load']}")
                break
                
    recompute_loads()
    return affected
