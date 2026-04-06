# ⚡ Watt Watch: Smart Grid Anomaly & Theft Detection ⚡
### *Sentinel Vigil for National Energy Infrastructure*

**Watt Watch** is a production-grade, full-stack investigative platform designed to identify, visualize, and mitigate electricity theft in real-time. By leveraging **TigerGraph's** high-performance graph processing, **FastAPI's** asynchronous concurrency, and **Scikit-learn's** anomaly detection algorithms, Watt Watch provides a "Sentinel" level of oversight for smart energy grids.

---

## 📌 Project Overview
Electricity theft accounts for billions in annual revenue loss and grid instability. **Watt Watch** addresses this by mapping 7,000+ infrastructure nodes (Power Plants, Transformers, and Poles) into a relational graph. It uses a hybrid detection engine to compare real-time telemetry against historical baselines, isolating suspicious consumption patterns with geospatial precision.

---

## 🚀 Key Features
-   **🔍 Layered Graph Monitoring**: Real-time visibility into the hierarchy of Power Plants → Transformers → Poles.
-   **🤖 Hybrid ML Detection**: Combines `Isolation Forest` (outlier detection) with a heuristic ratio-based engine.
-   **🗺️ GPU-Accelerated Mapping**: Rendered via Leaflet (Canvas), supporting 7,000+ nodes at 60FPS fluid navigation.
-   **📈 Intelligence Dashboard**: Clickable stats cards for instant risk-group filtering (Normal vs. High Risk).
-   **📡 Dynamic Telemetry Sync**: Upload field CSVs to instantly update the entire grid's load state via the API.
-   **🌌 Obsidian UI Palette**: Premium dark-mode interface with Cyber-Cyan glassmorphism panels.

---

## 🏗️ System Architecture
The platform operates as a **Four-Tier Sentinel Architecture**:

1.  **Ingestion Layer**: `ml/generator.py` synthesizes 7,000 poles with unique geospatial coordinates and baselines.
2.  **Graph Layer (TigerGraph)**: Stores the infrastructure as a persistent graph. Relationships enable sub-millisecond traversal from a suspicious pole to its source transformer.
3.  **Inference Layer (FastAPI + ML)**:
    -   **Backbone**: FastAPI asynchronously handles telemetry uploads.
    -   **Brain**: `ml/predict.py` uses a pre-trained `Isolation Forest` model to classify consumption risk.
4.  **Presentation Layer (React)**:
    -   **Map Engine**: Leaflet + Canvas for high-density geospatial dots.
    -   **State Engine**: React hooks manage global filtering and active "focus-on-anomaly" panning.

---

## 📂 Directory Structure

```text
/watt_watch/
├── backend/                       # FASTAPI CORE
│   ├── .env                       # TigerGraph & Security Credentials
│   ├── main.py                    # REST API (Uvicorn Service)
│   ├── requirements.txt           # Python Dependencies (pyTigerGraph, Pandas, sklearn)
│   ├── db/
│   │   └── tigergraph.py          # Persistent Graph Connection Layer
│   ├── services/
│   │   └── tg_service.py          # Hybrid Anomaly & Business Logic
│   ├── ml/                        # ML & DATA PIPELINE
│   │   ├── generator.py           # Infrastructure Generator (7k Nodes)
│   │   ├── bulk_loader.py         # DB Ingestion Logic (TG Cloud)
│   │   ├── train.py               # Model Trainer (Isolation Forest)
│   │   ├── predict.py             # Model Inference Engine
│   │   └── model.pkl              # Binary Weights
│   └── data/                      # LOCAL DATA STORAGE
│       └── grid_data.csv          # Master Grid Snapshot
│
├── frontend/                      # REACT CONSOLE
│   ├── src/
│   │   ├── App.jsx                # Global Router (Landing/Login/Console)
│   │   ├── MainConsole.jsx        # Authenticated Grid Orchestrator
│   │   ├── components/            # UI MODULES
│   │   │   ├── LandingPage.jsx    # "Sentinel" Public Home
│   │   │   ├── LoginPage.jsx      # Mock Operator Auth
│   │   │   ├── GridView.jsx       # GPU Map Module
│   │   │   ├── DashboardView.jsx  # Metrics & Filtering
│   │   │   └── AnalyticsView.jsx  # Recharts Intelligence
│   │   └── services/api.js        # FastAPI Integration (Axios/Fetch)
│   └── package.json               # Node Modules & Vite Settings
└── README.md                      # Documentation
```

