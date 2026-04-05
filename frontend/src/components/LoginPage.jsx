import React, { useState } from 'react';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Simulate instantaneous local session initialization
    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        if (onLoginSuccess) onLoginSuccess({ user: { email } });
      } else {
        setError("Invalid credentials for current infrastructure node.");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center relative overflow-hidden font-['Inter'] px-4">
      <div className="absolute inset-0 bg-[#060D1A]">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#08162e_1px,transparent_1px),linear-gradient(to_bottom,#08162e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md relative z-10 bg-[#060e20]/90 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(8,145,178,0.2)]">
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-2xl"></div>

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-900/20 rounded-full mb-4 border border-cyan-800/50">
            <span className="material-symbols-outlined text-cyan-400 text-3xl">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Secure <span className="text-cyan-500">Access</span></h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Gov. Infrastructure Node</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
             <label className="block text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2">Operator Email</label>
             <input 
               type="email" value={email} onChange={(e) => setEmail(e.target.value)}
               className="w-full bg-[#0a1428] border border-slate-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-all"
               placeholder="operator@wattwatch.gov" required
             />
          </div>
          <div>
             <label className="block text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2">Passcode</label>
             <input 
               type="password" value={password} onChange={(e) => setPassword(e.target.value)}
               className="w-full bg-[#0a1428] border border-slate-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition-all font-mono"
               placeholder="••••••••••" required
             />
          </div>
          <button 
            type="submit" disabled={loading}
            className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] flex justify-center items-center gap-2"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : "Initialize Session"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
