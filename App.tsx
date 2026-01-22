
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InventoryTable from './components/InventoryTable';
import RiskAssistant from './components/RiskAssistant';
import SDSRepository from './components/SDSRepository';
import ComplianceManager from './components/ComplianceManager';
import AlertConfiguration from './components/AlertConfiguration';
import DocumentCenter from './components/DocumentCenter';
import WasteManagement from './components/WasteManagement';
import IncidentReporting from './components/IncidentReporting';
import TrainingTracker from './components/TrainingTracker';
import ProcurementWorkflow from './components/ProcurementWorkflow';
import UserManagement from './components/UserManagement';
import NewsManagement from './components/NewsManagement';
import DatabaseMonitoring from './components/DatabaseMonitoring';
import StorageManagement from './components/StorageManagement';
import ChecksheetCenter from './components/ChecksheetCenter';
import PPEManager from './components/PPEManager';
import ChemicalStorageMonitoring from './components/ChemicalStorageMonitoring';
import AuditTrail from './components/AuditTrail';
import AILogisticsHub from './components/AILogisticsHub';
import AIChatPDF from './components/AIChatPDF';
import CalendarManagement from './components/CalendarManagement';
import CompatibilityConfig from './components/CompatibilityConfig';
import FactoryLayoutMapping from './components/FactoryLayoutMapping';

import { 
  ViewType, ChemicalItem, SDSDocument, ComplianceReport, 
  AlertTrigger, SafetyDocument, Language, WasteLog, 
  IncidentReport, TrainingRecord, PurchaseRequest, User, NewsItem, VisitorStats,
  StorageLocation, PPEItem, AuditLog, VisitorHistory, CalendarEvent, HazardClass, PPETransaction
} from './types';

