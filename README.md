# ⚡ Watt Watch Pro: Sentinel Vigil ⚡
### Autonomous Smart Grid Monitoring & Anomaly Detection System

Watt Watch Pro is a production-grade **Graph AI** platform designed to monitor national energy infrastructure, detect electricity theft, and visualize 7,000+ infrastructure points in real-time. Built specifically for high-concurrency grid operations, it combines the pathfinding power of **TigerGraph** with the predictive precision of **Isolation Forest ML**.

---

## 🏗️ Project Architecture (A to Z Working)

The system operates across four primary layers ensuring a seamless "Data to Decision" pipeline:

1.  **Infrastructure Generation**: The `ml/generator.py` script synthesizes 7,000 unique grid poles across the Delhi Hub, calculating baseline "Expected Loads" based on demographic density.
2.  **Graph Ingestion**: Using `ml/bulk_loader.py`, this data is injected into a scalable **TigerGraph Cloud** instance, creating a complex relational map between Power Plants, Transformers, and Poles.
3.  **Hybrid Detection Engine**: The backend service retrieves live telemetry and processes it through a **Hybrid Anomaly Engine**:
    -   **ML Layer**: An `Isolation Forest` model (trained by `ml/train.py`) identifies non-linear deviations.
    -   **Heuristic Layer**: A ratio-based logic (`actual / expected > 1.5`) serves as a robust fallback.
4.  **Sentinel Map & Dashboard**: A high-performance **React + Leaflet** frontend renders the 7,000 nodes using GPU-accelerated Canvas, allowing operators to filter risk levels instantly.

---

## 🤖 ML Model Technical Specs

The project utilizes an **Isolation Forest** (Anomaly Detection) approach:
-   **Features**: `[Expected_Load, Actual_Load, Load_Mismatch]`
-   **Logic**: Unlike traditional clustering, Isolation Forest isolates anomalies by partitioning features until an outlier is found. This is hyper-efficient for detecting energy theft where "mismatches" are the primary indicator.
-   **Hybrid Fallback**: If the model is offline, the system automatically switches to a Ratio-Based calculation (Load vs. Threshold) to ensure 24/7 coverage.

---

## 📂 Directory Structure

```text
/watt_watch/
├── backend/                       # FASTAPI BACKEND CORE
│   ├── .env                       # TigerGraph Credentials (TG_HOST, TG_TOKEN, etc.)
│   ├── main.py                    # Entry Point (REST API Endpoints)
│   ├── db/
│   │   └── tigergraph.py          # TigerGraph Connection Config
│   ├── services/
│   │   └── tg_service.py          # Hybrid Detection & DB Operations
│   ├── ml/                        # ML DATA PIPELINE
│   │   ├── generator.py           # Infrastructure Synthesizer (7,000 poles)
│   │   ├── bulk_loader.py         # DB Ingestion Script
│   │   ├── train.py               # ML Model Trainer
│   │   ├── predict.py             # Inference Engine
│   │   └── model.pkl              # Trained Binary Model
│   ├── data/                      # LOCAL DATA REPOSITORY
│   │   └── grid_data.csv          # Master Infrastructure Snapshot
│   └── requirements.txt           # Python Dependencies (Pandas, pyTigerGraph, sklearn)
│
├── frontend/                      # REACT COMMAND CONSOLE
│   ├── src/
│   │   ├── App.jsx                # Global Router (Landing/Login/Main)
│   │   ├── MainConsole.jsx        # Authenticated UI Layout
│   │   ├── components/            # UI MODULES
│   │   │   ├── LandingPage.jsx    # "Sentinel" Public Home
│   │   │   ├── LoginPage.jsx      # Operator Mock Auth
│   │   │   ├── DashboardView.jsx  # Real-time Metrics
│   │   │   ├── GridView.jsx       # Canvas Map (Leaflet)
│   │   │   ├── AnalyticsView.jsx  # Recharts Intelligence
│   │   │   └── Sidebar/Header/Panels...
│   │   └── services/api.js        # Axios/Fetch Integration
│   └── package.json               # React/Vite Dependencies
└── README.md                      # Documentation
```

---

## 🛠️ Installation & Setup

### 1. Backend Initialization (Python 3.9+)
1.  Navigate to `/backend`.
2.  Install requirements: `pip install -r requirements.txt`.
3.  Configure `.env` with your TigerGraph credentials.
4.  Optionally reset and regenerate data:
    -   `python ml/generator.py` (Generate 7k nodes)
    -   `python ml/bulk_loader.py` (Inject into TigerGraph)
5.  Start API: `uvicorn main:app --reload`.

### 2. Frontend Initialization (Node 16+)
1.  Navigate to `/frontend`.
2.  Install dependencies: `npm install`.
3.  Start Console: `npm run dev`.

---

## 🌟 Key Features
-   **Canvas-Only Map**: Smoothly renders 7,000 poles without UI lag using `preferCanvas: true`.
-   **Real-time Risk Filtering**: Instant dashboard cards that toggle Normal, Medium, and High risk visibility.
-   **Dynamic Diagnostic**: `/detect` endpoint allows manual re-training and re-inference of the entire grid.
-   **Premium Aesthetics**: Obsidian dark mode with Cyber-Cyan glassmorphism panels.

---
**Developed by Antigravity Systems for the IIT Smart Grid Hackathon 2026.**
