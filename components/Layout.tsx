
import React from 'react';
import { ViewType, Language, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  user: User;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, lang, setLang, user, onLogout }) => {
  const t = TRANSLATIONS[lang];

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: 'fa-chart-line', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'inventory', label: t.nav.inventory, icon: 'fa-boxes-stacked', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'storages', label: t.nav.storages, icon: 'fa-warehouse', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'mapping_layout', label: t.nav.mapping, icon: 'fa-map-location-dot', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'compatibility_mgmt', label: t.nav.compatibility, icon: 'fa-table-cells', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'storage_monitoring', label: lang === 'en' ? 'Audit Tracking' : 'ตรวจติดตามคลัง', icon: 'fa-calendar-check', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'calendar_mgmt', label: t.nav.calendar, icon: 'fa-calendar-days', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'checksheets', label: t.nav.checksheets, icon: 'fa-list-check', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'ppe', label: t.nav.ppe, icon: 'fa-shield-halved', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'sds', label: t.nav.sds, icon: 'fa-file-shield', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'ai_chat_pdf', label: lang === 'en' ? 'SDS AI Chat' : 'AI คุยกับ SDS', icon: 'fa-comment-medical', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'procurement', label: t.nav.procurement, icon: 'fa-cart-shopping', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'compliance', label: t.nav.compliance, icon: 'fa-clipboard-check', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'waste', label: t.nav.waste, icon: 'fa-trash-can', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'incidents', label: t.nav.incidents, icon: 'fa-kit-medical', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'training', label: t.nav.training, icon: 'fa-user-graduate', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'documents', label: t.nav.documents, icon: 'fa-folder-tree', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'alerts', label: t.nav.alerts, icon: 'fa-bell-circle-exclamation', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'audit', label: t.nav.audit, icon: 'fa-clock-rotate-left', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'risk', label: t.nav.risk, icon: 'fa-robot', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
    { id: 'ai_hub', label: lang === 'en' ? 'AI Logistics Hub' : 'ศูนย์ควบคุม AI', icon: 'fa-microchip', roles: ['Admin'] },
    { id: 'users', label: t.nav.users, icon: 'fa-users-gear', roles: ['Admin', 'Manager'] },
    { id: 'monitoring', label: t.nav.monitoring, icon: 'fa-server', roles: ['Admin'] },
    { id: 'news', label: t.nav.news, icon: 'fa-comment-dots', roles: ['Admin', 'Safety Officer', 'Manager'] },
    { id: 'settings', label: t.nav.settings, icon: 'fa-cog', roles: ['Admin', 'Safety Officer', 'Staff', 'Manager'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar - Updated to Black/Amber */}
      <aside className="w-64 bg-black text-white flex flex-col hidden lg:flex shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 text-black rounded-lg flex items-center justify-center text-xl font-bold shadow-lg shadow-amber-400/20">
              <i className="fa-solid fa-flask"></i>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white uppercase">ChemSafe</h1>
              <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Industrial Pro</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20 font-black' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-amber-400'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i>
              <span className="text-[11px] uppercase tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex bg-slate-900 p-1 rounded-xl">
            <button 
              onClick={() => setLang('en')}
              className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${lang === 'en' ? 'bg-amber-400 text-black' : 'text-slate-400'}`}
            >
              EN
            </button>
            <button 
              onClick={() => setLang('th')}
              className={`flex-1 py-1 text-[10px] font-bold rounded-lg transition-colors ${lang === 'th' ? 'bg-amber-400 text-black' : 'text-slate-400'}`}
            >
              TH
            </button>
          </div>
          
          <div className="bg-slate-900 rounded-xl p-3 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 border border-amber-500/30 overflow-hidden flex items-center justify-center text-black font-black text-sm uppercase shadow-lg shadow-amber-400/5">
                {user.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black truncate text-white uppercase tracking-tight leading-none mb-1">{user.name}</p>
                <div className="flex items-center gap-1.5">
                   <p className="text-[8px] text-amber-400 truncate uppercase tracking-widest font-bold">{user.position || user.role}</p>
                   {user.employeeId && <span className="text-[8px] text-slate-600 font-mono">#{user.employeeId}</span>}
                </div>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full py-2 bg-slate-800 hover:bg-red-600 transition-colors rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/5"
            >
              <i className="fa-solid fa-power-off"></i>
              {t.common.logout}
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-600">
              <i className="fa-solid fa-bars text-xl"></i>
            </button>
            <h2 className="text-lg font-black text-black uppercase tracking-tight">
              {navItems.find(n => n.id === activeView)?.label || activeView}
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden sm:block">
              <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input 
                type="text" 
                placeholder={t.common.search} 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full w-64 focus:ring-2 focus:ring-amber-400 text-sm transition-all"
              />
            </div>
            <div className="flex gap-4">
              <button className="relative text-slate-500 hover:text-amber-500">
                <i className="fa-solid fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white">3</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Layout;
