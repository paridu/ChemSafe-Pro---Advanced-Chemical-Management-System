
import React, { useState, useEffect, useRef } from 'react';
import { InspectionRecord, InspectionDate } from '../types';

interface MonthColumn {
  month: string;
  year: number;
  weeks: string[];
}

const ChemicalStorageMonitoring: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [inspectionData, setInspectionData] = useState<InspectionRecord[]>([]);
  const [filteredData, setFilteredData] = useState<InspectionRecord[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState<boolean>(false);

  // Evidence Modal State
  const [activeCell, setActiveCell] = useState<{ recordId: number, week: string } | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate month columns with weeks
  const generateMonthColumns = (): MonthColumn[] => {
    const months = [
      'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
    ];

    return months.map((month, index) => {
      const monthNum = index + 1;
      const weeksInMonth = getWeeksInMonth(selectedYear, monthNum);
      
      return {
        month,
        year: selectedYear,
        weeks: weeksInMonth
      };
    });
  };

  const getWeeksInMonth = (year: number, month: number): string[] => {
    const weeks: string[] = [];
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    let currentDate = new Date(firstDay);
    while (currentDate <= lastDay) {
      weeks.push(`${currentDate.getDate()}-${month < 10 ? '0' : ''}${month}-${year.toString().slice(-2)}`);
      currentDate.setDate(currentDate.getDate() + 7);
    }
    return weeks;
  };

  useEffect(() => {
    const saved = localStorage.getItem('cs_inspection_roadmap');
    if (saved) {
      setInspectionData(JSON.parse(saved));
      setFilteredData(JSON.parse(saved));
    } else {
      fetchInspectionData();
    }
  }, [selectedYear]);

  useEffect(() => {
    if (inspectionData.length > 0) {
      localStorage.setItem('cs_inspection_roadmap', JSON.stringify(inspectionData));
    }
  }, [inspectionData]);

  const fetchInspectionData = async () => {
    setLoading(true);
    setTimeout(() => {
        const data = getMockData();
        setInspectionData(data);
        setFilteredData(data);
        setLoading(false);
    }, 800);
  };

  const getStatusStyle = (status: string): string => {
    switch (status) {
      case 'completed': return 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20';
      case 'pending': return 'bg-amber-500 text-white shadow-lg shadow-amber-500/20';
      case 'overdue': return 'bg-rose-500 text-white shadow-lg shadow-rose-500/20';
      default: return 'bg-slate-200 text-slate-400';
    }
  };

  const getStatusIcon = (inspection?: InspectionDate) => {
    if (!inspection) return null;
    const { status, evidenceFileData } = inspection;
    
    return (
      <div className="relative">
        {status === 'completed' && <i className="fa-solid fa-check text-[10px]" />}
        {status === 'pending' && <i className="fa-solid fa-clock text-[10px]" />}
        {status === 'overdue' && <i className="fa-solid fa-triangle-exclamation text-[10px]" />}
        {evidenceFileData && (
          <div className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
             <i className="fa-solid fa-paperclip text-[7px] text-indigo-600"></i>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    let filtered = [...inspectionData];
    if (selectedMonth !== 'ALL') {
      filtered = filtered.map(record => ({
        ...record,
        inspection_dates: record.inspection_dates.filter(d => d.date.includes(`-${selectedMonth.slice(0, 3)}`))
      }));
    }
    if (selectedStatus !== 'ALL') {
      filtered = filtered.map(record => ({
        ...record,
        inspection_dates: record.inspection_dates.filter(d => d.status === selectedStatus)
      }));
    }
    setFilteredData(filtered);
  }, [selectedMonth, selectedStatus, inspectionData]);

  const handleCellClick = (recordId: number, week: string) => {
    setActiveCell({ recordId, week });
    setIsUploadModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeCell) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        updateInspectionEvidence(activeCell.recordId, activeCell.week, base64, file.name);
        setIsUploadModalOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateInspectionEvidence = (recordId: number, week: string, data: string, filename: string) => {
    setInspectionData(prev => prev.map(record => {
      if (record.id !== recordId) return record;
      
      const dates = [...record.inspection_dates];
      const idx = dates.findIndex(d => d.date === week);
      
      if (idx > -1) {
        dates[idx] = { ...dates[idx], evidenceFileData: data, evidenceFileName: filename, status: 'completed' };
      } else {
        dates.push({ date: week, status: 'completed', evidenceFileData: data, evidenceFileName: filename });
      }
      
      return { ...record, inspection_dates: dates };
    }));
  };

  const downloadEvidence = (inspection: InspectionDate) => {
    if (inspection.evidenceFileData) {
      const link = document.createElement('a');
      link.href = inspection.evidenceFileData;
      link.download = inspection.evidenceFileName || 'evidence.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const monthColumns = generateMonthColumns();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Audit Tracking
          </h1>
          <p className="text-slate-400 font-medium">
            Storage Area Monitoring • Facility-wide inspection roadmap for Fiscal Year {selectedYear}
          </p>
        </div>
        
        <button
          onClick={() => alert('Exporting Integrated Audit Log...')}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl shadow-emerald-100"
        >
          <i className="fa-solid fa-file-excel" />
          Export Integrated Audit Log
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-wrap gap-6 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {[2025, 2026].map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedYear === year ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Y{year}
                </button>
              ))}
            </div>

            <div className="relative">
              <i className="fa-solid fa-filter absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-600 appearance-none"
              >
                <option value="ALL">All Months</option>
                {monthColumns.map(col => <option key={col.month} value={col.month}>{col.month}</option>)}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-600 appearance-none"
            >
              <option value="ALL">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-emerald-500 flex items-center justify-center text-white"><i className="fa-solid fa-check" /></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-lg bg-amber-500 flex items-center justify-center text-white"><i className="fa-solid fa-clock" /></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2 text-rose-500">
              <div className="w-4 h-4 rounded-lg bg-rose-500 flex items-center justify-center text-white"><i className="fa-solid fa-triangle-exclamation" /></div>
              <span>Overdue</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[600px]">
        <div className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar">
          <table className="w-full border-collapse text-sm">
            <thead className="sticky top-0 z-30">
              <tr className="bg-slate-900 border-b border-slate-800">
                <th className="sticky left-0 z-40 bg-slate-900 px-4 py-4 text-center font-black text-white text-[10px] uppercase tracking-widest border-r border-slate-800">#</th>
                <th className="sticky left-[60px] z-40 bg-slate-900 px-6 py-4 text-left font-black text-white text-[10px] uppercase tracking-widest border-r border-slate-800 min-w-[280px]">Storage Site / Location Code</th>
                {monthColumns.map((col, idx) => (
                  <th key={idx} colSpan={col.weeks.length} className="px-2 py-4 text-center font-black text-indigo-400 text-[10px] uppercase tracking-widest border-r border-slate-800 bg-slate-900">{col.month}</th>
                ))}
                <th className="px-6 py-4 text-center font-black text-white text-[10px] uppercase tracking-widest bg-slate-900 border-l border-slate-800">Quick Actions</th>
              </tr>
              <tr className="bg-slate-800 border-b border-slate-700">
                <th className="sticky left-0 z-40 bg-slate-800 border-r border-slate-700"></th>
                <th className="sticky left-[60px] z-40 bg-slate-800 border-r border-slate-700"></th>
                {monthColumns.map((col, colIdx) =>
                  col.weeks.map((week, weekIdx) => (
                    <th key={`${colIdx}-${weekIdx}`} className="px-1 py-2 text-center text-[9px] font-bold text-slate-500 border-r border-slate-700 min-w-[65px]">{week}</th>
                  ))
                )}
                <th className="bg-slate-800 border-l border-slate-700"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={100} className="py-32 text-center text-slate-400 font-black uppercase text-[10px]">Assembling Timeline...</td></tr>
              ) : (
                filteredData.map((record, rowIdx) => (
                  <tr key={record.id} className="hover:bg-indigo-50/30 transition-colors">
                    <td className="sticky left-0 z-20 bg-white px-4 py-4 text-center border-r border-slate-100 text-[10px] font-black text-slate-400">{rowIdx + 1}</td>
                    <td className="sticky left-[60px] z-20 bg-white px-6 py-4 border-r border-slate-100">
                      <div className="font-black text-slate-800 text-xs">{record.location_code}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5">{record.location_name}</div>
                    </td>
                    {monthColumns.map((col, colIdx) =>
                      col.weeks.map((week, weekIdx) => {
                        const inspection = record.inspection_dates.find(d => d.date === week);
                        const status = inspection?.status || 'na';
                        return (
                          <td key={`${colIdx}-${weekIdx}`} className="px-1 py-4 text-center border-r border-slate-50">
                            <div
                              onClick={() => handleCellClick(record.id, week)}
                              className={`w-7 h-7 rounded-lg mx-auto flex items-center justify-center cursor-pointer ${getStatusStyle(status)} hover:scale-110 transition-transform`}
                              title={`${week}: ${inspection?.evidenceFileName ? 'Evidence Attached' : 'Click to Upload'}`}
                            >
                              {getStatusIcon(inspection)}
                            </div>
                          </td>
                        );
                      })
                    )}
                    <td className="px-6 py-4 text-center bg-slate-50 border-l border-slate-200">
                      <div className="flex items-center justify-center gap-3">
                         <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-indigo-600 flex items-center justify-center shadow-sm hover:bg-indigo-600 hover:text-white transition-all"><i className="fa-solid fa-pen-to-square text-[10px]" /></button>
                         <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><i className="fa-solid fa-boxes-stacked text-[10px]" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && activeCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
           <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-white/20">
              <div className="p-8 bg-slate-950 text-white flex justify-between items-center border-b border-white/5">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-xl shadow-amber-400/20">
                       <i className="fa-solid fa-file-import"></i>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tight">Audit Evidence</h3>
                       <p className="text-[8px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-0.5">Cell: {activeCell.week}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <i className="fa-solid fa-times text-2xl"></i>
                 </button>
              </div>

              <div className="p-10 space-y-8 bg-slate-50/50">
                 <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Selected Site</p>
                    <p className="text-sm font-black text-slate-800">{inspectionData.find(r => r.id === activeCell.recordId)?.location_name}</p>
                 </div>

                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all group bg-white"
                 >
                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-slate-300 mb-4 group-hover:text-amber-500 transition-colors"></i>
                    <p className="text-sm font-bold text-slate-600">Select Audit Payload (.PDF/Image)</p>
                    <p className="text-[9px] text-slate-400 uppercase mt-2 tracking-widest">Mandatory evidence for ISO 14001 compliance</p>
                    <input ref={fileInputRef} type="file" className="hidden" accept="application/pdf,image/*" onChange={handleFileUpload} />
                 </div>

                 {inspectionData.find(r => r.id === activeCell.recordId)?.inspection_dates.find(d => d.date === activeCell.week)?.evidenceFileName && (
                   <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="flex items-center gap-3">
                         <i className="fa-solid fa-file-shield text-emerald-500 text-xl"></i>
                         <div>
                            <p className="text-[10px] font-black text-emerald-600 uppercase">Current Evidence Attached</p>
                            <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{inspectionData.find(r => r.id === activeCell.recordId)?.inspection_dates.find(d => d.date === activeCell.week)?.evidenceFileName}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => downloadEvidence(inspectionData.find(r => r.id === activeCell.recordId)!.inspection_dates.find(d => d.date === activeCell.week)!)}
                        className="w-10 h-10 rounded-xl bg-white border border-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                         <i className="fa-solid fa-download"></i>
                      </button>
                   </div>
                 )}

                 <div className="flex gap-4">
                    <button 
                       onClick={() => setIsUploadModalOpen(false)}
                       className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest shadow-sm"
                    >
                       Discard
                    </button>
                    <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="flex-[2] py-4 bg-black text-amber-400 font-black rounded-3xl shadow-2xl hover:bg-slate-900 transition-all border border-white/10 uppercase text-[10px] tracking-widest"
                    >
                       Replace/Upload Evidence
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-file-shield text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-clipboard-check text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Active Surveillance & Evidence Logs</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">การยืนยันตัวตนของผู้ตรวจและการพิสูจน์ความถูกต้องของผลการตรวจ (Audit Trails) มักทำได้ยากเมื่อไม่มีภาพถ่ายหรือไฟล์หลักฐานแนบ</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ระบบอัปโหลดหลักฐานรายสัปดาห์ที่เปลี่ยนสถานะการตรวจเป็น Completed อัตโนมัติเมื่อมีการแนบไฟล์ พร้อมไอคอนแจ้งเตือนสำหรับการ Audit ย้อนกลับ</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

const getMockData = (): InspectionRecord[] => {
  return [
    {
      id: 1,
      location_code: '#B4L1_X-CALIBLR_S2003-0107',
      location_name: 'Building 4 Level 1 - X-Ray Calibration Room',
      inspection_dates: [
        { date: '1-01-26', status: 'completed', inspector: 'Somchai P.' },
        { date: '8-01-26', status: 'completed', inspector: 'Somchai P.' },
        { date: '15-01-26', status: 'pending' },
      ],
      update_link: '#',
      stock_link: '#',
    },
    {
      id: 2,
      location_code: '#B4L1_BENCHTEST01_S2014-0003',
      location_name: 'Building 4 Level 1 - Bench Test Area 01',
      inspection_dates: [
        { date: '1-01-26', status: 'completed' },
        { date: '8-01-26', status: 'overdue' },
        { date: '15-01-26', status: 'pending' },
      ],
      update_link: '#',
      stock_link: '#',
    },
    {
        id: 3,
        location_code: '#WH-NORTH_GAS_PAD',
        location_name: 'Warehouse North - External Gas Storage',
        inspection_dates: [
          { date: '1-01-26', status: 'completed' },
          { date: '8-01-26', status: 'completed' },
          { date: '15-01-26', status: 'completed' },
        ],
        update_link: '#',
        stock_link: '#',
      },
      {
        id: 4,
        location_code: '#LAB-SOLV_CABINET',
        location_name: 'Analytical Lab - Flammable Cabinet',
        inspection_dates: [
          { date: '1-01-26', status: 'completed' },
          { date: '8-01-26', status: 'pending' },
        ],
        update_link: '#',
        stock_link: '#',
      },
  ];
};

export default ChemicalStorageMonitoring;
