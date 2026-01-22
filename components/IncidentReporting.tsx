
import React, { useState } from 'react';
import { IncidentReport, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface IncidentReportingProps {
  incidents: IncidentReport[];
  lang: Language;
}

const IncidentReporting: React.FC<IncidentReportingProps> = ({ incidents, lang }) => {
  const t = TRANSLATIONS[lang];
  const [viewType, setViewType] = useState<'list' | 'month' | 'year'>('year');
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handlePrevYear = () => setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  const handleNextYear = () => setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  const renderYearView = () => {
    const year = currentDate.getFullYear();
    return (
      <div className="space-y-6 animate-in zoom-in-95 duration-500">
        <div className="bg-slate-900 p-6 rounded-3xl text-white flex items-center justify-between shadow-xl">
          <h4 className="text-xl font-black tracking-tight flex items-center gap-3">
            <i className="fa-solid fa-calendar-week text-indigo-400"></i>
            {lang === 'en' ? `Annual Overview ${year}` : `ภาพรวมรายปี ${year}`}
          </h4>
          <div className="flex gap-2">
            <button onClick={handlePrevYear} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-all flex items-center justify-center">
              <i className="fa-solid fa-angles-left"></i>
            </button>
            <button onClick={handleNextYear} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-indigo-600 transition-all flex items-center justify-center">
              <i className="fa-solid fa-angles-right"></i>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {t.calendar.months.map((monthName: string, monthIdx: number) => {
            const totalDays = daysInMonth(year, monthIdx);
            const startDay = firstDayOfMonth(year, monthIdx);
            const monthIncidents = incidents.filter(inc => {
              const d = new Date(inc.date);
              return d.getFullYear() === year && d.getMonth() === monthIdx;
            });

            return (
              <div 
                key={monthIdx} 
                onClick={() => {
                  setCurrentDate(new Date(year, monthIdx, 1));
                  setViewType('month');
                }}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group text-left"
              >
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-black text-slate-800 group-hover:text-indigo-600">{monthName}</h5>
                  {monthIncidents.length > 0 && (
                    <span className="bg-red-50 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-black">
                      {monthIncidents.length} {lang === 'en' ? 'Events' : 'เหตุการณ์'}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-4 w-full"></div>
                  ))}
                  {Array.from({ length: totalDays }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const dayInc = incidents.find(inc => inc.date === dateStr);
                    return (
                      <div 
                        key={dayNum} 
                        className={`h-4 w-full rounded-sm flex items-center justify-center ${dayInc ? getSeverityColor(dayInc.severity) : 'bg-slate-50'}`}
                      >
                        {dayInc && <div className="w-1 h-1 bg-white rounded-full"></div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/30 border border-slate-100"></div>);
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayIncidents = incidents.filter(inc => inc.date === dateStr);
      days.push(
        <div key={day} className="h-32 bg-white border border-slate-100 p-2 overflow-y-auto hover:bg-slate-50 text-left">
          <span className="text-xs font-bold text-slate-400">{day}</span>
          <div className="mt-1 space-y-1">
            {dayIncidents.map(inc => (
              <div key={inc.id} className={`text-[9px] px-1.5 py-0.5 rounded border truncate shadow-sm ${getSeverityColor(inc.severity)} text-white`}>{inc.title}</div>
            ))}
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <h4 className="text-lg font-black">{t.calendar.months[month]} {year}</h4>
          <div className="flex gap-2"><button onClick={handlePrevMonth} className="p-2 hover:bg-slate-800"><i className="fa-solid fa-chevron-left"></i></button><button onClick={handleNextMonth} className="p-2 hover:bg-slate-800"><i className="fa-solid fa-chevron-right"></i></button></div>
        </div>
        <div className="grid grid-cols-7 border-collapse">{days}</div>
      </div>
    );
  };

  const renderList = () => (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
      {incidents.map(inc => (
        <div key={inc.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm flex group text-left">
          <div className={`w-2 ${getSeverityColor(inc.severity)}`}></div>
          <div className="p-6 flex-1">
            <h4 className="font-bold">{inc.title}</h4>
            <p className="text-xs text-slate-400 uppercase font-black">{inc.date} • {inc.location}</p>
            <p className="text-sm mt-2 text-slate-600 line-clamp-2">{inc.description}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-left">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">Incident Intelligence Hub</h3>
          <p className="text-sm text-slate-400 font-medium">Real-time safety occurrences and near-miss monitoring.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shrink-0">
          <button onClick={() => setViewType('year')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewType === 'year' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Year</button>
          <button onClick={() => setViewType('month')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewType === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Month</button>
          <button onClick={() => setViewType('list')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${viewType === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>List</button>
        </div>
      </div>

      {viewType === 'year' ? renderYearView() : viewType === 'month' ? renderMonthView() : renderList()}

      {/* Industrial Intelligence Memo */}
      <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-8 border border-amber-400/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <i className="fa-solid fa-notes-medical text-7xl text-amber-400"></i>
        </div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
           <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center border border-amber-400/20 shrink-0">
              <i className="fa-solid fa-triangle-exclamation text-amber-400 text-3xl"></i>
           </div>
           <div className="flex-1 space-y-4">
              <div>
                <h4 className="text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">System Intelligence Memo</h4>
                <p className="text-white font-black text-lg leading-tight uppercase tracking-tight">Hazardous Event Forensics</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Painpoint / ปัญหาหลัก</p>
                   <p className="text-xs text-slate-300 leading-relaxed font-medium">อุบัติเหตุหรือเหตุการณ์เกือบเกิดอุบัติเหตุ (Near Miss) มักถูกมองข้ามหรือจัดเก็บแยกส่วน ทำให้ไม่สามารถวิเคราะห์หาแนวโน้มเพื่อป้องกันในอนาคตได้</p>
                </div>
                <div className="p-4 bg-amber-400/5 rounded-xl border border-amber-400/10">
                   <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Solution / แนวทางแก้ไข</p>
                   <p className="text-xs text-amber-100/80 leading-relaxed font-medium">ศูนย์กลางข้อมูลเหตุการณ์ความปลอดภัยพร้อมมุมมองปฏิทินที่ช่วยระบุความถี่และความรุนแรง เพื่อใช้ในการกำหนดมาตรการป้องกันเชิงรุก</p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReporting;
