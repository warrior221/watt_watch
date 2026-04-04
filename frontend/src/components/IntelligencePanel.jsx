import React from 'react';

const IntelligencePanel = ({ summary, history, theftNodes, suspiciousTfs, onLocate }) => {
  const primaryTheft = theftNodes?.[0];

  return (
    <div className="absolute top-24 right-6 bottom-6 w-96 flex flex-col gap-4 z-[1000] overflow-y-auto pr-2 custom-scrollbar">
      {/* Active Anomaly Alert - Theft */}
      {primaryTheft ? (
        <section 
          onClick={() => onLocate(primaryTheft.id)}
          className="glass-panel rounded-2xl border border-red-500/30 glow-red overflow-hidden animate-in fade-in slide-in-from-right duration-500 cursor-pointer group hover:border-red-500/60 transition-all"
        >
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
                <p className="data-font text-sm font-black text-white group-hover:text-red-400 transition-colors">{primaryTheft.id}</p>
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
          <div className="p-3 space-y-2 overflow-y-auto max-h-[15rem] custom-scrollbar">
            {suspiciousTfs.map(tfId => (
              <div 
                key={tfId} 
                onClick={() => onLocate(tfId)}
                className="flex items-center justify-between bg-slate-900/40 p-3 rounded-xl border border-white/5 cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/30 transition-all group"
              >
                <div>
                   <p className="text-xs font-bold text-white uppercase group-hover:text-amber-400 transition-colors">{tfId}</p>
                   <p className="text-[8px] text-slate-400 uppercase tracking-tighter">Leakage detected in downstream poles</p>
                </div>
                <span className="material-symbols-outlined text-amber-500 text-sm group-hover:translate-x-1 transition-transform">chevron_right</span>
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
      <section className="glass-panel rounded-2xl border border-outline-variant/10 p-3 shadow-2xl shrink-0">
        <h3 className="text-[9px] uppercase tracking-widest text-on-surface-variant font-black mb-3">Load Differential (kW)</h3>
        <div className="space-y-3">
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">Expected Load</span>
              <span className="text-[10px] data-font font-black">{(summary?.total_expected_load || 0).toFixed(2)} kW</span>
            </div>
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="relative">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tight">Actual Load</span>
              <span className={`text-[10px] data-font font-black ${summary?.total_loss > 0 ? 'text-error' : 'text-blue-400'}`}>
                {(summary?.total_actual_load || 0).toFixed(2)} kW
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
        
        <div className="mt-4 flex items-center justify-center gap-5">
          <div className="relative w-16 h-16">
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
              <span className="text-[10px] data-font font-black leading-none">{100 - (summary?.loss_percentage || 0).toFixed(0)}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(100,150,255,0.4)]"></div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Revenue: {(100 - (summary?.loss_percentage || 0)).toFixed(1)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-error shadow-[0_0_8px_rgba(255,100,100,0.4)]"></div>
              <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-widest">Loss: {(summary?.loss_percentage || 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default IntelligencePanel;
