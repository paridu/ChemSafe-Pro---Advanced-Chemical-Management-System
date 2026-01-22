
import React, { useState, useRef, useEffect } from 'react';
import { ChemicalItem, SDSDocument, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface SDSRepositoryProps {
  sdsDocs: SDSDocument[];
  chemicals: ChemicalItem[];
  onSave: (doc: SDSDocument) => void;
  onDelete: (id: string) => void;
  lang: Language;
}

const SDSRepository: React.FC<SDSRepositoryProps> = ({ sdsDocs, chemicals, onSave, onDelete, lang }) => {
  const t = TRANSLATIONS[lang];
  const [search, setSearch] = useState('');
  const [filterStandard, setFilterStandard] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSDS = sdsDocs.filter(sds => {
    const chemical = chemicals.find(c => c.id === sds.chemicalId);
    const matchesSearch = sds.name.toLowerCase().includes(search.toLowerCase()) || 
                          sds.chemicalId.toLowerCase().includes(search.toLowerCase()) ||
                          (chemical?.name.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesStandard = filterStandard === 'All' || sds.standard === filterStandard;
    return matchesSearch && matchesStandard;
  });

  const stats = {
    total: sdsDocs.length,
    ghs: sdsDocs.filter(d => d.standard === 'GHS').length,
    osha: sdsDocs.filter(d => d.standard === 'OSHA').length,
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      {/* Header Stats Bar */}
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fa-solid fa-file-shield text-8xl"></i>
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-amber-400/20">
              <i className="fa-solid fa-folder-tree"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-1">SDS Document Hub</h2>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Centralized Safety Data Repository</p>
            </div>
          </div>
          <div className="flex gap-10">
            <RepoStat label="Total Docs" value={stats.total} />
            <RepoStat label="GHS Standard" value={stats.ghs} />
            <RepoStat label="OSHA Standard" value={stats.osha} />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-4 bg-amber-400 text-black rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 whitespace-nowrap uppercase text-[10px] tracking-widest"
          >
            <i className="fa-solid fa-file-arrow-up mr-2"></i>
            Archive New SDS
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents by name, chemical ID or associated material..." 
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-amber-400 outline-none font-medium text-sm transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={filterStandard}
            onChange={(e) => setFilterStandard(e.target.value)}
            className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-600 appearance-none text-sm min-w-[160px]"
          >
            <option value="All">All Standards</option>
            <option value="GHS">GHS Protocol</option>
            <option value="OSHA">OSHA Standard</option>
            <option value="EU">EU REACH</option>
          </select>
        </div>
      </div>

      {/* SDS Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSDS.map(sds => {
          const chemical = chemicals.find(c => c.id === sds.chemicalId);
          return (
            <div key={sds.id} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-400/5 transition-all group relative overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-2xl shadow-sm group-hover:bg-red-500 group-hover:text-white transition-all">
                  <i className="fa-solid fa-file-pdf"></i>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-black text-amber-400 rounded-lg text-[9px] font-black uppercase tracking-widest h-fit">
                    {sds.standard}
                  </span>
                  <button onClick={() => onDelete(sds.id)} className="text-slate-200 hover:text-red-500 p-1 transition-colors">
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
              
              <div className="mb-6 flex-1">
                <h4 className="font-black text-slate-800 text-lg mb-1 group-hover:text-black transition-colors leading-tight line-clamp-1">{sds.name}</h4>
                <div className="flex items-center gap-2">
                   <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">{sds.chemicalId}</p>
                   <span className="text-slate-200 text-xs">•</span>
                   <p className="text-xs text-slate-400 font-bold italic truncate">{chemical?.name || 'Unknown Material'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-5 border-y border-slate-50 mb-6">
                <div>
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Doc Version</p>
                  <p className="text-xs font-black text-slate-700">{sds.version}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Last Revision</p>
                  <p className="text-xs font-black text-slate-700">{sds.lastUpdated}</p>
                </div>
                <div className="mt-2">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Archived Size</p>
                  <p className="text-xs font-black text-slate-700">{sds.fileSize}</p>
                </div>
                <div className="mt-2 text-right">
                  <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Doc Integrity</p>
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter flex items-center justify-end gap-1">
                    <i className="fa-solid fa-shield-check"></i>
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button className="flex-1 py-3.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg flex items-center justify-center gap-2">
                  <i className="fa-solid fa-download"></i>
                  Download
                </button>
                <button className="px-5 py-3.5 bg-slate-50 text-slate-400 rounded-2xl hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100">
                  <i className="fa-solid fa-share-nodes"></i>
                </button>
              </div>
            </div>
          );
        })}
        {filteredSDS.length === 0 && (
          <div className="col-span-full py-40 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center">
            <i className="fa-solid fa-box-archive text-7xl text-slate-100 mb-6"></i>
            <p className="text-xl font-black text-slate-400 uppercase tracking-widest">Repository Filter Empty</p>
            <p className="text-sm text-slate-300 mt-2">Adjust your query or archive a new safety document.</p>
          </div>
        )}
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-file-pdf text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-shield-halved text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Compliance Document Management</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">เอกสาร SDS/MSDS มักจัดเก็บเป็นกระดาษหรือไฟล์ที่กระจัดกระจาย ทำให้ค้นหายากในภาวะฉุกเฉินและยากต่อการตรวจสอบวันหมดอายุ</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">คลังเอกสารดิจิทัลส่วนกลางที่เชื่อมโยงกับรายการสารเคมีโดยตรง พร้อมระบบติดตามเวอร์ชันและมาตรฐานความปลอดภัยสากล</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <SDSUploadModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(doc) => {
            onSave(doc);
            setIsModalOpen(false);
          }}
          chemicals={chemicals}
          lang={lang}
        />
      )}
    </div>
  );
};

const RepoStat = ({ label, value }: { label: string, value: number }) => (
  <div className="text-center px-6 border-r border-white/10 last:border-0">
    <p className="text-2xl font-black text-white">{value.toString().padStart(2, '0')}</p>
    <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{label}</p>
  </div>
);

interface SDSUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: SDSDocument) => void;
  chemicals: ChemicalItem[];
  lang: Language;
}

const SDSUploadModal: React.FC<SDSUploadModalProps> = ({ isOpen, onClose, onSave, chemicals, lang }) => {
  const [formData, setFormData] = useState<Partial<SDSDocument>>({
    name: '',
    chemicalId: '',
    version: 'v1.0',
    lastUpdated: new Date().toISOString().split('T')[0],
    standard: 'GHS',
    fileSize: '0 KB'
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      setTimeout(() => {
        setFormData({
          ...formData,
          name: file.name.replace(/\.[^/.]+$/, ""),
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        });
        setIsUploading(false);
      }, 1000);
    } else if (file) {
      alert("Invalid format: System only accepts .PDF documents for SDS compliance.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.chemicalId || !formData.name) return;
    
    onSave({
      id: `SDS-${Math.floor(1000 + Math.random() * 9000)}`,
      chemicalId: formData.chemicalId as string,
      name: formData.name as string,
      version: formData.version || 'v1.0',
      lastUpdated: formData.lastUpdated || new Date().toISOString().split('T')[0],
      fileSize: formData.fileSize || '0 KB',
      standard: (formData.standard as any) || 'GHS'
    });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20">
        <div className="p-8 bg-slate-950 text-white flex justify-between items-center border-b border-white/5">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-xl shadow-amber-400/20">
                 <i className="fa-solid fa-file-import"></i>
              </div>
              <div>
                 <h3 className="text-2xl font-black uppercase tracking-tight">Archive SDS Protocol</h3>
                 <p className="text-[8px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-0.5">Material Compliance Archive v4.2</p>
              </div>
           </div>
           <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
              <i className="fa-solid fa-times text-2xl"></i>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-slate-50/50 max-h-[75vh] overflow-y-auto custom-scrollbar">
           {/* Dropzone */}
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Document Payload</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center cursor-pointer transition-all ${
                  formData.name ? 'border-amber-400 bg-amber-50/50' : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-slate-50'
                }`}
              >
                <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-spinner fa-spin text-3xl text-amber-500 mb-4"></i>
                    <p className="text-xs font-black uppercase text-slate-600 tracking-widest">Analyzing Stream...</p>
                  </div>
                ) : formData.name ? (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-500 text-3xl shadow-lg border border-amber-200 mb-4">
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <p className="text-sm font-black text-slate-800 line-clamp-1 max-w-[400px]">{formData.name}</p>
                    <p className="text-[9px] font-black text-amber-600 uppercase mt-2 tracking-widest">{formData.fileSize} • READY FOR ARCHIVE</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center opacity-60 group">
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-3xl mb-4 group-hover:text-amber-500 transition-colors">
                      <i className="fa-solid fa-cloud-arrow-up"></i>
                    </div>
                    <p className="text-sm font-bold text-slate-600">Select Mandatory Safety Data Sheet (.PDF)</p>
                    <p className="text-[9px] text-slate-400 uppercase mt-2 tracking-widest">Compliant with GHS Rev 9 standards</p>
                  </div>
                )}
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Inventory Chemical</label>
                <select 
                  required
                  value={formData.chemicalId}
                  onChange={e => setFormData({...formData, chemicalId: e.target.value})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700 focus:ring-4 focus:ring-amber-400/10 appearance-none shadow-sm"
                >
                  <option value="">Select Material...</option>
                  {chemicals.map(c => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Safety Standard Protocol</label>
                <select 
                  value={formData.standard}
                  onChange={e => setFormData({...formData, standard: e.target.value as any})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700 appearance-none shadow-sm"
                >
                  <option value="GHS">GHS (Globally Harmonized)</option>
                  <option value="OSHA">OSHA Hazard Comm</option>
                  <option value="EU">EU REACH Standard</option>
                </select>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Revision Version</label>
                <input 
                  type="text" 
                  value={formData.version}
                  onChange={e => setFormData({...formData, version: e.target.value})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700 shadow-sm"
                  placeholder="e.g. v4.2 (2024)"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Archive Entry Date</label>
                <input 
                  type="date" 
                  value={formData.lastUpdated}
                  onChange={e => setFormData({...formData, lastUpdated: e.target.value})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none font-bold text-slate-700 shadow-sm"
                />
              </div>
           </div>

           <div className="pt-8 flex gap-5">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-5 bg-white text-slate-500 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest border border-slate-200"
              >
                Discard
              </button>
              <button 
                type="submit" 
                className="flex-[2] py-5 bg-black text-amber-400 font-black rounded-3xl shadow-2xl hover:bg-slate-900 transition-all uppercase text-[10px] tracking-widest border border-white/10"
              >
                Archive Document
              </button>
           </div>
        </form>
      </div>
    </div>
  );
};

export default SDSRepository;
