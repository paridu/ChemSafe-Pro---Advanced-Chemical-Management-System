
import { 
  ChemicalItem, HazardClass, SDSDocument, ComplianceReport, 
  AlertTrigger, SafetyDocument, WasteLog, IncidentReport, 
  TrainingRecord, Language, User, NewsItem,
  StorageLocation, PPEItem, AuditLog, CalendarEvent, PPETransaction,
  PurchaseRequest
} from './types';

export const COMPATIBILITY_MATRIX: Record<HazardClass, HazardClass[]> = {
  [HazardClass.FLAMMABLE]: [HazardClass.OXIDIZER, HazardClass.EXPLOSIVE],
  [HazardClass.OXIDIZER]: [HazardClass.FLAMMABLE, HazardClass.CORROSIVE],
  [HazardClass.CORROSIVE]: [HazardClass.FLAMMABLE, HazardClass.OXIDIZER],
  [HazardClass.TOXIC]: [],
  [HazardClass.EXPLOSIVE]: [HazardClass.FLAMMABLE, HazardClass.OXIDIZER, HazardClass.CORROSIVE],
  [HazardClass.ENVIRONMENTAL]: [],
  [HazardClass.HEALTH]: [],
  [HazardClass.NONE]: []
};

export const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: 'LOG-001', timestamp: new Date().toISOString(), userId: 'U-001', userName: 'Jane Doe', action: 'MOVE_STOCK', details: 'Moved 50L Ethanol to Solvent Vault', severity: 'info' },
  { id: 'LOG-002', timestamp: new Date().toISOString(), userId: 'U-002', userName: 'Admin User', action: 'APPROVE_PURCHASE', details: 'Approved PR-4001 Acetone request', severity: 'info' }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'EV-001', title: 'Q1 Chemical Audit', type: 'Audit', date: '2025-03-25', startTime: '09:00', endTime: '12:00', location: 'Warehouse B4', description: 'Internal chemical audit and label verification.', organizer: 'Jane Doe', status: 'Scheduled' },
  { id: 'EV-002', title: 'Safety Tour: Lab B2', type: 'Safety Tour', date: '2025-03-27', startTime: '14:00', endTime: '15:30', location: 'R&D Center', description: 'Monthly safety walkthrough with site managers.', organizer: 'Admin User', status: 'Scheduled' },
  { id: 'EV-003', title: 'GHS Compliance News Release', type: 'News Release', date: '2025-03-20', startTime: '08:00', endTime: '09:00', location: 'Internal Portal', description: 'Global release of updated chemical handling news.', organizer: 'IT Ops', status: 'Completed' },
  { id: 'EV-004', title: 'HazMat Level 2 Training', type: 'Training', date: '2025-03-28', startTime: '10:00', endTime: '16:00', location: 'Training Room 1', description: 'Advanced hazardous materials handling course.', organizer: 'Safety Dept', status: 'Scheduled' },
];

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    nav: {
      dashboard: "Dashboard",
      inventory: "Inventory",
      storages: "Storages",
      checksheets: "Checksheets",
      ppe: "PPE Mgmt",
      sds: "SDS Repository",
      compliance: "Compliance",
      waste: "Waste Mgmt",
      incidents: "Incidents",
      training: "Training",
      procurement: "Procurement",
      documents: "Doc Center",
      alerts: "Alert Config",
      risk: "Risk AI",
      users: "User Management",
      news: "News Config",
      settings: "Settings",
      audit: "Audit Logs",
      monitoring: "DB Monitoring",
      calendar: "Calendar Mgmt",
      compatibility: "Compatibility Matrix",
      mapping: "Factory Layout"
    },
    common: {
      add: "Add New",
      edit: "Edit",
      delete: "Delete",
      search: "Search...",
      save: "Save",
      cancel: "Cancel",
      status: "Status",
      date: "Date",
      action: "Action",
      logout: "Logout",
      login: "Login",
      email: "Email Address",
      password: "Password",
      approve: "Approve",
      reject: "Reject"
    },
    dashboard: {
      total: "Total Chemicals",
      critical: "Critical Stock",
      expiring: "Expiring Soon",
      score: "Safety Score",
      visitors: "Total Visits",
      online: "Live Sessions",
      traffic: "Traffic Trend",
      daily_visits: "Daily Visitors"
    },
    storage: {
      compatibility_warning: "Storage Compatibility Conflict",
      conflict_desc: "The chemical you are trying to add is incompatible with existing hazardous materials in this area.",
      usage: "Storage Usage",
      batches: "Total Batches",
      safety_coverage: "Safety Coverage",
      distribution: "Chemical Distribution",
      responsible: "Responsible Person"
    },
    news: {
      title: "News Management",
      subtitle: "Configure global tickers and internal announcements.",
      text: "News Content",
      type: "Type",
      position: "Position",
      active: "Active Status",
      startDate: "Start Date",
      endDate: "End Date",
      speed: "Scroll Speed",
      types: {
        General: "General",
        Breaking: "Breaking",
        Alert: "Alert"
      }
    },
    calendar: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    }
  },
  th: {
    nav: {
      dashboard: "แผงควบคุม",
      inventory: "คลังสารเคมี",
      storages: "พื้นที่จัดเก็บ",
      checksheets: "เช็คลิสต์",
      ppe: "จัดการ PPE",
      sds: "คลัง SDS",
      compliance: "การปฏิบัติตามกฎ",
      waste: "จัดการของเสีย",
      incidents: "รายงานอุบัติการณ์",
      training: "การฝึกอบรม",
      procurement: "การจัดซื้อ",
      documents: "ศูนย์เอกสาร",
      alerts: "แจ้งเตือน",
      risk: "AI ประเมินความเสี่ยง",
      users: "จัดการผู้ใช้งาน",
      news: "จัดการข่าววิ่ง",
      settings: "การตั้งค่า",
      audit: "บันทึกการใช้งาน",
      monitoring: "ตรวจสอบระบบ",
      calendar: "จัดการปฏิทิน",
      compatibility: "ตั้งค่าความไม่เข้ากัน",
      mapping: "แผนผังโรงงาน"
    },
    common: {
      add: "เพิ่มใหม่",
      edit: "แก้ไข",
      delete: "ลบ",
      search: "ค้นหา...",
      save: "บันทึก",
      cancel: "ยกเลิก",
      status: "สถานะ",
      date: "วันที่",
      action: "จัดการ",
      logout: "ออกจากระบบ",
      login: "เข้าสู่ระบบ",
      email: "อีเมล",
      password: "รหัสผ่าน",
      approve: "อนุมัติ",
      reject: "ปฏิเสธ"
    },
    dashboard: {
      total: "สารเคมีทั้งหมด",
      critical: "สต็อกขั้นวิกฤต",
      expiring: "ใกล้หมดอายุ",
      score: "คะแนนความปลอดภัย",
      visitors: "ผู้เข้าชมทั้งหมด",
      online: "ผู้ใช้งานขณะนี้",
      traffic: "แนวโน้มการเข้าใช้งาน",
      daily_visits: "จำนวนผู้เข้าชมรายวัน"
    },
    storage: {
      compatibility_warning: "แจ้งเตือนความไม่เข้ากันของสารเคมี",
      conflict_desc: "สารเคมีที่คุณกำลังย้ายเข้ามีความไม่เข้ากันกับสารอันตรายที่มีอยู่เดิมในพื้นที่นี้",
      usage: "ปริมาณการใช้งาน",
      batches: "จำนวนแบทช์",
      safety_coverage: "ความครอบคลุมความปลอดภัย",
      distribution: "การกระจายตัวสารเคมี",
      responsible: "ผู้รับผิดชอบ"
    },
    news: {
      title: "จัดการข่าวสาร",
      subtitle: "กำหนดค่าข่าววิ่งและประกาศภายในองค์กร",
      text: "เนื้อหาข่าว",
      type: "ประเภท",
      position: "ตำแหน่ง",
      active: "สถานะการใช้งาน",
      startDate: "วันที่เริ่ม",
      endDate: "วันที่สิ้นสุด",
      speed: "ความเร็ว",
      types: {
        General: "ทั่วไป",
        Breaking: "ด่วนมาก",
        Alert: "แจ้งเตือน"
      }
    },
    calendar: {
      months: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
      daysShort: ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."]
    }
  }
};

