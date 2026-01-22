
import React, { useState } from 'react';
import { StorageLocation, Language } from '../types';

interface ChecksheetCenterProps {
  storages: StorageLocation[];
  lang: Language;
}

const ChecksheetCenter: React.FC<ChecksheetCenterProps> = ({ storages, lang }) => {
  const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [responses, setResponses] = useState<Record<string, Record<number, 'Pass' | 'Fail' | 'N/A'>>>({});

  const mockQuestions = [
    "Venting system is operational and clear of obstructions.",
    "Storage area is clean and free of spills.",
    "Fire extinguishers are in place and charged.",
    "PPE kit is complete and accessible.",
    "Labels on all chemical containers are legible.",
    "Secondary containment is empty and dry."
  ];

  const handleToggle = (storageId: string, qIdx: number, status: 'Pass' | 'Fail' | 'N/A') => {
    setResponses(prev => ({
      ...prev,
      [storageId]: {
        ...(prev[storageId] || {}),
        [qIdx]: status
      }
    }));
  };

  const calculateProgress = (storageId: string) => {
    const storageResponses = responses[storageId] || {};
    const answeredCount = Object.keys(storageResponses).length;
    return Math.round((answeredCount / mockQuestions.length) * 100);
  };

  const handleSubmit = (storageId: string) => {
    const progress = calculateProgress(storageId);
    if (progress < 100) {
      alert('Please complete all checks before submitting.');
      return;
    }
    alert(`Report for ${storages.find(s => s.id === storageId)?.name} submitted successfully!`);
    setResponses(prev => {
      const newState = { ...prev };
      delete newState[storageId];
      return newState;
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 text-left">
          <div>
            <h3 className="text-2xl font-black text-slate-800">Compliance Checksheet Center</h3>
            <p className="text-sm text-slate-400 font-medium">Mandatory safety inspections for all storage areas.</p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {(['Daily', 'Weekly', 'Monthly'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {storages.slice(0, 6).map(storage => {
            const progress = calculateProgress(storage.id);
            return (
              <div key={storage.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6 hover:shadow-md transition-shadow text-left">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">{storage.name.charAt(0)}</div>
                    <div>
                      <h5 className="font-bold text-slate-800">{storage.name}</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{activeTab} INSPECTION</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  {mockQuestions.map((q, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                      <span className="text-xs font-semibold text-slate-600">{q}</span>
                      <div className="flex gap-1">
                        <button onClick={() => handleToggle(storage.id, i, 'Pass')} className={`w-8 h-8 rounded-lg border ${responses[storage.id]?.[i] === 'Pass' ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'}`}><i className="fa-solid fa-check text-xs"></i></button>
                        <button onClick={() => handleToggle(storage.id, i, 'Fail')} className={`w-8 h-8 rounded-lg border ${responses[storage.id]?.[i] === 'Fail' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-500'}`}><i className="fa-solid fa-xmark text-xs"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleSubmit(storage.id)} disabled={progress < 100} className={`w-full py-3 rounded-xl font-black text-xs uppercase ${progress === 100 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Submit Report</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-clipboard-list text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-list-check text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Active Surveillance Protocols</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การตรวจความปลอดภัยหน้างานมักใช้กระดาษ จดบันทึกไม่ครบถ้วน และข้อมูลเข้าสู่ระบบช้าจนทำให้แก้ไขปัญหาไม่ทันเวลา</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบ Checksheet ดิจิทัลที่บันทึกข้อมูลได้ทันทีผ่านมือถือ พร้อมระบบวัดความคืบหน้าเพื่อให้แน่ใจว่าการตรวจเป็นไปอย่างเข้มงวด</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ChecksheetCenter;
