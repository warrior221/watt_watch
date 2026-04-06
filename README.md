# ⚡ Watt Watch: Sentinel Grid Topology & Anomaly Intelligence ⚡
### *3-Tier Energy Integrity & Distribution Twin*

**Watt Watch** is a next-generation "Digital Twin" and investigative platform designed to monitor national energy infrastructure. It transforms a simple pole-based system into a deep **hierarchical energy grid** (Powerplant → Transformer → Pole), leveraging **TigerGraph's** relational engine to detect anomalies and trace supply-chain integrity in real-time.

---

## 📌 Project Overview
Energy grids are complex, branching networks where a failure or theft at the "edge" (Pole) cascades up to the "core" (Powerplant). **Watt Watch** maps these relationships with geospatial precision, allowing operators to visualize the entire supply chain and identify suspicious load patterns using a hybrid heuristic-ML engine.

---

## 🚀 Key Features

-   **📡 3-Tier Grid Hierarchy**: 
    -   **Powerplant** (Purple): The core generation hubs.
    -   **Transformer** (Orange): The distribution nodes.
    -   **Pole** (Blue/Multicolor): The consumer endpoints.
-   **🗺️ Interactive Topology Map**: GPU-accelerated rendering of 3,000+ interactive nodes with dynamic connection lines.
-   **🔍 Hierarchy Path Tracing**: Click any **Pole** to instantly highlight its supply line through a **Transformer** back to the originating **Powerplant**.
-   **🤖 Tiered Anomaly Detection**:
    -   **Edge (Pole)**: Ratio-based load analysis (Actual vs. Expected).
    -   **Distribution (Transformer)**: Aggregates downstream loads to detect transformer over-capacity.
    -   **Core (Powerplant)**: Monitors total draw to flag grid-level critical status.
-   **📊 Dashboard Intelligence**: Real-time counters for "System Health" based on hierarchical risk propagation.
-   **⚡ Sentinel Map Engine**: Zoom-based rendering for connection lines ensures fluid 60FPS navigation even with thousands of edges.

---

## 🏗️ System Architecture (Sentinel Stack)

1.  **Graph Layer (TigerGraph)**: 
    -   Utilizes `Powerplant`, `Transformer`, and `Pole` vertex types.
    -   Relational edges: `SUPPLIES` (Plant → TX) and `DISTRIBUTES` (TX → Pole).
2.  **Logic Layer (FastAPI)**: 
    -   **Asynchronous Engine**: Handles high-volume telemetry ingestion.
    -   **Hierarchy Orchestrator**: Traverses the graph to calculate cascading loads.
3.  **Data Layer (Python + Pandas)**: 
    -   `ml/generator.py`: Generates a geographically accurate synthetic grid for any city (Default: Delhi Hub).
    -   `ml/bulk_loader.py`: High-speed ingestion (Batch Size: 1000) using JWT-based TigerGraph authentication.
4.  **Presentation Layer (React + Leaflet)**: 
    -   **Spatial Engine**: Canvas-based rendering for high-density geospatial points.
    -   **Graph State**: React hooks manage the active supply-chain path highlighting.

---

## 📂 Directory Structure

```text
/watt_watch/
├── backend/                       # FASTAPI COMMAND CENTER
│   ├── main.py                    # REST API Entry Point
│   ├── apply_schema.py            # GSQL Schema Change Infrastructure
│   ├── clear_grid.py              # Topology Reset Utility
│   ├── db/
│   │   └── tigergraph.py          # pyTigerGraph 1.7 Compatibility & Auth Layer
│   ├── services/
│   │   └── tg_service.py          # Hierarchical Anomaly & Path Logic
│   ├── ml/                        # DATA PIPELINE
│   │   ├── generator.py           # Scalable Grid Generator (Plants, TX, Poles)
│   │   └── bulk_loader.py         # Batch Ingestion Engine
│   └── data/                      # LOCAL SNAPSHOTS (.csv)
│
├── frontend/                      # REACT CONSOLE
│   ├── src/
│   │   ├── MainConsole.jsx        # Grid State Orchestrator
│   │   ├── components/            
│   │   │   ├── GridView.jsx       # Map Engine (Hierarchy Rendering)
│   │   │   ├── DashboardView.jsx  # Hierarchical Metrics
│   │   │   └── AnalyticsView.jsx  # Trend Analysis
│   │   └── services/api.js        # API Integration
```

---

## 🧠 Anomaly Detection Logic

The Sentinel engine applies a **Bottom-Up Propagation Strategy**:

1.  **Pole Level**: If $Actual Load > 1.5 \times Expected Load$, a "High Anomaly" alert is raised at the edge.
2.  **Transformer Level**: $Current Load = \sum(Connected Poles)$. If $Current Load > Transformer Capacity$, the transformer is flagged as "Anomaly".
3.  **Powerplant Level**: $Total Draw = \sum(Connected Transformers)$. If $Total Draw > Powerplant Capacity$, a "Critical" status is propagated to the dashboard.

---

## 🛠️ Setup & Execution

### 1. Backend Preparation
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Install deps
pip install -r requirements.txt
```

### 2. Synchronization (TigerGraph)
```bash
# 1. Update Schema (Add Plants & Transformers)
python apply_schema.py

# 2. Generate and Load the Grid Topology
python ml/generator.py
python ml/bulk_loader.py
```

### 3. Start Services
-   **Backend**: `uvicorn main:app --reload`
-   **Frontend**: `npm run dev`

---

## 👤 Author & Development
**Hridyansh (Sentinel Developer)**
*Built for the Scaler School of Technology (SST) Watt Watch Challenge.*
