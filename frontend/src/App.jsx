import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapCanvas from './components/MapCanvas';
import IntelligencePanel from './components/IntelligencePanel';
import Footer from './components/Footer';
import { api } from './services/api';

function App() {
  const [currentCity, setCurrentCity] = useState("Delhi");
  const [gridData, setGridData] = useState({ nodes: [], edges: [] });
  const [metrics, setMetrics] = useState({ total_nodes: 0, transformers: 0, system_health: 0 });
  const [alerts, setAlerts] = useState([]);
  const [suspiciousTfs, setSuspiciousTfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllData = useCallback(async (city = currentCity) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both raw grid and detection status
      const [grid, currentMetrics, currentAlerts, detectionFull] = await Promise.all([
        api.getGridData(city),
        api.getMetrics(),
        api.getAlerts(),
        api.getDetectionResults()
      ]);
      
      setGridData(grid);
      setMetrics(currentMetrics);
      setAlerts(currentAlerts);
      setSuspiciousTfs(detectionFull.suspicious_transformers || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Connection failed. Please check backend status.');
    } finally {
      setLoading(false);
    }
  }, [currentCity]);

  useEffect(() => {
    loadAllData(currentCity);
  }, [currentCity, loadAllData]);

  const handleCityChange = async (newCity) => {
    if (newCity !== currentCity) {
      setCurrentCity(newCity);
      // Data will be loaded via useEffect dependency change
    }
  };

  const handleTheftInjection = async (poles) => {
    try {
      await api.injectTheft(poles);
      await loadAllData(currentCity);
    } catch (err) {
      setError('Simulation failed.');
    }
  };

  const handleManualDetection = async () => {
    try {
      setLoading(true);
      await api.triggerDetection();
      await loadAllData(currentCity);
    } catch (err) {
      setError('Manual detect failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden text-on-surface bg-[#0b1326] h-screen w-screen relative font-['Inter']">
      <Header />
      <Sidebar metrics={metrics} onRefresh={handleManualDetection} />
      
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] bg-red-900/40 backdrop-blur-xl border border-red-500/50 px-6 py-3 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl">
          <span className="material-symbols-outlined text-sm">warning</span>
          {error}
          <button onClick={() => loadAllData(currentCity)} className="ml-4 underline hover:text-white transition-colors">Retry</button>
        </div>
      )}

      {loading && !gridData.nodes.length && (
        <div className="absolute inset-0 z-[2000] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center">
            <div className="flex flex-col items-center gap-8 translate-y-[-10%]">
                <div className="w-20 h-20 relative">
                   <div className="absolute inset-0 border-4 border-blue-400/20 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                   <span className="material-symbols-outlined text-blue-400 text-3xl absolute inset-0 flex items-center justify-center animate-pulse">radar</span>
                </div>
                <div className="text-center">
                   <h3 className="text-blue-400 font-black uppercase tracking-[0.4em] text-sm mb-2">PhantomNode Monitoring</h3>
                   <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Synchronizing {currentCity} Grid...</p>
                </div>
            </div>
        </div>
      )}

      <main className="ml-72 pt-16 h-screen relative">
        <MapCanvas 
          nodes={gridData.nodes} 
          edges={gridData.edges} 
          theftNodes={alerts} 
          suspiciousTfs={suspiciousTfs}
          onInjectTheft={handleTheftInjection}
          onGenerateGrid={() => loadAllData(currentCity)} 
          onDetectTheft={handleManualDetection}
          currentCity={currentCity}
          onCityChange={handleCityChange}
        />
        <IntelligencePanel 
          summary={{
            total_expected_load: gridData.nodes.reduce((acc, n) => acc + (n.expected_load || 0), 0) || 0,
            total_actual_load: gridData.nodes.reduce((acc, n) => acc + (n.actual_load || 0), 0) || 0,
            loss_percentage: Math.max(0, 100 - (metrics.system_health || 100))
          }}
          history={[]}
          theftNodes={alerts}
          suspiciousTfs={suspiciousTfs}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;