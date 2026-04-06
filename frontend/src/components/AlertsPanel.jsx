import React from 'react';

const severityMeta = (confidence) => {
  if (confidence >= 0.7) return { label: 'HIGH', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', dot: 'bg-red-500' };
  if (confidence >= 0.4) return { label: 'MEDIUM', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', dot: 'bg-orange-500' };
  return { label: 'LOW', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', dot: 'bg-yellow-500' };
};

const AlertsPanel = ({ isOpen, onClose, alerts = [], onLocateNode }) => {
  if (!isOpen) return null;

  const high   = alerts.filter(a => a.confidence >= 0.7).length;
  const medium = alerts.filter(a => a.confidence >= 0.4 && a.confidence < 0.7).length;
  const low    = alerts.filter(a => a.confidence < 0.4).length;

  return (
    <>
      <div className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-96 z-[9001] bg-slate-950 border-l border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center relative">
              <span className="material-symbols-outlined text-red-400 text-lg">notifications_active</span>
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
            <h2 className="text-white font-black text-sm uppercase tracking-widest">Anomaly Alerts</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-6 py-4 border-b border-slate-800 grid grid-cols-3 gap-3">
          {[
            { label: 'Critical', count: high, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Medium', count: medium, countStr: medium, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'Low', count: low, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
              <p className={`text-xl font-black ${s.color}`}>{s.count}</p>
              <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Alerts list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
              <span className="material-symbols-outlined text-5xl mb-3">task_alt</span>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">No Active Anomalies</p>
              <p className="text-[10px] text-slate-500 mt-1">Grid operating normally</p>
            </div>
          ) : (
            alerts.map((alert, idx) => {
              const sev = severityMeta(alert.confidence || 0);
              const timeStr = alert.time ? new Date(alert.time).toLocaleTimeString('en-IN', { timeStyle: 'short' }) : 'Now';
              return (
                <div 
                  key={idx} 
                  onClick={() => { onLocateNode(alert.id); onClose(); }}
                  className={`${sev.bg} border ${sev.border} rounded-2xl p-4 flex items-start gap-4 cursor-pointer hover:brightness-125 hover:scale-[1.02] active:scale-95 transition-all group`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${sev.dot} animate-pulse shadow-[0_0_8px_currentColor]`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-black text-white truncate group-hover:text-blue-400 transition-colors uppercase tracking-wider">{alert.id}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-slate-500 font-bold uppercase">{timeStr}</span>
                        <span className={`text-[9px] font-black uppercase tracking-wider ${sev.color}`}>
                          {sev.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                      {alert.area || '—'} • {alert.transformer || 'Unknown Substation'}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                        <p className="text-[8px] text-slate-550 uppercase font-black tracking-widest mb-0.5">Mismatch</p>
                        <p className="text-xs font-black text-white">{(alert.mismatch || 0).toFixed(2)} <span className="text-[9px] opacity-40">kW</span></p>
                      </div>
                      <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                        <p className="text-[8px] text-slate-550 uppercase font-black tracking-widest mb-0.5">Confidence</p>
                        <p className={`text-xs font-black ${sev.color}`}>{((alert.confidence || 0) * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                    {/* Confidence bar */}
                    <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          alert.confidence >= 0.7 ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : alert.confidence >= 0.4 ? 'bg-orange-400' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${Math.min((alert.confidence || 0) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};

export default AlertsPanel;
