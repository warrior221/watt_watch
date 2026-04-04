# Watt Watch: Advanced Electricity Theft Detection & Smart Grid Analytics

Watt Watch is an enterprise-grade IoT sensing and data intelligence platform developed for monitoring modern smart grids. 

The system leverages hierarchical data structures and a deterministic, multi-factor anomaly scoring engine to identify, visualize, and report energy leakage in real-time. It is designed to scale across thousands of nodes from Power Plants down to individual street-level poles.

---

## 🏛️ Project Architecture & Analysis

The platform is divided into a high-performance **Python/FastAPI** backend and a reactive **Vite/React** frontend. 

### 1. The Hierarchical Graph Engine
The backend maintains an in-memory graph of the power distribution network. The relationships are established during data ingestion via:
*   **Power Plants:** The root sourcing nodes.
*   **Transformers:** The intermediate distribution and aggregation hubs.
*   **Poles (Sensors):** The leaf-level nodes where most electrical losses occur.

### 2. Recursive Load Recomputation (The Intelligence Core)
When a theft is detected or injected, the backend initiates a recursive **Load Propagation Sync**. It calculates the `expected_load` (the theoretical sum of all downstream consumers) and compares it against the `actual_load` (sensor data). Discrepancies larger than the defined `THRESHOLD` (default 0.5 kW) trigger a widespread grid alert.

### 3. Smart Confidence Matrix (V2.0 Logic)
To reduce false positives, the platform moved away from simple binary tagging. It now scores every anomaly using a weighted three-pillar matrix:
*   **Deviation (40%):** Weighted by the magnitude of the specific node's mismatch ratio.
*   **Tree Health (30%):** Cross-references the parent transformer's total aggregate mismatch.
*   **Recurrence (30%):** Scores based on temporal persistence from the `HistoryVault`—frequent offenders are prioritized automatically.

---

## 📁 System Folder Structure

```bash
Watt_Watch/
├── backend/                   # Python FastAPI Engine
│   ├── data/                  # Local CSV datasets
│   ├── __pycache__/           # Compiled bytecode
│   ├── config.py              # Environment and Threshold configs
│   ├── data_loader.py         # CSV Parser and Graph Builder
│   ├── data_store.py          # Global state (In-memory cache)
│   ├── detection.py           # Multi-factor Anomaly Engine & SMTP
│   ├── injection.py           # Simulation: Load Propagation Logic
│   ├── main.py                # FastAPI Routes and Middleware
│   └── requirements.txt       # Backend Dependencies
├── frontend/                  # React/Vite UI
│   ├── src/                   # Source files
│   │   ├── assets/            # Static media
│   │   ├── services/          # API & Supabase interface
│   │   └── components/        # View Layer
│   │       ├── AnalyticsView.jsx     # Recharts Charting
│   │       ├── GridView.jsx          # Leaflet Geospatial mapping
│   │       ├── DashboardView.jsx     # Real-time KPIs
│   │       ├── SystemHealthView.jsx  # Tree-depth monitoring
│   │       └── ...                   # Modal & Layout UI
│   ├── index.html             # React Entry point
│   ├── package.json           # Frontend Dependencies
│   └── vite.config.js         # Build pipeline
├── README.md                  # Detailed Documentation
└── .env.example               # Configuration Template
```

---

## 🚀 Performance & UI Engineering

*   **Minimized API Footprint:** The frontend utilizes a batch-loading strategy for `loadAllData`. By fetching core grid and the pre-computed detection cache simultaneously, we've reduced active network requests by **50%**, ensuring high-speed UI responsiveness on 3G/4G field connections.
*   **O(1) Data Access:** The backend uses `defaultdict` and hash-map indexing for parent-child relationship tracking, eliminating slow $O(N^2)$ traversal in large-scale datasets.
*   **Geospatial Tracking:** The **MapController** plugin for Leaflet implements a unified hook system for smooth coordinate tracking and automatic `invalidateSize` resizing, preventing white-flash rendering artifacts during aggressive zooms.
*   **Automated Response:** The backend's **SMTP Sentinel** provides an instant SMTP link for enforcement team notifications, sent directly to the logged-in user's email ID.

---

## ⚙️ Deployment & Setup

### 1. Global Setup
Clone the repository and locate both main folders. Ensure you have **Python 3.10+** and **Node.js 18+** installed.

### 2. Backend Initialization
```bash
cd backend
pip install -r requirements.txt
cp ../.env.example .env (and configure)
uvicorn main:app --reload
```
The server will start at `localhost:8000`.

### 3. Frontend Initialization
```bash
cd frontend
npm install
npm run dev
```
The production UI will serve at `localhost:5173`.

### 4. Configuring Security (Supabase)
To enable the profile system and sign-on security:
1.  Setup a **Supabase** project.
2.  Enable **Email Auth**.
3.  Fill in the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env`.

---

## 🔒 Environment Variable Reference (`.env.example`)

| Variable | Use | Default |
| :--- | :--- | :--- |
| `THRESHOLD` | Trigger sensitivity for kW mismatch. | `0.5` |
| `ALERT_EMAIL` | Sender address for gmail alerts. | `your@gmail.com` |
| `ALERT_EMAIL_PASSWORD` | Google 16-char App Password. | `xxxx-xxxx-xxxx` |
| `ALERT_RECIPIENT` | Fallback alert destination address. | `admin@grid.com` |
| `SUPABASE_URL` | Your secure Supabase project URL. | `...supabase.co` |
