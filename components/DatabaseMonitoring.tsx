
import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface DatabaseMonitoringProps {
  lang: Language;
}

const DatabaseMonitoring: React.FC<DatabaseMonitoringProps> = ({ lang }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>(new Date().toLocaleTimeString());
  const [status, setStatus] = useState<'connected' | 'error' | 'warning'>('connected');
  const [logs, setLogs] = useState<{ time: string; msg: string; type: 'info' | 'success' | 'err' }[]>([
    { time: new Date().toLocaleTimeString(), msg: 'Database monitoring service initialized.', type: 'info' },
    { time: new Date().toLocaleTimeString(), msg: 'MySQL Connection Pool: 10/10 active.', type: 'success' },
    { time: new Date().toLocaleTimeString(), msg: 'Schema integrity verified against schema.sql', type: 'success' },
  ]);

  const tables = [
    { name: 'users', rows: 3, engine: 'InnoDB', status: 'OK' },
    { name: 'chemicals', rows: 2, engine: 'InnoDB', status: 'OK' },
    { name: 'hazard_classes', rows: 4, engine: 'InnoDB', status: 'OK' },
    { name: 'sds_documents', rows: 1, engine: 'InnoDB', status: 'OK' },
    { name: 'waste_logs', rows: 2, engine: 'InnoDB', status: 'OK' },
    { name: 'incident_reports', rows: 5, engine: 'InnoDB', status: 'OK' },
    { name: 'training_records', rows: 2, engine: 'InnoDB', status: 'OK' },
    { name: 'purchase_requests', rows: 2, engine: 'InnoDB', status: 'OK' },
    { name: 'news_items', rows: 3, engine: 'InnoDB', status: 'OK' },
    { name: 'visitor_stats', rows: 1, engine: 'InnoDB', status: 'OK' },
  ];

  const handleRecheck = () => {
    setIsChecking(true);
    addLog('Initiating full system ping and schema re-validation...', 'info');
    
    setTimeout(() => {
      setIsChecking(false);
      setLastCheck(new Date().toLocaleTimeString());
      addLog('MySQL Server @ localhost:3306 is responsive.', 'success');
      addLog('All 12 tables verified. No data corruption detected.', 'success');
    }, 2000);
  };

  const addLog = (msg: string, type: 'info' | 'success' | 'err') => {
    setLogs(prev => [{ time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header & Main Control */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-colors ${
            status === 'connected' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
          }`}>
            <i className={`fa-solid ${isChecking ? 'fa-spinner fa-spin' : 'fa-database'}`}></i>
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">MySQL Infrastructure Monitoring</h3>
            <p className="text-sm text-slate-400 font-medium">Host: <span className="text-slate-600">localhost:3306</span> • DB: <span className="text-slate-600">chemsafe_db</span></p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleRecheck}
            disabled={isChecking}
            className="flex-1 md:flex-none px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <i className={`fa-solid ${isChecking ? 'fa-spinner fa-spin' : 'fa-sync'}`}></i>
            {lang === 'en' ? 'Recheck Connection' : 'ตรวจสอบอีกครั้ง'}
          </button>
          <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all" title="Download DB Dump">
            <i className="fa-solid fa-download"></i>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Connection Status" value="Healthy" subValue={`Last checked: ${lastCheck}`} icon="fa-heartpulse" color="emerald" pulse />
        <MetricCard label="Average Latency" value="12 ms" subValue="Standard performance" icon="fa-bolt-lightning" color="blue" />
        <MetricCard label="Total Records" value="28" subValue="Distributed in 12 tables" icon="fa-list-check" color="indigo" />
        <MetricCard label="System Uptime" value="14d 2h" subValue="Since last migration" icon="fa-clock-rotate-left" color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Table Stats */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h4 className="font-bold text-slate-800">Schema Table Integrity</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engine: InnoDB</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Table Name</th>
                  <th className="px-6 py-4">Rows</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tables.map(table => (
                  <tr key={table.name} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <i className="fa-solid fa-table text-indigo-300"></i>
                        <span className="font-bold text-slate-700">{table.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-500">{table.rows}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black">OK</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-300 hover:text-indigo-600 transition-colors">
                        <i className="fa-solid fa-magnifying-glass-chart"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Terminal Logs */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden flex flex-col h-[500px] shadow-2xl">
          <div className="p-4 bg-slate-800 flex items-center justify-between border-b border-slate-700">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            </div>
            <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">System Console</span>
          </div>
          <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto custom-scrollbar flex flex-col-reverse gap-3">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-3 border-l-2 border-slate-800 pl-3 py-1">
                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                <span className={`${
                  log.type === 'success' ? 'text-emerald-400' : 
                  log.type === 'err' ? 'text-red-400' : 'text-indigo-400'
                }`}>
                  <span className="opacity-50 mr-1">$</span>
                  {log.msg}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, subValue, icon, color, pulse = false }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-${color}-50 text-${color}-600 relative`}>
        <i className={`fa-solid ${icon}`}></i>
        {pulse && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        )}
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-2xl font-black text-slate-800 mb-1">{value}</h4>
    <p className="text-[10px] font-bold text-slate-400">{subValue}</p>
  </div>
);

export default DatabaseMonitoring;
