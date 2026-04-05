import React, { useState, useRef } from 'react';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ onUpload, currentCity, onCityChange, onOpenSettings, onOpenAlerts, alertCount = 0, session }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  return (
    <header className="fixed top-0 w-full z-[2000] flex justify-between items-center px-6 h-16 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
      {/* Left: Logo + City Tabs */}
      <div className="flex items-center gap-8">
        <span className="text-xl font-black tracking-tighter text-blue-400">Watt Watch</span>
        <nav className="hidden md:flex gap-2 items-center">
          {['Delhi', 'Mumbai', 'Bangalore'].map(city => (
            <button
              key={city}
              id={`city-${city.toLowerCase()}`}
              onClick={() => onCityChange(city)}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all duration-200 ${
                currentCity === city
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-blue-300 hover:bg-slate-800/60'
              }`}
            >
              {city}
            </button>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Anomaly badge */}
        {alertCount > 0 && (
          <div className="hidden lg:flex items-center gap-2 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 animate-pulse">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">
              {alertCount} Anomal{alertCount === 1 ? 'y' : 'ies'}
            </span>
          </div>
        )}

        {/* Upload */}
        <label
          id="upload-dataset-btn"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl border border-blue-400/40 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">upload_file</span>
          <span className="text-[10px] font-black uppercase tracking-[0.1em]">Upload Dataset</span>
          <input type="file" accept=".csv" className="hidden" onChange={onUpload} />
        </label>

        {/* Alerts bell */}
        <div className="relative">
          <button
            id="alerts-btn"
            onClick={onOpenAlerts}
            className="relative bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white p-2.5 rounded-xl transition-all duration-200 border border-slate-700/40 hover:border-slate-600/60"
            title="Anomaly Alerts"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[9px] font-black text-white flex items-center justify-center shadow-lg">
                {alertCount > 9 ? '9+' : alertCount}
              </span>
            )}
          </button>
        </div>

        {/* Settings */}
        <button
          id="settings-btn"
          onClick={onOpenSettings}
          className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white p-2.5 rounded-xl transition-all duration-200 border border-slate-700/40 hover:border-slate-600/60"
          title="Settings"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
        </button>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            id="profile-btn"
            onClick={() => setProfileOpen(p => !p)}
            className="h-9 w-9 rounded-full bg-blue-500/20 border-2 border-blue-400/40 hover:border-blue-400/80 overflow-hidden transition-all duration-200 flex items-center justify-center"
            title="Profile"
          >
            <span className="text-blue-400 font-black text-sm">
              {(session?.user?.email || 'OP').slice(0, 2).toUpperCase()}
            </span>
          </button>
          <ProfileDropdown
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
            session={session}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
