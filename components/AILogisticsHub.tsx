
import React, { useState } from 'react';
import { Language, AIProviderConfig, VectorDBConfig } from '../types';

interface AILogisticsHubProps {
  lang: Language;
}

const AILogisticsHub: React.FC<AILogisticsHubProps> = ({ lang }) => {
  const [providers, setProviders] = useState<AIProviderConfig[]>([
    // Fix: Updated modelName to gemini-3-pro-preview to match the reasoning services usage
    { id: 'GEMINI', name: 'Google Gemini 3', type: 'Cloud', endpoint: 'api.google.com', status: 'Online', modelName: 'gemini-3-pro-preview' },
    { id: 'OLLAMA', name: 'Ollama Local', type: 'Local', endpoint: 'http://localhost:11434', status: 'Offline', modelName: 'llama3:8b' }
  ]);

  const [vectorDB, setVectorDB] = useState<VectorDBConfig>({
    provider: 'Memory',
    indexName: 'safety_protocols_v1',
    dimension: 768,
    status: 'Connected',
    documentCount: 142
  });

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncVector = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <i className="fa-solid fa-microchip text-indigo-600"></i>
            {lang === 'en' ? 'AI Logistics Hub' : 'ศูนย์ควบคุมโครงข่าย AI'}
          </h1>
          <p className="text-slate-400 font-medium">
            Manage Large Language Models, Local Inference, and RAG Knowledge Base.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncVector}
            className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-3 transition-all ${
              isSyncing ? 'bg-amber-100 text-amber-600' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            <i className={`fa-solid ${isSyncing ? 'fa-spinner fa-spin' : 'fa-arrows-rotate'}`}></i>
            {isSyncing ? 'Syncing Knowledge...' : 'Sync Vector Store'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Providers */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Model Providers</h4>
              <button className="text-indigo-600 text-[10px] font-black uppercase tracking-tighter hover:underline">Add New Endpoint</button>
            </div>
            <div className="p-6 space-y-4">
              {providers.map(p => (
                <div key={p.id} className="p-5 border border-slate-100 rounded-2xl flex flex-col md:flex-row items-center gap-6 hover:border-indigo-200 transition-colors">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                    p.status === 'Online' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-300'
                  }`}>
                    <i className={`fa-solid ${p.type === 'Cloud' ? 'fa-cloud' : 'fa-server'}`}></i>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h5 className="font-bold text-slate-800">{p.name}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{p.endpoint} • {p.modelName}</p>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.status === 'Online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        <span className="text-[10px] font-black uppercase text-slate-400">{p.status}</span>
                     </div>
                     <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-all">
                       <i className="fa-solid fa-gears text-sm"></i>
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Processing Logs */}
          <div className="bg-slate-900 rounded-[2rem] p-6 shadow-2xl h-80 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
               <h4 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-3">
                 <i className="fa-solid fa-terminal text-indigo-500"></i>
                 AI Bridge Log
               </h4>
               <span className="text-emerald-500 text-[8px] font-black tracking-widest uppercase animate-pulse">Socket Active</span>
            </div>
            <div className="flex-1 font-mono text-[10px] text-indigo-300 space-y-2 overflow-y-auto custom-scrollbar">
              <p><span className="text-slate-600">[08:42:11]</span> System initialized AI logistics middleware.</p>
              <p><span className="text-slate-600">[08:42:15]</span> <span className="text-emerald-400">SUCCESS:</span> Connected to Cloud Provider (Gemini 3 Pro).</p>
              <p><span className="text-slate-600">[08:42:15]</span> <span className="text-rose-400">ERR:</span> Ollama connection refused at http://localhost:11434.</p>
              <p><span className="text-slate-600">[08:43:01]</span> Mapping Knowledge Base: 142 vectors loaded from persistent storage.</p>
              <p><span className="text-slate-600">[08:45:10]</span> RAG Engine standby: Awaiting query.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Vector DB & RAG */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">Vector Store</h4>
               <div className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[8px] font-black border border-emerald-100 uppercase">ACTIVE</div>
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                    <i className="fa-solid fa-database"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Provider</p>
                    <p className="font-black text-slate-800">{vectorDB.provider}</p>
                  </div>
                </div>

                <div className="space-y-2">
                   <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-slate-400 uppercase">Embedded Docs</span>
                      <span className="text-indigo-600">{vectorDB.documentCount}</span>
                   </div>
                   <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 w-3/4 rounded-full"></div>
                   </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-3">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] text-slate-400 font-black uppercase">Dimensions</p>
                      <p className="text-sm font-black text-slate-700">{vectorDB.dimension}</p>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[8px] text-slate-400 font-black uppercase">Retrieval</p>
                      <p className="text-sm font-black text-slate-700">Top-k (3)</p>
                   </div>
                </div>
             </div>
           </div>

           <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
              <h4 className="text-lg font-black mb-2 relative z-10">RAG Orchestration</h4>
              <p className="text-xs text-indigo-100 opacity-80 leading-relaxed mb-6 relative z-10">
                Connect your SDS PDFs and Safety Manuals directly to the AI's reasoning engine for hallucination-free compliance.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl relative z-10 hover:bg-indigo-50 transition-colors">
                Rebuild Index
              </button>
           </div>

           <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
             <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-4">Architecture Map</h4>
             <div className="space-y-4">
                <FlowItem icon="fa-file-pdf" label="Data Ingestion" status="Done" />
                <FlowItem icon="fa-wand-magic-sparkles" label="Embedding" status="Done" />
                <FlowItem icon="fa-layer-group" label="Vector Search" status="Ready" />
                <FlowItem icon="fa-comments" label="LLM Reasoning" status="Ready" />
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const FlowItem = ({ icon, label, status }: any) => (
  <div className="flex items-center gap-4">
    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 text-xs">
      <i className={`fa-solid ${icon}`}></i>
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-bold text-slate-700">{label}</p>
    </div>
    <span className="text-[8px] font-black text-emerald-500 uppercase">{status}</span>
  </div>
);

export default AILogisticsHub;
