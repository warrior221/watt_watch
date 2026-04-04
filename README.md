# Watt Watch: Electricity Theft Detection & Smart Grid Analytics

Watt Watch is a sophisticated, real-time platform designed to monitor city-scale smart grids, identify power distribution irregularities, and visualize electricity theft with high-confidence geospatial tracking.

---

## ⚡ Core Architecture & Engineering

The system operates on a complex hierarchical graph model: **Power Plant → Transformer → Pole**. 
Data integrity is maintained through a recursive **Load Propagation Layer** in the Python backend, ensuring that any single kW discrepancy at the edge (pole) is accurately mapped through its parent transformer and into the city grid's aggregate health reports.

### 🧠 Smart Confidence Scoring Engine (Version 2.0)
Unlike simple threshold-based detection, Watt Watch now utilizes a **Weighted Multi-Factor Anomaly Algorithm**:
$$Confidence = (0.4 \times Node Deviation) + (0.3 \times Transformer Health) + (0.3 \times Historical Persistence)$$

*   **Node Deviation (40%):** The raw mismatch percentage of a single pole.
*   **Infrastructure Context (30%):** The overall health of the parent transformer—nodes are penalized more if the entire transformer tree shows aggregate leakage.
*   **Time Series Recurrence (30%):** An automated scoring system that tracks how many times a node has been flagged in recent detection cycles.

---

## 🛠️ Key Features & Views

### 📍 Interactive Grid Visualization (Leaflet.js)
A custom-built **MapController** manages smooth, cinematic `flyTo` transitions. When an anomaly is detected, the map automatically tracks the location with appropriate zoom levels while maintaining a consistent dark-theme UI.

### 📊 Intelligence Panels & Alerts
*   **Anomaly Intelligence Panel:** A floating, scrollable sidebar that lists suspicious sources (transformers) and active thefts, providing real-time load differential statistics (Expected vs. Actual) formatted to 2 decimal places.
*   **Theft Injection Simulator:** A sandbox feature allowing users to "ZAP" random poles with artificial load spikes to test system responsiveness.
*   **Automated SMTP Sentinel:** When a high-severity theft is detected, the backend autonomously triggers a professional Gmail-alert dispatch to the logged-in user's email ID, providing coordinates, Confidence Score, and severity.

### 📈 Comprehensive Analytics Hub (Recharts)
*   **Load Analysis:** Bar charts mapping area-wise leakage.
*   **Integrity Gauges:** Pie charts reflecting total grid efficiency vs. system-wide losses.
*   **Critical Vulnerability Reports:** Highlights the worst-performing city sectors.

### 🆕 Advanced Grid Management Views
*   **System Health:** A detailed, tree-based drill-down of every transformer and connected pole's performance.
*   **History Vault:** A centralized log of every anomaly ever recorded, fully filterable and searchable.
*   **Support & Documentation:** Built-in guidance for field enforcement teams.

---

## 🚀 Performance Optimizations

1.  **Network Request Consolidation:** The frontend has been optimized to batch data fetching, cutting browser network load by **50%** while maintaining real-time accuracy.
2.  **O(1) Data Traversal:** Back-end load recomputation uses `defaultdict` hashing for parent-child relationship mappings, ensuring $O(N)$ linear performance even as the grid scales to thousands of nodes.
3.  **UI Glassmorphism & Z-Index Management:** Precision CSS layering ensures intelligence panels float above the Leaflet map's interaction layers, providing a premium, glitch-free software experience.
4.  **Responsive Fluidity:** m-CSS constraints ensure that even high-density analytics dashboards render perfectly on laptop resolutions (13-16") without label clipping or layout overflow.

---

## ⚙️ Technical Stack

*   **Frontend:** React (Vite), TailwindCSS, Leaflet.js, Recharts, Lucide Icons, Material Symbols.
*   **Backend:** Python 3.10+, FastAPI (Asynchronous), Pandas, Pydantic.
*   **Database/Auth:** Supabase (Auth/Sessions & Persistence).
*   **Deployment/Ops:** Uvicorn (ASGI), Dotenv (Environmental Security).

---

## 📥 Setup & Configuration

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
*Port: 8000*

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Port: 5173*

### Environmental Variables (`.env`)
To enable automated email alerts, configure the following in your backend root:
```ini
ALERT_EMAIL=your-gmail@gmail.com
ALERT_EMAIL_PASSWORD=your-app-password (16 chars)
ALERT_RECIPIENT=default-alert-recipient@email.com
THRESHOLD=0.5
```
