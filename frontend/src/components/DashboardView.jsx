import React from 'react';

const DashboardView = ({ metrics, alerts, gridData, onLocateNode }) => {
  const lossPercentage = 100 - (metrics.system_health || 100);
  const healthColor = metrics.system_health > 90 ? '#22c55e' : metrics.system_health > 70 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950 text-white scrollbar-hide">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-blue-400 uppercase">System <span className="text-white">Sentinel</span></h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-black mt-1">Grid Integrity & Loss Prevention Node</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:border-blue-500/20 transition-all">
          <div>
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 border border-blue-500/20 text-blue-400">
               <span className="material-symbols-outlined">hub</span>
            </div>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Total Nodes</p>
          </div>
          <p className="text-3xl font-black data-font mt-4 text-white">{(gridData.nodes?.length || 0).toLocaleString()}</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:border-amber-500/20 transition-all">
          <div>
            <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 border border-amber-500/20 text-amber-500">
               <span className="material-symbols-outlined">bolt</span>
            </div>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Active Transformers</p>
          </div>
          <p className="text-3xl font-black data-font mt-4 text-white">
            {gridData.nodes?.filter(n => (n.attributes?.type || n.type || "").toLowerCase().includes('transformer')).length}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:border-emerald-500/20 transition-all">
          <div>
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 border border-emerald-500/20 text-emerald-500">
               <span className="material-symbols-outlined">offline_pin</span>
            </div>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">System Health</p>
          </div>
          <p className="text-3xl font-black data-font mt-4" style={{ color: healthColor }}>{metrics.system_health || 100}%</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between bg-red-500/5 hover:border-red-500/40 transition-all cursor-pointer group" onClick={() => alerts[0] && onLocateNode(alerts[0].id)}>
          <div>
             <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 border border-red-500/20 text-red-500 group-hover:scale-110 transition-transform">
               <span className="material-symbols-outlined">gpp_maybe</span>
            </div>
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest group-hover:text-red-400">Alerts Detected</p>
          </div>
          <p className="text-3xl font-black data-font mt-4 text-red-500">{alerts?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <span className="material-symbols-outlined text-9xl">analytics</span>
          </div>
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 border-b border-white/5 pb-4">Loss Analysis Matrix</h3>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(34,197,94,0.1)]" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#ffffff0a" strokeWidth="4"></circle>
                <circle 
                  cx="18" cy="18" r="16" fill="none" 
                  stroke={healthColor} strokeWidth="4" 
                  strokeDasharray={`${metrics.system_health}, 100`}
                  className="transition-all duration-1000"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black data-font">{metrics.system_health || 100}%</span>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Integrity</span>
              </div>
            </div>
            <div className="flex-1 space-y-8 w-full">
               <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                     <span className="text-slate-500">Grid Revenue Integrity</span>
                     <span className="text-blue-400">{(100 - lossPercentage).toFixed(2)}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${100 - lossPercentage}%` }}></div>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                     <span className="text-slate-500">Unaccounted Energy Loss</span>
                     <span className="text-red-500">{lossPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000" style={{ width: `${lossPercentage}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 border-b border-white/5 pb-4">Intelligence Feed</h3>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {alerts && alerts.length > 0 ? alerts.map((alert, idx) => (
              <div 
                key={idx} 
                onClick={() => onLocateNode(alert.id)}
                className="group bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all hover:-translate-x-1 active:scale-95"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all text-red-500">
                   <span className="material-symbols-outlined text-sm">leak_add</span>
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-black uppercase text-white truncate group-hover:text-red-400 transition-colors tracking-widest">{alert.id}</p>
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter mt-0.5">{alert.area || 'Unknown Sector'}</p>
                </div>
                <span className="material-symbols-outlined text-slate-600 text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 py-8">
                 <span className="material-symbols-outlined text-5xl mb-4 text-emerald-500">verified</span>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Infrastructure Secured • No Active Theft</p>
              </div>
            )}
          </div>
          {alerts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-[9px] text-slate-600 font-bold uppercase text-center tracking-widest">Showing {Math.min(alerts.length, 5)} priority anomalies</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
