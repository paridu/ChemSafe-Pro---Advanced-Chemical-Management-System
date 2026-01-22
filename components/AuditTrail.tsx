
import React from 'react';
import { AuditLog, Language } from '../types';

interface AuditTrailProps {
  logs: AuditLog[];
  lang: Language;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ logs, lang }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-800">System Audit Trail</h3>
          <p className="text-sm text-slate-400">Chronological log of all inventory and compliance modifications.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] text-slate-400 font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Action</th>
                <th className="px-8 py-5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="px-8 py-5">
                    <p className="text-xs font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                        {log.userName.charAt(0)}
                      </div>
                      <p className="text-xs font-bold text-slate-700">{log.userName}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      log.severity === 'critical' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
