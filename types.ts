
export enum HazardClass {
  FLAMMABLE = 'Flammable',
  CORROSIVE = 'Corrosive',
  TOXIC = 'Toxic',
  OXIDIZER = 'Oxidizer',
  EXPLOSIVE = 'Explosive',
  ENVIRONMENTAL = 'Environmental Hazard',
  HEALTH = 'Health Hazard',
  NONE = 'None'
}

export type UserRole = 'Admin' | 'Safety Officer' | 'Staff' | 'Manager';

export interface User {
  id: string;
  employeeId: string; // รหัสพนักงาน
  name: string;
  email: string;
  role: UserRole;
  position: string; // ตำแหน่ง
  department: string;
  avatar?: string; // รูปภาพโปรไฟล์ (Base64)
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export type CalendarEventType = 'Audit' | 'Safety Tour' | 'News Release' | 'Training' | 'Inspection';

export interface CalendarEvent {
  id: string;
  title: string;
  type: CalendarEventType;
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  organizer: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

export interface InspectionRecord {
  id: number;
  location_code: string;
  location_name: string;
  inspection_dates: InspectionDate[];
  update_link?: string;
  stock_link?: string;
}

export interface InspectionDate {
  date: string;
  status: 'completed' | 'pending' | 'overdue' | 'na';
  inspector?: string;
  notes?: string;
  evidenceFileData?: string; // Base64
  evidenceFileName?: string;
}

export interface AIProviderConfig {
  id: string;
  name: string;
  type: 'Cloud' | 'Local' | 'Hybrid';
  endpoint: string;
  apiKey?: string;
  status: 'Online' | 'Offline' | 'Standby';
  modelName: string;
}

export interface VectorDBConfig {
  provider: 'Chroma' | 'Pinecone' | 'Milvus' | 'Memory';
  indexName: string;
  dimension: number;
  status: 'Connected' | 'Disconnected';
  documentCount: number;
}

export interface VisitorHistory {
  date: string;
  count: number;
}

export interface VisitorStats {
  totalVisits: number;
  onlineUsers: number;
  history: VisitorHistory[];
}

export type PPEType = 'Mask' | 'Gloves' | 'Goggles' | 'Suit' | 'Boots' | 'Ear Protection' | 'Helmet' | 'Apron';

export interface PPEItem {
  id: string;
  name: string;
  type: PPEType;
  icon: string;
  description: string;
  stock: number;
  minStock: number;
  unit: string;
}

export interface PPETransaction {
  id: string;
  ppeId: string;
  ppeName: string;
  type: 'Restock' | 'Withdrawal';
  quantity: number;
  user: string;
  timestamp: string;
  notes?: string;
}

export interface StorageLocation {
  id: string;
  name: string;
  area: string;
  description: string;
  capacity: number;
  requiredPPE: string[];
  status: 'Normal' | 'Full' | 'Warning';
  responsiblePersonName?: string;
  responsiblePersonImage?: string;
  photo?: string; // Facility/Storage area photo (base64)
  // Positioning for internal map
  mapX?: number;
  mapY?: number;
  // World Geolocation
  lat?: number;
  lng?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export type ViewType = 
  | 'dashboard' 
  | 'inventory' 
  | 'storages'
  | 'storage_monitoring'
  | 'checksheets'
  | 'ppe'
  | 'sds' 
  | 'compliance' 
  | 'waste' 
  | 'incidents' 
  | 'training' 
  | 'procurement' 
  | 'documents' 
  | 'alerts' 
  | 'risk' 
  | 'users'
  | 'news'
  | 'settings'
  | 'monitoring'
  | 'audit'
  | 'ai_hub'
  | 'ai_chat_pdf'
  | 'calendar_mgmt'
  | 'compatibility_mgmt'
  | 'mapping_layout';

export type Language = 'en' | 'th';

export type NewsType = 'Breaking' | 'General' | 'Alert';
export type NewsPosition = 'Top' | 'Bottom';
export type NewsSpeed = 'Slow' | 'Medium' | 'Fast';

export interface ChemicalItem {
  id: string;
  name: string;
  description: string;
  casNumber: string;
  hazardClass: HazardClass[];
  location: string;
  storageId: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  responsiblePerson: string;
  revisionDate: string;
  retentionYears: number;
  sdsAvailable: boolean;
  sdsFileData?: string;
  sdsFileName?: string;
}

export interface SDSDocument {
  id: string;
  chemicalId: string;
  name: string;
  version: string;
  lastUpdated: string;
  fileSize: string;
  standard: 'GHS' | 'OSHA' | 'EU';
}

export interface ComplianceReport {
  id: string;
  title: string;
  standard: 'OSHA' | 'ISO 14001' | 'GHS';
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  date: string;
  auditor: string;
  findings?: string;
  score?: number;
}

export interface AlertTrigger {
  id: string;
  name: string;
  type: 'Stock Level' | 'Expiry' | 'Compliance';
  condition: 'less_than' | 'days_before' | 'status_change';
  value: number | string;
  targetId: string;
  notifyTo: string;
  isEnabled: boolean;
}

export interface SafetyDocument {
  id: string;
  title: string;
  category: 'Forms' | 'Checksheets' | 'Manuals' | 'Protocols';
  format: 'PDF' | 'DOCX' | 'XLSX';
  uploadDate: string;
  size: string;
}

export interface WasteLog {
  id: string;
  chemical_name: string;
  quantity: number;
  unit: string;
  generator: string;
  generation_date: string;
  disposal_method: string;
  disposal_date?: string;
  status: 'Storage' | 'Transport' | 'Disposed';
  manifest_number?: string;
}

export interface IncidentReport {
  id: string;
  title: string;
  date: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Investigating' | 'Closed';
  description: string;
  reporter: string;
}

export interface TrainingRecord {
  id: string;
  traineeName: string;
  employeeId: string;
  courseName: string;
  completionDate: string;
  expiryDate: string;
  status: 'Active' | 'Expiring' | 'Expired';
  certificateId: string;
  provider: string;
  score?: number;
  certFileData?: string; // Base64
  certFileName?: string;
}

export interface PurchaseRequest {
  id: string;
  chemicalName: string;
  quantity: number;
  unit: string;
  requester: string;
  department: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Ordered';
  requestDate: string;
  approvedBy?: string;
}

export interface NewsItem {
  id: string;
  text: string;
  type: NewsType;
  position: NewsPosition;
  startDate: string;
  endDate: string;
  speed: NewsSpeed;
  isActive: boolean;
}
