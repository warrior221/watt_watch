import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

const AnalyticsView = ({ detectionData, onLocateNode }) => {
  const { theft_nodes = [], summary = {} } = detectionData || {};
  
  // Group data by area for Bar Chart
  const areaData = useMemo(() => {
    const areas = {};
    theft_nodes.forEach(node => {
      if (!areas[node.area]) {
        areas[node.area] = { area: node.area, expected_load: 0, actual_load: 0, mismatch: 0, representativeNode: node.id };
      }
      areas[node.area].expected_load += node.expected_load;
      areas[node.area].actual_load += node.actual_load;
      areas[node.area].mismatch += node.mismatch;
    });
    return Object.values(areas).sort((a, b) => b.mismatch - a.mismatch);
  }, [theft_nodes]);

  // Pie Chart Data (Normal vs Loss)
  const pieData = [
    { name: 'Normal', value: summary.total_expected_load || 0 },
    { name: 'Loss', value: summary.total_loss || 0 }
  ];

  const COLORS = ['#3b82f6', '#f43f5e'];

  // Severity Logic
  const lossPercent = summary.loss_percentage || 0;
  const severity = lossPercent < 5 ? 'Low' : lossPercent < 15 ? 'Medium' : 'High';
  const severityColor = severity === 'Low' ? '#22c55e' : severity === 'Medium' ? '#eab308' : '#f43f5e';

  // Stats
  const mostAffectedArea = areaData[0]?.area || 'N/A';
  const worstNode = [...theft_nodes].sort((a, b) => b.mismatch - a.mismatch)[0];

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-950 text-white scrollbar-hide">
      <header className="mb-10 flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-black tracking-tight text-blue-400">DATA <span className="text-white">INTELLIGENCE</span></h1>
           <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-1">Advanced Anomaly Analytics Dashboard</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Severity</span>
           <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: severityColor }}></div>
              <span className="text-xs font-black uppercase" style={{ color: severityColor }}>{severity}</span>
           </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:border-blue-500/30 transition-colors group cursor-default">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-blue-400 transition-colors">Total Grid Loss</p>
           <p className="text-3xl font-black data-font mt-4 text-white">{summary.total_loss?.toFixed(2) || 0} <span className="text-sm font-medium text-slate-500">kW</span></p>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between hover:border-red-500/30 transition-colors group cursor-default">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-red-400 transition-colors">Loss Percentage</p>
           <p className="text-3xl font-black data-font mt-4 text-white">{lossPercent.toFixed(2)} %</p>
        </div>
        <div className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between group">
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-amber-400 transition-colors">Anomaly Count</p>
           <p className="text-3xl font-black data-font mt-4 text-white">{theft_nodes.length}</p>
        </div>
        <div 
          onClick={() => areaData[0]?.representativeNode && onLocateNode(areaData[0].representativeNode)}
          className="glass-panel p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col justify-between group cursor-pointer hover:border-purple-400 transition-colors animate-pulse"
        >
           <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest group-hover:text-purple-400 transition-colors">Most Affected Area</p>
           <p className="text-xl font-bold mt-4 text-white truncate uppercase">{mostAffectedArea}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Bar Chart */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center justify-between">
              Load Mismatch by Area
              <span className="material-symbols-outlined text-sm text-blue-500">bar_chart</span>
           </h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="area" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                       itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
                    <Bar name="Expected Load (kW)" dataKey="expected_load" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar name="Actual Load (kW)" dataKey="actual_load" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Pie Chart */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center justify-between">
              Infrastructure Integrity
              <span className="material-symbols-outlined text-sm text-green-500">pie_chart</span>
           </h3>
           <div className="h-[300px] w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={pieData}
                       innerRadius={80}
                       outerRadius={110}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                    />
                 </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <span className="text-2xl font-black data-font">{(100 - lossPercent).toFixed(1)}%</span>
                 <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Integrity</span>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl overflow-hidden">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Critical Vulnerabilities</h3>
            <div className="space-y-4">
               {areaData.slice(0, 4).map((area, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => onLocateNode(area.representativeNode)}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-red-500/10 hover:border-red-500/30 transition-all group"
                   >
                     <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-500 group-hover:text-red-400">{idx + 1}</span>
                        <span className="text-xs font-bold uppercase group-hover:text-white">{area.area}</span>
                     </div>
                     <span className="text-xs font-black text-red-400 data-font">+{((area.mismatch / area.expected_load) * 100).toFixed(1)}% Leakage</span>
                  </div>
               ))}
            </div>
         </div>

         <div 
          onClick={() => worstNode && onLocateNode(worstNode.id)}
          className="glass-panel p-8 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-red-500/40 transition-all"
         >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
               <span className="material-symbols-outlined text-8xl text-red-500 group-hover:scale-110 transition-transform">warning</span>
            </div>
            <div>
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 group-hover:text-red-400 transition-colors">Worst Performing Node</h3>
               {worstNode ? (
                  <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 group-hover:bg-red-500/20 transition-all">
                     <p className="text-xs font-black uppercase text-red-400 mb-1">{worstNode.id}</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-4">{worstNode.area}</p>
                     <div className="flex items-end justify-between">
                        <div>
                           <p className="text-2xl font-black data-font text-white">{worstNode.mismatch.toFixed(2)} kW</p>
                           <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Total Theft Load</p>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-red-500">{(worstNode.confidence * 100).toFixed(0)}%</p>
                           <p className="text-[8px] font-bold uppercase tracking-widest text-slate-500">Confidence</p>
                        </div>
                     </div>
                  </div>
               ) : (
                  <p className="text-xs text-slate-500 italic">No nodes flagged for theft.</p>
               )}
            </div>
            <div className="w-full mt-6 bg-red-600 group-hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all border border-red-400/20 text-center shadow-lg shadow-red-900/20">
               Locate Critical Anomaly
            </div>
         </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
