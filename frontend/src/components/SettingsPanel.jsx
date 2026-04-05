import React, { useState, useEffect } from 'react';

const SettingsPanel = ({ isOpen, onClose, currentCity, onCityChange, onRefresh }) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const cities = ['Delhi', 'Mumbai', 'Bangalore'];

  return (
    <>
      <div className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-80 z-[9001] bg-slate-950 border-l border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-blue-400 text-lg">settings</span>
             <h2 className="text-white font-black text-xs uppercase tracking-[0.2em]">Settings</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"><span className="material-symbols-outlined">close</span></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Select Operations Node</p>
            <div className="space-y-2">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => onCityChange(city)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                    currentCity === city
                      ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                      : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold">{city} Hub</span>
                  {currentCity === city && <span className="material-symbols-outlined text-sm">radio_button_checked</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
             <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Grid Control</p>
             <button
               onClick={() => { onRefresh(); onClose(); }}
               className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600/10 border border-blue-600/30 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all font-bold text-xs"
             >
               <span className="material-symbols-outlined text-sm">refresh_grid</span>
               Trigger Diagnostic Sync
             </button>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-800">
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-xs"
          >
            Terminal Shutdown
          </button>
        </div>
      </aside>
    </>
  );
};

export default SettingsPanel;
