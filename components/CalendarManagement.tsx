
import React, { useState } from 'react';
import { CalendarEvent, Language, CalendarEventType } from '../types';
import { TRANSLATIONS } from '../constants';

interface CalendarManagementProps {
  events: CalendarEvent[];
  lang: Language;
  onAddEvent: (event: CalendarEvent) => void;
  onUpdateEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

const CalendarManagement: React.FC<CalendarManagementProps> = ({ events, lang, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const t = TRANSLATIONS[lang];
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getEventTypeColor = (type: CalendarEventType) => {
    switch (type) {
      case 'Audit': return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case 'Safety Tour': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      case 'News Release': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'Training': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'Inspection': return 'bg-rose-50 text-rose-600 border-rose-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-slate-50/20 border border-slate-100"></div>);
    }
    
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(ev => ev.date === dateStr);
      
      days.push(
        <div key={day} className="h-32 bg-white border border-slate-100 p-2 overflow-y-auto hover:bg-indigo-50/10 transition-colors group relative">
          <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">{day}</span>
          <div className="mt-1 space-y-1">
            {dayEvents.map(ev => (
              <div 
                key={ev.id} 
                onClick={() => { setSelectedEvent(ev); setIsModalOpen(true); }}
                className={`text-[9px] px-1.5 py-1 rounded border truncate cursor-pointer shadow-sm transition-transform hover:scale-105 font-bold ${getEventTypeColor(ev.type)}`}
                title={`${ev.title} @ ${ev.startTime}`}
              >
                {ev.startTime} {ev.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20">
                <i className="fa-solid fa-calendar-alt"></i>
             </div>
             <div>
                <h4 className="text-xl font-black tracking-tight">
                  {t.calendar.months[month]} {year}
                </h4>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Global Safety Schedule</p>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-slate-800 p-1 rounded-xl">
              <button onClick={handlePrevMonth} className="w-10 h-10 rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center">
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <button onClick={handleNextMonth} className="w-10 h-10 rounded-lg hover:bg-slate-700 transition-all flex items-center justify-center">
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
            <button 
              onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20"
            >
              Add Event
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
          {t.calendar.daysShort.map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 border-collapse">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <i className="fa-solid fa-clock-rotate-left text-indigo-600"></i>
            {lang === 'en' ? 'Safety Calendar Mgmt' : 'จัดการปฏิทินความปลอดภัย'}
          </h1>
          <p className="text-slate-400 font-medium">
            Orchestrate audits, safety tours, and internal safety news deployments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side: Legend & Upcoming */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Event Categories</h4>
             <div className="space-y-3">
               <LegendItem label="Audit" color="bg-indigo-600" />
               <LegendItem label="Safety Tour" color="bg-emerald-600" />
               <LegendItem label="News Release" color="bg-amber-600" />
               <LegendItem label="Training" color="bg-purple-600" />
               <LegendItem label="Inspection" color="bg-rose-600" />
             </div>
           </div>

           <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Coming Up Next</h4>
             <div className="space-y-4">
               {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map(ev => (
                 <div key={ev.id} className="group cursor-pointer">
                    <p className="text-[10px] font-black text-indigo-500 uppercase mb-1">{ev.date}</p>
                    <h5 className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{ev.title}</h5>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <i className="fa-solid fa-location-dot"></i> {ev.location}
                    </p>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Side: Calendar */}
        <div className="lg:col-span-3">
          {renderCalendar()}
        </div>
      </div>

      {isModalOpen && (
        <EventModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={(ev) => {
            if (selectedEvent) onUpdateEvent(ev);
            else onAddEvent(ev);
            setIsModalOpen(false);
          }}
          onDelete={(id) => {
            onDeleteEvent(id);
            setIsModalOpen(false);
          }}
          initialData={selectedEvent}
          lang={lang}
        />
      )}
    </div>
  );
};

const LegendItem = ({ label, color }: any) => (
  <div className="flex items-center gap-3">
    <div className={`w-2 h-2 rounded-full ${color}`}></div>
    <span className="text-xs font-bold text-slate-600">{label}</span>
  </div>
);

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ev: CalendarEvent) => void;
  onDelete: (id: string) => void;
  initialData: CalendarEvent | null;
  lang: Language;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, onDelete, initialData, lang }) => {
  const [formData, setFormData] = useState<CalendarEvent>(initialData || {
    id: `EV-${Date.now()}`,
    title: '',
    type: 'Audit',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    location: '',
    description: '',
    organizer: '',
    status: 'Scheduled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg ${
               formData.type === 'Audit' ? 'bg-indigo-600' :
               formData.type === 'Safety Tour' ? 'bg-emerald-600' :
               formData.type === 'News Release' ? 'bg-amber-600' :
               'bg-slate-600'
             }`}>
                <i className="fa-solid fa-calendar-check"></i>
             </div>
             <h3 className="text-xl font-black text-slate-800">
               {initialData ? 'Edit Event' : 'Create New Event'}
             </h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-times text-slate-400"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Title</label>
            <input 
              required
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. Annual Chemical Inventory Audit"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as CalendarEventType})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Audit">Audit</option>
                <option value="Safety Tour">Safety Tour</option>
                <option value="News Release">News Release</option>
                <option value="Training">Training</option>
                <option value="Inspection">Inspection</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Date</label>
              <input 
                required
                type="date" 
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</label>
              <input 
                required
                type="time" 
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Time</label>
              <input 
                required
                type="time" 
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
                className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location / Room</label>
            <input 
              required
              type="text" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 outline-none"
              placeholder="e.g. Warehouse Block B"
            />
          </div>

          <div className="pt-6 flex gap-4">
            {initialData && (
              <button 
                type="button" 
                onClick={() => onDelete(initialData.id)}
                className="px-6 py-4 bg-red-50 text-red-600 font-black rounded-2xl hover:bg-red-100 transition-colors uppercase text-[10px] tracking-widest"
              >
                Delete
              </button>
            )}
            <div className="flex-1 flex gap-4">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex-1 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-colors uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all uppercase text-[10px] tracking-widest"
              >
                {initialData ? 'Update Event' : 'Deploy Event'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarManagement;
