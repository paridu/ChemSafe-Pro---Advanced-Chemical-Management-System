
import React, { useState } from 'react';
import { HAZARD_COLORS } from '../constants';
import { ChemicalItem, HazardClass } from '../types';
import ChemicalModal from './ChemicalModal';
import { aiHub } from '../services/aiService';

interface InventoryTableProps {
  chemicals: ChemicalItem[];
  onSave: (item: ChemicalItem) => void;
  onDelete: (id: string) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({ chemicals, onSave, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filterHazard, setFilterHazard] = useState<HazardClass | 'All'>('All');
  const [isScanning, setIsScanning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChemicalItem | null>(null);

  // AI Assessment State
  const [assessingId, setAssessingId] = useState<string | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<{name: string, text: string} | null>(null);

  const filtered = chemicals.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.casNumber.includes(search);
    const matchesHazard = filterHazard === 'All' || item.hazardClass.includes(filterHazard as HazardClass);
    return matchesSearch && matchesHazard;
  });

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setSearch('C0028/2025');
      setIsScanning(false);
    }, 2000);
  };

  const handleRiskAssessment = async (item: ChemicalItem) => {
    setAssessingId(item.id);
    try {
      const result = await aiHub.analyzeHazard(item.name, item.casNumber);
      setAssessmentResult({ name: item.name, text: result });
    } catch (error) {
      alert("Failed to reach AI Safety Engine.");
    } finally {
      setAssessingId(null);
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Description', 'CAS Number', 'Hazard Classes', 'Location', 'Quantity', 'Unit', 'Expiry Date', 'Responsible Person'];
    const rows = chemicals.map(item => [
      item.id,
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.description.replace(/"/g, '""')}"`,
      item.casNumber,
      `"${item.hazardClass.join(', ')}"`,
      `"${item.location.replace(/"/g, '""')}"`,
      item.quantity,
      item.unit,
      item.expiryDate,
      `"${item.responsiblePerson.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `chemsafe_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ChemicalItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (item: ChemicalItem) => {
    onSave(item);
    setIsModalOpen(false);
  };

  const downloadSds = (item: ChemicalItem) => {
    if (item.sdsFileData) {
      const link = document.createElement('a');
      link.href = item.sdsFileData;
      link.download = item.sdsFileName || 'msds_document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Name, or CAS Number..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <button 
            onClick={handleSimulateScan}
            className={`px-4 py-3 rounded-xl transition-all border flex items-center gap-2 ${
              isScanning ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
            }`}
          >
            <i className={`fa-solid ${isScanning ? 'fa-spinner fa-spin' : 'fa-qrcode'}`}></i>
            <span className="hidden sm:inline">{isScanning ? 'Scanning...' : 'Scan Label'}</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <select 
            className="flex-1 md:flex-none px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-slate-600"
            value={filterHazard}
            onChange={(e) => setFilterHazard(e.target.value as any)}
          >
            <option value="All">All Hazards</option>
            {Object.values(HazardClass).map(h => <option key={h} value={h}>{h}</option>)}
          </select>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleExportCSV}
              className="flex-1 sm:flex-none px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <i className="fa-solid fa-file-export"></i>
              Export CSV
            </button>
            <button 
              onClick={handleAdd}
              className="flex-1 sm:flex-none px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <i className="fa-solid fa-plus"></i>
              Add New
            </button>
          </div>
        </div>
      </div>

      {isScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Camera Scanner</h3>
              <button onClick={() => setIsScanning(false)} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <div className="relative aspect-square bg-slate-900 flex items-center justify-center">
              <div className="absolute inset-10 border-2 border-indigo-400 border-dashed rounded-3xl opacity-50"></div>
              <div className="w-1/2 h-0.5 bg-indigo-400 absolute top-1/2 left-1/4 animate-bounce shadow-[0_0_10px_rgba(129,140,248,0.8)]"></div>
              <i className="fa-solid fa-camera text-slate-700 text-6xl opacity-20"></i>
              <p className="absolute bottom-8 text-white/60 text-sm font-medium">Position label within the box</p>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 text-slate-500">
                <i className="fa-solid fa-info-circle text-indigo-500"></i>
                <p className="text-sm">Detecting barcodes and QR codes automatically...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Assessment Result Modal */}
      {assessmentResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20 flex flex-col max-h-[85vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-black text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-xl shadow-amber-400/20">
                  <i className="fa-solid fa-bolt"></i>
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">AI Risk Profile</h3>
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">{assessmentResult.name}</p>
                </div>
              </div>
              <button onClick={() => setAssessmentResult(null)} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                <i className="fa-solid fa-times text-xl text-slate-400 hover:text-white"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {assessmentResult.text}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-white flex justify-center">
              <button 
                onClick={() => setAssessmentResult(null)}
                className="px-10 py-3 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-5">ID / CAS</th>
                <th className="px-6 py-5">Chemical Name</th>
                <th className="px-6 py-5">Hazard Class</th>
                <th className="px-6 py-5">Stock Level</th>
                <th className="px-6 py-5">MSDS</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length > 0 ? filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-800 tracking-tight">{item.id}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.casNumber}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2 mt-1">
                       <i className="fa-solid fa-location-dot text-indigo-300"></i>
                       {item.location}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {item.hazardClass.map(h => (
                        <span key={h} className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${HAZARD_COLORS[h]}`}>
                          {h}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="w-24">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-black uppercase ${item.quantity < 30 ? 'text-red-600' : 'text-slate-500'}`}>
                          {item.quantity} {item.unit}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${item.quantity < 30 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${Math.min(100, item.quantity)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {item.sdsAvailable ? (
                      <button 
                        onClick={() => downloadSds(item)}
                        className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Download Original SDS"
                      >
                        <i className="fa-solid fa-file-pdf"></i>
                      </button>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-200 border border-slate-100 flex items-center justify-center" title="No SDS Uploaded">
                        <i className="fa-solid fa-file-circle-xmark"></i>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleRiskAssessment(item)}
                        disabled={assessingId === item.id}
                        className={`w-10 h-10 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
                          assessingId === item.id 
                            ? 'bg-amber-100 border-amber-300 text-amber-600' 
                            : 'bg-white border-slate-100 text-amber-500 hover:bg-amber-400 hover:text-white hover:border-amber-400'
                        }`}
                        title="AI Risk Assessment"
                      >
                        <i className={`fa-solid ${assessingId === item.id ? 'fa-spinner fa-spin' : 'fa-bolt'}`}></i>
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 transition-all flex items-center justify-center" 
                        title="Edit Item"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 border border-slate-100 transition-all flex items-center justify-center" 
                        title="Delete Item"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-slate-400">
                    <i className="fa-solid fa-box-open text-6xl mb-6 opacity-10"></i>
                    <p className="font-bold uppercase tracking-widest text-[10px]">No matches found in database</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-flask-vial text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-vial text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Chemical Asset Registration</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การบันทึกข้อมูลสารเคมีแบบ Manual มีความล่าช้า ข้อมูลตกหล่น และยากต่อการติดตามวันหมดอายุหรือสถานะ SDS ที่เป็นปัจจุบัน</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบทะเบียนดิจิทัลที่รองรับการสแกน QR/Barcode พร้อมเชื่อมต่อฐานข้อมูล SDS และ AI ประเมินความเสี่ยงทันทีที่ลงทะเบียน</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      <ChemicalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveItem} 
        initialData={selectedItem}
      />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InventoryTable;