export const MOCK_PPE: PPEItem[] = [
  { id: 'PPE-001', name: 'N95 Respirator', type: 'Mask', icon: 'fa-mask-face', description: 'Standard particulate protection.', stock: 500, minStock: 100, unit: 'Units' },
  { id: 'PPE-002', name: 'Nitrile Gloves', type: 'Gloves', icon: 'fa-hands-clapping', description: 'Chemical resistant hand protection.', stock: 1200, minStock: 200, unit: 'Pairs' },
  { id: 'PPE-003', name: 'Safety Goggles', type: 'Goggles', icon: 'fa-glasses', description: 'Impact and splash protection.', stock: 150, minStock: 20, unit: 'Units' },
  { id: 'PPE-004', name: 'Level B Hazmat Suit', type: 'Suit', icon: 'fa-user-ninja', description: 'Full body chemical protection.', stock: 45, minStock: 5, unit: 'Sets' },
  { id: 'PPE-005', name: 'Steel Toe Boots', type: 'Boots', icon: 'fa-boot', description: 'Foot protection against heavy objects.', stock: 80, minStock: 10, unit: 'Pairs' },
];

export const MOCK_PPE_TRANSACTIONS: PPETransaction[] = [
  { id: 'TX-1001', ppeId: 'PPE-002', ppeName: 'Nitrile Gloves', type: 'Restock', quantity: 200, user: 'Admin User', timestamp: new Date(Date.now() - 86400000).toISOString(), notes: 'Weekly replenishment' },
  { id: 'TX-1002', ppeId: 'PPE-001', ppeName: 'N95 Respirator', type: 'Withdrawal', quantity: 10, user: 'Anuson K.', timestamp: new Date(Date.now() - 3600000).toISOString(), notes: 'Lab B2 Session' }
];

