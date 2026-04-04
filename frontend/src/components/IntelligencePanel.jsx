import React from 'react';

const IntelligencePanel = ({ summary, history, theftNodes, suspiciousTfs }) => {
  const primaryTheft = theftNodes?.[0];

  return (
    <div className="absolute top-6 right-6 bottom-14 w-96 flex flex-col gap-4 z-10 overflow-y-auto pr-2 custom-scrollbar">
      {/* Active Anomaly Alert - Theft */}
      {primaryTheft ? (
        <section className="glass-panel rounded-2xl border border-red-500/30 glow-red overflow-hidden animate-in fade-in slide-in-from-right duration-500">
          <div className="bg-red-500/20 px-5 py-3 flex justify-between items-center border-b border-red-500/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>report</span>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-red-100">Theft Detected</h3>
            </div>
            <span className="text-[10px] data-font font-black text-red-500 bg-red-500/10 px-2 py-0.5 rounded animate-pulse">CRITICAL</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Pole ID</p>
                <p className="data-font text-sm font-black text-white">{primaryTheft.id}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Confidence</p>
                <p className="data-font text-sm font-black text-red-400">{(primaryTheft.confidence * 100).toFixed(1)}%</p>
              </div>
            </div>
            <button className="w-full bg-red-600 text-white font-black text-[10px] uppercase tracking-widest py-3 rounded-xl hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">location_on</span> Dispatch Enforcement
            </button>
          </div>
        </section>
      ) : null}

      {/* Suspicious Transformers */}
      {suspiciousTfs?.length > 0 && (
        <section className="glass-panel rounded-2xl border border-amber-500/30 bg-amber-500/5 overflow-hidden animate-in fade-in slide-in-from-right duration-700">
          <div className="bg-amber-500/20 px-5 py-3 flex justify-between items-center border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-lg">warning</span>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-100">Suspicious Sources</h3>
            </div>
          </div>
          <div className="p-4 space-y-2">
            {suspiciousTfs.map(tfId => (
              <div key={tfId} className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5">
                <div>
                   <p className="text-xs font-bold text-white uppercase">{tfId}</p>
                   <p className="text-[8px] text-slate-400 uppercase tracking-tighter">Leakage detected in downstream poles</p>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-sm">chevron_right</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {(!primaryTheft && suspiciousTfs?.length === 0) && (
        <section className="glass-panel rounded-2xl border border-blue-400/20 p-6 flex flex-col items-center justify-center gap-3 opacity-60">
           <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400 text-2xl">verified_user</span>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Grid Integrity Secure</p>
        </section>
      )}

      {/* Load Analytics */}
      <section className="glass-panel rounded-2xl border border-outline-variant/10 p-6 shadow-2xl">
        <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black mb-6">Load Differential (kW)</h3>
        <div className="space-y-5">
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">Expected Load</span>
              <span className="text-[10px] data-font font-black">{summary?.total_expected_load || 0} kW</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">Actual Load</span>
              <span className={`text-[10px] data-font font-black ${summary?.total_loss > 0 ? 'text-error' : 'text-blue-400'}`}>
                {summary?.total_actual_load || 0} kW
              </span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${summary?.total_loss > 0 ? 'bg-error' : 'bg-blue-400'}`} 
                style={{ width: `${Math.min((summary?.total_actual_load / summary?.total_expected_load) * 100, 100) || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-8">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#222a3d" strokeWidth="3"></path>
              <path 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" stroke="#adc6ff" strokeDasharray={`${100 - (summary?.loss_percentage || 0)}, 100`} 
                strokeWidth="3" className="transition-all duration-1000"
              ></path>
              <path 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" stroke="#ffb4ab" strokeDasharray={`${summary?.loss_percentage || 0}, 100`} 
                strokeDashoffset={`-${100 - (summary?.loss_percentage || 0)}`}
                strokeWidth="4" className="transition-all duration-1000"
              ></path>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[7px] text-on-surface-variant font-black uppercase leading-none">Integrity</span>
              <span className="text-[12px] data-font font-black leading-none">{100 - (summary?.loss_percentage || 0).toFixed(0)}%</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(100,150,255,0.4)]"></div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Revenue: {(100 - (summary?.loss_percentage || 0)).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_8px_rgba(255,100,100,0.4)]"></div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Loss: {summary?.loss_percentage || 0}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* History Panel */}
      <section className="glass-panel rounded-2xl border border-outline-variant/10 flex-1 flex flex-col min-h-0 shadow-2xl">
        <div className="p-5 border-b border-outline-variant/10 flex justify-between items-center">
          <h3 className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">System Terminal</h3>
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
        </div>
        <div className="p-5 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
          {history?.length > 0 ? history.slice().reverse().map((item, idx) => (
            <div key={idx} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2">
              <div className="flex-shrink-0 w-1 bg-blue-500 group-hover:bg-error transition-colors rounded-full"></div>
              <div>
                <p className="data-font text-[9px] font-black text-blue-400 group-hover:text-error transition-colors">
                  {new Date(item.time).toLocaleTimeString()}
                </p>
                <p className="text-[11px] text-on-surface font-medium mt-1 leading-relaxed">
                  Theft detected at node <span className="font-black text-blue-300">{item.pole}</span>. 
                  Confidence level: <span className="font-black text-error">{(item.confidence * 100).toFixed(1)}%</span>
                </p>
              </div>
            </div>
          )) : (
            <div className="h-full flex items-center justify-center py-10 opacity-30">
               <p className="text-[10px] font-black uppercase tracking-widest">No logs found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default IntelligencePanel;
