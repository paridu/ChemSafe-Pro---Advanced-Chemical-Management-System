
import React, { useState } from 'react';
import { PurchaseRequest, Language, User } from '../types';
import { TRANSLATIONS } from '../constants';

interface ProcurementWorkflowProps {
  requests: PurchaseRequest[];
  lang: Language;
  user: User;
  onUpdateStatus: (id: string, status: 'Approved' | 'Rejected', actor: string) => void;
  onAddRequest: (request: PurchaseRequest) => void;
}

const ProcurementWorkflow: React.FC<ProcurementWorkflowProps> = ({ requests, lang, user, onUpdateStatus, onAddRequest }) => {
  const t = TRANSLATIONS[lang];
  const canApprove = user.role === 'Admin' || user.role === 'Safety Officer';
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-500 text-white border-emerald-500';
      case 'Rejected': return 'bg-rose-500 text-white border-rose-500';
      case 'Pending': return 'bg-amber-500 text-white border-amber-500';
      case 'Ordered': return 'bg-indigo-500 text-white border-indigo-500';
      default: return 'bg-slate-500 text-white border-slate-500';
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-left-8 duration-500 pb-12 text-left">
      {/* Header Section */}
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fa-solid fa-cart-shopping text-8xl"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-amber-400/20">
              <i className="fa-solid fa-truck-fast"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{lang === 'en' ? 'Supply Chain Logistics' : 'การจัดการห่วงโซ่อุปทาน'}</h3>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Material Acquisition & Safety Verification</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 bg-amber-400 text-black rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 whitespace-nowrap uppercase text-[10px] tracking-widest"
          >
            {lang === 'en' ? '+ New Acquisition Request' : '+ สร้างคำขอจัดซื้อใหม่'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Active Procurement Pipeline</h4>
          <span className="px-3 py-1 bg-black text-amber-400 rounded-lg text-[9px] font-black uppercase">{requests.length} BATCHES</span>
        </div>
        <div className="divide-y divide-slate-50">
          {requests.map(req => (
            <div key={req.id} className="p-8 flex flex-col lg:flex-row justify-between items-center gap-8 hover:bg-amber-50/30 transition-all group">
              <div className="flex items-center gap-6 flex-1 w-full lg:w-auto">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg border-2 ${
                  req.status === 'Approved' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 
                  req.status === 'Rejected' ? 'bg-rose-50 text-rose-500 border-rose-100' : 'bg-amber-50 text-amber-500 border-amber-100'
                }`}>
                  <i className={`fa-solid ${
                    req.status === 'Approved' ? 'fa-circle-check' : 
                    req.status === 'Rejected' ? 'fa-circle-xmark' : 'fa-hourglass-start'
                  }`}></i>
                </div>
                <div className="min-w-0">
                  <h5 className="font-black text-slate-800 text-lg leading-tight uppercase group-hover:text-black transition-colors">{req.chemicalName}</h5>
                  <div className="flex items-center gap-4 mt-1.5">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{req.id}</p>
                    <p className="text-[10px] text-amber-600 font-black uppercase">{req.quantity} {req.unit}</p>
                    <span className="text-slate-200">•</span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{req.requestDate}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-10 w-full lg:w-auto justify-between lg:justify-end">
                <div className="hidden sm:block text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Originator</p>
                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs font-bold text-slate-700">{req.requester}</span>
                    <div className="w-5 h-5 rounded-full bg-slate-100 text-[8px] flex items-center justify-center font-black text-slate-500 uppercase">{req.requester.charAt(0)}</div>
                  </div>
                </div>

                <div className={`px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm ${getStatusStyle(req.status)}`}>
                  {req.status}
                </div>
                
                {req.status === 'Pending' && canApprove ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onUpdateStatus(req.id, 'Approved', user.name)}
                      className="px-6 py-2.5 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-black/5"
                    >
                      Authorize
                    </button>
                    <button 
                      onClick={() => onUpdateStatus(req.id, 'Rejected', user.name)}
                      className="px-6 py-2.5 bg-white border border-slate-200 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all"
                    >
                      Deny
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-black transition-all flex items-center justify-center border border-slate-100">
                        <i className="fa-solid fa-file-invoice-dollar"></i>
                     </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-truck-ramp-box text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-file-contract text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Material Acquisition Governance</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การสั่งซื้อสารเคมีอันตรายเข้ามาโดยไม่มีการตรวจสอบพื้นที่จัดเก็บหรือความเข้ากันได้ล่วงหน้า นำไปสู่ความเสี่ยงด้านอุบัติเหตุ</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">กระบวนการอนุมัติการสั่งซื้อที่รวมการตรวจสอบความปลอดภัยจาก Safety Officer เพื่อยืนยันว่าสถานที่มีความพร้อมในการรับสารใหม่</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <PurchaseRequestModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(req) => {
            onAddRequest(req);
            setIsModalOpen(false);
          }}
          user={user}
          lang={lang}
        />
      )}
    </div>
  );
};

// PurchaseRequestModal Component
interface PurchaseRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (req: PurchaseRequest) => void;
  user: User;
  lang: Language;
}

const PurchaseRequestModal: React.FC<PurchaseRequestModalProps> = ({ isOpen, onClose, onSave, user, lang }) => {
  const [formData, setFormData] = useState<Partial<PurchaseRequest>>({
    chemicalName: '',
    quantity: 0,
    unit: 'Liters',
    requester: user.name,
    department: user.department,
    status: 'Pending',
    requestDate: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tight">New Procurement Request</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave({
            ...formData,
            id: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
          } as PurchaseRequest);
        }} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Chemical Name</label>
            <input required type="text" value={formData.chemicalName} onChange={e => setFormData({...formData, chemicalName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" placeholder="e.g. Isopropyl Alcohol" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Quantity</label>
              <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Unit</label>
              <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400">
                <option>Liters</option>
                <option>kg</option>
                <option>ml</option>
                <option>Units</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-black text-amber-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all">Submit Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcurementWorkflow;