import { 
  MOCK_CHEMICALS, MOCK_SDS, MOCK_COMPLIANCE, 
  MOCK_ALERTS, MOCK_SAFETY_DOCS, MOCK_WASTE, 
  MOCK_INCIDENTS, MOCK_TRAINING, MOCK_PROCUREMENT,
  MOCK_USERS, MOCK_NEWS, MOCK_STORAGES, MOCK_PPE,
  MOCK_AUDIT_LOGS, MOCK_CALENDAR_EVENTS, COMPATIBILITY_MATRIX,
  MOCK_PPE_TRANSACTIONS
} from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Application Data State
  const [chemicals, setChemicals] = useState<ChemicalItem[]>(MOCK_CHEMICALS);
  const [storages, setStorages] = useState<StorageLocation[]>(MOCK_STORAGES);
  const [ppeItems, setPpeItems] = useState<PPEItem[]>(MOCK_PPE);
  const [ppeTransactions, setPpeTransactions] = useState<PPETransaction[]>(MOCK_PPE_TRANSACTIONS);
  const [sdsDocs, setSdsDocs] = useState<SDSDocument[]>(MOCK_SDS);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>(MOCK_COMPLIANCE);
  const [alerts, setAlerts] = useState<AlertTrigger[]>(MOCK_ALERTS);
  const [docs, setDocs] = useState<SafetyDocument[]>(MOCK_SAFETY_DOCS);
  
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>(MOCK_WASTE);
  const [incidents, setIncidents] = useState<IncidentReport[]>(MOCK_INCIDENTS);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>(MOCK_TRAINING);
  const [purchases, setPurchases] = useState<PurchaseRequest[]>(MOCK_PROCUREMENT);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [compatibilityMatrix, setCompatibilityMatrix] = useState<Record<HazardClass, HazardClass[]>>(COMPATIBILITY_MATRIX);

  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    onlineUsers: Math.floor(Math.random() * 8) + 5,
    history: []
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('chemsafe_session');
    if (savedUser) setUser(JSON.parse(savedUser));
    
    const savedChems = localStorage.getItem('cs_inventory');
    if (savedChems) setChemicals(JSON.parse(savedChems));

    const savedStorages = localStorage.getItem('cs_storages');
    if (savedStorages) setStorages(JSON.parse(savedStorages));

    const savedMatrix = localStorage.getItem('cs_compatibility');
    if (savedMatrix) setCompatibilityMatrix(JSON.parse(savedMatrix));

    const savedCompliance = localStorage.getItem('cs_compliance');
    if (savedCompliance) setComplianceReports(JSON.parse(savedCompliance));

    const savedPpe = localStorage.getItem('cs_ppe');
    if (savedPpe) setPpeItems(JSON.parse(savedPpe));

    const savedPpeT = localStorage.getItem('cs_ppe_tx');
    if (savedPpeT) setPpeTransactions(JSON.parse(savedPpeT));

    const savedTraining = localStorage.getItem('cs_training');
    if (savedTraining) setTrainingRecords(JSON.parse(savedTraining));

    // Handle Visitor Analytics
    const today = new Date().toISOString().split('T')[0];
    const storedHistoryRaw = localStorage.getItem('chemsafe_visitor_history');
    let history: VisitorHistory[] = storedHistoryRaw ? JSON.parse(storedHistoryRaw) : [];

    if (history.length === 0) {
      for (let i = 6; i >= 1; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        history.push({ 
          date: d.toISOString().split('T')[0], 
          count: Math.floor(Math.random() * 50) + 100 
        });
      }
    }

    const todayEntry = history.find(h => h.date === today);
    if (todayEntry) {
      todayEntry.count += 1;
    } else {
      history.push({ date: today, count: 1 });
    }

    if (history.length > 14) history = history.slice(-14);

    localStorage.setItem('chemsafe_visitor_history', JSON.stringify(history));
    
    const total = history.reduce((acc, h) => acc + h.count, 0);
    localStorage.setItem('chemsafe_total_visits', total.toString());

    setVisitorStats(prev => ({ 
      ...prev, 
      totalVisits: total,
      history: history
    }));
    
    setIsLoaded(true);
  }, []);

  // Persistence
  useEffect(() => { localStorage.setItem('cs_inventory', JSON.stringify(chemicals)); }, [chemicals]);
  useEffect(() => { localStorage.setItem('cs_storages', JSON.stringify(storages)); }, [storages]);
  useEffect(() => { localStorage.setItem('cs_compatibility', JSON.stringify(compatibilityMatrix)); }, [compatibilityMatrix]);
  useEffect(() => { localStorage.setItem('cs_compliance', JSON.stringify(complianceReports)); }, [complianceReports]);
  useEffect(() => { localStorage.setItem('cs_ppe', JSON.stringify(ppeItems)); }, [ppeItems]);
  useEffect(() => { localStorage.setItem('cs_ppe_tx', JSON.stringify(ppeTransactions)); }, [ppeTransactions]);
  useEffect(() => { localStorage.setItem('cs_training', JSON.stringify(trainingRecords)); }, [trainingRecords]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorStats(prev => ({
        ...prev,
        onlineUsers: Math.max(1, prev.onlineUsers + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const addAuditLog = (action: string, details: string, severity: 'info' | 'warning' | 'critical' = 'info') => {
    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || 'SYSTEM',
      userName: user?.name || 'System',
      action,
      details,
      severity
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('chemsafe_session', JSON.stringify(u));
    addAuditLog('USER_LOGIN', `User ${u.name} signed into the platform.`);
  };

  const handleLogout = () => {
    addAuditLog('USER_LOGOUT', `User ${user?.name} signed out.`);
    setUser(null);
    localStorage.removeItem('chemsafe_session');
    setActiveView('dashboard');
  };

  // Logic Handlers
  const handleUpdateChemical = (updated: ChemicalItem) => {
    setChemicals(prev => prev.map(c => c.id === updated.id ? updated : c));
    addAuditLog('UPDATE_STOCK', `Updated stock for ${updated.name} (${updated.id})`);
  };

  const handleAddNewBatch = (base: ChemicalItem, storageId: string) => {
    const newBatch: ChemicalItem = {
      ...base,
      id: `${base.id.split('/')[0]}-${Math.floor(Math.random() * 1000)}/2025`,
      storageId,
      quantity: 0,
    };
    setChemicals(prev => [...prev, newBatch]);
    addAuditLog('ADD_BATCH', `Registered new batch for ${base.name} in ${storageId}`);
  };

  const handleMoveChemical = (chemicalId: string, storageId: string) => {
    const chem = chemicals.find(c => c.id === chemicalId);
    setChemicals(prev => prev.map(c => 
      c.id === chemicalId ? { ...c, storageId } : c
    ));
    addAuditLog('MOVE_STOCK', `Relocated ${chem?.name} to storage ${storageId}`);
  };

  const handleTogglePPEForStorage = (storageId: string, ppeId: string) => {
    setStorages(prev => prev.map(s => {
      if (s.id !== storageId) return s;
      const exists = s.requiredPPE.includes(ppeId);
      return {
        ...s,
        requiredPPE: exists 
          ? s.requiredPPE.filter(id => id !== ppeId)
          : [...s.requiredPPE, ppeId]
      };
    }));
  };

  const handleUpdateProcurementStatus = (id: string, status: 'Approved' | 'Rejected', actor: string) => {
    setPurchases(prev => prev.map(p => p.id === id ? { ...p, status, approvedBy: actor } : p));
    addAuditLog(`${status.toUpperCase()}_PURCHASE`, `Purchase request ${id} was ${status.toLowerCase()} by ${actor}`);
  };

  const handleAddPurchaseRequest = (request: PurchaseRequest) => {
    setPurchases(prev => [request, ...prev]);
    addAuditLog('CREATE_PURCHASE', `New purchase request for ${request.chemicalName} created by ${request.requester}`);
  };

  const handleUpdateStoragePos = (id: string, x: number, y: number, lat?: number, lng?: number) => {
    setStorages(prev => prev.map(s => s.id === id ? { ...s, mapX: x, mapY: y, lat, lng } : s));
    addAuditLog('UPDATE_SITE_MAPPING', `Storage ${id} location coordinates updated (X:${x}, Y:${y}, Lat:${lat || 'N/A'}, Lng:${lng || 'N/A'}).`);
  };

  const handleSaveCompliance = (report: ComplianceReport) => {
    setComplianceReports(prev => {
      const exists = prev.find(r => r.id === report.id);
      if (exists) {
        addAuditLog('UPDATE_COMPLIANCE', `Updated compliance report ${report.title} (${report.id})`);
        return prev.map(r => r.id === report.id ? report : r);
      } else {
        addAuditLog('CREATE_COMPLIANCE', `Created new compliance report ${report.title}`);
        return [...prev, report];
      }
    });
  };

  const handleSaveSDS = (doc: SDSDocument) => {
    setSdsDocs(prev => [doc, ...prev]);
    addAuditLog('ARCHIVE_SDS', `New SDS document ${doc.name} archived for chemical ${doc.chemicalId}.`);
  };

  const handleUpdatePPEItem = (ppe: PPEItem) => {
    setPpeItems(prev => prev.map(p => p.id === ppe.id ? ppe : p));
    addAuditLog('UPDATE_PPE_CATALOG', `Modified PPE specifications for ${ppe.name}.`);
  };

  const handleAddPPEItem = (ppe: PPEItem) => {
    setPpeItems(prev => [...prev, ppe]);
    addAuditLog('ADD_PPE_CATALOG', `Registered new PPE equipment ${ppe.name} into global catalog.`);
  };

  const handleAddPPETransaction = (tx: PPETransaction) => {
    setPpeTransactions(prev => [tx, ...prev]);
    setPpeItems(prev => prev.map(p => {
      if (p.id !== tx.ppeId) return p;
      const adjustment = tx.type === 'Restock' ? tx.quantity : -tx.quantity;
      return { ...p, stock: Math.max(0, p.stock + adjustment) };
    }));
    addAuditLog('PPE_TRANSACTION', `${tx.type} operation for ${tx.ppeName} (Qty: ${tx.quantity}).`);
  };

  const renderContent = () => {
    if (!user) return null;
    const isAdmin = user.role === 'Admin';
    const isOfficer = user.role === 'Safety Officer' || isAdmin;

    switch (activeView) {
      case 'dashboard': return <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'inventory': return <InventoryTable chemicals={chemicals} onSave={(c) => { setChemicals([...chemicals, c]); addAuditLog('CREATE_ITEM', `Created inventory item ${c.name}`); }} onDelete={(id) => setChemicals(chemicals.filter(c => c.id !== id))} />;
      case 'storages': return (
        <StorageManagement 
          storages={storages} 
          chemicals={chemicals} 
          ppeItems={ppeItems}
          lang={lang} 
          onAdd={(s) => setStorages([...storages, s])} 
          onUpdate={(s) => setStorages(storages.map(st => st.id === s.id ? s : st))} 
          onDelete={(id) => setStorages(storages.filter(s => s.id !== id))}
          onMoveChemical={handleMoveChemical}
          onTogglePPE={handleTogglePPEForStorage}
          onUpdateChemical={handleUpdateChemical}
          onAddNewBatch={handleAddNewBatch}
          onUpdateStoragePos={handleUpdateStoragePos}
          compatibilityMatrix={compatibilityMatrix}
        />
      );
      case 'mapping_layout': return isOfficer ? (
        <FactoryLayoutMapping 
           storages={storages} 
           lang={lang} 
           onUpdateStoragePos={handleUpdateStoragePos}
        />
      ) : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'compatibility_mgmt': return isOfficer ? (
        <CompatibilityConfig 
          matrix={compatibilityMatrix} 
          lang={lang} 
          onUpdate={(m) => { setCompatibilityMatrix(m); addAuditLog('UPDATE_MATRIX', 'Industrial compatibility matrix updated.'); }} 
        />
      ) : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'storage_monitoring': return <ChemicalStorageMonitoring />;
      case 'calendar_mgmt': return (
        <CalendarManagement 
          events={calendarEvents} 
          lang={lang} 
          onAddEvent={(e) => { setCalendarEvents([...calendarEvents, e]); addAuditLog('CREATE_EVENT', `Scheduled ${e.type}: ${e.title}`); }}
          onUpdateEvent={(e) => { setCalendarEvents(calendarEvents.map(ev => ev.id === e.id ? e : ev)); addAuditLog('UPDATE_EVENT', `Updated ${e.type}: ${e.title}`); }}
          onDeleteEvent={(id) => { setCalendarEvents(calendarEvents.filter(ev => ev.id !== id)); addAuditLog('DELETE_EVENT', `Removed event ID: ${id}`); }}
        />
      );
      case 'checksheets': return <ChecksheetCenter storages={storages} lang={lang} />;
      case 'ppe': return (
        <PPEManager 
          ppeItems={ppeItems}
          transactions={ppeTransactions}
          user={user}
          lang={lang} 
          onAdd={handleAddPPEItem}
          onUpdate={handleUpdatePPEItem}
          onDelete={(id) => setPpeItems(ppeItems.filter(p => p.id !== id))}
          onAddTransaction={handleAddPPETransaction}
        />
      );
      case 'risk': return <RiskAssistant chemicals={chemicals} />;
      case 'sds': return <SDSRepository sdsDocs={sdsDocs} chemicals={chemicals} lang={lang} onSave={handleSaveSDS} onDelete={(id) => setSdsDocs(sdsDocs.filter(d => d.id !== id))} />;
      case 'compliance': return isOfficer ? <ComplianceManager reports={complianceReports} lang={lang} onSave={handleSaveCompliance} onDelete={(id) => setComplianceReports(complianceReports.filter(c => c.id !== id))} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'waste': return isOfficer ? <WasteManagement logs={wasteLogs} lang={lang} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'training': return isOfficer ? (
        <TrainingTracker 
          records={trainingRecords} 
          lang={lang} 
          onAdd={(r) => { setTrainingRecords([r, ...trainingRecords]); addAuditLog('REGISTER_TRAINING', `Archived training record for ${r.traineeName}.`); }}
          onUpdate={(r) => { setTrainingRecords(trainingRecords.map(rec => rec.id === r.id ? r : rec)); addAuditLog('UPDATE_TRAINING', `Updated competency log for ${r.traineeName}.`); }}
          onDelete={(id) => { setTrainingRecords(trainingRecords.filter(rec => rec.id !== id)); addAuditLog('DELETE_TRAINING', `Deleted record ID: ${id}`); }}
        />
      ) : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'procurement': return <ProcurementWorkflow requests={purchases} lang={lang} user={user} onUpdateStatus={handleUpdateProcurementStatus} onAddRequest={handleAddPurchaseRequest} />;
      case 'alerts': return isOfficer ? <AlertConfiguration alerts={alerts} chemicals={chemicals} onSave={(a) => setAlerts([...alerts, a])} onDelete={(id) => setAlerts(alerts.filter(al => al.id !== id))} onToggle={(id) => setAlerts(alerts.map(al => al.id === id ? {...al, isEnabled: !al.isEnabled} : al))} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'news': return isOfficer ? <NewsManagement news={news} lang={lang} onAdd={(n) => setNews([...news, n])} onUpdate={(n) => setNews(news.map(ne => ne.id === n.id ? n : ne))} onDelete={(id) => setNews(news.filter(n => n.id !== id))} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'incidents': return <IncidentReporting incidents={incidents} lang={lang} />;
      case 'audit': return <AuditTrail logs={auditLogs} lang={lang} />;
      case 'documents': return <DocumentCenter documents={docs} onUpload={(d) => setDocs([...docs, d])} onDelete={(id) => setDocs(docs.filter(d => d.id !== id))} />;
      case 'users': return isAdmin ? <UserManagement users={users} lang={lang} onDelete={(id) => setUsers(users.filter(u => u.id !== id))} onAdd={(u) => setUsers([...users, u])} onUpdate={(u) => setUsers(users.map(us => us.id === u.id ? u : us))} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'monitoring': return isAdmin ? <DatabaseMonitoring lang={lang} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'ai_hub': return isAdmin ? <AILogisticsHub lang={lang} /> : <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
      case 'ai_chat_pdf': return <AIChatPDF chemicals={chemicals} lang={lang} />;
      case 'settings': return <SettingsView />;
      default: return <Dashboard chemicals={chemicals} news={news} lang={lang} visitorStats={visitorStats} />;
    }
  };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center"><i className="fa-solid fa-flask fa-spin text-4xl text-amber-500"></i></div>;
  if (!user) return <Login onLogin={handleLogin} lang={lang} setLang={setLang} />;

  return (
    <Layout activeView={activeView} setActiveView={setActiveView} lang={lang} setLang={setLang} user={user} onLogout={handleLogout}>
      {renderContent()}
    </Layout>
  );
};

const SettingsView = () => (
  <div className="max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-500">
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">System Settings</h3>
      <div className="space-y-4">
        <SettingToggle title="Push Notifications" desc="Alert for stock and compliance" active />
        <SettingToggle title="Cloud Backup" desc="Automated daily database sync" active />
        <SettingToggle title="Audit Mode" desc="Prevent changes during active inspection" />
        <SettingToggle title="AI Assistance" desc="Gemini 3 powered safety advisor" active />
      </div>
    </div>
  </div>
);

const SettingToggle = ({ title, desc, active = false }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
    <div>
      <h5 className="font-bold text-slate-700">{title}</h5>
      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{desc}</p>
    </div>
    <div className={`w-12 h-6 rounded-full relative cursor-pointer ${active ? 'bg-amber-400' : 'bg-slate-200'}`}>
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`}></div>
    </div>
  </div>
);

export default App;
