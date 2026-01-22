
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, AreaChart, Area } from 'recharts';
import { TRANSLATIONS } from '../constants';
import { HazardClass, ChemicalItem, NewsItem, Language, VisitorStats } from '../types';
import NewsTicker from './NewsTicker';

interface DashboardProps {
  chemicals: ChemicalItem[];
  news: NewsItem[];
  lang: Language;
  visitorStats: VisitorStats;
}

const Dashboard: React.FC<DashboardProps> = ({ chemicals, news, lang, visitorStats }) => {
  const t = TRANSLATIONS[lang];
  
  const totalItems = chemicals.length;
  const criticalItems = chemicals.filter(c => c.quantity < 20).length;
  const expiringSoon = chemicals.filter(c => {
    const expiry = new Date(c.expiryDate);
    const now = new Date();
    const diff = (expiry.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff < 90;
  }).length;

  const hazardDistribution = Object.values(HazardClass).map(h => ({
    name: h,
    value: chemicals.filter(c => c.hazardClass.includes(h)).length
  })).filter(h => h.value > 0);

  const stockData = chemicals.map(c => ({
    name: c.name,
    stock: c.quantity
  }));

  const COLORS = ['#fbbf24', '#f59e0b', '#d97706', '#000000', '#451a03', '#78350f'];

  return (
    <div className="flex flex-col min-h-full pb-12 animate-in fade-in duration-500 relative">
      <NewsTicker news={news} position="Top" lang={lang} />
      
      <div className="space-y-8 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title={t.dashboard.total} value={totalItems} icon="fa-vial" color="amber" />
          <StatCard title={t.dashboard.critical} value={criticalItems} icon="fa-triangle-exclamation" color="red" />
          <StatCard title={t.dashboard.expiring} value={expiringSoon} icon="fa-hourglass-half" color="black" />
          <StatCard title={t.dashboard.score} value="98%" icon="fa-shield-heart" color="emerald" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tight">{t.dashboard.traffic}</h3>
                  <p className="text-sm text-slate-400 font-medium">{t.dashboard.daily_visits}</p>
                </div>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sessions</span>
                   </div>
                </div>
             </div>
             <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorStats.history}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={10} 
                    tick={{ fill: '#94a3b8' }} 
                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                  />
                  <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{ fill: '#94a3b8' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    labelClassName="font-black text-slate-400 text-[10px] uppercase"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#fbbf24" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
             <StatCard 
              title={t.dashboard.visitors} 
              value={visitorStats.totalVisits.toLocaleString()} 
              icon="fa-users" 
              color="black" 
              subValue="+12% from last week"
            />
            <StatCard 
              title={t.dashboard.online} 
              value={visitorStats.onlineUsers} 
              icon="fa-signal" 
              color="amber" 
              indicator={<span className="flex h-3 w-3 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span></span>} 
              subValue="Real-time monitoring"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-black uppercase">{lang === 'en' ? 'Inventory Levels' : 'ระดับคงคลัง'}</h3>
              <select className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-1 font-bold">
                <option>Building B4</option>
                <option>Building B2</option>
              </select>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: '#fef3c7' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
                    {stockData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-black text-black uppercase mb-6">{lang === 'en' ? 'Hazard Distribution' : 'การกระจายความเป็นอันตราย'}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hazardDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {hazardDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-black text-black uppercase">Recent Transactions</h3>
            <button className="text-amber-600 text-sm font-black hover:underline uppercase">View All</button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-black text-white text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Ref ID</th>
                <th className="px-6 py-4">Chemical</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-bold">
              <ActivityRow id="TRX-1092" name="Ethanol 95%" action="Withdrawal (-5L)" user="Somchai P." date="Today, 10:45 AM" />
              <ActivityRow id="TRX-1091" name="NaOH Pellets" action="Inventory Audit" user="Admin" date="Today, 09:12 AM" />
              <ActivityRow id="TRX-1090" name="Hydrochloric Acid" action="Restock (+10L)" user="Anuson K." date="Yesterday" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-lightbulb text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-brain text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Analytics & Decision Hub</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">ข้อมูลคลังสินค้าและความเสี่ยงกระจัดกระจาย ทำให้ยากต่อการมองเห็นภาพรวมความปลอดภัยและระดับสต็อกที่วิกฤตแบบเรียลไทม์</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">แดชบอร์ดอัจฉริยะที่รวบรวม Metrics สำคัญจากทุกภาคส่วนมาไว้ในหน้าเดียว ช่วยให้ Safety Officer ตัดสินใจได้แม่นยำบนพื้นฐานของข้อมูลจริง</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-12">
        <NewsTicker news={news} position="Bottom" lang={lang} />
      </div>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string;
  indicator?: React.ReactNode;
  subValue?: string;
}> = ({ title, value, icon, color, indicator, subValue }) => {
  const colorMap: any = {
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    black: 'bg-black text-amber-400',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5 transition-transform hover:scale-[1.02]">
      <div className={`w-14 h-14 rounded-2xl shrink-0 ${colorMap[color]} flex items-center justify-center text-2xl relative shadow-sm`}>
        <i className={`fa-solid ${icon}`}></i>
        {indicator && <div className="absolute -top-1 -right-1">{indicator}</div>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest truncate">{title}</p>
        <h4 className="text-2xl font-black text-black leading-none mt-1">{value}</h4>
        {subValue && <p className="text-[10px] text-amber-600 font-black uppercase tracking-tighter mt-2">{subValue}</p>}
      </div>
    </div>
  );
};

const ActivityRow: React.FC<{ id: string; name: string; action: string; user: string; date: string }> = ({ id, name, action, user, date }) => (
  <tr className="hover:bg-amber-50/50 transition-colors">
    <td className="px-6 py-4 text-xs font-mono text-slate-400">{id}</td>
    <td className="px-6 py-4 text-sm text-black">{name}</td>
    <td className="px-6 py-4 text-sm text-slate-600">{action}</td>
    <td className="px-6 py-4 text-sm text-slate-600">{user}</td>
    <td className="px-6 py-4 text-sm text-slate-400">{date}</td>
  </tr>
);

export default Dashboard;
