
import React from 'react';
import { HazardClass, Language } from '../types';
import { TRANSLATIONS, HAZARD_COLORS } from '../constants';

interface CompatibilityConfigProps {
  matrix: Record<HazardClass, HazardClass[]>;
  lang: Language;
  onUpdate: (matrix: Record<HazardClass, HazardClass[]>) => void;
}

const CompatibilityConfig: React.FC<CompatibilityConfigProps> = ({ matrix, lang, onUpdate }) => {
  const t = TRANSLATIONS[lang];
  const hazardClasses = Object.values(HazardClass);

  const toggleConflict = (h1: HazardClass, h2: HazardClass) => {
    // Symmetrical toggle: if h1 is incompatible with h2, h2 must be incompatible with h1
    const newMatrix = { ...matrix };
    const currentH1 = [...(newMatrix[h1] || [])];
    const currentH2 = [...(newMatrix[h2] || [])];

    if (currentH1.includes(h2)) {
      newMatrix[h1] = currentH1.filter(h => h !== h2);
      newMatrix[h2] = currentH2.filter(h => h !== h1);
    } else {
      newMatrix[h1] = [...currentH1, h2];
      newMatrix[h2] = [...currentH2, h1];
    }

    onUpdate(newMatrix);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4 uppercase">
            <i className="fa-solid fa-layer-group text-amber-500"></i>
            {t.nav.compatibility}
          </h1>
          <p className="text-slate-400 font-medium">
            Define global segregation logic for GHS hazard classifications.
          </p>
        </div>
        <div className="px-6 py-2 bg-black text-amber-400 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-amber-400/20">
          Industrial Safety Standard: GHS Rev.9
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 bg-slate-950 text-white flex items-center justify-between border-b border-white/5">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-lg shadow-amber-400/20">
                 <i className="fa-solid fa-table-cells"></i>
              </div>
              <div>
                 <h4 className="text-xl font-black uppercase tracking-tight">Segregation Matrix</h4>
                 <p className="text-[10px] text-amber-400 font-bold uppercase tracking-[0.2em]">Conflict Management Terminal</p>
              </div>
           </div>
        </div>

        <div className="overflow-x-auto p-8 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-50 border border-slate-100"></th>
                {hazardClasses.map(hc => (
                  <th key={hc} className="p-4 bg-slate-50 border border-slate-100 min-w-[120px]">
                    <div className="flex flex-col items-center gap-2">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter text-center whitespace-nowrap ${HAZARD_COLORS[hc]}`}>
                         {hc}
                       </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hazardClasses.map(rowClass => (
                <tr key={rowClass}>
                  <td className="p-4 bg-slate-50 border border-slate-100 font-black text-[10px] uppercase text-slate-500 tracking-widest sticky left-0 z-10">
                    {rowClass}
                  </td>
                  {hazardClasses.map(colClass => {
                    const isSame = rowClass === colClass;
                    const isConflict = matrix[rowClass]?.includes(colClass);
                    
                    return (
                      <td 
                        key={colClass} 
                        className={`p-4 border border-slate-100 text-center transition-all ${isSame ? 'bg-slate-100/50 cursor-not-allowed' : 'cursor-pointer hover:bg-amber-50'}`}
                        onClick={() => !isSame && toggleConflict(rowClass, colClass)}
                      >
                        {!isSame && (
                          <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all ${
                            isConflict 
                              ? 'bg-black text-amber-400 shadow-lg scale-110' 
                              : 'bg-slate-50 text-slate-200'
                          }`}>
                            <i className={`fa-solid ${isConflict ? 'fa-triangle-exclamation' : 'fa-check'}`}></i>
                          </div>
                        )}
                        {isSame && <div className="w-1 h-1 bg-slate-300 rounded-full mx-auto"></div>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-8 items-center">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-lg bg-black text-amber-400 flex items-center justify-center text-[10px] shadow-sm">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                 </div>
                 <span className="text-xs font-black uppercase text-slate-600 tracking-widest">Incompatible</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-lg bg-slate-50 border border-slate-200 text-slate-200 flex items-center justify-center text-[10px]">
                    <i className="fa-solid fa-check"></i>
                 </div>
                 <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Compatible</span>
              </div>
           </div>
           <div className="flex-1 p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl flex gap-4 items-center">
              <i className="fa-solid fa-circle-info text-amber-600 text-xl"></i>
              <p className="text-[11px] text-amber-800 font-bold leading-relaxed uppercase tracking-tighter">
                Manual Override: Safety Officers can use this matrix to update facility storage rules. Changes are atomic and apply immediately to all drag-and-drop validation logic.
              </p>
           </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #000; border-radius: 20px; border: 3px solid #fff; }
      `}</style>
    </div>
  );
};

export default CompatibilityConfig;
