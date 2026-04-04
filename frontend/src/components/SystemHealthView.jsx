import React from 'react';

const Gauge = ({ value, max = 100, color, label, unit = '%' }) => {
  const pct = Math.min((value / max) * 100, 100);
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#ffffff08" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color }}>{value}{unit}</span>
          <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">{label}</span>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ health }) => {
  if (health >= 90) return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-green-400 font-black text-xs uppercase tracking-widest">Healthy</span>
    </div>
  );
  if (health >= 70) return (
    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full">
      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
      <span className="text-yellow-400 font-black text-xs uppercase tracking-widest">Warning</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      <span className="text-red-400 font-black text-xs uppercase tracking-widest">Critical</span>
    </div>
  );
};

const SystemHealthView = ({ metrics, detectionData, gridData }) => {
  const health     = metrics?.system_health ?? 100;
  const lossPct    = Math.max(0, 100 - health);
  const color      = health >= 90 ? '#22c55e' : health >= 70 ? '#f59e0b' : '#f43f5e';

  const totalExpected = detectionData?.summary?.total_expected_load ?? 0;
  const totalActual   = detectionData?.summary?.total_actual_load   ?? 0;
  const totalLoss     = detectionData?.summary?.total_loss          ?? 0;
  const severity      = detectionData?.summary?.severity            ?? 'low';

  const nodes = gridData?.nodes || [];
  const poles        = nodes.filter(n => n.type?.toLowerCase() === 'pole').length;
  const transformers = nodes.filter(n => n.type?.toLowerCase() === 'transformer').length;
  const plants       = nodes.filter(n => n.type?.toLowerCase() === 'powerplant').length;

  const checks = [
    { label: 'API Backend', ok: true,         detail: 'FastAPI running on :8000' },
    { label: 'Grid Data',   ok: nodes.length > 0, detail: nodes.length > 0 ? `${nodes.length} nodes loaded` : 'No dataset uploaded' },
    { label: 'Detection',   ok: totalExpected > 0, detail: totalExpected > 0 ? 'Detection engine active' : 'Awaiting first run' },
    { label: 'Loss Alert',  ok: lossPct < 20,  detail: lossPct < 20 ? 'Within normal range' : 'High loss detected' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950 text-white">
      {/* Title */}
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-blue-400">
            SYSTEM <span className="text-white">HEALTH</span>
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">
            Real-time Grid Diagnostics
          </p>
        </div>
        <StatusBadge health={health} />
      </header>

      {/* Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/3 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl">
          <Gauge value={health} color={color} label="Health" />
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">System Stability</p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl">
          <Gauge value={lossPct.toFixed(1)} max={100} color="#f43f5e" label="Loss" />
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">Power Loss</p>
        </div>
        <div className="bg-white/3 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl">
          <Gauge value={nodes.length} max={Math.max(nodes.length, 100)} color="#60a5fa" label="Nodes" unit="" />
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">Infrastructure Size</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Load Analysis */}
        <div className="bg-white/3 border border-white/5 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Load Analysis</h3>
          <div className="space-y-5">
            {[
              { label: 'Expected Load', value: totalExpected.toFixed(2), unit: 'kW', color: 'bg-blue-500', pct: 100 },
              { label: 'Actual Load',   value: totalActual.toFixed(2),   unit: 'kW', color: 'bg-green-500', pct: totalExpected > 0 ? (totalActual / totalExpected) * 100 : 0 },
              { label: 'Total Loss',    value: totalLoss.toFixed(2),     unit: 'kW', color: 'bg-red-500',   pct: totalExpected > 0 ? (totalLoss / totalExpected) * 100 : 0 },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="text-white">{row.value} <span className="text-slate-500">{row.unit}</span></span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${row.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min(row.pct, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Node Breakdown */}
        <div className="bg-white/3 border border-white/5 rounded-3xl p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Node Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Power Plants', count: plants,       icon: 'bolt',         color: 'text-yellow-400 bg-yellow-500/10' },
              { label: 'Transformers', count: transformers, icon: 'electrical_services', color: 'text-orange-400 bg-orange-500/10' },
              { label: 'Poles',        count: poles,        icon: 'location_on',  color: 'text-blue-400 bg-blue-500/10' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.color}`}>
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-300">{item.label}</span>
                </div>
                <span className="text-xl font-black text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Checks */}
      <div className="bg-white/3 border border-white/5 rounded-3xl p-6 shadow-xl">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5">System Diagnostics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checks.map(check => (
            <div key={check.label} className="flex items-center gap-4 bg-white/3 rounded-xl px-4 py-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${check.ok ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                <span className={`material-symbols-outlined text-sm ${check.ok ? 'text-green-400' : 'text-red-400'}`}>
                  {check.ok ? 'check_circle' : 'error'}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{check.label}</p>
                <p className="text-[10px] text-slate-500">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemHealthView;