---

## ⚙️ How It Works (Step-by-Step Pipeline)

1.  **Data Generation**: The `ml/generator.py` script identifies 7,000 coordinates across the Delhi Hub and assigns `expected_load` based on demographic density.
2.  **Storage (TigerGraph)**: The `ml/bulk_loader.py` script performs a bulk upsert (Batch Size: 5,000) into TigerGraph Cloud, ensuring all connections are established.
3.  **ML Detection Trigger**: When the "Run Detection" icon is clicked on the UI, the backend retrieves all vertices, feeds them into the `predict_anomalies` function, and updates the `status` attribute in the DB.
4.  **Visualization**: The frontend fetches the updated nodes and uses a custom `getColor` function to determine dot styling on the geospatial map.

---

## 🛠️ Installation Guide

### 1. Setup Backend (Python 3.9+)
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Install deps
pip install -r requirements.txt
```
**Environment Variables (.env):**
Create a `.env` in `backend/` with:
```env
TG_HOST=https://your-graph.i.tgcloud.io
TG_TOKEN=your-api-token
TG_GRAPH=watt_watch
TG_USERNAME=tigergraph
TG_PASSWORD=your-password
```

### 2. Setup Frontend (Node 16+)
```bash
cd frontend
npm install
```

---

## 🚀 Running the Project

1.  **Start API (Backend)**: `uvicorn main:app --reload`
2.  **Start Console (Frontend)**: `npm run dev`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/nodes` | Retrieves all 7,000 active grid poles and their metrics. |
| `POST` | `/detect` | Triggers the Hybrid ML detection engine across the entire grid. |
| `POST` | `/upload-load` | Accepts a `.csv` file to sync field telemetry with the DB. |
| `GET` | `/reset-grid` | Purges the graph and re-initializes 7,000 nodes from scratch. |

---

## 🧠 ML Logic Explanation

The system uses a **Hybrid Anomaly Strategy**:

### 1. The Anomaly Ratio (Base Detection)
The system calculates the consumption mismatch using:
$$ratio = \frac{actual\_load}{expected\_load}$$

-   **Normal**: $ratio \le 1.2$ (Green)
-   **Medium Anomaly**: $1.2 < ratio \le 1.5$ (Yellow)
-   **High Anomaly**: $ratio > 1.5$ (Red)

### 2. Isolation Forest (Pattern Detection)
The pre-trained model looks for multi-feature outliers. It partitions features like `expected_load`, `load1`, and `area` until it isolates "branches" that deviate significantly from the norm. This captures complex local thefts that a simple ratio might miss.

---

## 🗺️ Map Visualization & Color System
To maintain clarity for operators, the Sentinel Map uses a strict color hierarchy:
-   🔵 **Blue**: Default State (Pre-Detection)
-   🟢 **Green**: Normal Load (Integrity Confirmed)
-   🟡 **Yellow**: Medium Risk (Investigation Recommended)
-   🔴 **Red**: High Anomaly (Immediate Response Required)

---

## 📊 Dashboard & Performance
-   **Stats Cards**: Live counters for Total Nodes, System Health (%), and Active Alerts. Click any card to **Filter the Map** instantly (e.g., viewing only Red nodes).
-   **Batch Processing**: Backend handles upserts in batches of 5,000 items to avoid DB timeouts.
-   **Leaflet Clustering**: Automatically groups high-density dots at lower zoom levels, expanding into individual dots as the operator zooms in.
-   **Frontend Filtering**: Uses `useMemo` hooks to filter 7,000 nodes in memory (sub-1ms), providing a zero-latency UI experience.

---

## 🔮 Future Improvements
-   **Real-time IoT Streams**: Integration with Zigbee/LoRaWAN smart meters for live streaming.
-   **Time-Series ML**: Using LSTM models to predict seasonal theft trends.
-   **Multi-User Auth**: Full RBAC (Role Based Access Control) for field engineers and management.

---

## 📸 Screenshots
*(Add your high-resolution sentinel screenshots here)*

---

## 👤 Author
**Hridyansh (Sentinel Developer)**
*Built with ❤️ for the IIT Smart Grid Hackathon 2026.*
