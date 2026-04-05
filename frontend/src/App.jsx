import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import GridView from './components/GridView';
import AnalyticsView from './components/AnalyticsView';
import HistoryView from './components/HistoryView';
import SystemHealthView from './components/SystemHealthView';
import SupportView from './components/SupportView';
import AlertsPanel from './components/AlertsPanel';
import SettingsPanel from './components/SettingsPanel';
import { getNodes, triggerDetection, uploadLoadCsv } from './services/api';

function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState('grid');
  const [currentCity, setCurrentCity] = useState('Delhi');
  const [isAlertsOpen, setAlertsOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  
  // Data State
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [focussedNodeId, setFocussedNodeId] = useState(null);

  // Synchronize Data
  const fetchData = async () => {
    setLoading(true);
    setStatusMsg("Syncing SmartGrid nodes...");
    try {
      const data = await getNodes();
      // Handle array or object response
      const nodeList = Array.isArray(data) ? data : (data.nodes || []);
      setNodes(nodeList);
      setStatusMsg("");
    } catch (err) {
      console.error(err);
      setStatusMsg("Sync Error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Detection Wrapper
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
    setStatusMsg("Mapping field telemetry...");
    try {
      const data = await uploadLoadCsv(file);
      if (data.status === "success") {
        setStatusMsg(`Telemetry mapping complete: Updated ${data.count} nodes.`);
        await fetchData();
      } else {
        setStatusMsg("Upload failed.");
      }
    } catch (err) {
      setStatusMsg("Upload Error.");
    } finally {
      setLoading(false);
      event.target.value = null;
    }
  };

  // derived metrics for Sidebar/Dashboard
  const metrics = useMemo(() => {
    const total_nodes = nodes.length;
    const transformers = nodes.filter(n => (n.attributes?.type || n.type || '').toLowerCase().includes('transformer')).length;
    const anomalies = nodes.filter(n => (n.attributes?.status || n.status) === 'high_anomaly' || (n.attributes?.status || n.status) === 'medium_anomaly');
    
    // Simple health calculation
    const health = total_nodes > 0 
      ? Math.max(0, 100 - (anomalies.length / total_nodes * 1000)) // Scaled for visibility
      : 100;

    return {
      total_nodes,
      transformers,
      system_health: Math.round(health),
      anomalies: anomalies.length
    };
  }, [nodes]);

  const theftNodes = useMemo(() => {
    return nodes.filter(n => (n.attributes?.status || n.status) === 'high_anomaly' || (n.attributes?.status || n.status) === 'medium_anomaly')
      .map(n => ({
        id: n.v_id || n.id,
        area: n.attributes?.area || n.area || 'Delhi Central',
        expected_load: n.attributes?.expected_load || 0,
        actual_load: n.attributes?.load1 || n.load || 0,
        mismatch: Math.abs((n.attributes?.load1 || n.load || 0) - (n.attributes?.expected_load || 0)),
        confidence: (n.attributes?.status || n.status) === 'high_anomaly' ? 0.95 : 0.65
      }));
  }, [nodes]);

  const locateNode = useCallback((id) => {
    setFocussedNodeId(id);
    setActiveTab('grid');
    setAlertsOpen(false);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#0b1326] text-white flex overflow-hidden font-['Inter']">
      {/* GLOBAL UI ELEMENTS */}
      <Header 
        onUpload={handleFileUpload}
        currentCity={currentCity}
        onCityChange={setCurrentCity}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenAlerts={() => setAlertsOpen(true)}
        alertCount={theftNodes.length}
      />
      
      <Sidebar 
        metrics={metrics}
        onRefresh={handleRunDetection}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 ml-72 mt-16 relative overflow-hidden bg-slate-950">
        {activeTab === 'dashboard' && (
          <DashboardView 
            metrics={metrics} 
            alerts={theftNodes}
            gridData={{ nodes }}
          />
        )}

        {activeTab === 'grid' && (
          <GridView 
            nodes={nodes}
            edges={[]} // Backend doesn't support edges currently
            theftNodes={theftNodes}
            suspiciousTfs={[]} 
            currentCity={currentCity}
            focussedNodeId={focussedNodeId}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView 
            detectionData={{ 
              theft_nodes: theftNodes,
              summary: {
                total_expected_load: nodes.reduce((acc, n) => acc + (n.attributes?.expected_load || 0), 0),
                total_loss: theftNodes.reduce((acc, n) => acc + n.mismatch, 0),
                loss_percentage: (theftNodes.reduce((acc, n) => acc + n.mismatch, 0) / nodes.reduce((acc, n) => acc + (n.attributes?.expected_load || 1), 0)) * 100
              }
            }}
            onLocateNode={locateNode}
          />
        )}

        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'health' && <SystemHealthView metrics={metrics} nodes={nodes} />}
        {activeTab === 'support' && <SupportView />}

        {/* STATUS BAR */}
        {statusMsg && (
          <div className="absolute bottom-6 left-6 glass-panel px-6 py-3 rounded-2xl border border-blue-500/30 z-[3000] flex items-center gap-3 animate-slide-up">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
            <span className="text-[10px] font-black tracking-widest text-blue-100 uppercase">{statusMsg}</span>
          </div>
        )}
      </main>

      {/* OVERLAYS */}
      <AlertsPanel 
        isOpen={isAlertsOpen} 
        onClose={() => setAlertsOpen(false)} 
        alerts={theftNodes}
        onLocateNode={locateNode}
      />
      
      <SettingsPanel 
        isOpen={isSettingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}

export default App;