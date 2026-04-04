import React from 'react';

const Sidebar = ({ metrics, onRefresh, activeTab, onTabChange }) => {
  const totalNodes = metrics?.total_nodes || 0;
  const transformersCount = metrics?.transformers || 0;
  const health = metrics?.system_health || 0;

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-slate-900/90 backdrop-blur-2xl w-72 pt-20 pb-10">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <div>
            <h2 className="text-on-surface font-black text-sm leading-none tracking-tight">PhantomNode</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Sentinel Vigil Active</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <button 
          onClick={() => onTabChange("dashboard")}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-xl ${
            activeTab === "dashboard" 
            ? "bg-blue-500/10 text-blue-400 border-r-4 border-blue-500" 
            : "text-slate-500 hover:bg-slate-800/50 hover:text-blue-300"
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: activeTab === "dashboard" ? "'FILL' 1" : "" }}>dashboard</span>
          <span className="font-bold text-sm">Dashboard</span>
        </button>
        <button 
          onClick={() => onTabChange("grid")}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-xl ${
            activeTab === "grid" 
            ? "bg-blue-500/10 text-blue-400 border-r-4 border-blue-500" 
            : "text-slate-500 hover:bg-slate-800/50 hover:text-blue-300"
          }`}
        >
          <span className="material-symbols-outlined">grid_view</span>
          <span className="font-medium text-sm">Grid View</span>
        </button>
        <button 
          onClick={() => onTabChange("analytics")}
          className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 rounded-xl ${
            activeTab === "analytics" 
            ? "bg-blue-500/10 text-blue-400 border-r-4 border-blue-500" 
            : "text-slate-500 hover:bg-slate-800/50 hover:text-blue-300"
          }`}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-medium text-sm">Analytics</span>
        </button>
        <a className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-800/50 hover:text-blue-300 transition-all duration-300" href="#">
          <span className="material-symbols-outlined">history</span>
          <span className="font-medium text-sm">History</span>
        </a>
      </nav>
      {/* Grid Metrics Card */}
      <div className="px-4 mt-6">
        <div className="bg-surface-container p-4 rounded-xl border border-outline-variant/10 shadow-lg">
          <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-4 flex items-center justify-between">
            Grid Metrics
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center group">
              <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">Total Nodes</span>
              <span className="data-font text-xs font-bold text-blue-400">{totalNodes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-xs text-on-surface-variant group-hover:text-on-surface transition-colors">Transformers</span>
              <span className="data-font text-xs font-bold text-on-surface">{transformersCount}</span>
            </div>
            <div className="pt-2 border-t border-outline-variant/10 flex justify-between items-center">
              <span className="text-xs text-on-surface-variant">System Health</span>
              <span className="data-font text-xs font-bold text-blue-400">
                {health}%
              </span>
            </div>
          </div>
        </div>
        <button 
          onClick={onRefresh}
          className="w-full mt-4 bg-primary text-on-primary font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(173,198,255,0.4)] hover:brightness-110 transition-all transform active:scale-95"
        >
          Run Full Detection
        </button>
      </div>
      <div className="mt-auto px-4 space-y-1">
        <a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-on-surface text-[10px] uppercase tracking-widest font-bold transition-colors" href="#">
          <span className="material-symbols-outlined text-lg">dns</span>
          System Health
        </a>
        <a className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-on-surface text-[10px] uppercase tracking-widest font-bold transition-colors" href="#">
          <span className="material-symbols-outlined text-lg">help_outline</span>
          Support
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
