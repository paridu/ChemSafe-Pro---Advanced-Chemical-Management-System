
import React, { useState } from 'react';
import { gemini } from '../services/geminiService';
import { ChemicalItem } from '../types';

interface RiskAssistantProps {
  chemicals: ChemicalItem[];
}

const RiskAssistant: React.FC<RiskAssistantProps> = ({ chemicals }) => {
  const [selectedChemical, setSelectedChemical] = useState(chemicals[0]?.id || '');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [advice, setAdvice] = useState<string | null>(null);

  const handleAnalyze = async () => {
    const chemical = chemicals.find(c => c.id === selectedChemical);
    if (!chemical) return;
    
    setLoading(true);
    const result = await gemini.analyzeHazard(chemical.name, chemical.casNumber);
    setAnalysis(result);
    setLoading(false);
  };

  const handleQueryAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    const result = await gemini.getComplianceAdvice(query);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><i className="fa-solid fa-robot"></i></div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Compliance AI Assistant</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Expert Advice powered by Gemini 3</p>
              </div>
            </div>
            <form onSubmit={handleQueryAdvice} className="relative">
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about OSHA, ISO 14001, or safety..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
              <button type="submit" disabled={loading} className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-lg font-bold">Ask</button>
            </form>
            {advice && <div className="mt-6 p-6 bg-indigo-50 rounded-2xl text-slate-700 text-sm">{advice}</div>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-left">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Hazard Profiler</h3>
            <div className="flex gap-4 mb-6">
              <select className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold" value={selectedChemical} onChange={(e) => setSelectedChemical(e.target.value)}>
                {chemicals.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button onClick={handleAnalyze} className="px-8 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2"><i className="fa-solid fa-bolt"></i> Profile</button>
            </div>
            {analysis && <div className="p-6 bg-slate-50 rounded-2xl text-slate-600 text-sm leading-relaxed">{analysis}</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl text-white text-left">
            <h4 className="font-bold text-lg mb-2">OSHA Compliance</h4>
            <p className="text-sm opacity-80 mb-4">Access latest global SDS standards and hazardous material handling guidelines.</p>
            <button className="w-full py-2 bg-white/20 rounded-lg text-sm font-semibold">Safety Handbooks</button>
          </div>
        </div>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-shield-cat text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-wand-magic-sparkles text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">AI Safety Consulting Engine</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">พนักงานขาดความรู้ความเข้าใจในอันตรายของสารเคมีเฉพาะทาง และการเปิดหาข้อมูลในเล่ม SDS นั้นล่าช้าและเข้าใจยาก</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ผู้ช่วย AI ที่สามารถสรุปข้อมูลความเสี่ยงและมาตรการป้องกันได้ทันที พร้อมตอบคำถามเชิงลึกด้านกฎหมายความปลอดภัยแบบ 24/7</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAssistant;
