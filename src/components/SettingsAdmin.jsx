import React from 'react';
import { useApp } from '../context/AppContext';
import { Sliders, RefreshCw, Key, Database, ShieldAlert, Sparkles, Check, HelpCircle } from 'lucide-react';

export const SettingsAdmin = () => {
  const { 
    currentUser, 
    documents, 
    checklists, 
    resetDatabase, 
    getRoleLabel 
  } = useApp();

  const permissions = [
    { role: 'admin', desc: 'Organization President / Admin', read: 'All Documents', upload: 'All Documents', checklist: 'All Checklists', config: 'Yes' },
    { role: 'executive_board', desc: 'VP & Exec Board Members', read: 'Executive & General', upload: 'Executive & General', checklist: 'Executive Checklists', config: 'No' },
    { role: 'committee_head', desc: 'Committee / Dept Chairs', read: 'Committee & General', upload: 'Committee & General', checklist: 'Committee Checklists', config: 'No' },
    { role: 'general_member', desc: 'General Org Members', read: 'General SOPs Only', upload: 'None', checklist: 'None', config: 'No' }
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/20 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Admin Control & Security Settings</h2>
          <p className="text-slate-500 text-sm mt-0.5">Manage permissions structure, audit clearance, and reset mockup state.</p>
        </div>
      </div>

      {/* ACTIVE ACCOUNT INFORMATION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 bg-white/45 flex flex-col justify-between border-white/35 md:col-span-1">
          <div>
            <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
              <Key className="w-4 h-4 shrink-0" />
              Clearance Diagnostic
            </div>
            <h3 className="text-base font-extrabold text-slate-800 mt-2.5">Active Session Credentials</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your UI is operating under simulated credentials synchronized from the floating Role Switcher.
            </p>
            
            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-slate-200/50 space-y-2.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Name</span>
                <span className="text-xs font-bold text-slate-700">{currentUser?.name}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">DB enum Role</span>
                <span className="text-xs font-mono font-bold text-teal-600">{currentUser?.org_role}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Role Label</span>
                <span className="text-xs font-bold text-slate-700">{getRoleLabel(currentUser?.org_role)}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/40">
            <button
              onClick={resetDatabase}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100/70 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Database State
            </button>
          </div>
        </div>

        {/* METRICS PANEL */}
        <div className="glass-card rounded-2xl p-5 bg-white/45 border-white/35 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
            <Database className="w-4 h-4 shrink-0" />
            Database Statistics
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white/50 border border-slate-200/40 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 block">Total SOP Guides</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {documents.filter(d => d.type === 'SOP').length}
              </span>
            </div>
            <div className="p-4 bg-white/50 border border-slate-200/40 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 block">Total Report Files</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
                {documents.filter(d => d.type === 'Report').length}
              </span>
            </div>
            <div className="p-4 bg-white/50 border border-slate-200/40 rounded-xl">
              <span className="text-xs font-semibold text-slate-500 block">Total Checkpoints</span>
              <span className="text-2xl font-extrabold text-slate-800 mt-1 block">{checklists.length}</span>
            </div>
          </div>

          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-teal-800 leading-relaxed font-semibold">
              <span className="font-extrabold">Notice:</span>supbaseMock.js emulates transactional state using LocalStorage. You can upload new files or delete them, and changes will be saved to your browser cache automatically.
            </div>
          </div>
        </div>
      </div>

      {/* RBAC GRID */}
      <div className="glass-card rounded-2xl p-5 md:p-6 bg-white/45 border-white/35 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
            <Sliders className="w-4 h-4 shrink-0" />
            Role-Based Access Control (RBAC) Matrix
          </div>
        </div>
        
        <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
          The database defines 4 distinct values for <span className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-bold text-slate-700">org_role</span>. The frontend routes, visibility filters, and upload modal clearances strictly enforce the rules below.
        </p>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/50 bg-white/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/70 border-b border-slate-200/60 font-bold text-slate-600">
                <th className="p-3">org_role</th>
                <th className="p-3">Title Description</th>
                <th className="p-3">Read Clearance</th>
                <th className="p-3">Upload Clearance</th>
                <th className="p-3">Turnover Checklist</th>
                <th className="p-3 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 text-slate-700">
              {permissions.map((p) => {
                const isCurrentRole = currentUser?.org_role === p.role;
                return (
                  <tr 
                    key={p.role}
                    className={`transition-colors ${
                      isCurrentRole ? 'bg-teal-500/5 font-medium' : 'hover:bg-white/40'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-teal-700">
                      {p.role}
                      {isCurrentRole && (
                        <span className="ml-1.5 text-[8px] bg-teal-600 text-white px-1.5 py-0.2 rounded font-sans uppercase font-extrabold tracking-wider">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold">{p.desc}</td>
                    <td className="p-3">{p.read}</td>
                    <td className="p-3">{p.upload}</td>
                    <td className="p-3">{p.checklist}</td>
                    <td className="p-3 text-center">
                      {p.config === 'Yes' ? (
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-200">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdmin;
