import React from 'react';

const DashboardView = ({ metrics, alerts, gridData }) => {
  const lossPercentage = 100 - (metrics.system_health || 100);
  const healthColor = metrics.system_health > 90 ? '#22c55e' : metrics.system_health > 70 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950 text-white scrollbar-hide">
      <header className="mb-8">
        <h1 className="text-2xl font-black tracking-tight text-blue-400">COMMAND <span className="text-white">CENTER</span></h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">Real-time Grid Infrastructure Monitoring</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Metric 1 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-blue-400 mb-4">hub</span>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Nodes</p>
          </div>
          <p className="text-4xl font-black data-font mt-4 text-white">{(gridData.nodes?.length || 0).toLocaleString()}</p>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-orange-400 mb-4">bolt</span>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Transformers</p>
          </div>
          <p className="text-4xl font-black data-font mt-4 text-white">
            {gridData.nodes?.filter(n => n.type.toLowerCase().includes('transformer')).length}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-green-400 mb-4">offline_pin</span>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Health</p>
          </div>
          <p className="text-4xl font-black data-font mt-4" style={{ color: healthColor }}>{metrics.system_health || 100}%</p>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between bg-red-500/5">
          <div>
            <span className="material-symbols-outlined text-red-500 mb-4">gpp_maybe</span>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Alerts Detected</p>
          </div>
          <p className="text-4xl font-black data-font mt-4 text-red-500">{alerts?.length || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8">Loss Analysis Matrix</h3>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
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
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Stability</span>
              </div>
            </div>
            <div className="flex-1 space-y-6">
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-slate-400">Calculated Revenue</span>
                     <span className="text-blue-400">{(100 - lossPercentage).toFixed(2)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${100 - lossPercentage}%` }}></div>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                     <span className="text-slate-400">Total System Loss</span>
                     <span className="text-red-500">{lossPercentage.toFixed(2)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500 rounded-full" style={{ width: `${lossPercentage}%` }}></div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Recent Fleet Alerts</h3>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {alerts && alerts.length > 0 ? alerts.map((alert, idx) => (
              <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                   <span className="material-symbols-outlined text-red-500 text-sm">bolt</span>
                </div>
                <div>
                   <p className="text-xs font-black uppercase text-white">{alert.id}</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">THEFT SUSPECTED • {alert.area}</p>
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 py-8">
                 <span className="material-symbols-outlined text-4xl mb-2">task_alt</span>
                 <p className="text-[10px] font-black uppercase tracking-widest">No Active Anomalies</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
