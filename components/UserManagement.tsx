
import React, { useState, useEffect, useRef } from 'react';
import { User, Language, UserRole } from '../types';
import { TRANSLATIONS } from '../constants';

interface UserManagementProps {
  users: User[];
  lang: Language;
  onUpdate: (user: User) => void;
  onDelete: (id: string) => void;
  onAdd: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, lang, onUpdate, onDelete, onAdd }) => {
  const t = TRANSLATIONS[lang];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getRoleStyle = (role: string) => {
    switch(role) {
      case 'Admin': return 'bg-slate-950 text-amber-400 border-amber-400/30';
      case 'Manager': return 'bg-amber-400 text-black border-amber-500';
      case 'Safety Officer': return 'bg-indigo-600 text-white border-indigo-400';
      case 'Staff': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-50 text-slate-400';
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleSave = (userData: User) => {
    if (selectedUser) {
      onUpdate(userData);
    } else {
      onAdd(userData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pb-12 text-left">
      <div className="bg-black p-8 rounded-[2.5rem] border border-amber-400/20 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <i className="fa-solid fa-users-gear text-8xl text-amber-400"></i>
        </div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Personnel Directory</h3>
          <p className="text-amber-400/70 text-xs font-bold uppercase tracking-widest">Global access control & organizational hierarchy</p>
        </div>
        <button 
          onClick={handleAddNew}
          className="relative z-10 px-8 py-4 bg-amber-400 text-black rounded-2xl font-black hover:bg-amber-500 transition-all shadow-xl shadow-amber-400/20 flex items-center gap-3 uppercase text-[10px] tracking-widest"
        >
          <i className="fa-solid fa-user-plus text-sm"></i>
          Register Personnel
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">User Profile</th>
                <th className="px-8 py-6">Employee ID</th>
                <th className="px-8 py-6">Department / Position</th>
                <th className="px-8 py-6">Access Role</th>
                <th className="px-8 py-6 text-right">Terminal Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-amber-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-300 shadow-sm">
                        {user.avatar ? (
                          <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                        ) : (
                          <i className="fa-solid fa-user text-2xl"></i>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-800 text-sm truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold truncate lowercase">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-mono text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                      {user.employeeId || 'N/A'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tighter">{user.position || 'Unassigned'}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{user.department}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest shadow-sm ${getRoleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-black hover:text-amber-400 transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button 
                        onClick={() => onDelete(user.id)}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        initialData={selectedUser}
        lang={lang}
      />
    </div>
  );
};

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  initialData: User | null;
  lang: Language;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, initialData, lang }) => {
  const [formData, setFormData] = useState<User>({
    id: '',
    employeeId: '',
    name: '',
    email: '',
    role: 'Staff' as UserRole,
    position: '',
    department: '',
    avatar: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        id: `U-${Math.floor(100 + Math.random() * 899)}`,
        employeeId: '',
        name: '',
        email: '',
        role: 'Staff',
        position: '',
        department: '',
        avatar: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, avatar: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
        <div className="p-8 bg-slate-950 text-white flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-xl shadow-xl shadow-amber-400/20">
                <i className="fa-solid fa-user-gear"></i>
             </div>
             <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">Personnel Entry</h3>
                <p className="text-[9px] text-amber-400 font-bold uppercase tracking-[0.2em] mt-0.5">Database Registration Node</p>
             </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors p-2">
            <i className="fa-solid fa-times text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8 bg-slate-50/50 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-4 py-2">
            <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-32 h-32 rounded-[2rem] bg-white border-2 border-dashed border-slate-200 relative group cursor-pointer overflow-hidden flex items-center justify-center shadow-lg transition-all hover:border-amber-400"
            >
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:text-amber-500">
                  <i className="fa-solid fa-camera text-2xl"></i>
                  <span className="text-[8px] font-black uppercase tracking-widest">UPLOAD</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Change Photo</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Biometric Profile Photo</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Employee ID</label>
              <input
                required
                type="text"
                value={formData.employeeId}
                onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-mono text-xs font-black text-indigo-600 focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 outline-none transition-all shadow-sm"
                placeholder="EMP-XXXX"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 outline-none transition-all shadow-sm text-sm"
                placeholder="e.g. Somchai S."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Corporate Email</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 outline-none transition-all shadow-sm text-sm"
              placeholder="user@facility.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Professional Position</label>
              <input
                required
                type="text"
                value={formData.position}
                onChange={e => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 outline-none transition-all shadow-sm text-sm"
                placeholder="e.g. Manager"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Department Assignment</label>
              <input
                required
                type="text"
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-4 focus:ring-amber-400/10 focus:border-amber-400 outline-none transition-all shadow-sm text-sm"
                placeholder="e.g. Logistics Wing"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">Terminal Access Role</label>
            <div className="grid grid-cols-2 gap-3">
              {(['Admin', 'Manager', 'Safety Officer', 'Staff'] as UserRole[]).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData({...formData, role})}
                  className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    formData.role === role 
                    ? 'bg-black text-amber-400 border-black shadow-lg scale-[1.02]' 
                    : 'bg-white text-slate-400 border-slate-200 hover:border-amber-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-5 bg-white text-slate-500 font-black rounded-3xl hover:bg-slate-100 transition-all uppercase text-[10px] tracking-widest border border-slate-200 shadow-sm"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 bg-black text-amber-400 font-black rounded-3xl shadow-2xl uppercase text-[10px] tracking-widest hover:bg-slate-900 transition-all border border-white/10"
            >
              Sync Records
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