export const MOCK_STORAGES: StorageLocation[] = [
  { id: 'STR-B4', name: 'Warehouse B4', area: 'Main Logistics North', description: 'General chemical storage area.', capacity: 5000, requiredPPE: ['PPE-002', 'PPE-003', 'PPE-005'], status: 'Normal', mapX: 150, mapY: 200, lat: 13.7563, lng: 100.5018 },
  { id: 'STR-B2', name: 'Lab B2 Storage', area: 'R&D Center East', description: 'Small reagent storage for analytical labs.', capacity: 200, requiredPPE: ['PPE-001', 'PPE-002', 'PPE-003'], status: 'Warning', mapX: 450, mapY: 150, lat: 13.7500, lng: 100.5100 },
  { id: 'STR-SOLV', name: 'Solvent Vault', area: 'Main Logistics North', description: 'Fire-proof storage for flammables.', capacity: 2000, requiredPPE: ['PPE-002', 'PPE-003'], status: 'Full', mapX: 150, mapY: 400, lat: 13.7600, lng: 100.4900 },
];

export const MOCK_NEWS: NewsItem[] = [
  { id: 'NW-001', text: 'BREAKING: Global Safety Standards Updated for ISO 14001:2025. Mandatory reviews required by EOM.', type: 'Breaking', position: 'Top', startDate: '2024-01-01', endDate: '2026-12-31', speed: 'Fast', isActive: true },
  { id: 'NW-002', text: 'ALERT: Chemical spill drill scheduled for Building 4 this Friday at 14:00.', type: 'Alert', position: 'Top', startDate: '2024-01-01', endDate: '2026-12-31', speed: 'Medium', isActive: true },
];

export const MOCK_USERS: User[] = [
  { id: 'U-001', employeeId: 'EMP-1001', name: 'Jane Doe', email: 'jane@chemsafe.com', role: 'Safety Officer', position: 'EHS Manager', department: 'Safety Department' },
  { id: 'U-002', employeeId: 'EMP-0001', name: 'Admin User', email: 'admin@chemsafe.com', role: 'Admin', position: 'Technical Manager', department: 'IT Operations' },
  { id: 'U-003', employeeId: 'EMP-2005', name: 'Anuson K.', email: 'anuson@chemsafe.com', role: 'Staff', position: 'Warehouse Supervisor', department: 'Warehouse B4' },
];

