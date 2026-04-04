import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-slate-950/80 backdrop-blur-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-8">
        <span className="text-xl font-black tracking-tighter text-blue-400">PhantomNode</span>
        <nav className="hidden md:flex gap-6 items-center">
          <a className="text-blue-400 border-b-2 border-blue-400 pb-1 font-semibold text-sm" href="#">Delhi</a>
          <a className="text-slate-400 hover:text-blue-300 transition-colors text-sm" href="#">Mumbai</a>
          <a className="text-slate-400 hover:text-blue-300 transition-colors text-sm" href="#">Bangalore</a>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 bg-error-container/20 px-3 py-1.5 rounded-full border border-error/20">
          <span className="flex h-2 w-2 rounded-full bg-error"></span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-error">Anomaly Detected</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-highest hover:bg-surface-bright text-on-surface p-2 rounded-xl transition-all scale-95 duration-200">
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
          <button className="bg-surface-container-highest hover:bg-surface-bright text-on-surface p-2 rounded-xl transition-all scale-95 duration-200">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="h-10 w-10 rounded-full bg-blue-500/20 border border-blue-400/30 overflow-hidden">
            <img alt="Operator Profile" className="w-full h-full object-cover" data-alt="close up of a professional technical operator avatar with modern glasses and neutral expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFXkIzBXVU5eLG_35S1N8YB47cyLFHEXDKxxAztuFYeyh-lFG3gRsHpM64s0wBZZVEceiwbnh0My9EDYAPzbcEpqXhY95amERzyEJl4qE1I_wLX-Zw7CvdVS5xHUTv-ED5WlKe8hMX3h-RbEawltf4Z0OfdyQV0e9ikHnVo1NpI8laktZtCODvgcrvC7-cm0SY5-bzAxb0B1mWgtEZ1Px_u8j5Z_TFiw3kotsXNpC35EMRfk6agR3JQ2C8DTQtHKzvcuSgdzXz5U_1"/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
