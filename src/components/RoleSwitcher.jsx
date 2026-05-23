import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, ShieldCheck, ChevronUp, ChevronDown } from 'lucide-react';

export const RoleSwitcher = () => {
  const { currentUser, switchRole, usersList, getRoleBadgeColor, getRoleLabel } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 glass-panel-dark rounded-2xl p-4 shadow-xl border border-teal-500/20 text-slate-800 transition-all duration-300 transform scale-100">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/50">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-600 animate-pulse" />
              <span className="font-bold text-xs uppercase tracking-wider text-slate-700">RBAC Role Switcher</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-0.5 px-2 py-1 bg-white/40 hover:bg-white/70 rounded-lg border border-slate-200/30 transition-all"
            >
              Minimize <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[10px] text-slate-500 mb-3 leading-tight">
            Click any profile below to swap roles. The dashboard documents and transition checklists will immediately reload matching that role's security clearance.
          </p>

          <div className="space-y-2">
            {usersList.map((usr) => {
              const isActive = usr.id === currentUser.id;
              return (
                <button
                  key={usr.id}
                  onClick={() => switchRole(usr.id)}
                  className={`w-full text-left p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                    isActive
                      ? 'bg-teal-500/10 border-teal-500/30 shadow-sm ring-1 ring-teal-500/20'
                      : 'bg-white/40 hover:bg-white/70 border-white/40 hover:border-slate-200'
                  }`}
                >
                  <img
                    src={usr.avatar}
                    alt={usr.name}
                    className={`w-9 h-9 rounded-lg object-cover border ${
                      isActive ? 'border-teal-500' : 'border-white'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 truncate">{usr.name}</span>
                      {isActive && (
                        <span className="text-[9px] font-bold text-teal-600 bg-teal-500/10 px-1 py-0.2 rounded border border-teal-500/20">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[9px] font-semibold px-1 rounded ${getRoleBadgeColor(usr.org_role)}`}>
                        {usr.org_role}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-2xl shadow-lg shadow-teal-600/20 hover:from-teal-500 hover:to-emerald-500 transition-all font-semibold text-xs uppercase tracking-wider group hover:-translate-y-0.5 border border-white/20"
        >
          <UserCheck className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
          <span>Switch Role</span>
          <ChevronUp className="w-3.5 h-3.5 shrink-0" />
        </button>
      )}
    </div>
  );
};

export default RoleSwitcher;
