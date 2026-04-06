import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050b14] text-white relative overflow-hidden font-['Inter']">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#08162e_1px,transparent_1px),linear-gradient(to_bottom,#08162e_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-10 h-24">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
            <span className="material-symbols-outlined text-white">bolt</span>
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Watt <span className="text-blue-500">Watch</span></span>
        </div>
        <div className="flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">Documentation</a>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
          >
            Operator Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-10 pt-20 pb-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">System v4.2.0 Online</span>
          </div>
          <h1 className="text-7xl font-black tracking-tighter leading-[0.9] text-white">
            SENTINEL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">OF THE GRID.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Protecting national infrastructure through autonomous Graph AI. 
            Real-time anomaly detection, predictive maintenance, and theft mitigation 
            for the next generation of smart energy grids.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_20px_40px_rgba(37,99,235,0.3)] transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3"
            >
              Initialize Node Console
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button className="px-10 py-4 text-slate-400 font-bold hover:text-white transition-colors text-xs uppercase tracking-widest">
              View Case Studies
            </button>
          </div>
        </div>

        {/* Status Dashboard Preview */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full group-hover:bg-blue-500/30 transition-all duration-1000"></div>
          <div className="relative glass-panel rounded-[2rem] border border-white/10 p-2 shadow-2xl overflow-hidden backdrop-blur-3xl transform hover:rotate-1 transition-transform duration-700">
             <div className="bg-[#0b1326] rounded-[1.5rem] p-8 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                   <p className="text-xs font-black uppercase tracking-widest text-slate-500">Live Infrastructure Status</p>
                   <span className="text-[10px] bg-green-500/10 text-green-500 px-3 py-1 rounded-full font-bold border border-green-500/20">Operational</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Efficiency</p>
                      <p className="text-3xl font-black text-white">98.4<span className="text-sm text-blue-400">%</span></p>
                   </div>
                   <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-2">Nodes Active</p>
                      <p className="text-3xl font-black text-white">7,000</p>
                   </div>
                </div>
                <div className="space-y-3 pt-2">
                   <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Threat Level</span>
                      <span>Low</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 w-[15%]"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>

      {/* Description Panel / How it Works */}
      <section id="how-it-works" className="relative z-10 px-10 py-32 bg-white/5 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Deep Intelligence</h2>
             <p className="text-4xl font-black text-white tracking-tighter">How Watt Watch Pro Works</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6 p-8 glass-panel rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-500">
                <span className="material-symbols-outlined text-blue-400 group-hover:text-white">account_tree</span>
              </div>
              <h3 className="text-xl font-bold">TigerGraph Synergy</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Natively built on a high-concurrency Graph Database. We map relationships between power plants, 
                transformers, and poles with sub-millisecond traversal speeds.
              </p>
            </div>

            <div className="space-y-6 p-8 glass-panel rounded-3xl border border-white/5 hover:border-cyan-500/30 transition-all group">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:scale-110 transition-all duration-500">
                <span className="material-symbols-outlined text-cyan-400 group-hover:text-white">neurology</span>
              </div>
              <h3 className="text-xl font-bold">Isolation Forest ML</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our models analyze load-to-expectation ratios in real-time, instantly identifying 
                non-linear deviations that indicate energy theft or hardware failure.
              </p>
            </div>

            <div className="space-y-6 p-8 glass-panel rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500 group-hover:scale-110 transition-all duration-500">
                <span className="material-symbols-outlined text-purple-400 group-hover:text-white">satellite_alt</span>
              </div>
              <h3 className="text-xl font-bold">Sentinel Map Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Advanced Canvas-based spatial visualization capable of handling millions of telemetry points 
                simultaneously without browser lag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-10 py-20 border-t border-white/5 text-center">
         <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.5em]">Antigravity Systems &copy; 2026 • Secure Infrastructure Node</p>
      </footer>
    </div>
  );
};

export default LandingPage;
