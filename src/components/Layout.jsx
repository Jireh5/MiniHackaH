import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Settings, 
  Menu, 
  X, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  FolderOpen,
  LogOut
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    getRoleBadgeColor, 
    getRoleLabel,
    resetDatabase,
    isLiveMode,
    logout
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check if role is allowed to view Checklist tab (only officers/admin)
  const isOfficer = currentUser && currentUser.org_role !== 'general_member';

  const navItems = [
    { id: 'dashboard', label: 'Document Hub', icon: LayoutDashboard, visible: true },
    { id: 'checklist', label: 'Turnover Checklist', icon: CheckSquare, visible: isOfficer },
    { id: 'settings', label: 'Settings & Admin', icon: Settings, visible: true }
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-tr from-sky-100 via-teal-50 to-emerald-100 pb-12">
      {/* BACKGROUND DECORATIVE BLOBS */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-1/3 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 w-full px-4 py-3 md:px-6">
        <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.jpg" 
              alt="OrgVault Logo" 
              className="w-10 h-10 rounded-xl object-cover shadow-md shadow-teal-500/20"
            />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5 leading-none">
                OrgVault <span className="text-[10px] uppercase font-semibold bg-teal-600 text-white px-1.5 py-0.5 rounded-md tracking-wider">v1.0</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">Secure SOP & Turnover Hub</p>
            </div>
          </div>

          {/* Desktop User Info & Quick Controls */}
          {currentUser && (
            <div className="hidden md:flex items-center gap-3">
              {/* Connection status badge */}
              {isLiveMode ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-700 rounded-lg shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Supabase Live
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-700 rounded-lg shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Mock DB
                </div>
              )}

              <button 
                onClick={resetDatabase}
                className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-white/50 transition-all border border-transparent hover:border-white/40"
                title="Reset Database to Defaults"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              
              <div className="h-6 w-px bg-slate-300/30"></div>

              <div className="flex items-center gap-3 bg-white/40 border border-white/50 py-1.5 pl-2 pr-3.5 rounded-xl shadow-sm">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-8 h-8 rounded-lg object-cover border border-white/80"
                />
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(currentUser.org_role)}`}>
                      {getRoleLabel(currentUser.org_role)}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={logout}
                className="p-2 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all shadow-sm"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={resetDatabase}
              className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-white/50 transition-all"
              title="Reset Database to Defaults"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-white/40 transition-all border border-transparent focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-4 flex flex-col md:flex-row gap-6 relative z-10">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="glass-panel rounded-2xl p-4 sticky top-24 flex flex-col justify-between h-[calc(100vh-140px)]">
            <div className="space-y-6">
              <div className="px-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Menu</p>
              </div>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  if (!item.visible) return null;
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? 'bg-teal-600/90 text-white shadow-md shadow-teal-600/10'
                          : 'text-slate-600 hover:text-teal-600 hover:bg-white/40'
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sidebar Footer info */}
            <div className="glass-card rounded-xl p-3 bg-white/20">
              <div className="flex items-center gap-2 text-teal-700">
                <Sparkles className="w-4 h-4 shrink-0 animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Transition Mode</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                Checklist auto-completes when corresponding files are uploaded to the hub.
              </p>
            </div>
          </div>
        </aside>

        {/* MOBILE MENU DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-30 bg-slate-900/10 backdrop-blur-sm">
            <div className="absolute top-20 left-4 right-4 glass-panel rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-white/20">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              <nav className="space-y-1">
                {navItems.map((item) => {
                  if (!item.visible) return null;
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'text-slate-600 hover:bg-white/40'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {currentUser && (
                <div className="pt-4 border-t border-white/20">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-white"
                    />
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-800 leading-tight">{currentUser.name}</div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded border mt-1 ${getRoleBadgeColor(currentUser.org_role)}`}>
                        {getRoleLabel(currentUser.org_role)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition-all mt-4"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 w-full min-w-0">
          <div className="glass-panel rounded-3xl p-5 md:p-8 min-h-[calc(100vh-140px)] shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
