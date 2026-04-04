import React from 'react';

const HistoryView = ({ events = [], onRefresh }) => {
  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch { return iso; }
  };

  const getColor = (conf) => {
    if (conf >= 0.7) return { card: 'text-red-400 bg-red-500/10 border-red-500/30', dot: 'bg-red-500',    label: 'HIGH'   };
    if (conf >= 0.4) return { card: 'text-orange-400 bg-orange-500/10 border-orange-500/30', dot: 'bg-orange-500', label: 'MEDIUM' };
    return               { card: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30', dot: 'bg-yellow-500', label: 'LOW'    };
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950 text-white">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-blue-400">
            DETECTION <span className="text-white">HISTORY</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">
            Chronological Anomaly Log
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-2xl border border-slate-700/30">
            <span className="material-symbols-outlined text-blue-400 text-sm">history</span>
            <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
              {events.length} Events
            </span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              id="history-refresh-btn"
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400 hover:bg-blue-500/20 transition-all text-[11px] font-black uppercase tracking-wider"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh
            </button>
          )}
        </div>
      </header>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 opacity-30">
          <span className="material-symbols-outlined text-5xl mb-4">history</span>
          <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">No History Yet</p>
          <p className="text-[10px] text-slate-500 mt-2">Inject theft or run detection to build a log</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-slate-800" />
          <div className="space-y-4">
            {events.map((ev, i) => {
              const conf = typeof ev.confidence === 'number' ? ev.confidence : 0;
              const { card, dot, label } = getColor(conf);

              return (
                <div key={i} className="flex items-start gap-5 pl-1">
                  {/* Timeline dot */}
                  <div className={`w-5 h-5 rounded-full border-2 border-slate-950 flex-shrink-0 mt-1.5 z-10 ${dot}`} />

                  {/* Card */}
                  <div className={`flex-1 border rounded-2xl p-4 ${card}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black text-sm text-white">{ev.id || ev.pole || '—'}</p>
                        <p className="text-[10px] uppercase tracking-wider font-bold mt-0.5 opacity-70">
                          {ev.area || '—'} · {ev.transformer || 'Unknown transformer'}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-black text-lg">{(conf * 100).toFixed(1)}%</p>
                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-70">Confidence</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full mt-1 inline-block ${
                          label === 'HIGH'   ? 'bg-red-500/20 text-red-400'    :
                          label === 'MEDIUM' ? 'bg-orange-500/20 text-orange-400' :
                                               'bg-yellow-500/20 text-yellow-400'
                        }`}>{label}</span>
                      </div>
                    </div>

                    {/* Load details if available */}
                    {ev.expected_load !== undefined && (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase">Expected</p>
                          <p className="text-[11px] font-bold text-white">{(ev.expected_load || 0).toFixed(2)} kW</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase">Actual</p>
                          <p className="text-[11px] font-bold text-white">{(ev.actual_load || 0).toFixed(2)} kW</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase">Mismatch</p>
                          <p className="text-[11px] font-bold text-red-400">+{(ev.mismatch || 0).toFixed(2)} kW</p>
                        </div>
                      </div>
                    )}

                    {/* Confidence bar */}
                    <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          conf >= 0.7 ? 'bg-red-500' : conf >= 0.4 ? 'bg-orange-400' : 'bg-yellow-400'
                        }`}
                        style={{ width: `${Math.min(conf * 100, 100)}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-slate-500 mt-3 font-mono">{formatTime(ev.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
