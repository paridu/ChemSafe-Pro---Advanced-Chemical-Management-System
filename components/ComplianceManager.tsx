
import React, { useState, useEffect } from 'react';
import { ComplianceReport, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ComplianceManagerProps {
  reports: ComplianceReport[];
  lang: Language;
  onSave: (report: ComplianceReport) => void;
  onDelete: (id: string) => void;
}

const ComplianceManager: React.FC<ComplianceManagerProps> = ({ reports, lang, onSave, onDelete }) => {
  const t = TRANSLATIONS[lang];
  const [filterStandard, setFilterStandard] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ComplianceReport | null>(null);

  const filtered = reports.filter(report => {
    const matchesStandard = filterStandard === 'All' || report.standard === filterStandard;
    const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase()) || 
                          report.auditor.toLowerCase().includes(search.toLowerCase());
    return matchesStandard && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'bg-emerald-500 text-white border-emerald-500';
      case 'Non-Compliant': return 'bg-red-500 text-white border-red-500';
      case 'Pending': return 'bg-amber-500 text-white border-amber-500';
      default: return 'bg-slate-500 text-white border-slate-500';
    }
  };

  const handleOpenModal = (report?: ComplianceReport) => {
    setSelectedReport(report || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fa-solid fa-clipboard-check text-8xl"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Safety Compliance Manager</h2>
            <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Regulatory Roadmap & Audit Repository</p>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Global Health</p>
              <p className="text-2xl font-black text-emerald-400">94% <span className="text-xs text-slate-500">STABLE</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Active Audits</p>
              <p className="text-2xl font-black text-amber-400">{reports.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search by report title or lead auditor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-amber-400 font-medium transition-all"
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <select 
            value={filterStandard}
            onChange={(e) => setFilterStandard(e.target.value)}
            className="flex-1 md:flex-none px-6 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 appearance-none text-sm"
          >
            <option value="All">All Standards</option>
            <option value="OSHA">OSHA</option>
            <option value="ISO 14001">ISO 14001</option>
            <option value="GHS">GHS</option>
          </select>
          <button 
            onClick={() => handleOpenModal()}
            className="flex-1 md:flex-none px-8 py-3.5 bg-black text-amber-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-3 whitespace-nowrap"
          >
            <i className="fa-solid fa-file-circle-plus"></i>
            New Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(report => (
          <div key={report.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-amber-200 transition-all group flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1 text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                report.status === 'Compliant' ? 'bg-emerald-50 text-emerald-500' : 
                report.status === 'Non-Compliant' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
              }`}>
                <i className={`fa-solid ${report.status === 'Compliant' ? 'fa-circle-check' : 'fa-clipboard-list'}`}></i>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{report.standard}</span>
                   <span className="text-[10px] text-slate-300 font-bold uppercase">• {report.id}</span>
                </div>
                <h5 className="font-black text-slate-800 text-lg group-hover:text-black transition-colors truncate">{report.title}</h5>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto shrink-0">
              <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusColor(report.status)}`}>
                {report.status}
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleOpenModal(report)}
                  className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 hover:bg-black hover:text-amber-400 transition-all flex items-center justify-center border border-slate-100"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                  onClick={() => onDelete(report.id)}
                  className="w-11 h-11 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center border border-slate-100"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-stamp text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-clipboard-check text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Regulatory Compliance Roadmap</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การติดตามสถานะการตรวจประเมินมาตรฐานสากล (ISO/OSHA) มักตกหล่นเนื่องจากใช้ระบบเก็บไฟล์แยกส่วนกัน</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ศูนย์กลางรายงานผลการ Audit ที่สามารถระบุ Score และสถานะความสอดคล้องตามกฎหมายได้ทันทีสำหรับทุกมาตรฐานสากล</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <ComplianceModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(r) => {
            onSave(r);
            setIsModalOpen(false);
          }}
          initialData={selectedReport}
          lang={lang}
        />
      )}
    </div>
  );
};

// ComplianceModal Component
interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: ComplianceReport) => void;
  initialData: ComplianceReport | null;
  lang: Language;
}

const ComplianceModal: React.FC<ComplianceModalProps> = ({ isOpen, onClose, onSave, initialData, lang }) => {
  const [formData, setFormData] = useState<ComplianceReport>({
    id: '',
    title: '',
    standard: 'OSHA',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    auditor: '',
    findings: '',
    score: 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `REP-${Math.floor(100 + Math.random() * 899)}`,
        title: '',
        standard: 'OSHA',
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        auditor: '',
        findings: '',
        score: 0
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tight">{initialData ? 'Edit Audit Report' : 'New Compliance Audit'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Report Title</label>
            <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Standard</label>
              <select value={formData.standard} onChange={e => setFormData({...formData, standard: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400">
                <option value="OSHA">OSHA</option>
                <option value="ISO 14001">ISO 14001</option>
                <option value="GHS">GHS</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Status</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400">
                <option value="Compliant">Compliant</option>
                <option value="Non-Compliant">Non-Compliant</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Date</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Auditor</label>
              <input type="text" value={formData.auditor} onChange={e => setFormData({...formData, auditor: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-black text-amber-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all">Save Report</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComplianceManager;
