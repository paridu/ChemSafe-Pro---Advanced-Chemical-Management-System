
import React, { useState, useEffect, useRef } from 'react';
import { ChemicalItem, HazardClass } from '../types';

interface ChemicalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ChemicalItem) => void;
  initialData?: ChemicalItem | null;
}

const ChemicalModal: React.FC<ChemicalModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<ChemicalItem>>({
    name: '',
    description: '',
    casNumber: '',
    hazardClass: [],
    location: '',
    quantity: 0,
    unit: 'Liters',
    expiryDate: '',
    responsiblePerson: '',
    revisionDate: new Date().toISOString().split('T')[0],
    retentionYears: 5,
    sdsAvailable: false,
    sdsFileData: '',
    sdsFileName: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `C${Math.floor(1000 + Math.random() * 9000)}/2025`,
        name: '',
        description: '',
        casNumber: '',
        hazardClass: [],
        location: '',
        quantity: 0,
        unit: 'Liters',
        expiryDate: '',
        responsiblePerson: '',
        revisionDate: new Date().toISOString().split('T')[0],
        retentionYears: 5,
        sdsAvailable: false,
        sdsFileData: '',
        sdsFileName: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as ChemicalItem);
  };

  const toggleHazard = (hazard: HazardClass) => {
    const current = formData.hazardClass || [];
    if (current.includes(hazard)) {
      setFormData({ ...formData, hazardClass: current.filter(h => h !== hazard) });
    } else {
      setFormData({ ...formData, hazardClass: [...current, hazard] });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData({
          ...formData,
          sdsAvailable: true,
          sdsFileData: base64,
          sdsFileName: file.name
        });
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert("Please upload a PDF file.");
    }
  };

  const removeSds = () => {
    setFormData({
      ...formData,
      sdsAvailable: false,
      sdsFileData: '',
      sdsFileName: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const viewSds = () => {
    if (formData.sdsFileData) {
      const link = document.createElement('a');
      link.href = formData.sdsFileData;
      link.download = formData.sdsFileName || 'msds_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <i className={`fa-solid ${initialData ? 'fa-pen-to-square text-indigo-500' : 'fa-plus text-emerald-500'}`}></i>
            {initialData ? 'Update Chemical Data' : 'New Chemical Entry'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Full Chemical Name *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                placeholder="e.g. Isopropyl Alcohol 99%"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">CAS Number</label>
              <input
                type="text"
                value={formData.casNumber}
                onChange={e => setFormData({ ...formData, casNumber: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                placeholder="00-00-0"
              />
            </div>
          </div>

          {/* SDS Upload Section */}
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-file-shield text-red-500"></i>
                Official SDS / MSDS (PDF)
              </span>
              {formData.sdsAvailable && <span className="text-emerald-500 flex items-center gap-1 font-bold"><i className="fa-solid fa-check-circle"></i> Document Linked</span>}
            </label>
            <div className={`p-8 border-2 border-dashed rounded-3xl transition-all ${formData.sdsAvailable ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'}`}>
              {!formData.sdsAvailable ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 text-3xl shadow-sm mb-4 group-hover:text-indigo-400 transition-colors">
                     <i className="fa-solid fa-file-arrow-up"></i>
                  </div>
                  <p className="text-sm font-bold text-slate-600">Click or drag SDS file to upload</p>
                  <p className="text-[10px] text-slate-400 uppercase font-black mt-2">Maximum file size: 10MB (.PDF only)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    className="hidden" 
                    accept="application/pdf"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-2xl text-red-500 shadow-sm">
                      <i className="fa-solid fa-file-pdf"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-700 truncate max-w-[280px]">{formData.sdsFileName}</p>
                      <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mt-1">Ready for storage</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={viewSds}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center justify-center"
                      title="Download/View"
                    >
                      <i className="fa-solid fa-eye"></i>
                    </button>
                    <button 
                      type="button"
                      onClick={removeSds}
                      className="w-10 h-10 bg-white border border-red-100 rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm flex items-center justify-center"
                      title="Remove"
                    >
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Starting Qty *</label>
              <input
                required
                type="number"
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Unit</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              >
                <option>Liters</option>
                <option>kg</option>
                <option>ml</option>
                <option>Gallons</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Expiry Date *</label>
              <input
                required
                type="date"
                value={formData.expiryDate}
                onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Hazard Classes</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(HazardClass).map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => toggleHazard(h)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                    formData.hazardClass?.includes(h)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-8 py-3 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase tracking-widest text-[10px]">Cancel</button>
          <button
            onClick={handleSubmit}
            className="px-12 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest text-[10px]"
          >
            {initialData ? 'Update Record' : 'Confirm Registration'}
          </button>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default ChemicalModal;
