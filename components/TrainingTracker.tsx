
import React, { useState, useRef, useEffect } from 'react';
import { TrainingRecord, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface TrainingTrackerProps {
  records: TrainingRecord[];
  lang: Language;
  onAdd: (record: TrainingRecord) => void;
  onUpdate: (record: TrainingRecord) => void;
  onDelete: (id: string) => void;
}

const TrainingTracker: React.FC<TrainingTrackerProps> = ({ records, lang, onAdd, onUpdate, onDelete }) => {
  const t = TRANSLATIONS[lang];
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecord | null>(null);

  const filteredRecords = records.filter(r => 
    r.traineeName.toLowerCase().includes(search.toLowerCase()) ||
    r.courseName.toLowerCase().includes(search.toLowerCase()) ||
    r.employeeId.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: records.length,
    active: records.filter(r => r.status === 'Active').length,
    expired: records.filter(r => r.status === 'Expired').length,
    expiring: records.filter(r => r.status === 'Expiring').length,
  };

  const handleEdit = (record: TrainingRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const downloadCert = (record: TrainingRecord) => {
    if (record.certFileData) {
      const link = document.createElement('a');
      link.href = record.certFileData;
      link.download = record.certFileName || 'certificate.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No certificate file archived for this record.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 text-left">
      {/* Header Stats Bar */}
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fa-solid fa-user-graduate text-8xl"></i>
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-amber-400/20">
              <i className="fa-solid fa-award"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-1">
                {lang === 'en' ? 'Competency Matrix' : 'คลังประวัติการฝึกอบรม'}
              </h2>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Certification & Safety Compliance Hub</p>
            </div>
          </div>
          <div className="flex gap-10">
            <TrainingStat label="Total Records" value={stats.total} />
            <TrainingStat label="Valid Certs" value={stats.active} color="text-emerald-400" />
            <TrainingStat label="Expired" value={stats.expired} color="text-red-400" />
          </div>
          <button 
            onClick={handleAddNew}
            className="px-10 py-4 bg-amber-400 text-black rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 whitespace-nowrap uppercase text-[10px] tracking-widest"
          >
            <i className="fa-solid fa-file-signature mr-2"></i>
            Register Training
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="relative">
          <i className="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by trainee name, course, or employee ID..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none font-medium transition-all"
          />
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRecords.map(record => (
          <div key={record.id} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-amber-400 hover:shadow-2xl transition-all group flex flex-col h-full relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 text-2xl border border-slate-100 group-hover:bg-amber-50 group-hover:text-amber-500 group-hover:border-amber-100 transition-all">
                  <i className="fa-solid fa-user-check"></i>
                </div>
                <div>
                   <h4 className="font-black text-slate-800 text-lg group-hover:text-black transition-colors leading-tight">{record.traineeName}</h4>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{record.employeeId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                record.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                record.status === 'Expiring' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                'bg-red-50 text-red-600 border-red-100'
              }`}>
                {record.status}
              </span>
            </div>

            <div className="mb-6 flex-1">
              <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mb-1">Assessed Competency</p>
              <h5 className="font-bold text-slate-700 text-sm">{record.courseName}</h5>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400 font-medium">
                 <div className="flex items-center gap-1.5"><i className="fa-solid fa-building-columns opacity-50"></i> {record.provider}</div>
                 {record.score !== undefined && <div className="flex items-center gap-1.5"><i className="fa-solid fa-star text-amber-400"></i> {record.score}%</div>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 mb-6">
              <div>
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Issue Date</p>
                <p className="text-xs font-black text-slate-700">{record.completionDate}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Expiry Date</p>
                <p className={`text-xs font-black ${record.status === 'Expired' ? 'text-red-500' : 'text-slate-700'}`}>{record.expiryDate}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button 
                onClick={() => downloadCert(record)}
                className={`flex-1 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  record.certFileData ? 'bg-black text-white hover:bg-slate-900 shadow-lg' : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                }`}
              >
                <i className="fa-solid fa-file-pdf"></i>
                Download Cert
              </button>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(record)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center border border-slate-100"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button 
                  onClick={() => onDelete(record.id)}
                  className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-white transition-all flex items-center justify-center border border-slate-100"
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
           <i className="fa-solid fa-certificate text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-user-graduate text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Competency Lifecycle Management</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">ใบเซอร์กระดาษมักสูญหาย และเป็นภาระในการตรวจสอบความพร้อมของพนักงานก่อนเข้าทำงานในพื้นที่เสี่ยง</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบจัดเก็บใบประกาศแบบดิจิทัลพร้อมการแจ้งเตือนวันหมดอายุแบบล่วงหน้า ช่วยให้ EHS มั่นใจว่าพนักงานทุกคนได้รับการฝึกอบรมที่ถูกต้อง</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <TrainingModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(r) => {
            if (selectedRecord) onUpdate(r);
            else onAdd(r);
            setIsModalOpen(false);
          }}
          initialData={selectedRecord}
          lang={lang}
        />
      )}
    </div>
  );
};

const TrainingStat = ({ label, value, color = "text-white" }: { label: string, value: number, color?: string }) => (
  <div className="text-center px-6 border-r border-white/10 last:border-0">
    <p className={`text-2xl font-black ${color}`}>{value.toString().padStart(2, '0')}</p>
    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{label}</p>
  </div>
);

// TrainingModal Component
interface TrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: TrainingRecord) => void;
  initialData: TrainingRecord | null;
  lang: Language;
}

const TrainingModal: React.FC<TrainingModalProps> = ({ isOpen, onClose, onSave, initialData, lang }) => {
  const [formData, setFormData] = useState<TrainingRecord>({
    id: '',
    traineeName: '',
    employeeId: '',
    courseName: '',
    completionDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active',
    certificateId: '',
    provider: '',
    score: 0,
    certFileData: '',
    certFileName: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `TR-${Date.now()}`,
        traineeName: '',
        employeeId: '',
        courseName: '',
        completionDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Active',
        certificateId: `CERT-${Math.floor(100000 + Math.random() * 899999)}`,
        provider: '',
        score: 100,
        certFileData: '',
        certFileName: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ 
          ...formData, 
          certFileData: event.target?.result as string,
          certFileName: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Fix: Explicitly type the return value to match TrainingRecord status type
  const calculateStatus = (expiry: string): 'Active' | 'Expiring' | 'Expired' => {
    const expDate = new Date(expiry);
    const now = new Date();
    const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Expired';
    if (diffDays < 60) return 'Expiring';
    return 'Active';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      status: calculateStatus(formData.expiryDate)
    };
    onSave(finalData);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20">
        <div className="p-8 bg-slate-950 text-white flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-xl shadow-amber-400/20">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">{initialData ? 'Update Competency' : 'Register Certification'}</h3>
              <p className="text-[8px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-0.5">Personnel Training Archive v2.1</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-6 bg-slate-50/50 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Trainee Name</label>
              <input required type="text" value={formData.traineeName} onChange={e => setFormData({...formData, traineeName: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-400/10 transition-all shadow-sm" placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Employee ID</label>
              <input required type="text" value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-mono text-xs font-black text-indigo-600 outline-none focus:ring-4 focus:ring-amber-400/10 transition-all shadow-sm" placeholder="EMP-XXXX" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Course Designation</label>
            <input required type="text" value={formData.courseName} onChange={e => setFormData({...formData, courseName: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-400/10 transition-all shadow-sm" placeholder="e.g. Advanced Chemical Handling" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Training Provider</label>
              <input required type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-4 focus:ring-amber-400/10 transition-all shadow-sm" placeholder="e.g. EHS Global Inst." />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assessment Score (%)</label>
              <input type="number" value={formData.score} onChange={e => setFormData({...formData, score: Number(e.target.value)})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-700 outline-none focus:ring-4 focus:ring-amber-400/10 transition-all shadow-sm" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Completion Date</label>
              <input required type="date" value={formData.completionDate} onChange={e => setFormData({...formData, completionDate: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
              <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none" />
            </div>
          </div>

          {/* Certificate Upload */}
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Certificate Archive (PDF/Image)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-[2rem] cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                formData.certFileData ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-200 bg-white hover:border-amber-400'
              }`}
            >
              {formData.certFileData ? (
                <>
                  <i className="fa-solid fa-file-circle-check text-2xl text-emerald-500"></i>
                  <p className="text-xs font-black text-slate-700 truncate max-w-full px-4">{formData.certFileName}</p>
                  <p className="text-[8px] font-black text-emerald-600 uppercase">READY FOR ARCHIVE</p>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-300"></i>
                  <p className="text-xs font-bold text-slate-400">Click to upload training evidence</p>
                </>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileSelect} />
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-white text-slate-500 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest border border-slate-200">Cancel</button>
            <button type="submit" className="flex-[2] py-4 bg-black text-amber-400 font-black rounded-3xl shadow-2xl uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all border border-white/10">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingTracker;
