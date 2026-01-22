
import React, { useState, useRef, useEffect } from 'react';
import { ChemicalItem, Language, ChatMessage } from '../types';
import { aiHub } from '../services/aiService';

interface AIChatPDFProps {
  chemicals: ChemicalItem[];
  lang: Language;
}

const AIChatPDF: React.FC<AIChatPDFProps> = ({ chemicals, lang }) => {
  const [selectedFile, setSelectedFile] = useState<{name: string, data: string} | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setSelectedFile({ name: file.name, data: base64 });
        setMessages([{
          role: 'model',
          text: `I've successfully loaded "${file.name}". I'm ready to answer any technical questions about its safety profile, chemical properties, or handling requirements.`,
          timestamp: new Date().toLocaleTimeString()
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectInventorySds = (chem: ChemicalItem) => {
    if (chem.sdsFileData) {
      setSelectedFile({ name: chem.sdsFileName || `${chem.name}_SDS.pdf`, data: chem.sdsFileData });
      setMessages([{
        role: 'model',
        text: `Inventory link active: analyzing SDS for ${chem.name}. How can I assist you with this material today?`,
        timestamp: new Date().toLocaleTimeString()
      }]);
    } else {
      alert("No PDF document is linked to this inventory item.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedFile || isTyping) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const aiResponse = await aiHub.chatWithDocument(selectedFile.data, userMsg.text, history);

    const modelMsg: ChatMessage = {
      role: 'model',
      text: aiResponse || "I'm sorry, I couldn't process that request.",
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsTyping(false);
  };

  const suggestedQueries = [
    "Summarize First Aid measures.",
    "What PPE is mandatory?",
    "Storage incompatibilities?",
    "Ecological toxicity profile?"
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col lg:flex-row h-[calc(100vh-280px)] gap-6">
        {/* Sidebar: Document Selection */}
        <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 h-full">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-black text-black text-xs uppercase tracking-widest">Document Vault</h4>
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-black flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-file-shield"></i>
              </div>
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50 hover:bg-amber-50 hover:border-amber-400 transition-all group mb-6"
            >
              <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-300 group-hover:text-amber-500 mb-2"></i>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-black">Upload New PDF</p>
              <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf" onChange={handleFileUpload} />
            </button>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Linked Inventory</p>
              <div className="space-y-2">
                {chemicals.filter(c => c.sdsAvailable).map(chem => (
                  <button 
                    key={chem.id}
                    onClick={() => selectInventorySds(chem)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all ${
                      selectedFile?.name === (chem.sdsFileName || `${chem.name}_SDS.pdf`)
                        ? 'bg-black border-black text-white shadow-lg'
                        : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`fa-solid fa-file-pdf ${selectedFile?.name === (chem.sdsFileName || `${chem.name}_SDS.pdf`) ? 'text-amber-400' : 'text-red-500'}`}></i>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate">{chem.name}</p>
                        <p className={`text-[8px] font-black uppercase ${selectedFile?.name === (chem.sdsFileName || `${chem.name}_SDS.pdf`) ? 'text-amber-400' : 'text-slate-400'}`}>{chem.id}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col relative">
          <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-black text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-lg shadow-amber-400/20">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight">SDS Intelligence</h3>
                <p className="text-[10px] text-amber-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  {selectedFile ? `Analyzing: ${selectedFile.name}` : 'Awaiting Document'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-10 space-y-8 custom-scrollbar bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}>
                <div className={`max-w-[85%] lg:max-w-[70%] group`}>
                  <div className={`px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm font-medium ${
                    msg.role === 'user' 
                      ? 'bg-amber-400 text-black rounded-tr-none' 
                      : 'bg-black text-white rounded-tl-none border border-slate-800'
                  }`}>
                    {msg.text.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-black px-6 py-4 rounded-[2rem] rounded-tl-none border border-slate-800 flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 border-t border-slate-100 bg-white">
            <form onSubmit={handleSend} className="relative flex items-center gap-4">
              <input 
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={!selectedFile || isTyping}
                placeholder={selectedFile ? "Ask about hazards or handling protocols..." : "Select a document to begin..."}
                className="flex-1 pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-bold focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <button 
                type="submit"
                disabled={!selectedFile || !input.trim() || isTyping}
                className="w-14 h-14 rounded-2xl bg-black text-amber-400 flex items-center justify-center text-xl shadow-xl disabled:bg-slate-200"
              >
                <i className={`fa-solid ${isTyping ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-comments text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-microchip text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">AI Augmented Documentation</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การอ่านเอกสาร SDS หลายหน้าเพื่อหาคำตอบทางเทคนิคนั้นใช้เวลานานและเสี่ยงต่อการตีความผิดพลาด</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">AI อัจฉริยะ (Gemini 3 Pro) ที่ช่วยวิเคราะห์และตอบคำถามจากไฟล์ PDF ได้ทันที ทำให้ได้ข้อมูลที่ถูกต้องในเวลาไม่กี่วินาที</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatPDF;
