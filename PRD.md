# ChemSafe Pro - Product Requirements Document (PRD)

## 1. Project Overview
**ChemSafe Pro** is an industrial-grade Chemical Management System (CMS) designed to help manufacturing facilities, laboratories, and warehouses manage hazardous materials safely. The system ensures compliance with international standards such as **OSHA**, **ISO 14001**, and **GHS (Globally Harmonized System)**.

## 2. Target Users
- **Safety Officers (EHS):** Responsible for audits, compliance, and emergency response.
- **Warehouse/Lab Staff:** Responsible for inventory tracking, usage, and storage.
- **Admin/IT:** Manage users, system configuration, and audit trails.

## 3. Core Features
### 3.1 Dashboard & Analytics
- Real-time visualization of inventory levels and hazard distribution.
- Stock alerts (critical/low) and expiry tracking.
- Operational metrics (Safe Days, Total Visitors, Compliance Score).

### 3.2 Advanced Inventory Management
- **QR/Barcode Simulation:** Fast lookup and registration via scanned labels.
- **SDS Repository:** Digital storage for Safety Data Sheets (PDF) linked to specific chemicals.
- **Version Tracking:** Monitoring SDS updates to ensure documents are not older than 5 years.

### 3.3 Smart Storage & Compatibility Matrix
- **Interactive Workspace:** Drag-and-drop movement of chemicals between storage sites.
- **Compatibility Engine:** Real-time logic preventing the storage of incompatible chemicals (e.g., Flammables + Oxidizers) based on a GHS matrix.
- **PPE Monitoring:** Visual indicators of required safety gear for specific storage zones.

### 3.4 AI Safety Assistant (Gemini API)
- **Risk Assessment:** Automated safety summaries for specific chemicals.
- **Compliance Chat:** Q&A for OSHA/ISO regulations.
- **Predictive Analytics:** Forecasting stock exhaustion dates based on usage history.

### 3.5 Operational Workflows
- **Procurement Approval:** Multi-stage workflow for ordering new materials with safety review.
- **Waste Management:** Tracking generation, storage, and disposal of hazardous waste.
- **Incident Hub:** Interactive calendar and reporting for safety events and near-misses.
- **Audit Trail:** immutable log of every transaction (Who, What, When).

## 4. Technical Architecture
- **Frontend:** React (ES6+), Tailwind CSS (Aesthetic UI/UX).
- **Charts:** Recharts for data visualization.
- **AI Engine:** Google Gemini (gemini-3-flash-preview).
- **Persistence:** LocalStorage (Simulation) / Integrated SQL Schema for backend readiness.
- **Internationalization:** Full EN/TH localization support.

## 5. Compliance Standards
- **GHS:** Hazard pictograms and classification.
- **OSHA 1910.1200:** Hazard communication.
- **ISO 45001:** Occupational Health & Safety.
- **ISO 14001:** Environmental Management.
