
import React, { useState, useEffect } from 'react';
import { NewsItem, Language, NewsType, NewsPosition, NewsSpeed } from '../types';
import { TRANSLATIONS } from '../constants';

interface NewsManagementProps {
  news: NewsItem[];
  lang: Language;
  onAdd: (item: NewsItem) => void;
  onUpdate: (item: NewsItem) => void;
  onDelete: (id: string) => void;
}

const NewsManagement: React.FC<NewsManagementProps> = ({ news, lang, onAdd, onUpdate, onDelete }) => {
  const t = TRANSLATIONS[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const handleEdit = (item: NewsItem) => {
    setSelectedNews(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedNews(null);
    setIsModalOpen(true);
  };

  const handleSave = (itemData: NewsItem) => {
    if (selectedNews) {
      onUpdate(itemData);
    } else {
      onAdd(itemData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800">{t.news.title}</h3>
          <p className="text-sm text-slate-400">{t.news.subtitle}</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-3"
        >
          <i className="fa-solid fa-plus-circle"></i>
          {t.common.add}
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">{t.news.text}</th>
                <th className="px-8 py-5">{t.news.type}</th>
                <th className="px-8 py-5">{t.news.position}</th>
                <th className="px-8 py-5">{t.news.active}</th>
                <th className="px-8 py-5 text-right">{t.common.action}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {news.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5 max-w-md">
                    <p className="font-bold text-slate-800 line-clamp-1">{item.text}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      {item.startDate} to {item.endDate}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      item.type === 'Breaking' ? 'bg-red-100 text-red-600' : 
                      item.type === 'Alert' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {t.news.types[item.type]}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-semibold text-slate-600">{item.position}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`w-3 h-3 rounded-full ${item.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(item.id)}
                        className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={selectedNews}
        lang={lang}
      />
    </div>
  );
};

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: NewsItem) => void;
  initialData: NewsItem | null;
  lang: Language;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, onSave, initialData, lang }) => {
  const t = TRANSLATIONS[lang];
  const [formData, setFormData] = useState<NewsItem>({
    id: '',
    text: '',
    type: 'General',
    position: 'Top',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    speed: 'Medium',
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `NW-${Math.floor(100 + Math.random() * 899)}`,
        text: '',
        type: 'General',
        position: 'Top',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        speed: 'Medium',
        isActive: true
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-xl font-bold text-slate-800">
            {initialData ? t.common.edit : t.common.add}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">{t.news.text}</label>
            <textarea
              required
              value={formData.text}
              onChange={e => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-24 resize-none"
              placeholder="Enter news content here..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.news.type}</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as NewsType })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="General">{t.news.types.General}</option>
                <option value="Breaking">{t.news.types.Breaking}</option>
                <option value="Alert">{t.news.types.Alert}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.news.position}</label>
              <select
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value as NewsPosition })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Top">Top</option>
                <option value="Bottom">Bottom</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.news.startDate}</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.news.endDate}</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t.news.speed}</label>
              <select
                value={formData.speed}
                onChange={e => setFormData({ ...formData, speed: e.target.value as NewsSpeed })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Slow">Slow</option>
                <option value="Medium">Medium</option>
                <option value="Fast">Fast</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input 
                type="checkbox" 
                id="news-active" 
                checked={formData.isActive} 
                onChange={e => setFormData({...formData, isActive: e.target.checked})}
                className="w-5 h-5 accent-indigo-600"
              />
              <label htmlFor="news-active" className="text-sm font-bold text-slate-700">{t.news.active}</label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsManagement;
