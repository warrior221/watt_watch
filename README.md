# Watt Watch - Electricity Theft Detection System

Watt Watch is an advanced, hierarchical anomaly detection platform designed to monitor smart grids, identify suspected electricity theft, and visualize load irregularities geospatially in real-time.

## System Architecture

The application is built on a high-performance stack:
*   **Backend:** Python / FastAPI
*   **Datastore:** In-memory State Management (Node/Edge Graph caching)
*   **Frontend:** React (Vite), TailwindCSS, Recharts, and React-Leaflet
*   **Authentication:** Supabase

## Core Capabilities

1.  **Hierarchical Load Recomputation:**
    The backend structures the grid in a tree: **Power Plants -> Transformers -> Poles**. 
    Any mismatch at the pole level propagates upwards. The `recompute_loads()` engine recursively aggregates expected and actual load so that infrastructure gaps are clearly traceable.

2.  **Deterministic Anomaly Detection (`detect_theft`):**
    Instead of heavy machine learning algorithms, the system uses a highly optimized deterministic mismatch approach. By traversing transformers and their child poles, it:
    *   Finds discrepancies between theoretical expected load and actual sensor load.
    *   Flags "Suspicious Transformers" where the aggregate mismatch crosses confidence thresholds.
    *   Caches the heavy computation `grid_data["detection_cache"]` for O(1) retrieval across the React frontend until the grid state mutates.

3.  **Real-Time Grid View (Interactive Mapping):**
    The React frontend plots the coordinate connections on a dark-themed Leaflet map. 
    It includes an interactive `IntelligencePanel` that monitors active theft alerts and suspicious sources. Selecting an anomaly triggers the localized `MapController` to smoothly zoom and track directly into the problem node.

4.  **Advanced Data Analytics:**
    Aggregates anomaly tracking by city areas. Uses generic Recharts to provide:
    *   Load mismatches mapped by severity and region.
    *   Infrastructure integrity distributions.
    *   "Worst Performing Node" isolation grids.

5.  **Simulated Theft Injection:**
    For demo/testing, the UI provides a "Zap" button that triggers the `/inject-theft` endpoint, artificially injecting 10kW load on a random pole, initiating a chain reaction of load re-computations and UI alerts.

## Key Optimizations Applied

During development, several key optimizations were implemented:
*   **O(1) Dictionary Lookup:** Fast mapping (`node_map`) and `defaultdict` structures were applied in `injection.py` to prevent O(N^2) loops when re-computing loads across thousands of nodes.
*   **Intelligent Caching:** The detection engine only recalculates grid status if a mutation (like theft injection or data upload) has occurred. Otherwise, it serves cached payloads, eliminating duplicate array traversal.
*   **Network Request Batching:** Data from detection runs are aggregated. Instead of iterating algorithms repeatedly to get metrics and alerts, the backend provides cached access preventing heavy calculations.
*   **UI Rendering Efficiencies:** We removed `useEffect` conflicts in Leaflet targeting functions by combining map resizing, flying, and pan logic into a unified `<MapController>` – averting severe map rendering glitches and zoom artifacts. Z-index layering was strictly constrained to float customized alerts beautifully over native Leaflet panes.
*   **Responsive Network Logic:** Component sizes were meticulously calculated via CSS flex/shrink rules so the UI operates perfectly at 14-to-16-inch laptop resolutions without overflowing or clipping data labels on smaller monitors.

## Running the Application

### Backend
Navigate to the `backend/` directory:
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```
Runs locally on `localhost:8000`.

### Frontend
Navigate to the `frontend/` directory:
```bash
npm install
npm run dev
```
Runs the Vite server on `localhost:5173`.
