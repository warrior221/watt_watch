import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SettingsPanel = ({ isOpen, onClose, currentCity, onCityChange, onRefresh }) => {
  const [darkMode, setDarkMode] = useState(true);

  // ── MUST be before any early return — React rules of hooks ──────────────────
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  // Backdrop click closes panel
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cities = ['Delhi', 'Mumbai', 'Bangalore'];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9000] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 h-full w-80 z-[9001] bg-slate-950 border-l border-slate-700/50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-400 text-lg">settings</span>
            </div>
            <h2 className="text-white font-black text-sm uppercase tracking-widest">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* City Selection */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Active City</p>
            <div className="space-y-2">
              {cities.map(city => (
                <button
                  key={city}
                  id={`settings-city-${city.toLowerCase()}`}
                  onClick={() => { onCityChange(city); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 ${
                    currentCity === city
                      ? 'bg-blue-500/15 border-blue-500/50 text-blue-400'
                      : 'bg-slate-800/50 border-slate-700/30 text-slate-400 hover:border-blue-500/30 hover:text-blue-300'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sm">location_city</span>
                    <span className="font-bold text-sm">{city}</span>
                  </span>
                  {currentCity === city && (
                    <span className="material-symbols-outlined text-sm text-blue-400">check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Display</p>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-400 text-lg">
                    {darkMode ? 'dark_mode' : 'light_mode'}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">Dark Mode</p>
                    <p className="text-[10px] text-slate-500">{darkMode ? 'Active — Obsidian theme' : 'Off — Light theme'}</p>
                  </div>
                </div>
                <button
                  id="dark-mode-toggle"
                  onClick={() => setDarkMode(prev => !prev)}
                  className={`relative w-12 h-6 rounded-full transition-all duration-300 ${darkMode ? 'bg-blue-500' : 'bg-slate-600'}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-md ${darkMode ? 'left-7' : 'left-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data Controls */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Data Controls</p>
            <button
              id="settings-refresh-btn"
              onClick={() => { onRefresh(); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-all font-bold text-sm"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              Refresh Grid Data
            </button>
          </div>

          {/* API Info */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Backend</p>
            <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">API Endpoint</span>
                <span className="text-xs font-bold text-green-400 font-mono">localhost:8000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Detection Mode</span>
                <span className="text-xs font-bold text-blue-400">Hierarchical</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Threshold</span>
                <span className="text-xs font-bold text-white font-mono">0.5 kW</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Email Alerts</span>
                <span className="text-xs font-bold text-yellow-400">
                  {import.meta.env.VITE_ALERTS_ENABLED === 'true' ? 'Enabled' : 'Configure in .env'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="px-6 py-4 border-t border-slate-800">
          <button
            id="settings-logout-btn"
            onClick={() => supabase.auth.signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 hover:bg-red-500/20 transition-all font-bold text-sm"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default SettingsPanel;
