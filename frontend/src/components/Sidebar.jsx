import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', icon: 'dashboard',   label: 'Dashboard'     },
  { id: 'grid',      icon: 'grid_view',   label: 'Grid View'     },
  { id: 'analytics', icon: 'analytics',   label: 'Analytics'     },
  { id: 'history',   icon: 'history',     label: 'History'       },
];

const BOTTOM_ITEMS = [
  { id: 'health',  icon: 'dns',          label: 'System Health' },
  { id: 'support', icon: 'help_outline', label: 'Support'       },
];

const NavBtn = ({ item, active, onClick }) => (
  <button
    id={`nav-${item.id}`}
    onClick={() => onClick(item.id)}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-xl group ${
      active
        ? 'bg-blue-500/10 text-blue-400 border-r-4 border-blue-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.07)]'
        : 'text-slate-500 hover:bg-slate-800/50 hover:text-blue-300 border-r-4 border-transparent'
    }`}
  >
    <span
      className={`material-symbols-outlined transition-all duration-200 group-hover:scale-110 ${active ? 'text-blue-400' : ''}`}
      style={{ fontVariationSettings: active ? "'FILL' 1" : '' }}
    >
      {item.icon}
    </span>
    <span className={`text-sm transition-colors ${active ? 'font-black' : 'font-medium'}`}>
      {item.label}
    </span>
    {active && (
      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
    )}
  </button>
);

const Sidebar = ({ metrics, onRefresh, activeTab, onTabChange }) => {
  const totalNodes = metrics?.total_nodes || 0;
  const transformersCount = metrics?.transformers || 0;
  const health = metrics?.system_health ?? 100;
  const healthColor = health >= 90 ? 'text-green-400' : health >= 70 ? 'text-yellow-400' : 'text-red-400';

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-40 bg-slate-900/90 backdrop-blur-2xl w-72 pt-20 pb-10 border-r border-slate-800/50">
      {/* Logo area */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="material-symbols-outlined text-white text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <div>
            <h2 className="text-on-surface font-black text-sm leading-none tracking-tight">Watt Watch</h2>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mt-1">Sentinel Vigil Active</p>
          </div>
        </div>
      </div>

      {/* Primary navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={onTabChange} />
        ))}
      </nav>

      {/* Grid Metrics Mini Card */}
      <div className="px-4 mt-4">
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/20 shadow-lg">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-black mb-4 flex items-center justify-between">
            Grid Metrics
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center group">
              <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">Total Nodes</span>
              <span className="text-xs font-bold text-blue-400">{totalNodes.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">Transformers</span>
              <span className="text-xs font-bold text-slate-300">{transformersCount}</span>
            </div>
            <div className="pt-2 border-t border-slate-700/30 flex justify-between items-center">
              <span className="text-xs text-slate-500">System Health</span>
              <span className={`text-xs font-bold ${healthColor}`}>{health}%</span>
            </div>
          </div>
        </div>

        <button
          id="run-detection-btn"
          onClick={onRefresh}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] active:scale-95 transition-all duration-200"
        >
          Run Full Detection
        </button>
      </div>

      {/* Bottom nav: Health + Support */}
      <div className="mt-4 px-4 space-y-1">
        <div className="h-px bg-slate-800 mx-2 mb-2" />
        {BOTTOM_ITEMS.map(item => (
          <NavBtn key={item.id} item={item} active={activeTab === item.id} onClick={onTabChange} />
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
