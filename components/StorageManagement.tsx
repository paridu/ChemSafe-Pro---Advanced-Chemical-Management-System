
import React, { useState, useRef, useEffect } from 'react';
import { StorageLocation, PPEItem, Language, ChemicalItem, HazardClass } from '../types';
import { TRANSLATIONS, HAZARD_COLORS } from '../constants';
import FactoryLayoutMapping from './FactoryLayoutMapping';

interface StorageManagementProps {
  storages: StorageLocation[];
  chemicals: ChemicalItem[];
  ppeItems: PPEItem[];
  lang: Language;
  onUpdate: (storage: StorageLocation) => void;
  onDelete: (id: string) => void;
  onAdd: (storage: StorageLocation) => void;
  onMoveChemical: (chemicalId: string, storageId: string) => void;
  onTogglePPE: (storageId: string, ppeId: string) => void;
  onUpdateChemical: (chemical: ChemicalItem) => void;
  onAddNewBatch: (baseChemical: ChemicalItem, storageId: string) => void;
  onUpdateStoragePos: (id: string, x: number, y: number, lat?: number, lng?: number) => void;
  compatibilityMatrix: Record<HazardClass, HazardClass[]>;
}

const StorageManagement: React.FC<StorageManagementProps> = ({ 
  storages, chemicals, ppeItems, lang, 
  onUpdate, onDelete, onAdd, onMoveChemical, onTogglePPE, onUpdateChemical, onAddNewBatch,
  onUpdateStoragePos,
  compatibilityMatrix
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTab, setActiveTab] = useState<'workspace' | 'overall' | 'mapping'>('overall');
  const [editingChem, setEditingChem] = useState<ChemicalItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMatrixRef, setShowMatrixRef] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<StorageLocation | null>(null);
  const [compatibilityError, setCompatibilityError] = useState<{name: string, conflict: string} | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const totalCapacity = storages.reduce((acc, s) => acc + s.capacity, 0);
  const usedCapacity = chemicals.reduce((acc, c) => acc + c.quantity, 0);
  const usagePercentage = Math.round((usedCapacity / totalCapacity) * 100);

  const checkCompatibility = (targetStorageId: string, incomingHazardClasses: HazardClass[]): {ok: boolean, conflict?: string} => {
    const existingInStorage = chemicals.filter(c => c.storageId === targetStorageId);
    for (const existingChem of existingInStorage) {
      for (const existingHazard of existingChem.hazardClass) {
        const incompatibles = compatibilityMatrix[existingHazard] || [];
        for (const incomingHazard of incomingHazardClasses) {
          if (incompatibles.includes(incomingHazard)) {
            return { ok: false, conflict: `${existingChem.name} (${existingHazard}) vs ${incomingHazard}` };
          }
        }
      }
    }
    return { ok: true };
  };

  const handleDragStart = (e: React.DragEvent, id: string, type: 'chemical' | 'ppe' | 'move_chemical') => {
    e.dataTransfer.setData('application/chemsafe', JSON.stringify({ id, type }));
    const dragIcon = document.createElement('div');
    dragIcon.className = "bg-black text-amber-400 p-3 rounded-2xl text-[10px] font-black uppercase shadow-2xl border border-amber-400/20";
    dragIcon.innerHTML = `<i class="fa-solid ${type === 'ppe' ? 'fa-shield-halved' : 'fa-flask'} mr-2"></i> ${type === 'ppe' ? 'Deploy PPE' : 'Deploy Batch'}`;
    document.body.appendChild(dragIcon);
    e.dataTransfer.setDragImage(dragIcon, 0, 0);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  const handleDrop = (e: React.DragEvent, storageId: string) => {
    e.preventDefault();
    setDragOverTarget(null);
    const data = e.dataTransfer.getData('application/chemsafe');
    if (!data) return;
    const { id, type } = JSON.parse(data);
    
    if (type === 'chemical' || type === 'move_chemical') {
      const chem = chemicals.find(c => c.id === id);
      if (chem) {
        const result = checkCompatibility(storageId, chem.hazardClass);
        if (!result.ok) {
          setCompatibilityError({ name: chem.name, conflict: result.conflict! });
          setTimeout(() => setCompatibilityError(null), 6000);
          return;
        }
        if (type === 'chemical') onAddNewBatch(chem, storageId);
        else onMoveChemical(id, storageId);
      }
    } else if (type === 'ppe') {
      onTogglePPE(storageId, id);
    }
  };

  const handleDragOver = (e: React.DragEvent, storageId: string) => {
    e.preventDefault();
    setDragOverTarget(storageId);
  };

  const renderOverall = () => {
    const chemGroups: Record<string, ChemicalItem[]> = {};
    chemicals.forEach(c => {
      if (!chemGroups[c.name]) chemGroups[c.name] = [];
      chemGroups[c.name].push(c);
    });

    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">{t.storage.usage}</p>
            <div className="flex items-end justify-between mb-4">
              <h4 className="text-4xl font-black text-black">{usagePercentage}%</h4>
              <p className="text-xs text-slate-400 font-bold">{usedCapacity.toLocaleString()} / {totalCapacity.toLocaleString()} L</p>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${usagePercentage > 85 ? 'bg-red-500' : 'bg-black'}`} style={{ width: `${usagePercentage}%` }}></div>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.storage.batches}</p>
              <h4 className="text-3xl font-black text-black">{chemicals.length}</h4>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-xl">
              <i className="fa-solid fa-layer-group"></i>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between transition-transform hover:scale-[1.02]">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.storage.safety_coverage}</p>
              <h4 className="text-3xl font-black text-emerald-500">100%</h4>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl">
              <i className="fa-solid fa-user-shield"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-black">
            <h4 className="font-black text-white uppercase tracking-tight">Facility Storage Directory</h4>
            <button onClick={() => { setSelectedStorage(null); setIsModalOpen(true); }} className="px-6 py-2 bg-amber-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all">
              {t.common.add} Site
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-8 py-5">Storage Name / ID</th>
                  <th className="px-8 py-5">Zone / Area</th>
                  <th className="px-8 py-5">Mandatory PPE</th>
                  <th className="px-8 py-5">Responsible Person</th>
                  <th className="px-8 py-5">Utilization</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {storages.map(storage => {
                   const siteUsed = chemicals.filter(c => c.storageId === storage.id).reduce((acc, l) => acc + l.quantity, 0);
                   const siteUsagePct = Math.round((siteUsed / storage.capacity) * 100);
                   return (
                    <tr key={storage.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                           {storage.photo ? (
                             <img src={storage.photo} className="w-10 h-10 rounded-lg object-cover border border-slate-200" alt={storage.name} />
                           ) : (
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${storage.status === 'Normal' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                               <i className="fa-solid fa-warehouse text-xs"></i>
                             </div>
                           )}
                           <div>
                              <p className="font-bold text-black text-sm leading-tight">{storage.name}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">{storage.id}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-600 uppercase">{storage.area}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-1.5">
                           {storage.requiredPPE.map(pId => (
                             <div key={pId} className="w-7 h-7 rounded bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]" title={ppeItems.find(p => p.id === pId)?.name}>
                               <i className={`fa-solid ${ppeItems.find(p => p.id === pId)?.icon}`}></i>
                             </div>
                           ))}
                           {storage.requiredPPE.length === 0 && <span className="text-[10px] text-slate-300 font-bold uppercase">None</span>}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-[10px]">
                             {storage.responsiblePersonName?.charAt(0) || 'U'}
                           </div>
                           <span className="text-xs font-bold text-slate-700">{storage.responsiblePersonName || 'Unassigned'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="flex-1 min-w-[60px] h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${siteUsagePct > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${siteUsagePct}%` }}></div>
                           </div>
                           <span className="text-[10px] font-black text-slate-400">{siteUsagePct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Industrial Intelligence Memo */}
        <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-warehouse text-7xl text-amber-400"></i>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
                <i className="fa-solid fa-map text-amber-400 text-3xl"></i>
            </div>
            <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                  <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Storage & Zone Logistics</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">การจัดเก็บสารเคมีผิดประเภทใกล้กัน (เช่น กรดใกล้ด่าง) เสี่ยงต่อการเกิดปฏิกิริยารุนแรง และยากต่อการควบคุมปริมาณการใช้พื้นที่</p>
                  </div>
                  <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                    <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบตรวจสอบความเข้ากันได้อัตโนมัติขณะลากวาง (Compatibility Check) พร้อมหน้าแสดงผลการใช้พื้นที่และจุดติดตั้ง PPE ประจำโซน</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkspace = () => (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-250px)] animate-in slide-in-from-right-8 duration-500">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {compatibilityError && (
          <div className="mb-6 bg-red-600 text-white p-6 rounded-3xl shadow-xl shadow-red-500/20 flex items-center justify-between animate-in slide-in-from-top-4 border-l-8 border-red-800">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                 <i className="fa-solid fa-radiation"></i>
               </div>
               <div>
                 <p className="font-black text-sm uppercase tracking-widest">{t.storage.compatibility_warning}</p>
                 <p className="text-xs font-bold opacity-90">{compatibilityError.name} conflicting with {compatibilityError.conflict}</p>
               </div>
             </div>
             <button onClick={() => setCompatibilityError(null)} className="p-2 hover:bg-white/10 rounded-full">
               <i className="fa-solid fa-times"></i>
             </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {storages.map(storage => {
            const items = chemicals.filter(c => c.storageId === storage.id);
            const isDraggingOver = dragOverTarget === storage.id;
            const currentVolume = items.reduce((acc, c) => acc + c.quantity, 0);
            const utilization = Math.round((currentVolume / storage.capacity) * 100);

            return (
              <div 
                key={storage.id}
                onDragOver={(e) => handleDragOver(e, storage.id)}
                onDragLeave={() => setDragOverTarget(null)}
                onDrop={(e) => handleDrop(e, storage.id)}
                className={`bg-white rounded-[2.5rem] border-2 transition-all group flex flex-col min-h-[480px] relative overflow-hidden ${
                  isDraggingOver 
                    ? 'border-amber-400 bg-amber-50/50 scale-[1.03] shadow-2xl z-10' 
                    : 'border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-slate-200/50'
                }`}
              >
                <div className="h-32 bg-slate-100 relative overflow-hidden">
                   {storage.photo ? (
                     <img src={storage.photo} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700" alt={storage.name} />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 text-slate-300">
                        <i className="fa-solid fa-warehouse text-4xl opacity-50"></i>
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                   <div className="absolute bottom-4 left-6 flex items-end gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-lg border-2 ${
                        storage.status === 'Normal' ? 'bg-emerald-500 text-white border-white' :
                        storage.status === 'Warning' ? 'bg-amber-500 text-white border-white' : 'bg-red-500 text-white border-white'
                      }`}>
                        <i className="fa-solid fa-warehouse"></i>
                      </div>
                      <div>
                        <h5 className="font-black text-white uppercase tracking-tight text-lg leading-none mb-1 drop-shadow-md">{storage.name}</h5>
                        <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest drop-shadow-md">{storage.area}</p>
                      </div>
                   </div>
                   
                   <button 
                      onClick={() => { setSelectedStorage(storage); setIsModalOpen(true); }}
                      className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/60 backdrop-blur-md text-white hover:bg-white hover:text-black flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-xl border border-white/20"
                    >
                      <i className="fa-solid fa-gear text-sm"></i>
                    </button>
                </div>

                {isDraggingOver && (
                  <div className="absolute inset-0 border-4 border-dashed border-amber-400/40 rounded-[2.5rem] animate-pulse pointer-events-none z-20"></div>
                )}

                <div className="p-6 space-y-6 flex-1 flex flex-col">
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Utilization</p>
                        <span className={`text-xs font-black ${utilization > 90 ? 'text-red-500' : 'text-slate-700'}`}>{utilization}% ({currentVolume}/{storage.capacity} L)</span>
                    </div>
                    <div className="w-full h-2 bg-white border border-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${utilization > 90 ? 'bg-red-500' : 'bg-indigo-600'}`} style={{ width: `${utilization}%` }}></div>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1 overflow-hidden">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory Segregation ({items.length})</p>
                    <div className="space-y-1.5 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
                      {items.map(c => (
                        <div 
                          key={c.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, c.id, 'move_chemical')}
                          className="p-3 bg-white border border-slate-100 rounded-2xl flex justify-between items-center group/item hover:border-amber-400 hover:shadow-lg transition-all cursor-grab active:cursor-grabbing"
                        >
                          <div className="flex items-center gap-3">
                             <div className={`w-1.5 h-7 rounded-full ${HAZARD_COLORS[c.hazardClass[0]]?.split(' ')[0] || 'bg-slate-200'}`}></div>
                             <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{c.name}</p>
                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">{c.id}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-black text-amber-600">{c.quantity}{c.unit}</span>
                            <button 
                              onClick={() => setEditingChem(c)}
                              className="w-7 h-7 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 hover:bg-black hover:text-white transition-all opacity-0 group-hover/item:opacity-100"
                            >
                              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                        Safety Gear
                      </p>
                      <div className="flex flex-wrap gap-1.5 p-2 bg-emerald-50/50 rounded-2xl border border-emerald-100/30">
                        {storage.requiredPPE.map(pId => {
                          const ppe = ppeItems.find(p => p.id === pId);
                          return (
                            <div 
                              key={pId} 
                              onClick={() => onTogglePPE(storage.id, pId)} 
                              className="w-8 h-8 rounded-xl bg-white border border-emerald-100 text-emerald-600 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm" 
                              title={`Remove ${ppe?.name}`}
                            >
                              <i className={`fa-solid ${ppe?.icon} text-xs`}></i>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <i className="fa-solid fa-user-tie text-blue-500"></i>
                        Custody
                      </p>
                      <div className="flex items-center gap-3 p-2 bg-blue-50/30 border border-blue-100/30 rounded-2xl overflow-hidden">
                         <div className="w-8 h-8 shrink-0 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-600 font-black text-[10px]">
                            {storage.responsiblePersonName?.charAt(0) || 'U'}
                         </div>
                         <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-700 truncate">{storage.responsiblePersonName || 'Unassigned'}</p>
                            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter">Site Manager</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 pb-10">
        <div className="bg-black rounded-[2.5rem] p-6 flex-1 flex flex-col overflow-hidden shadow-2xl border border-white/5">
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
             <div>
                <h4 className="text-white font-black flex items-center gap-2 uppercase tracking-tighter">
                  <i className="fa-solid fa-boxes-packing text-amber-400"></i>
                  Inventory Depot
                </h4>
                <p className="text-[8px] text-amber-400/50 font-black uppercase tracking-[0.2em] mt-1">Industrial Batches</p>
             </div>
             <button 
                onClick={() => setShowMatrixRef(true)}
                className="w-9 h-9 rounded-xl bg-white/5 text-slate-400 hover:text-amber-400 hover:bg-white/10 flex items-center justify-center transition-all border border-white/5"
             >
                <i className="fa-solid fa-shield-cat"></i>
             </button>
          </div>
          <div className="space-y-2.5 overflow-y-auto custom-scrollbar flex-1 pr-2">
            {Array.from(new Set(chemicals.map(c => c.name))).map(name => {
              const base = chemicals.find(c => c.name === name)!;
              return (
                <div 
                  key={name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, base.id, 'chemical')}
                  className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-grab hover:bg-amber-400 group transition-all"
                >
                  <span className="text-[11px] font-black text-slate-300 group-hover:text-black truncate block uppercase tracking-tight">{name}</span>
                  <div className="flex flex-wrap gap-1 mt-2.5">
                     {base.hazardClass.map(h => (
                       <span key={h} className="text-[7px] bg-black/40 text-white/50 px-1.5 py-0.5 rounded-md border border-white/5 group-hover:bg-black/20 group-hover:text-black uppercase font-black">{h}</span>
                     ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
          <h4 className="font-black text-black mb-5 flex items-center gap-3 uppercase text-xs">
            <i className="fa-solid fa-kit-medical text-emerald-500"></i>
            Deploy Safety Gear
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {ppeItems.map(p => (
              <div 
                key={p.id}
                draggable
                onDragStart={(e) => handleDragStart(e, p.id, 'ppe')}
                className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-xl text-slate-400 cursor-grab hover:bg-black hover:text-amber-400 transition-all shadow-sm active:scale-90 group"
              >
                <i className={`fa-solid ${p.icon}`}></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('overall')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'overall' ? 'bg-black text-amber-400 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Overall Depot
        </button>
        <button 
          onClick={() => setActiveTab('workspace')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'workspace' ? 'bg-black text-amber-400 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Interactive Workflow
        </button>
        <button 
          onClick={() => setActiveTab('mapping')}
          className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'mapping' ? 'bg-black text-amber-400 shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
        >
          {lang === 'en' ? 'Spatial Mapping' : 'แผนผังพื้นที่'}
        </button>
      </div>

      {activeTab === 'overall' && renderOverall()}
      {activeTab === 'workspace' && renderWorkspace()}
      {activeTab === 'mapping' && (
        <div className="h-[calc(100vh-250px)]">
          <FactoryLayoutMapping 
            storages={storages} 
            lang={lang} 
            onUpdateStoragePos={onUpdateStoragePos}
          />
        </div>
      )}

      {/* Reused Memo for Tab Views if necessary */}
      {activeTab !== 'overall' && (
        <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                    <p className="text-xs text-slate-300 leading-relaxed font-medium">การเคลื่อนย้ายสารเคมีระหว่างคลังมักไม่มีการบันทึกที่ชัดเจนและขาดการตรวจสอบความเสถียรของสารที่เก็บร่วมกัน</p>
                  </div>
                  <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                    <p className="text-xs text-amber-100/80 leading-relaxed font-medium">อินเทอร์เฟซแบบลากวางที่เชื่อมต่อกับ Logic ความปลอดภัยสากล ช่วยให้การย้ายของทำได้รวดเร็วและปลอดภัย 100%</p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}

      {showMatrixRef && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-white/20">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-950 text-white">
                 <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-[1.25rem] bg-amber-400 text-black flex items-center justify-center text-3xl shadow-xl shadow-amber-400/20">
                       <i className="fa-solid fa-table-list"></i>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tight">Segregation Protocol</h3>
                       <p className="text-xs text-amber-400 font-bold uppercase tracking-[0.2em] mt-1">Hazard Compatibility Engine</p>
                    </div>
                 </div>
                 <button onClick={() => setShowMatrixRef(false)} className="w-12 h-12 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
                    <i className="fa-solid fa-times text-2xl text-slate-400 hover:text-white"></i>
                 </button>
              </div>
              <div className="flex-1 overflow-auto p-8 custom-scrollbar">
                 <table className="w-full border-collapse rounded-3xl overflow-hidden">
                    <thead className="bg-slate-900 text-white">
                       <tr>
                          <th className="p-5 border border-slate-800 text-left text-xs font-black uppercase tracking-widest bg-slate-950">GHS Classification</th>
                          <th className="p-5 border border-slate-800 text-left text-xs font-black uppercase tracking-widest bg-slate-950">Strict Segregation Requirements</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                       {Object.entries(compatibilityMatrix).map(([hazard, conflicts]) => (
                          <tr key={hazard} className="hover:bg-amber-50/50 transition-colors">
                             <td className="p-5 border border-slate-50">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${HAZARD_COLORS[hazard as HazardClass]}`}>
                                   {hazard}
                                </span>
                             </td>
                             <td className="p-5 border border-slate-50">
                                <div className="flex flex-wrap gap-2">
                                   {conflicts.length > 0 ? conflicts.map(c => (
                                      <span key={c} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[9px] font-black uppercase tracking-tight shadow-sm">
                                         {c}
                                      </span>
                                   )) : <span className="text-xs italic text-slate-300 font-bold">Standard Safety Protocols Only</span>}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {editingChem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-black uppercase tracking-tight mb-2">Adjust Batch Log</h3>
            <p className="text-xs text-slate-400 mb-6 uppercase font-bold tracking-widest leading-relaxed">Update volume parameters for <span className="text-black">{editingChem.name}</span>.</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Volume Quantity ({editingChem.unit})</label>
                <input 
                  type="number" 
                  value={editingChem.quantity}
                  onChange={(e) => setEditingChem({ ...editingChem, quantity: Number(e.target.value) })}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl text-xl font-black outline-none focus:ring-4 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
                />
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingChem(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-3xl hover:bg-slate-200 transition-colors uppercase text-[10px] tracking-widest"
                >
                  Discard
                </button>
                <button 
                  onClick={() => {
                    onUpdateChemical(editingChem);
                    setEditingChem(null);
                  }}
                  className="flex-1 py-4 bg-black text-amber-400 font-black rounded-3xl shadow-xl hover:bg-slate-900 transition-colors uppercase text-[10px] tracking-widest border border-white/10"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <StorageLocationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(s) => {
            if (selectedStorage) onUpdate(s);
            else onAdd(s);
            setIsModalOpen(false);
          }}
          initialData={selectedStorage}
          lang={lang}
        />
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border-radius: 10px; }
      `}</style>
    </div>
  );
};

interface StorageLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (storage: StorageLocation) => void;
  initialData: StorageLocation | null;
  lang: Language;
}

const StorageLocationModal: React.FC<StorageLocationModalProps> = ({ isOpen, onClose, onSave, initialData, lang }) => {
  const [formData, setFormData] = useState<StorageLocation>({
    id: '',
    name: '',
    area: '',
    description: '',
    capacity: 0,
    requiredPPE: [],
    status: 'Normal',
    lat: 0,
    lng: 0,
    responsiblePersonName: '',
    photo: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `STR-${Math.floor(Math.random() * 1000)}`,
        name: '',
        area: '',
        description: '',
        capacity: 1000,
        requiredPPE: [],
        status: 'Normal',
        lat: 0,
        lng: 0,
        responsiblePersonName: '',
        photo: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, photo: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-950 text-white">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-xl shadow-amber-400/20">
                <i className="fa-solid fa-wrench"></i>
             </div>
             <h3 className="text-2xl font-black uppercase tracking-tight">
               {initialData ? 'Configure Node' : 'Initialize Site'}
             </h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white p-2 transition-colors">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Facility Documentation (Storage Photo)</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`h-48 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center relative ${
                formData.photo ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-white hover:border-amber-400 hover:bg-slate-50'
              }`}
            >
               {formData.photo ? (
                 <>
                   <img src={formData.photo} className="w-full h-full object-cover" alt="Storage Preview" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black uppercase">Change Photo</div>
                 </>
               ) : (
                 <div className="text-center p-6">
                    <i className="fa-solid fa-camera text-3xl text-slate-300 mb-3"></i>
                    <p className="text-xs font-bold text-slate-500">Capture or Upload Storage Area Image</p>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase">Visual identification for safety protocols</p>
                 </div>
               )}
               <input 
                 ref={fileInputRef}
                 type="file" 
                 accept="image/*" 
                 onChange={handlePhotoUpload} 
                 className="hidden" 
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Site Designation</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm transition-all"
                placeholder="e.g. Acid Vault A1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Zone Assignment</label>
              <input 
                type="text" 
                value={formData.area}
                onChange={e => setFormData({...formData, area: e.target.value})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm transition-all"
                placeholder="e.g. Logistics Wing"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Responsible Person (Manager)</label>
            <input 
              type="text" 
              value={formData.responsiblePersonName}
              onChange={e => setFormData({...formData, responsiblePersonName: e.target.value})}
              className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm transition-all"
              placeholder="e.g. Somchai P."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Latitude</label>
                <input 
                  type="number" step="any"
                  value={formData.lat}
                  onChange={e => setFormData({...formData, lat: Number(e.target.value)})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm"
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Longitude</label>
                <input 
                  type="number" step="any"
                  value={formData.lng}
                  onChange={e => setFormData({...formData, lng: Number(e.target.value)})}
                  className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm"
                />
             </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Max Capacity (Liters)</label>
                <input 
                type="number" 
                value={formData.capacity}
                onChange={e => setFormData({...formData, capacity: Number(e.target.value)})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm"
                required
                />
            </div>
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Status Protocol</label>
                <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value as any})}
                className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 font-bold shadow-sm appearance-none"
                >
                <option value="Normal">NORMAL OPS</option>
                <option value="Warning">WARNING / INSPECTION</option>
                <option value="Full">FULL CAPACITY</option>
                </select>
            </div>
          </div>
          
          <div className="pt-8 flex gap-4">
            <button type="button" onClick={onClose} className="flex-1 py-5 bg-white text-slate-500 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest border border-slate-200 shadow-sm">Cancel</button>
            <button type="submit" className="flex-[2] py-5 bg-black text-amber-400 font-black rounded-3xl shadow-2xl uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all border border-white/10">Synchronize Node</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StorageManagement;
