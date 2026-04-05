import React, { useEffect, useRef } from 'react';

const ProfileDropdown = ({ isOpen, onClose, session }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEsc);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const email    = session?.user?.email || 'admin@wattwatch.gov';
  const role     = 'Senior Grid Admin';
  const initials = 'AD';

  return (
    <div
      ref={ref}
      id="profile-dropdown"
      className="absolute right-0 top-full mt-2 w-72 bg-slate-950 border border-slate-700/50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-[9002] overflow-hidden"
    >
      <div className="px-5 py-5 bg-gradient-to-br from-blue-500/10 to-transparent border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <span className="text-blue-400 font-black text-lg">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-sm truncate max-w-[160px]">{email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                {role}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-2">
        {[
          { icon: 'person',        label: 'My Profile',    sub: 'View account details' },
          { icon: 'security',      label: 'Permissions',   sub: 'Role & access control' },
        ].map(item => (
          <button key={item.label} className="w-full flex items-center gap-4 px-5 py-3 hover:bg-slate-800/60 transition-colors text-left group">
            <span className="material-symbols-outlined text-slate-500 group-hover:text-blue-400 transition-colors text-lg">{item.icon}</span>
            <div><p className="text-sm font-bold text-slate-300 group-hover:text-white">{item.label}</p></div>
          </button>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-slate-800">
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-all text-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Reset Session
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
