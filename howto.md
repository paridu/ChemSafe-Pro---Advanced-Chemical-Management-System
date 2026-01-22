# ChemSafe Pro - User Manual & Operating Guide

Welcome to ChemSafe Pro. This guide covers the essential workflows for managing your chemical inventory safely and efficiently, including the latest AI capabilities.

## 1. Getting Started
### Login
- Access the platform using your corporate email.
- **Roles:**
  - **Admin:** Full system access + AI Infrastructure Management.
  - **Safety Officer:** Manage compliance, audits, and approvals.
  - **Staff:** Inventory updates and incident reporting.

## 2. Managing Inventory
### Registering a New Chemical
1. Navigate to the **Inventory** tab.
2. Click **Add New**.
3. Fill in the Chemical Name, CAS Number, and select Hazard Classes.
4. **Important:** Upload the original PDF SDS for compliance tracking.
5. Assign a responsible person and an expiry date.

### Scanning Labels
- Use the **Scan Label** button on the Inventory page to simulate a QR code scan. This automatically filters the database to the scanned item.

## 3. SDS Intelligence & AI Chat
### Chatting with Documents
1. Go to the **SDS AI Chat** tab.
2. Select a document from the **Document Vault** (synced from your inventory) or upload a new PDF.
3. Once loaded, the AI (Gemini 3 Pro) acts as a virtual safety engineer.
4. Ask questions such as:
   - "What are the specific first aid procedures for skin contact?"
   - "Summarize Section 10: Stability and Reactivity."
   - "Identify all mandatory PPE requirements."

## 4. AI Logistics Hub (Admin Only)
### Managing Model Infrastructure
- Access the **AI Logistics Hub** from the sidebar.
- **Providers:** Monitor connectivity to Cloud AI (Gemini) and Local AI (Ollama).
- **Vector DB:** Sync your document repository to enable Retrieval-Augmented Generation (RAG).
- **Log Monitor:** View real-time API transactions and infrastructure heartbeat.

## 5. Storage & Compatibility
### The Interactive Workspace
- Go to **Storages** and switch the tab to **Interactive Workspace**.
- **Move Items:** Drag a chemical batch from one storage card to another.
- **Compatibility Check:** If you attempt to move a chemical into a site with incompatible materials (e.g., Acid into a Base cabinet), a Red Alert will prevent the action.

### Assigning PPE
- Drag PPE icons from the right-hand sidebar onto a Storage card to update the mandatory requirements for that zone.

## 6. Procurement & Approvals
### For Staff
- Create a **Purchase Request** from the Procurement tab. Status will be "Pending".
### For Safety Officers/Admins
- Review pending requests.
- Click **Approve** to authorize the purchase or **Reject** if the material is too hazardous for current facilities.

## 7. Incidents & Audits
### Reporting an Incident
1. Go to the **Incidents** tab.
2. Use the **Yearly/Monthly calendar** to see past events.
3. Click **Report New** to document a spill, leak, or injury.
### Reviewing Logs
- The **Audit Logs** tab (Admin only) shows every single change made in the system, serving as your "Black Box" for regulatory inspections.

## 8. System Customization
- **Language:** Toggle between English and Thai at the bottom of the sidebar.
- **Settings:** Enable AI assistance, push notifications, or cloud backups.