export const MOCK_CHEMICALS: ChemicalItem[] = [
  {
    id: 'C0028/2025',
    name: 'Ethanol 95%',
    description: 'Industrial grade solvent',
    casNumber: '64-17-5',
    hazardClass: [HazardClass.FLAMMABLE, HazardClass.HEALTH],
    location: '#B4L1_XCALIBLE',
    storageId: 'STR-B4',
    quantity: 50,
    unit: 'Liters',
    expiryDate: '2026-05-12',
    responsiblePerson: 'Somchai P.',
    revisionDate: '2024-01-10',
    retentionYears: 5,
    sdsAvailable: true
  },
  {
    id: 'C0029/2025',
    name: 'Hydrochloric Acid 37%',
    description: 'Concentrated mineral acid',
    casNumber: '7647-01-0',
    hazardClass: [HazardClass.CORROSIVE, HazardClass.TOXIC],
    location: '#B2L1_MANUAL',
    storageId: 'STR-B2',
    quantity: 25,
    unit: 'Liters',
    expiryDate: '2025-08-20',
    responsiblePerson: 'Jane Doe',
    revisionDate: '2023-11-15',
    retentionYears: 5,
    sdsAvailable: true
  }
];

export const MOCK_WASTE: WasteLog[] = [
  { id: 'W-001', chemical_name: 'Used Solvent Mix', quantity: 200, unit: 'Liters', generator: 'Lab A', generation_date: '2024-05-10', disposal_method: 'Incineration', status: 'Storage' }
];

export const MOCK_INCIDENTS: IncidentReport[] = [
  { id: 'INC-101', title: 'Minor Spill in Storage B4', date: '2024-05-12', location: 'B4 Warehouse', severity: 'Medium', status: 'Closed', description: 'Small leak from ethanol drum.', reporter: 'Somchai P.' }
];

export const MOCK_TRAINING: TrainingRecord[] = [
  { 
    id: 'TR-001', 
    traineeName: 'Anuson K.', 
    employeeId: 'EMP-2005',
    courseName: 'HazMat Level 1', 
    completionDate: '2023-11-20', 
    expiryDate: '2024-11-20', 
    status: 'Expired',
    certificateId: 'CERT-882910',
    provider: 'Global Safety Council',
    score: 85
  },
  { 
    id: 'TR-002', 
    traineeName: 'Jane Doe', 
    employeeId: 'EMP-1001',
    courseName: 'ISO 14001 Lead Auditor', 
    completionDate: '2024-01-15', 
    expiryDate: '2026-01-15', 
    status: 'Active',
    certificateId: 'CERT-112003',
    provider: 'TUV SUD',
    score: 98
  }
];

export const MOCK_PROCUREMENT: PurchaseRequest[] = [
  { id: 'PR-4001', chemicalName: 'Acetone HPLC Grade', quantity: 10, unit: 'Liters', requester: 'Jane Doe', department: 'QC Lab', status: 'Pending', requestDate: '2024-05-20' }
];

export const MOCK_SDS: SDSDocument[] = [
  { id: 'SDS-001', chemicalId: 'C0028/2025', name: 'Ethanol Safety Data Sheet', version: 'v4.2', lastUpdated: '2024-01-10', fileSize: '1.2 MB', standard: 'GHS' }
];

export const MOCK_COMPLIANCE: ComplianceReport[] = [
  { id: 'REP-001', title: 'Annual Chemical Safety Audit', standard: 'OSHA', status: 'Compliant', date: '2024-05-20', auditor: 'John Smith' }
];

export const MOCK_ALERTS: AlertTrigger[] = [
  { id: 'ALT-001', name: 'Ethanol Low Stock', type: 'Stock Level', condition: 'less_than', value: 10, targetId: 'C0028/2025', notifyTo: 'Somchai P.', isEnabled: true }
];

export const MOCK_SAFETY_DOCS: SafetyDocument[] = [
  { id: 'DOC-001', title: 'Chemical Inventory Checksheet', category: 'Checksheets', format: 'XLSX', uploadDate: '2024-02-10', size: '45 KB' }
];

export const HAZARD_COLORS: Record<HazardClass, string> = {
  [HazardClass.FLAMMABLE]: 'bg-red-100 text-red-700 border-red-200',
  [HazardClass.CORROSIVE]: 'bg-orange-100 text-orange-700 border-orange-200',
  [HazardClass.TOXIC]: 'bg-purple-100 text-purple-700 border-purple-200',
  [HazardClass.OXIDIZER]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [HazardClass.EXPLOSIVE]: 'bg-slate-800 text-white border-slate-900',
  [HazardClass.ENVIRONMENTAL]: 'bg-green-100 text-green-700 border-green-200',
  [HazardClass.HEALTH]: 'bg-blue-100 text-blue-700 border-blue-200',
  [HazardClass.NONE]: 'bg-slate-100 text-slate-600 border-slate-200'
};
