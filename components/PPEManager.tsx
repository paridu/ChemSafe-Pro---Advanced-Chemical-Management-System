
import React, { useState, useEffect } from 'react';
import { PPEItem, Language, PPEType, PPETransaction, User } from '../types';

interface PPEManagerProps {
  ppeItems: PPEItem[];
  transactions: PPETransaction[];
  user: User;
  lang: Language;
  onAdd: (ppe: PPEItem) => void;
  onUpdate: (ppe: PPEItem) => void;
  onDelete: (id: string) => void;
  onAddTransaction: (tx: PPETransaction) => void;
}

const PPEManager: React.FC<PPEManagerProps> = ({ ppeItems, transactions, user, lang, onAdd, onUpdate, onDelete, onAddTransaction }) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'inventory' | 'history'>('catalog');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedPPE, setSelectedPPE] = useState<PPEItem | null>(null);

  const handleEdit = (ppe: PPEItem) => {
    setSelectedPPE(ppe);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPPE(null);
    setIsModalOpen(true);
  };

  const handleStockAdj = (ppe: PPEItem) => {
    setSelectedPPE(ppe);
    setIsTxModalOpen(true);
  };

  const handleSave = (ppe: PPEItem) => {
    if (selectedPPE) onUpdate(ppe);
    else onAdd(ppe);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-500 pb-12 text-left">
      {/* Dynamic Industrial Header */}
      <div className="bg-black rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fa-solid fa-shield-halved text-8xl"></i>
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-amber-400 text-black rounded-2xl flex items-center justify-center text-3xl shadow-xl shadow-amber-400/20">
              <i className="fa-solid fa-kit-medical"></i>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-1">
                {lang === 'en' ? 'PPE Control Terminal' : 'ระบบจัดการอุปกรณ์ป้องกันภัย'}
              </h2>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em]">Personal Protective Equipment & Stock Monitoring</p>
            </div>
          </div>
          <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
             <button onClick={() => setActiveTab('catalog')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'catalog' ? 'bg-amber-400 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>Catalog</button>
             <button onClick={() => setActiveTab('inventory')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'inventory' ? 'bg-amber-400 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>Inventory</button>
             <button onClick={() => setActiveTab('history')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'history' ? 'bg-amber-400 text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}>TX Logs</button>
          </div>
          <button 
            onClick={handleAddNew}
            className="px-10 py-4 bg-amber-400 text-black rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 whitespace-nowrap uppercase text-[10px] tracking-widest"
          >
            <i className="fa-solid fa-file-circle-plus mr-2"></i>
            Register New PPE
          </button>
        </div>
      </div>

      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {ppeItems.map(ppe => (
            <div key={ppe.id} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-amber-400 transition-all group flex flex-col h-full relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-4xl text-slate-300 border-2 border-slate-50 group-hover:bg-amber-50 group-hover:text-amber-500 group-hover:border-amber-100 transition-all">
                  <i className={`fa-solid ${ppe.icon}`}></i>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <div className="px-2 py-1 bg-black text-amber-400 rounded-lg text-[8px] font-black uppercase tracking-widest">{ppe.id}</div>
                   {ppe.stock < ppe.minStock && (
                     <div className="px-2 py-1 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase animate-pulse">Low Stock</div>
                   )}
                </div>
              </div>
              
              <h5 className="font-black text-slate-800 text-lg mb-1 group-hover:text-black transition-colors">{ppe.name}</h5>
              <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mb-4">{ppe.type}</p>
              
              <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1 italic">
                {ppe.description}
              </p>

              <div className="py-4 border-y border-slate-50 mb-6 flex justify-between items-end">
                 <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase mb-1">Available Inventory</p>
                    <p className="text-xl font-black text-slate-700">{ppe.stock} <span className="text-[10px] text-slate-400">{ppe.unit}</span></p>
                 </div>
                 <button 
                  onClick={() => handleStockAdj(ppe)}
                  className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 hover:bg-amber-400 hover:text-black transition-all shadow-lg flex items-center justify-center"
                 >
                    <i className="fa-solid fa-plus-minus text-sm"></i>
                 </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleEdit(ppe)}
                  className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                >
                  Configure
                </button>
                <button 
                  onClick={() => onDelete(ppe.id)}
                  className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-300 hover:text-red-500 flex items-center justify-center transition-all border border-slate-100"
                >
                  <i className="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
           <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Global PPE Stock Status</h4>
              <button onClick={() => window.print()} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-50 transition-all flex items-center gap-2">
                 <i className="fa-solid fa-print"></i> Print Inventory Report
              </button>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50/80 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <tr>
                       <th className="px-8 py-5">Equipment Profile</th>
                       <th className="px-8 py-5 text-center">Category</th>
                       <th className="px-8 py-5 text-center">Safety Threshold</th>
                       <th className="px-8 py-5 text-center">In-Stock Volume</th>
                       <th className="px-8 py-5 text-center">Health Status</th>
                       <th className="px-8 py-5 text-right">Transactions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {ppeItems.map(ppe => (
                       <tr key={ppe.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                                   <i className={`fa-solid ${ppe.icon}`}></i>
                                </div>
                                <div>
                                   <p className="font-black text-slate-800 text-sm">{ppe.name}</p>
                                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{ppe.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter bg-indigo-50 px-2 py-1 rounded-md">{ppe.type}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className="text-xs font-bold text-slate-400">{ppe.minStock} {ppe.unit}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className={`text-sm font-black ${ppe.stock < ppe.minStock ? 'text-red-600' : 'text-slate-800'}`}>{ppe.stock} {ppe.unit}</span>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${ppe.stock < ppe.minStock ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${ppe.stock < ppe.minStock ? 'text-red-500' : 'text-emerald-600'}`}>
                                   {ppe.stock < ppe.minStock ? 'Critical' : 'Stable'}
                                </span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <button 
                                onClick={() => handleStockAdj(ppe)}
                                className="px-4 py-2 bg-black text-amber-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg"
                             >
                                Adjust Stock
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
           <div className="p-8 border-b border-slate-50 bg-slate-50/50">
              <h4 className="font-black text-slate-800 uppercase text-xs tracking-widest">Transaction Audit Log</h4>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                    <tr>
                       <th className="px-8 py-5">Reference ID</th>
                       <th className="px-8 py-5">Equipment</th>
                       <th className="px-8 py-5 text-center">Type</th>
                       <th className="px-8 py-5 text-center">Quantity</th>
                       <th className="px-8 py-5 text-center">Authorized By</th>
                       <th className="px-8 py-5 text-right">Timestamp</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    {transactions.map(tx => (
                       <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="px-8 py-5 font-mono text-[10px] text-slate-400">{tx.id}</td>
                          <td className="px-8 py-5">
                             <p className="font-black text-slate-800 text-sm uppercase">{tx.ppeName}</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${tx.type === 'Restock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                {tx.type}
                             </span>
                          </td>
                          <td className="px-8 py-5 text-center font-black text-slate-700">
                             {tx.type === 'Restock' ? '+' : '-'}{tx.quantity}
                          </td>
                          <td className="px-8 py-5 text-center">
                             <div className="flex items-center justify-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 uppercase">{tx.user.charAt(0)}</div>
                                <span className="text-xs font-bold text-slate-600">{tx.user}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5 text-right text-xs font-medium text-slate-400">
                             {new Date(tx.timestamp).toLocaleString()}
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-shield-halved text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-hard-hat text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">PPE Asset Management</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">อุปกรณ์ PPE มักถูกเบิกจ่ายโดยไม่มีการบันทึกที่แม่นยำ ทำให้ของขาดสต็อกในเวลาที่จำเป็นต้องใช้งานจริง</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบบริหารจัดการ PPE แบบครบวงจร ตั้งแต่การลงทะเบียน Catalog จนถึงการติดตามประวัติการเข้า-ออกสต็อกแบบรายบุคคล</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <PPEModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
          initialData={selectedPPE}
          lang={lang}
        />
      )}

      {isTxModalOpen && selectedPPE && (
        <StockTransactionModal 
          isOpen={isTxModalOpen}
          onClose={() => setIsTxModalOpen(false)}
          onSave={(tx) => {
            onAddTransaction(tx);
            setIsTxModalOpen(false);
          }}
          ppe={selectedPPE}
          user={user}
          lang={lang}
        />
      )}
    </div>
  );
};

// PPEModal Component
interface PPEModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ppe: PPEItem) => void;
  initialData: PPEItem | null;
  lang: Language;
}

const PPEModal: React.FC<PPEModalProps> = ({ isOpen, onClose, onSave, initialData, lang }) => {
  const [formData, setFormData] = useState<PPEItem>(initialData || {
    id: `PPE-${Math.floor(100 + Math.random() * 899)}`,
    name: '',
    type: 'Mask',
    icon: 'fa-mask-face',
    description: '',
    stock: 0,
    minStock: 10,
    unit: 'Units'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `PPE-${Math.floor(100 + Math.random() * 899)}`,
        name: '',
        type: 'Mask',
        icon: 'fa-mask-face',
        description: '',
        stock: 0,
        minStock: 10,
        unit: 'Units'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-8 bg-slate-950 text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase tracking-tight">{initialData ? 'Configure PPE' : 'Register New PPE'}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors"><i className="fa-solid fa-times text-2xl"></i></button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Item Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Type</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as PPEType})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400">
                <option value="Mask">Mask</option>
                <option value="Gloves">Gloves</option>
                <option value="Goggles">Goggles</option>
                <option value="Suit">Suit</option>
                <option value="Boots">Boots</option>
                <option value="Ear Protection">Ear Protection</option>
                <option value="Helmet">Helmet</option>
                <option value="Apron">Apron</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">Min Stock Threshold</label>
              <input type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: Number(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase">Description</label>
            <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 h-24 resize-none" />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold hover:bg-slate-50">Cancel</button>
            <button type="submit" className="flex-1 py-3 bg-black text-amber-400 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all">Save PPE</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// StockTransactionModal Component
interface StockTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: PPETransaction) => void;
  ppe: PPEItem;
  user: User;
  lang: Language;
}

const StockTransactionModal: React.FC<StockTransactionModalProps> = ({ isOpen, onClose, onSave, ppe, user, lang }) => {
  const [type, setType] = useState<'Restock' | 'Withdrawal'>('Withdrawal');
  const [quantity, setQuantity] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-8 bg-slate-950 text-white">
          <h3 className="text-xl font-black uppercase tracking-tight">Adjust Stock: {ppe.name}</h3>
          <p className="text-[9px] text-amber-400 font-bold uppercase tracking-widest mt-1">Ref ID: {ppe.id}</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setType('Withdrawal')} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'Withdrawal' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Withdrawal</button>
            <button onClick={() => setType('Restock')} className={`flex-1 py-2.5 text-[10px] font-black uppercase rounded-lg transition-all ${type === 'Restock' ? 'bg-black text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Restock</button>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase text-center block tracking-widest">Adjustment Quantity ({ppe.unit})</label>
            <input required type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="w-full px-4 py-6 bg-slate-50 border border-slate-200 rounded-3xl text-3xl font-black text-center outline-none focus:ring-4 focus:ring-amber-400/20" />
          </div>
          <div className="flex gap-4">
            <button onClick={onClose} className="flex-1 py-4 font-black text-slate-400 uppercase text-[10px] tracking-widest hover:bg-slate-50 rounded-2xl">Cancel</button>
            <button 
              onClick={() => onSave({
                id: `TX-${Date.now()}`,
                ppeId: ppe.id,
                ppeName: ppe.name,
                type,
                quantity,
                user: user.name,
                timestamp: new Date().toISOString()
              })}
              className="flex-1 py-4 bg-black text-amber-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-black/5"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPEManager;
