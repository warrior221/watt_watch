import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 w-full h-8 flex items-center justify-between px-6 z-50 bg-slate-900/50 backdrop-blur-md border-t border-slate-800/50">
      <span className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-slate-600">© 2024 Obsidian Pulse Systems</span>
      <div className="flex gap-6">
        <a className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300" href="#">Privacy Policy</a>
        <a className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-slate-600 hover:text-slate-300" href="#">Terms of Service</a>
        <a className="font-['Space_Grotesk'] text-[10px] uppercase tracking-widest text-blue-400" href="#">API Documentation</a>
      </div>
    </footer>
  );
};

export default Footer;
