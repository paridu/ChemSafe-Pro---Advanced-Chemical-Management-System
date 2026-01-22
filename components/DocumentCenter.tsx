
import React, { useState, useRef } from 'react';
import { SafetyDocument } from '../types';

interface DocumentCenterProps {
  documents: SafetyDocument[];
  onUpload: (doc: SafetyDocument) => void;
  onDelete: (id: string) => void;
}

const DocumentCenter: React.FC<DocumentCenterProps> = ({ documents, onUpload, onDelete }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Forms', 'Checksheets', 'Manuals', 'Protocols'];

  const filtered = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const extension = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const newDoc: SafetyDocument = {
        id: `DOC-${Math.floor(Math.random() * 1000)}`,
        title: file.name.replace(/\.[^/.]+$/, ""),
        category: (activeCategory === 'All' ? 'Forms' : activeCategory) as any,
        format: (['PDF', 'DOCX', 'XLSX'].includes(extension) ? extension : 'PDF') as any,
        uploadDate: new Date().toISOString().split('T')[0],
        size: `${(file.size / 1024).toFixed(1)} KB`
      };
      onUpload(newDoc);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = (doc: SafetyDocument) => {
    // Simulate a download by creating a blob and a link
    const content = `This is a simulated safety document: ${doc.title}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.title}.${doc.format.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return 'fa-file-pdf text-red-500';
      case 'DOCX': return 'fa-file-word text-blue-500';
      case 'XLSX': return 'fa-file-excel text-emerald-500';
      default: return 'fa-file text-slate-400';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.docx,.xlsx"
      />

      {/* Search and Category Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Search checksheet, form, or protocol..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full md:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-3"
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
          Upload New
        </button>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
                <i className={`fa-solid ${getFormatIcon(doc.format)}`}></i>
              </div>
              <button 
                onClick={() => onDelete(doc.id)}
                className="p-2 text-slate-200 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
            
            <h5 className="font-bold text-slate-800 mb-1 leading-tight group-hover:text-indigo-600 transition-colors min-h-[40px] line-clamp-2">
              {doc.title}
            </h5>
            <div className="flex items-center gap-2 mb-6">
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded text-[10px] font-bold uppercase tracking-widest">{doc.category}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">{doc.format} • {doc.size}</span>
            </div>

            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="text-[10px] text-slate-400">
                <p>Uploaded</p>
                <p className="font-bold">{doc.uploadDate}</p>
              </div>
              <button 
                onClick={() => handleDownload(doc)}
                className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center hover:bg-indigo-600 transition-colors"
              >
                <i className="fa-solid fa-download text-sm"></i>
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-24 text-center text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
            <i className="fa-solid fa-folder-open text-6xl mb-4 opacity-10"></i>
            <p className="text-lg font-bold">No documents found in this category</p>
          </div>
        )}
      </div>

      {/* Quick Downloads Summary */}
      <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <h4 className="text-2xl font-bold mb-2">Internal Compliance Bundle</h4>
          <p className="text-indigo-100 opacity-80 max-w-lg">Download the complete set of mandatory checksheets and forms for your quarterly OSHA audit report.</p>
        </div>
        <button 
          onClick={() => {
            const doc = { title: 'Compliance_Bundle', format: 'ZIP' } as any;
            handleDownload(doc);
          }}
          className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-colors shadow-xl shadow-indigo-900/20 whitespace-nowrap"
        >
          Download Bundle (.ZIP)
        </button>
      </div>
    </div>
  );
};

export default DocumentCenter;
