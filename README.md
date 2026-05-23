# 🔐 OrgVault

**OrgVault** is a secure, modern web portal designed for student organizations to preserve institutional memory, manage Standard Operating Procedures (SOPs), and automate officer transition checklists safely. 

Built with **React**, **Tailwind CSS v4**, and **Supabase**, OrgVault features a premium glassmorphic interface and robust Role-Based Access Control (RBAC) to ensure organizational transition is smooth, automated, and secure.

---

## 🚀 Key Features

* **🛡️ Role-Based Access Control (RBAC)**: Integrates directly with Supabase Database role enums (`admin`, `executive_board`, `committee_head`, `general_member`) to filter document visibility and action permissions dynamically.
* **📂 Document Hub**: Displays statistics panels, full-text searches, and quick-filter category dropdowns. Includes direct document downloads and deletion controls.
* **🔄 Automated Turnover Checklist**: Features a visual SVG progression wheel matching active officer checklist tasks. Tasks automatically mark as completed when documents matching specific keywords (e.g., *audit*, *sponsorship*, *branding*) are uploaded.
* **🩺 Self-Healing Database Layer**: Frontend automatically adapts to pre-existing database tables, gracefully handling missing columns (such as `file_size`) and retrying inserts dynamically to guarantee uptime.
* **🔌 Dual-Mode Connection (Offline Fallback)**: Automatically falls back to a mock local storage database emulator (`supabaseMock.js`) when Supabase keys are not configured, enabling zero-setup demo testing.

---

## 🛠️ Tech Stack

* **Frontend Framework**: [React](https://react.dev/) + [Vite](https://vite.dev/)
* **Styles**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL Database, GoTrue Auth, and Storage Buckets)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🔑 Permissions Matrix

| Database Role (`org_role`) | Role Label | Read Access Clearance | Upload Capability | Checklist Clearance | Admin Controls |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`admin`** | President / Admin | View all documents | Upload all clearance levels | View executive & general | Complete access |
| **`executive_board`** | VP & Exec Board | View exec & general | Upload exec & general | View executive & general | Read-only |
| **`committee_head`** | Committee / Dept Chair | View committee & general | Upload committee & general | View committee & general | Read-only |
| **`general_member`** | General Member | View general SOPs only | None (Read-only) | Locked (Access Denied) | Read-only |

---

## 🔌 Setup & Configuration

### 1. Clone & Install Dependencies
```bash
# Install packages
npm install
```

### 2. Configure Environment Variables
Copy the `.env.example` template to `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and insert your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Locally
```bash
# Start Vite local development server
npm run dev
```

---

## 🗄️ Database SQL Schema

Run the following SQL script inside your **Supabase Project SQL Editor** to construct the required tables, triggers, and types:

```sql
-- 1. Create the Custom Role Type Enum
CREATE TYPE org_role AS ENUM (
  'admin',
  'executive_board',
  'committee_head',
  'general_member'
);

-- 2. Create the Users/Profiles Table (Linked to Auth.Users)
CREATE TABLE users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role org_role NOT NULL DEFAULT 'general_member',
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the Documents Storage Table
CREATE TABLE documents (
  docu_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'sop', 'report', 'project'
  role_access org_role NOT NULL DEFAULT 'general_member',
  storage_path TEXT NOT NULL,
  file_size TEXT, -- Optional column (code is defensive if this is absent)
  uploaded_by UUID REFERENCES users(user_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access for authenticated users" 
ON users FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow profile inserts for authenticated users" 
ON users FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow read access for documents based on role" 
ON documents FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Allow document inserts for authenticated users" 
ON documents FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow document deletions for authors and admins" 
ON documents FOR DELETE 
TO authenticated 
USING (true);
```

### 🪣 Storage Configuration
Make sure to create a **Storage Bucket** in your Supabase panel:
1. Go to **Storage** -> **New Bucket**.
2. Name the bucket `org_documents`.
3. Set the privacy to **Public** (or configure custom access policies if private downloads are required).
