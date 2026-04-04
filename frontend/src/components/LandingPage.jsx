import React from 'react';

const LandingPage = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-[#050B14] text-slate-200 font-['Inter'] selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#050B14]/90 backdrop-blur-lg border-b border-cyan-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-cyan-500 text-3xl drop-shadow-[0_0_10px_rgba(8,145,178,0.8)]">admin_panel_settings</span>
            <div>
              <span className="text-2xl font-black tracking-tighter text-white drop-shadow-md">Watt<span className="text-cyan-400">Watch</span></span>
            </div>
            <div className="hidden lg:flex items-center ml-4 px-3 py-1 bg-cyan-950/40 border border-cyan-800/50 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse mr-2 shadow-[0_0_5px_#22d3ee]"></span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-cyan-300 font-bold">Government Grade Monitoring System</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">About</a>
            <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">Framework</a>
          </div>
          <button onClick={onLaunch} className="group relative px-6 py-2.5 bg-gradient-to-r from-cyan-700 to-blue-800 hover:from-cyan-600 hover:to-blue-700 text-white rounded-[4px] border border-cyan-500/50 text-xs font-black uppercase tracking-[0.15em] transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.6)]">
            <span className="relative z-10 flex items-center gap-2">
              Launch Dashboard <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-24 px-6 min-h-[95vh] flex items-center">
        {/* Abstract cyber grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#08162e_1px,transparent_1px),linear-gradient(to_bottom,#08162e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid xl:grid-cols-2 gap-16 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-slate-900/80 border border-slate-700/80 backdrop-blur-sm">
              <span className="material-symbols-outlined text-cyan-400 text-sm">public</span>
              <span className="text-[10px] text-slate-300 font-bold tracking-[0.1em] uppercase">National Infrastructure Security Initiative</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white drop-shadow-xl">
              Smart Electricity Monitoring<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">for Modern Cities</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-light">
              Detect anomalies, prevent power theft, and ensure grid integrity using real-time intelligence and advanced flow analysis. Built for municipal authority scale.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onLaunch} 
                className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md font-black uppercase tracking-[0.2em] text-[11px] transition-all shadow-[0_0_25px_rgba(8,145,178,0.4)] hover:shadow-[0_0_40px_rgba(8,145,178,0.6)] flex items-center gap-3 border border-cyan-400/50 hover:-translate-y-1"
              >
                Launch System <span className="material-symbols-outlined text-lg">launch</span>
              </button>
              <button className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white rounded-md font-bold uppercase tracking-[0.2em] text-[11px] transition-all border border-slate-700 hover:border-slate-500 flex items-center gap-3 backdrop-blur-sm hover:-translate-y-1">
                View Demo <span className="material-symbols-outlined text-lg">play_circle</span>
              </button>
            </div>
          </div>
          
          <div className="relative w-full aspect-square md:aspect-video xl:aspect-[4/3]">
            {/* Visual representation of grid / Cyber Map */}
            <div className="absolute inset-0 bg-[#060D1A] border border-cyan-900/60 rounded-xl p-2 shadow-[0_0_60px_rgba(8,145,178,0.2)]">
               <div className="w-full h-full rounded-lg bg-slate-950 relative overflow-hidden border border-slate-800">
                 {/* Map Base Image */}
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAf6HrComrePwB6llkWE-ut3hLqPEd7Mov35GrNJDRuYO1ZYqb5HWBvAvHBhOgFs9mZMk3j-B7EOBnkXgqu2ogKqezo8EokomfX9uErlUQgZ0qTeEaCLExBam7e_TP4huNeMveuE3ssUxm35oLwpSc96kLbyNLxodUoUrcdSmvH3SA0JpoGTwADv5vSdMIZ9pEjAMkCIm-eAV9FRv8wd7Bd36tAKvPSdWwjDEreOvxhPuzuo10AxsTl8kuyY9hK2AFrb5n2L59DYju" alt="Map Grid Background" className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-125 contrast-150 mix-blend-screen" />
                 
                 {/* Grid lines overlay */}
                 <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="20" y1="30" x2="50" y2="50" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="1 1" />
                    <line x1="50" y1="50" x2="80" y2="40" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="1 1" />
                    <line x1="50" y1="50" x2="45" y2="80" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="2 1" className="animate-pulse" />
                    <line x1="80" y1="40" x2="90" y2="70" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="1 1" />
                 </svg>
                 
                 {/* Fake nodes */}
                 <div className="absolute top-[28%] left-[19%] w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_#22c55e]"></div>
                 <div className="absolute top-[48%] left-[49%] w-5 h-5 bg-cyan-400 rounded-full shadow-[0_0_20px_#22d3ee] animate-pulse flex items-center justify-center">
                   <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                 </div>
                 <div className="absolute top-[39%] left-[79%] w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_#06b6d4]"></div>
                 <div className="absolute top-[69%] left-[89%] w-2 h-2 bg-blue-500 rounded-full"></div>
                 
                 {/* Red Anomaly Node */}
                 <div className="absolute top-[78%] left-[44%] z-20">
                    <div className="relative">
                      <div className="w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_#ef4444]"></div>
                      <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                    </div>
                 </div>
                 
                 {/* UI Info Box Overlay */}
                 <div className="absolute bottom-5 left-5 bg-[#050B14]/90 border border-slate-700 p-3 rounded-lg backdrop-blur-md shadow-xl w-48">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_#ef4444]"></span>
                      <span className="text-[9px] text-red-400 font-black uppercase tracking-widest">Active Alert</span>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 font-mono">NODE</span>
                         <span className="text-slate-200 font-bold font-mono">P-809</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 font-mono">STATUS</span>
                         <span className="text-red-400 font-bold font-mono">THEFT</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px]">
                         <span className="text-slate-500 font-mono">DELTA</span>
                         <span className="text-cyan-400 font-bold font-mono">14.2kW</span>
                       </div>
                    </div>
                 </div>
               </div>
            </div>
            
            {/* Cyber Corner Decals */}
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50"></div>
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-[#02050A] border-y border-cyan-900/30">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-900/20 rounded-full mb-6 border border-cyan-800/50">
            <span className="material-symbols-outlined text-cyan-400 text-3xl">account_balance</span>
          </div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4">Official Infrastructure Standard</h2>
          <h3 className="text-3xl lg:text-5xl font-black text-white mb-8 tracking-tight">What is Watt<span className="text-cyan-400">Watch</span>?</h3>
          <p className="text-xl text-slate-400 leading-relaxed font-light mb-12">
            WattWatch is a smart grid monitoring system designed to detect abnormal electricity usage using real-time current flow analysis. Engineered specifically for urban municipalities and public utility boards, it provides undeniable tracking of transmission versus consumption to instantly root out line losses and unauthorized distribution tapping.
          </p>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#0a1426] border border-cyan-900/80 rounded-md shadow-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-cyan-300 font-bold text-xs uppercase tracking-[0.1em]">Designed for scalable deployment across urban infrastructure</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative bg-[#050B14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 relative">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4">System Capabilities</h2>
            <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight">Advanced Intelligence</h3>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="group bg-[#081220] rounded-xl p-8 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(8,145,178,0.15)] relative overflow-hidden hover:-translate-y-2">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 text-white">
                  <span className="material-symbols-outlined text-9xl">monitoring</span>
               </div>
               <div className="w-14 h-14 bg-[#0a182b] rounded-lg flex items-center justify-center mb-8 border border-cyan-900/50 group-hover:border-cyan-400/50 transition-colors shadow-inner">
                 <span className="material-symbols-outlined text-cyan-400 text-3xl">radar</span>
               </div>
               <h4 className="text-lg font-bold text-white mb-4 tracking-tight">Real-Time Grid Monitoring</h4>
               <p className="text-sm text-slate-400 leading-relaxed">Continuous telemetry from millions of endpoints providing an instantaneous authoritative view of city-wide power infrastructure.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="group bg-[#081220] rounded-xl p-8 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(8,145,178,0.15)] relative overflow-hidden hover:-translate-y-2">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 text-white">
                  <span className="material-symbols-outlined text-9xl">electric_meter</span>
               </div>
               <div className="w-14 h-14 bg-[#0a182b] rounded-lg flex items-center justify-center mb-8 border border-cyan-900/50 group-hover:border-cyan-400/50 transition-colors shadow-inner">
                 <span className="material-symbols-outlined text-cyan-400 text-3xl">warning</span>
               </div>
               <h4 className="text-lg font-bold text-white mb-4 tracking-tight">Anomaly Detection</h4>
               <p className="text-sm text-slate-400 leading-relaxed">Utilizes advanced current flow analysis and expected vs. actual load differentials to identify and isolate unmetered electrical tapping.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="group bg-[#081220] rounded-xl p-8 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(8,145,178,0.15)] relative overflow-hidden hover:-translate-y-2">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 text-white">
                  <span className="material-symbols-outlined text-9xl">map</span>
               </div>
               <div className="w-14 h-14 bg-[#0a182b] rounded-lg flex items-center justify-center mb-8 border border-cyan-900/50 group-hover:border-cyan-400/50 transition-colors shadow-inner">
                 <span className="material-symbols-outlined text-cyan-400 text-3xl">satellite_alt</span>
               </div>
               <h4 className="text-lg font-bold text-white mb-4 tracking-tight">Interactive City Map</h4>
               <p className="text-sm text-slate-400 leading-relaxed">Geospatial intelligence overlay rendering power plants, transformers, and distribution nodes directly onto a high-contrast municipal grid.</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-[#081220] rounded-xl p-8 border border-slate-800/80 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(8,145,178,0.15)] relative overflow-hidden hover:-translate-y-2">
               <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500 text-white">
                  <span className="material-symbols-outlined text-9xl">query_stats</span>
               </div>
               <div className="w-14 h-14 bg-[#0a182b] rounded-lg flex items-center justify-center mb-8 border border-cyan-900/50 group-hover:border-cyan-400/50 transition-colors shadow-inner">
                 <span className="material-symbols-outlined text-cyan-400 text-3xl">analytics</span>
               </div>
               <h4 className="text-lg font-bold text-white mb-4 tracking-tight">Data-Driven Analytics</h4>
               <p className="text-sm text-slate-400 leading-relaxed">Executive-level dashboards summarizing total system health, localized node anomalies, and operational grid metrics simultaneously.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 bg-[#02050A] border-y border-cyan-900/30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500 mb-4">Operational Protocol</h2>
            <h3 className="text-3xl lg:text-5xl font-black text-white tracking-tight">How WattWatch Works</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6 relative max-w-6xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[40px] left-[10%] w-[80%] h-[1px] bg-cyan-900/50 z-0"></div>
            
            {[
               { num: '01', icon: 'settings_input_antenna', title: 'Data Collection', desc: 'Secure telemetry data is collected in real-time from metered grid nodes.' },
               { num: '02', icon: 'memory', title: 'Flow Analysis', desc: 'System analyzes expected vs. actual current at sub-station operational levels.' },
               { num: '03', icon: 'rule', title: 'Threshold Logic', desc: 'Anomalies are detected using mathematically proven threshold variance logic.' },
               { num: '04', icon: 'dashboard', title: 'Visualization', desc: 'Results are immediately visualized on an interactive map and executive dashboard.' }
            ].map((step, i) => (
              <div key={i} className="flex-1 relative z-10 pt-4">
                <div className="group bg-[#081220] p-8 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all text-center h-full hover:shadow-[0_0_20px_rgba(8,145,178,0.15)]">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-[#060D1A] border border-cyan-800 rounded-full flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all">
                     <span className="material-symbols-outlined text-3xl text-cyan-500 group-hover:text-cyan-300">{step.icon}</span>
                  </div>
                  <div className="text-[10px] text-cyan-500 font-black mb-4 mt-6">STEP {step.num}</div>
                  <h4 className="text-lg font-bold text-white mb-4">{step.title}</h4>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Preview CTA / Section */}
      <section className="py-40 px-6 relative overflow-hidden flex justify-center items-center">
         <div className="absolute inset-0 bg-[#040914]">
            {/* Super minimal grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#08162e_1px,transparent_1px),linear-gradient(to_bottom,#08162e_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20"></div>
         </div>
         
         <div className="max-w-5xl mx-auto relative z-10 text-center bg-[#060D1A]/90 p-16 rounded-[2rem] border border-cyan-800/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(8,145,178,0.1)]">
            <span className="material-symbols-outlined text-6xl text-cyan-500 mb-8 drop-shadow-[0_0_15px_rgba(8,145,178,0.8)]">policy</span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-md">Monitor Your City Grid Intelligently</h2>
            <p className="text-lg text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Deploy government-grade analytics to protect critical infrastructure, secure utility revenue, and maintain absolute public trust.
            </p>
            <button onClick={onLaunch} className="px-12 py-5 bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white rounded-md font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_30px_rgba(8,145,178,0.4)] hover:shadow-[0_0_50px_rgba(8,145,178,0.6)] hover:scale-105 border border-cyan-400/30">
              Launch Dashboard Sandbox
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#02050A] pt-16 pb-8 px-6 border-t border-slate-900 border-t-cyan-900/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 border-b border-slate-800/50 pb-12 mb-8">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
               <span className="material-symbols-outlined text-cyan-500">admin_panel_settings</span>
               <div className="text-2xl font-black tracking-tighter text-white">Watt<span className="text-cyan-500">Watch</span></div>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Built for Smart Infrastructure Monitoring</p>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-slate-500">
             <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
             <a href="#" className="hover:text-cyan-400 transition-colors">Documentation</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-600">
          <div>&copy; 2024 Obsidian Pulse Systems. All Rights Reserved.</div>
          <div className="flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
             System Operational
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
