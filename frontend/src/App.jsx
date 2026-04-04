import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header           from './components/Header';
import Sidebar          from './components/Sidebar';
import GridView         from './components/GridView';
import DashboardView    from './components/DashboardView';
import AnalyticsView    from './components/AnalyticsView';
import HistoryView      from './components/HistoryView';
import SystemHealthView from './components/SystemHealthView';
import SupportView      from './components/SupportView';
import IntelligencePanel from './components/IntelligencePanel';
import Footer           from './components/Footer';
import LandingPage      from './components/LandingPage';
import LoginPage        from './components/LoginPage';
import SettingsPanel    from './components/SettingsPanel';
import AlertsPanel      from './components/AlertsPanel';
import { api }          from './services/api';
import { supabase }     from './supabaseClient';

const POLL_INTERVAL_MS = 30_000; // real-time refresh every 30s

function App() {
  // ── Navigation ───────────────────────────────────────────────
  const [activePage, setActivePage] = useState('grid');
  const [focussedNode, setFocussedNode] = useState(null);

  // ── Data ─────────────────────────────────────────────────────
  const [currentCity,   setCurrentCity]   = useState('Delhi');
  const [gridData,      setGridData]      = useState({ nodes: [], edges: [] });
  const [metrics,       setMetrics]       = useState({ total_nodes: 0, transformers: 0, system_health: 100 });
  const [alerts,        setAlerts]        = useState([]);
  const [history,       setHistory]       = useState([]);
  const [suspiciousTfs, setSuspiciousTfs] = useState([]);
  const [detectionFull, setDetectionFull] = useState({});
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);

  // ── Auth ──────────────────────────────────────────────────────
  const [session,     setSession]     = useState(null);
  const [hasLaunched, setHasLaunched] = useState(false);

  // Derived: logged-in user's email for alert routing
  const userEmail = session?.user?.email || null;

  // ── Panels ────────────────────────────────────────────────────
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [alertsOpen,   setAlertsOpen]   = useState(false);

  // ── Auth listener ─────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setHasLaunched(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Data loader ───────────────────────────────────────────────
  const loadAllData = useCallback(async (city = currentCity) => {
    try {
      setError(null);

      const email = session?.user?.email || null;

      const [grid, currentMetrics, detection, historyData] = await Promise.all([
        api.getGridData(city),
        api.getMetrics(),
        api.getDetectionResults(email),   // forwards email → backend sends alert to this address
        api.getHistory(),
      ]);

      setGridData(grid);
      setMetrics(currentMetrics);
      setAlerts(detection.theft_nodes || detection.anomalies || []);
      setSuspiciousTfs(detection.suspicious_transformers || []);
      setDetectionFull(detection);
      setHistory(historyData || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('No data — upload a dataset to begin.');
    } finally {
      setLoading(false);
    }
  }, [currentCity, session]);

  // Initial load
  useEffect(() => { loadAllData(currentCity); }, [currentCity, loadAllData]);

  // ── Real-time polling ─────────────────────────────────────────
  const pollRef = useRef(null);
  useEffect(() => {
    pollRef.current = setInterval(() => {
      loadAllData(currentCity);
    }, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [currentCity, loadAllData]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleCityChange = (newCity) => {
    if (newCity !== currentCity) {
      setCurrentCity(newCity);
      setGridData({ nodes: [], edges: [] });
      setAlerts([]);
      setFocussedNode(null);
    }
  };

  const handleTheftInjection = async (poles) => {
    try {
      await api.injectTheft(poles);
      await loadAllData(currentCity);
    } catch { setError('Simulation failed.'); }
  };

  const handleManualDetection = async () => {
    try {
      setLoading(true);
      await api.triggerDetection(userEmail);  // force re-run + send email to user
      await loadAllData(currentCity);
    } catch { setError('Detection failed.'); }
    finally { setLoading(false); }
  };

  const handleLocateNode = useCallback((nodeId) => {
    setFocussedNode(nodeId);
    setActivePage("grid");
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // reset so input can fire again with same file
    e.target.value = '';
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      setGridData({ nodes: [], edges: [] });
      await api.uploadData(formData);
      await loadAllData();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Upload failed. Check file format.';
      setError(msg);
    } finally { setLoading(false); }
  };

  // ── Early returns ─────────────────────────────────────────────
  if (!hasLaunched) return <LandingPage onLaunch={() => setHasLaunched(true)} />;
  if (!session)     return <LoginPage />;

  // ── Page renderer ─────────────────────────────────────────────
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardView metrics={metrics} alerts={alerts} gridData={gridData} />;
      case 'analytics':
        return <AnalyticsView detectionData={detectionFull} onLocateNode={handleLocateNode} />;
      case 'history':
        return <HistoryView events={history} onRefresh={() => loadAllData(currentCity)} />;
      case 'health':
        return <SystemHealthView metrics={metrics} detectionData={detectionFull} gridData={gridData} />;
      case 'support':
        return <SupportView />;
      case 'grid':
      default:
        return (
          <>
            <GridView
              nodes={gridData.nodes}
              edges={gridData.edges}
              theftNodes={alerts}
              suspiciousTfs={suspiciousTfs}
              currentCity={currentCity}
              focussedNodeId={focussedNode}
            />

            {/* Action buttons overlay */}
            <div className="absolute bottom-14 left-6 flex gap-3 z-[1000]">
              <button
                id="generate-grid-btn"
                onClick={() => loadAllData(currentCity)}
                className="bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-blue-400/30 flex items-center gap-3 hover:bg-slate-800 transition-all shadow-[0_0_30px_rgba(59,130,246,0.15)] group"
              >
                <span className="material-symbols-outlined text-blue-400 group-hover:rotate-180 transition-transform duration-700 text-sm">refresh</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Refresh Grid</span>
              </button>
              <button
                id="inject-theft-btn"
                onClick={() => {
                  const poles = gridData.nodes.filter(n => n.type === 'pole');
                  if (poles.length > 0) {
                    const pick = poles[Math.floor(Math.random() * poles.length)];
                    handleTheftInjection([pick.id]);
                  }
                }}
                className="bg-slate-900/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-red-400/30 flex items-center gap-3 hover:bg-slate-800 transition-all shadow-[0_0_30px_rgba(244,63,94,0.15)] group"
              >
                <span className="material-symbols-outlined text-red-400 group-hover:scale-125 transition-transform text-sm">bolt</span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Inject Theft</span>
              </button>
            </div>

            <IntelligencePanel
              summary={{
                total_expected_load: gridData.nodes.reduce((a, n) => a + (n.expected_load || 0), 0),
                total_actual_load:   gridData.nodes.reduce((a, n) => a + (n.actual_load   || 0), 0),
                loss_percentage:     Math.max(0, 100 - (metrics.system_health || 100)),
              }}
              history={history}
              theftNodes={alerts}
              suspiciousTfs={suspiciousTfs}
              onLocate={handleLocateNode}
            />
          </>
        );
    }
  };

  return (
    <div className="overflow-hidden text-white bg-[#0b1326] h-screen w-screen relative font-['Inter']">
      {/* ── Top Bar ── */}
      <Header
        onUpload={handleUpload}
        currentCity={currentCity}
        onCityChange={handleCityChange}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAlerts={() => setAlertsOpen(true)}
        alertCount={alerts.length}
        session={session}
      />

      {/* ── Left Sidebar ── */}
      <Sidebar
        metrics={metrics}
        onRefresh={handleManualDetection}
        activeTab={activePage}
        onTabChange={setActivePage}
      />

      {/* ── Error Banner ── */}
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[2000] bg-red-900/40 backdrop-blur-xl border border-red-500/50 px-6 py-3 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl">
          <span className="material-symbols-outlined text-sm">warning</span>
          {error}
          <button
            onClick={() => { setError(null); loadAllData(currentCity); }}
            className="ml-4 underline hover:text-white transition-colors"
          >
            Retry
          </button>
          <button onClick={() => setError(null)} className="text-red-300 hover:text-white ml-1">✕</button>
        </div>
      )}

      {/* ── Loading Overlay (first load only) ── */}
      {loading && !gridData.nodes.length && (
        <div className="absolute inset-0 z-[2000] bg-slate-950/90 backdrop-blur-3xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 translate-y-[-10%]">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 border-4 border-blue-400/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <span className="material-symbols-outlined text-blue-400 text-3xl absolute inset-0 flex items-center justify-center animate-pulse">radar</span>
            </div>
            <div className="text-center">
              <h3 className="text-blue-400 font-black uppercase tracking-[0.4em] text-sm mb-2">Watt Watch Monitoring</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">Synchronizing {currentCity} Grid...</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="ml-72 pt-16 h-screen relative bg-slate-950">
        <div className="h-full w-full transition-all duration-300">
          {renderPage()}
        </div>
      </main>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Panels & Modals ── */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentCity={currentCity}
        onCityChange={handleCityChange}
        onRefresh={() => { handleManualDetection(); setSettingsOpen(false); }}
      />

      <AlertsPanel
        isOpen={alertsOpen}
        onClose={() => setAlertsOpen(false)}
        alerts={alerts}
      />
    </div>
  );
}

export default App;