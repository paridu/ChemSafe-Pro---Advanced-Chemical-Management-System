
import React, { useState } from 'react';
import { AlertTrigger, ChemicalItem } from '../types';

interface AlertConfigurationProps {
  alerts: AlertTrigger[];
  chemicals: ChemicalItem[];
  onSave: (alert: AlertTrigger) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

const AlertConfiguration: React.FC<AlertConfigurationProps> = ({ alerts, chemicals, onSave, onDelete, onToggle }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<AlertTrigger>>({
    name: '',
    type: 'Stock Level',
    condition: 'less_than',
    value: 10,
    targetId: 'ALL',
    notifyTo: '',
    isEnabled: true
  });

  const handleAdd = () => {
    if (!newAlert.name || !newAlert.notifyTo) {
      alert("Please fill in all required fields.");
      return;
    }

    const alertItem: AlertTrigger = {
      id: `ALT-${Math.floor(Math.random() * 1000)}`,
      name: newAlert.name || 'Unnamed Alert',
      type: newAlert.type as any,
      condition: newAlert.condition as any,
      value: newAlert.value as any,
      targetId: newAlert.targetId as any,
      notifyTo: newAlert.notifyTo || 'Admin',
      isEnabled: true
    };
    onSave(alertItem);
    setIsAdding(false);
    setNewAlert({
      name: '',
      type: 'Stock Level',
      condition: 'less_than',
      value: 10,
      targetId: 'ALL',
      notifyTo: '',
      isEnabled: true
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Alert Notification Triggers</h3>
          <p className="text-sm text-slate-400">Configure automated logic to notify staff of stock shortages, upcoming expirations, or compliance gaps.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-3 shadow-xl shadow-indigo-100 whitespace-nowrap"
        >
          <i className="fa-solid fa-bell-plus"></i>
          Create Trigger
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.map(alert => (
          <div key={alert.id} className={`bg-white p-6 rounded-3xl border transition-all group ${alert.isEnabled ? 'border-slate-100 opacity-100 shadow-sm' : 'border-slate-100 opacity-60'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                alert.type === 'Stock Level' ? 'bg-blue-50 text-blue-600' : 
                alert.type === 'Expiry' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
              }`}>
                <i className={`fa-solid ${
                  alert.type === 'Stock Level' ? 'fa-cubes-stacked' : 
                  alert.type === 'Expiry' ? 'fa-hourglass-half' : 'fa-shield-halved'
                }`}></i>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onToggle(alert.id)}
                  className={`w-10 h-6 rounded-full relative transition-colors ${alert.isEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${alert.isEnabled ? 'right-1' : 'left-1'}`}></div>
                </button>
                <button 
                  onClick={() => onDelete(alert.id)} 
                  className="text-slate-200 hover:text-red-500 transition-colors p-1"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 text-lg mb-1">{alert.name}</h4>
            <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mb-4">{alert.type}</p>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-3 mb-6 border border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Logic</span>
                <span className="font-bold text-slate-700 bg-white px-2 py-1 rounded-lg border border-slate-100">
                  {alert.condition.replace('_', ' ')} {alert.value}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Scope</span>
                <span className="font-bold text-slate-700 truncate max-w-[140px]">
                  {alert.targetId === 'ALL' ? 'Global Inventory' : chemicals.find(c => c.id === alert.targetId)?.name || alert.targetId}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-50 pt-4">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-black uppercase">
                {alert.notifyTo.charAt(0)}
              </div>
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Subscriber</p>
                <p className="text-xs font-bold text-slate-700">{alert.notifyTo}</p>
              </div>
            </div>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
            <i className="fa-solid fa-bell-slash text-4xl text-slate-200 mb-4"></i>
            <p className="text-slate-400 font-medium">No alerts configured. Create one to stay informed.</p>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i className="fa-solid fa-plus-circle text-indigo-600"></i>
                New Alert Trigger
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><i className="fa-solid fa-times"></i></button>
            </div>
            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Trigger Display Name</label>
                <input 
                  type="text" 
                  value={newAlert.name || ''} 
                  onChange={e => setNewAlert({...newAlert, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                  placeholder="e.g. Critical Acid Level Alert"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Alert Type</label>
                  <select 
                    value={newAlert.type} 
                    onChange={e => setNewAlert({...newAlert, type: e.target.value as any})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Stock Level">Stock Level</option>
                    <option value="Expiry">Expiry</option>
                    <option value="Compliance">Compliance</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Threshold Value</label>
                  <input 
                    type="number" 
                    value={newAlert.value} 
                    onChange={e => setNewAlert({...newAlert, value: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inventory Scope</label>
                <select 
                  value={newAlert.targetId} 
                  onChange={e => setNewAlert({...newAlert, targetId: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">Entire Inventory (Global)</option>
                  <optgroup label="Specific Chemicals">
                    {chemicals.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Notify Personnel (Email/Name)</label>
                <input 
                  type="text" 
                  value={newAlert.notifyTo || ''} 
                  onChange={e => setNewAlert({...newAlert, notifyTo: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="e.g. Safety Department"
                />
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setIsAdding(false)} 
                className="flex-1 py-3.5 font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd} 
                className="flex-1 py-3.5 font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-colors"
              >
                Create Trigger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertConfiguration;
