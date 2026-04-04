import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b14] flex items-center justify-center relative overflow-hidden font-['Inter'] px-4">
      {/* Background Cyber Elements */}
      <div className="absolute inset-0 bg-[#060D1A]">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#08162e_1px,transparent_1px),linear-gradient(to_bottom,#08162e_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none"></div>
      </div>

      <div className="w-full max-w-md relative z-10 bg-[#060e20]/90 border border-cyan-500/30 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(8,145,178,0.2)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 rounded-tr-2xl"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 rounded-bl-2xl"></div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-900/20 rounded-full mb-4 border border-cyan-800/50">
            <span className="material-symbols-outlined text-cyan-400 text-3xl">admin_panel_settings</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mb-2">Secure <span className="text-cyan-500">Access</span></h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Gov. Infrastructure Node</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-xs p-3 rounded-lg mb-6 flex items-start gap-2">
            <span className="material-symbols-outlined text-sm">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
             <label className="block text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2">Operator Email</label>
             <div className="relative">
               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">mail</span>
               <input 
                 type="email" 
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full bg-[#0a1428] border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-600"
                 placeholder="operator@wattwatch.gov"
                 required
               />
             </div>
          </div>
          
          <div>
             <label className="block text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-2">Passcode</label>
             <div className="relative">
               <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">lock</span>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full bg-[#0a1428] border border-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-600"
                 placeholder="••••••••••"
                 required
               />
             </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg py-3.5 text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(8,145,178,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading ? <span className="material-symbols-outlined animate-spin text-sm">sync</span> : null}
            {isRegister ? 'Register Access' : 'Initialize Session'}
          </button>
        </form>

        <div className="mt-6 text-center">
           <button 
             type="button"
             onClick={() => { setIsRegister(!isRegister); setError(null); }}
             className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
           >
             {isRegister ? "Already an operator? Login" : "Request operative access? Register"}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
