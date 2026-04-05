import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { getNodes, triggerDetection, uploadLoadCsv } from './services/api';

// Delhi Bounding Box (Lat: 28.4 - 28.9, Lng: 76.8 - 77.4)
const DELHI_BOUNDS = [
  [28.4, 76.8],
  [28.9, 77.4]
];

// ✅ CORE COLOR SYSTEM
const getColor = (status) => {
  switch (status) {
    case 'normal': return '#10b981'; // Green
    case 'medium_anomaly': return '#f59e0b'; // Yellow/Orange
    case 'high_anomaly': return '#ef4444'; // Red
    default: return '#3b82f6'; // Blue (Default)
  }
};

function Dashboard({ stats, currentFilter, onFilterChange }) {
  const filterLabelMap = {
    all: "All Grid Nodes",
    normal: "Normal Load Nodes",
    medium_anomaly: "Medium Risk Nodes",
    high_anomaly: "High Risk (Theft) Nodes"
  };

  return (
    <div className="p-4 bg-slate-900 border-l border-slate-800 w-80 flex flex-col gap-4 overflow-y-auto z-10 box-border">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-lg font-black text-blue-400 tracking-tighter">ANALYTICS</h2>
        {currentFilter !== 'all' && (
          <button 
            onClick={() => onFilterChange('all')}
            className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-400 font-bold transition-all"
          >
            RESET
          </button>
        )}
      </div>

      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest -mb-2">
        Showing: <span className="text-white">{filterLabelMap[currentFilter]}</span>
      </p>
      
      <div className="grid grid-cols-1 gap-3 mt-2">
        {/* Total Nodes (Always All) */}
        <div 
          onClick={() => onFilterChange('all')}
          className={`cursor-pointer transition-all p-4 rounded-xl border ${currentFilter === 'all' ? 'bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'}`}
        >
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Total Grid Nodes</p>
          <p className="text-2xl font-black text-white">{stats.total.toLocaleString()}</p>
        </div>
        
        {/* Normal Load Card */}
        <div 
          onClick={() => onFilterChange('normal')}
          className={`cursor-pointer transition-all p-4 rounded-xl border ${currentFilter === 'normal' ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-emerald-950/20 border-emerald-500/10 hover:border-emerald-500/30'}`}
        >
          <p className="text-[10px] text-emerald-500 uppercase font-black tracking-widest">Normal Load</p>
          <p className="text-2xl font-bold text-emerald-400">{stats.normal.toLocaleString()}</p>
        </div>

        {/* Medium Risk Card */}
        <div 
          onClick={() => onFilterChange('medium_anomaly')}
          className={`cursor-pointer transition-all p-4 rounded-xl border ${currentFilter === 'medium_anomaly' ? 'bg-amber-950/40 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-amber-950/20 border-amber-500/10 hover:border-amber-500/30'}`}
        >
          <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Medium Risk</p>
          <p className="text-2xl font-bold text-amber-400">{stats.medium.toLocaleString()}</p>
        </div>

        {/* High Risk Card */}
        <div 
          onClick={() => onFilterChange('high_anomaly')}
          className={`cursor-pointer transition-all p-4 rounded-xl border ${currentFilter === 'high_anomaly' ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-red-950/20 border-red-500/10 hover:border-red-500/30'}`}
        >
          <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">High Risk (Theft)</p>
          <p className="text-2xl font-bold text-red-400">{stats.high.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-auto p-4 bg-slate-800/20 rounded-xl border border-slate-700/30">
        <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">System Health</p>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex shadow-inner">
          <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${stats.total > 0 ? (stats.normal / stats.total * 100) : 100}%` }}></div>
          <div className="bg-amber-500 h-full transition-all duration-700" style={{ width: `${stats.total > 0 ? (stats.medium / stats.total * 100) : 0}%` }}></div>
          <div className="bg-red-500 h-full transition-all duration-700" style={{ width: `${stats.total > 0 ? (stats.high / stats.total * 100) : 0}%` }}></div>
        </div>
        <p className="text-[10px] mt-2 text-slate-400 font-mono flex justify-between">
          <span>THEFT RATIO:</span>
          <span className="text-red-400 font-bold">{stats.total > 0 ? (((stats.medium + stats.high) / stats.total) * 100).toFixed(1) : 0}%</span>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [nodes, setNodes] = useState([]);
  const [filter, setFilter] = useState("all"); // ✅ STATE FOR FILTERING
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setStatusMsg("Syncing SmartGrid nodes...");
    try {
      const data = await getNodes();
      setNodes(Array.isArray(data) ? data : []);
      setStatusMsg("");
    } catch (err) {
      console.error(err);
      setStatusMsg("Sync Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunDetection = async () => {
    setLoading(true);
    setStatusMsg("Running Anomaly Detection Algorithm...");
    try {
      const res = await triggerDetection();
      if (res.status === "success") {
        setStatusMsg(`Detection Complete: Processed ${res.count} poles.`);
        await fetchData();
      } else {
        setStatusMsg("Detection failed.");
      }
    } catch (err) {
      setStatusMsg("Detection Error.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatusMsg("Synchronizing load telemetry mapping...");
    try {
      const data = await uploadLoadCsv(file);
      if (data.status === "success") {
        setStatusMsg(`Telemetry mapping complete: Updated ${data.count} nodes.`);
        await fetchData();
      } else {
        setStatusMsg("Upload failed: " + data.error);
      }
    } catch (err) {
      setStatusMsg("Upload Error.");
    } finally {
      setLoading(false);
      event.target.value = null; // Reset input
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const total = nodes.length;
    const normal = nodes.filter(n => (n.attributes?.status || n.status) === 'normal').length;
    const medium = nodes.filter(n => (n.attributes?.status || n.status) === 'medium_anomaly').length;
    const high = nodes.filter(n => (n.attributes?.status || n.status) === 'high_anomaly').length;
    return { total, normal, medium, high };
  }, [nodes]);

  // ✅ CALCULATE FILTERED NODES (MEMOIZED)
  const filteredNodes = useMemo(() => {
    if (filter === "all") return nodes;
    return nodes.filter(n => (n.attributes?.status || n.status) === filter);
  }, [nodes, filter]);

  return (
    <div className="h-screen w-screen bg-[#0b1326] text-white flex font-['Inter'] overflow-hidden">
      <div className="flex flex-col flex-1 relative">
        <header className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center shadow-2xl z-30">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/20">
              <span className="text-blue-500 material-symbols-outlined text-3xl">bolt</span>
            </div>
            <div>
              <h1 className="text-2xl tracking-tighter font-black text-white flex items-center gap-1 transition-all">
                WATT WATCH <span className="text-blue-500 font-black italic">PRO</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-80">Autonomous Delhi Grid Analytics</p>
            </div>
          </div>

          <div className="flex gap-4">
            <label className="bg-slate-900 hover:bg-slate-800 text-slate-400 text-[10px] font-black px-6 py-3 rounded-xl cursor-pointer border border-slate-800 transition-all flex items-center gap-2 group">
              <span className="material-symbols-outlined text-base group-hover:scale-110 transition-transform">upload_file</span>
              UPDATE FIELD LOADS (CSV)
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>

            <button 
              onClick={handleRunDetection}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-900 border border-blue-400/20 text-white text-[10px] font-black px-8 py-3 rounded-xl shadow-2xl shadow-blue-900/20 transition-all flex items-center gap-2 group overflow-hidden relative"
            >
              {loading ? "PROCESSING ENGINE..." : (
                <>
                  <span className="material-symbols-outlined text-base group-hover:rotate-180 transition-transform duration-500">settings_suggest</span>
                  RUN ANOMALY ENGINE
                </>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 relative z-10">
          <MapContainer 
            center={[28.65, 77.1]} 
            zoom={12} 
            className="h-full w-full grayscale-[0.3] contrast-[1.1]"
            maxBounds={DELHI_BOUNDS}
            worldCopyJump={false}
            preferCanvas={true} // ✅ FOR HIGH PERFORMANCE RENDERING
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; CARTO'
            />
            
            <MarkerClusterGroup 
              chunkedLoading 
              maxClusterRadius={40}
              showCoverageOnHover={false}
              spiderfyOnMaxZoom={true}
              key={filter} // ✅ FORCE RE-RENDER CLUSTERS ON FILTER CHANGE
            >
              {filteredNodes.map(node => {
                const lat = node.attributes?.lat || node.lat;
                const lng = node.attributes?.lng || node.lng;
                const status = node.attributes?.status || node.status || 'default';
                const load = node.attributes?.load1 || 0;
                const expected = node.attributes?.expected_load || 0;
                
                if (!lat || !lng) return null;
                
                return (
                  <CircleMarker
                    key={node.v_id || node.id}
                    center={[lat, lng]}
                    radius={5}
                    pathOptions={{
                      fillColor: getColor(status),
                      color: getColor(status),
                      weight: 1,
                      opacity: 0.8,
                      fillOpacity: 0.6
                    }}
                  >
                    <Tooltip sticky opacity={0.9}>
                      <div className="text-slate-900 p-2 min-w-[140px] font-bold">
                        <p className="border-b border-slate-200 mb-2 pb-1 text-blue-600 tracking-tighter">NODE ID: {node.v_id || node.id}</p>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-slate-500">LOAD:</span>
                          <span>{load.toFixed(1)} kW</span>
                        </div>
                        <div className="flex justify-between text-[11px] mb-2">
                          <span className="text-slate-500">THRESHOLD:</span>
                          <span>{expected.toFixed(1)} kW</span>
                        </div>
                        <div className={`p-1.5 rounded-md text-center text-[10px] font-black uppercase tracking-widest ${
                          status === 'normal' ? 'bg-emerald-100 text-emerald-700' : 
                          status === 'default' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {status.replace('_', ' ')}
                        </div>
                      </div>
                    </Tooltip>
                  </CircleMarker>
                );
              })}
            </MarkerClusterGroup>
          </MapContainer>

          {statusMsg && (
            <div className="absolute bottom-8 left-10 bg-slate-950/80 backdrop-blur-xl px-6 py-3 rounded-2xl border border-blue-500/30 shadow-2xl z-[1000] flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[11px] font-black text-blue-100 uppercase tracking-widest">{statusMsg}</span>
            </div>
          )}
        </main>
      </div>

      <Dashboard stats={stats} currentFilter={filter} onFilterChange={setFilter} />
    </div>
  );
}

export default App;