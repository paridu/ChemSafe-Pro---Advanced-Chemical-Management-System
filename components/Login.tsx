
import React, { useState } from 'react';
import { Language, User } from '../types';
import { TRANSLATIONS, MOCK_USERS } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email);
      if (user) {
        onLogin(user);
      } else {
        setError(lang === 'en' ? 'Invalid credentials.' : 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleDemoLogin = (userEmail: string) => {
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === userEmail);
      if (user) onLogin(user);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-400/10 to-transparent pointer-events-none"></div>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl"></div>
      
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 z-10">
        <div className="w-full max-w-md space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-400 rounded-2xl flex items-center justify-center text-3xl text-black shadow-2xl shadow-amber-400/20 mb-4">
              <i className="fa-solid fa-flask"></i>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1 uppercase">ChemSafe Pro</h1>
            <p className="text-amber-400 font-bold text-[10px] uppercase tracking-[0.3em]">Industrial Management Platform</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">{t.common.email}</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 outline-none transition-all placeholder:text-slate-600 text-sm font-bold"
                  placeholder="name@chemsafe.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">{t.common.password}</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 outline-none transition-all text-sm font-bold"
                />
              </div>

              {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-[10px] font-bold text-center uppercase tracking-widest">{error}</div>}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-amber-400 text-black rounded-xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-sm uppercase tracking-widest"
              >
                {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-right-to-bracket"></i>}
                {t.common.login}
              </button>
            </form>

            <div className="mt-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-px bg-white/10 flex-1"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">DEMO NODES</span>
                <div className="h-px bg-white/10 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <DemoButton onClick={() => handleDemoLogin('admin@chemsafe.com')} icon="fa-user-shield" role="Admin" label="Terminal Access" />
                <DemoButton onClick={() => handleDemoLogin('jane@chemsafe.com')} icon="fa-shield-heart" role="Safety" label="Audit Control" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 items-center justify-center p-12 relative border-l border-white/5">
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="inline-flex px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full text-amber-400 text-[10px] font-black uppercase tracking-widest">
            FACILITY SAFETY PROTOCOL ACTIVE
          </div>
          <h2 className="text-6xl font-black text-white leading-none tracking-tighter uppercase">Industrial Integrity.</h2>
          <p className="text-lg text-slate-400 leading-relaxed font-medium">
            Next-gen chemical logistics, compliance roadmaps, and SDS intelligence powered by Gemini 3.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
            <div>
              <p className="text-3xl font-black text-amber-400">GHS</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Compliance Standard</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">OSHA</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Safety Certified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoButton: React.FC<{ onClick: () => void; icon: string; role: string; label: string }> = ({ onClick, icon, role, label }) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-4 w-full p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-amber-400 hover:text-black transition-all text-left group"
  >
    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 group-hover:bg-black transition-colors shadow-lg">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs font-black uppercase group-hover:text-black">{role}</p>
      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{label}</p>
    </div>
  </button>
);

export default Login;
