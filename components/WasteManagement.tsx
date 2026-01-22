
import React, { useState } from 'react';
import { WasteLog, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface WasteManagementProps {
  logs: WasteLog[];
  lang: Language;
}

type WorkflowPhase = 'Storage' | 'Transport' | 'Disposed';

const WasteManagement: React.FC<WasteManagementProps> = ({ logs, lang }) => {
  const t = TRANSLATIONS[lang];
  const [activePhase, setActivePhase] = useState<WorkflowPhase | 'All'>('All');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Storage': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Transport': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Disposed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const filteredLogs = activePhase === 'All' ? logs : logs.filter(log => log.status === activePhase);

  const totalVolume = logs.reduce((acc, l) => acc + l.quantity, 0);
  const storageVolume = logs.filter(l => l.status === 'Storage').reduce((acc, l) => acc + l.quantity, 0);
  const transitVolume = logs.filter(l => l.status === 'Transport').reduce((acc, l) => acc + l.quantity, 0);
  const disposedVolume = logs.filter(l => l.status === 'Disposed').reduce((acc, l) => acc + l.quantity, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 text-left">
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fa-solid fa-recycle text-8xl"></i>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-8 text-left">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Waste Lifecycle Workflow</h2>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Compliance Protocol: ISO 14001</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Site Volume</p>
              <p className="text-2xl font-black text-white">{totalVolume} <span className="text-sm font-bold text-slate-500">Liters</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <WorkflowStep title="Site Accumulation" desc="Temporary Storage" value={storageVolume} icon="fa-warehouse" active={activePhase === 'Storage' || activePhase === 'All'} color="amber" />
            <WorkflowStep title="Manifest & Transit" desc="Licensed Transport" value={transitVolume} icon="fa-truck-ramp-box" active={activePhase === 'Transport' || activePhase === 'All'} color="blue" />
            <WorkflowStep title="Final Destruction" desc="Certified Disposal" value={disposedVolume} icon="fa-shield-check" active={activePhase === 'Disposed' || activePhase === 'All'} color="emerald" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button onClick={() => setActivePhase('All')} className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activePhase === 'All' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>All Batches</button>
          <button onClick={() => setActivePhase('Storage')} className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activePhase === 'Storage' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400'}`}>In Storage</button>
          <button onClick={() => setActivePhase('Transport')} className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activePhase === 'Transport' ? 'bg-blue-400 text-white shadow-sm' : 'text-slate-400'}`}>In Transport</button>
          <button onClick={() => setActivePhase('Disposed')} className={`flex-1 px-6 py-2.5 rounded-xl text-[10px] font-black transition-all ${activePhase === 'Disposed' ? 'bg-emerald-400 text-white shadow-sm' : 'text-slate-400'}`}>Disposed</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-50 border-b border-slate-100">
             <tr className="text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-6">Identity & Volume</th>
                <th className="px-8 py-6">Source Node</th>
                <th className="px-8 py-6">Manifest ID</th>
                <th className="px-8 py-6">Current Phase</th>
                <th className="px-8 py-6 text-right">Workflow Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-100">
             {filteredLogs.map(log => (
               <tr key={log.id} className="hover:bg-amber-50/30 transition-colors">
                  <td className="px-8 py-6 font-bold">{log.chemical_name} <span className="text-[10px] block text-amber-600">{log.quantity} {log.unit}</span></td>
                  <td className="px-8 py-6 text-xs">{log.generator}</td>
                  <td className="px-8 py-6 font-mono text-xs text-slate-400">{log.manifest_number || 'PENDING'}</td>
                  <td className="px-8 py-6"><span className={`px-3 py-1 rounded-lg text-[9px] font-black border ${getStatusStyle(log.status)}`}>{log.status}</span></td>
                  <td className="px-8 py-6 text-right"><button className="text-slate-300 hover:text-black transition-colors"><i className="fa-solid fa-ellipsis-vertical"></i></button></td>
               </tr>
             ))}
           </tbody>
        </table>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-trash-arrow-up text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-biohazard text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Environmental Impact Control</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การทิ้งกากของเสียอันตรายที่ผิดกฎหมายหรือขาดการบันทึก Manifest นำไปสู่บทลงโทษทางกฎหมายที่รุนแรงและปัญหาสิ่งแวดล้อม</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบติดตามวงจรชีวิตของเสียแบบครบวงจร (Lifecycle Tracking) ตั้งแต่จุดกำเนิดจนถึงปลายทาง พร้อมประวัติการทำลายที่ตรวจสอบย้อนกลับได้</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

// WorkflowStep Component
const WorkflowStep: React.FC<{ 
  title: string; 
  desc: string; 
  value: number; 
  icon: string; 
  active: boolean; 
  color: 'amber' | 'blue' | 'emerald' 
}> = ({ title, desc, value, icon, active, color }) => {
  const colorMap = {
    amber: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
    blue: 'text-blue-400 border-blue-400/20 bg-blue-400/5',
    emerald: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5'
  };

  return (
    <div className={`p-6 rounded-3xl border transition-all ${active ? colorMap[color] : 'opacity-20 border-white/5 bg-white/5'}`}>
      <div className="flex justify-between items-start mb-4">
        <i className={`fa-solid ${icon} text-2xl`}></i>
        <p className="text-xl font-black">{value.toLocaleString()}</p>
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">{title}</h4>
      <p className="text-[8px] opacity-60 uppercase font-bold">{desc}</p>
    </div>
  );
};

export default WasteManagement;
