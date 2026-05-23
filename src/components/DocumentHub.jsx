import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  FileSpreadsheet, 
  Layers, 
  Lock, 
  Unlock, 
  Download, 
  Trash2,
  Calendar,
  User,
  Shield,
  FileCheck,
  FolderOpen
} from 'lucide-react';

export const DocumentHub = () => {
  const { 
    currentUser, 
    documents, 
    setIsUploadOpen, 
    deleteDoc, 
    getRoleBadgeColor,
    getRoleLabel,
    showNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedAccess, setSelectedAccess] = useState('All');

  // Check if role is allowed to upload (only officers, i.e., admin, executive_board, committee_head)
  const canUpload = currentUser && currentUser.org_role !== 'general_member';

  // Stats calculation
  const sopsCount = documents.filter(d => d.type === 'SOP').length;
  const reportsCount = documents.filter(d => d.type === 'Report').length;
  const projectsCount = documents.filter(d => d.type === 'Project').length;

  // Search & filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.file_name.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedType === 'All' || doc.type === selectedType;
    const matchesAccess = selectedAccess === 'All' || doc.role_access === selectedAccess;

    return matchesSearch && matchesType && matchesAccess;
  });

  const getDocIcon = (type) => {
    switch (type) {
      case 'SOP':
        return <FileText className="w-6 h-6 text-teal-600" />;
      case 'Report':
        return <FileSpreadsheet className="w-6 h-6 text-indigo-600" />;
      case 'Project':
      default:
        return <Layers className="w-6 h-6 text-emerald-600" />;
    }
  };

  const handleDownload = (doc) => {
    showNotification(`Downloading simulated file: ${doc.file_name} (${doc.file_size})`, "info");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const tabs = [
    { value: 'All', label: 'All Documents', icon: Layers, count: documents.length },
    { value: 'SOP', label: 'SOP Guides', icon: FileText, count: sopsCount },
    { value: 'Report', label: 'Reports', icon: FileSpreadsheet, count: reportsCount },
    { value: 'Project', label: 'Project Files', icon: FolderOpen, count: projectsCount }
  ];

  return (
    <div className="space-y-6">
      {/* HUB HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/20 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Knowledge & Document Hub</h2>
          <p className="text-slate-500 text-sm mt-0.5">Explore SOPs, reports, and transition files.</p>
        </div>
        
        {canUpload ? (
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl shadow-md shadow-teal-500/15 hover:shadow-lg transition-all text-sm font-semibold hover:-translate-y-0.5 border border-white/10 shrink-0"
          >
            <Plus className="w-4.5 h-4.5" />
            Upload Document
          </button>
        ) : (
          <div className="text-xs font-semibold text-slate-500 bg-white/40 border border-white/60 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
            <Lock className="w-3.5 h-3.5" />
            General Member: Read Only
          </div>
        )}
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 bg-white/50">
          <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center border border-teal-100">
            <FileCheck className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800 leading-tight">{documents.length}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Accessible</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 bg-white/50">
          <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100">
            <FileText className="w-6 h-6 text-sky-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800 leading-tight">{sopsCount}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SOP Guides</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 bg-white/50">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
            <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800 leading-tight">{reportsCount}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Reports</div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3.5 bg-white/50">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
            <Layers className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-slate-800 leading-tight">{projectsCount}</div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Project Files</div>
          </div>
        </div>
      </div>

      {/* FILTER, TABS, & SEARCH BAR */}
      <div className="glass-card rounded-2xl p-4 bg-white/30 border-white/20">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          
          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-white/40 border border-white/50 rounded-2xl shadow-sm w-full lg:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedType(tab.value)}
                className={`flex items-center justify-center gap-2 flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                  selectedType === tab.value
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-600/10'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
                }`}
              >
                <tab.icon className={`w-3.5 h-3.5 ${selectedType === tab.value ? 'text-white' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                  selectedType === tab.value 
                    ? 'bg-white/20 text-white' 
                    : 'bg-slate-200/50 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Right Actions: Search Box & Access Dropdown */}
          <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto lg:flex-1 justify-end">
            {/* Search box */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl text-sm focus:outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Access Level Selector */}
            <div className="flex items-center gap-1.5 bg-white/40 border border-white/60 p-1 rounded-xl w-full md:w-auto shrink-0">
              <span className="text-xs font-semibold text-slate-500 pl-2">Access:</span>
              <select
                value={selectedAccess}
                onChange={(e) => setSelectedAccess(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-700 py-1.5 px-2.5 focus:outline-none rounded-lg hover:bg-white/50 cursor-pointer w-full md:w-auto"
              >
                <option value="All">All Clearance</option>
                <option value="general_member">general_member</option>
                <option value="committee_head">committee_head</option>
                <option value="executive_board">executive_board</option>
                <option value="admin">admin</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* DOCUMENT LISTING GRID */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredDocuments.map((doc) => {
            const isAuthor = currentUser && doc.uploaded_by === currentUser.name;
            const isAdmin = currentUser && currentUser.org_role === 'admin';
            const canDelete = isAuthor || isAdmin;

            return (
              <div 
                key={doc.id}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between h-[230px] bg-white/45 relative group border-white/30"
              >
                {/* Header line */}
                <div>
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="p-2.5 rounded-xl bg-white/70 border border-white shadow-sm shrink-0">
                      {getDocIcon(doc.type)}
                    </div>
                    
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                        doc.type === 'SOP' ? 'bg-teal-500/10 text-teal-700 border-teal-500/20' :
                        doc.type === 'Report' ? 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20' :
                        'bg-emerald-500/10 text-emerald-700 border-emerald-500/20'
                      }`}>
                        {doc.type}
                      </span>
                      
                      <div className="flex items-center gap-1 mt-0.5">
                        {doc.role_access === 'general_member' ? (
                          <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded flex items-center gap-1 border border-slate-200/50">
                            <Unlock className="w-2.5 h-2.5" /> Open Access
                          </span>
                        ) : (
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded flex items-center gap-1 border ${getRoleBadgeColor(doc.role_access)}`}>
                            <Lock className="w-2.5 h-2.5" /> {doc.role_access}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-800 mt-3 line-clamp-1 group-hover:text-teal-700 transition-colors">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                {/* Footer metadata & actions */}
                <div className="pt-3 border-t border-slate-200/40 flex items-center justify-between text-[11px] text-slate-400 mt-auto">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 text-slate-500">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[100px] font-medium">{doc.uploaded_by}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(doc.uploaded_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 rounded-lg bg-white/55 border border-white/80 hover:bg-white text-teal-700 shadow-sm hover:shadow transition-all"
                      title={`Download ${doc.file_name} (${doc.file_size})`}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {canDelete && (
                      <button
                        onClick={() => deleteDoc(doc.id)}
                        className="p-2 rounded-lg bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 transition-all shadow-sm hover:shadow"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center max-w-md mx-auto bg-white/30 border-white/20">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100/50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-teal-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No documents found</h3>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            We couldn't find any documents matching your filters or search query. Try broadening your keywords or changing the clearance selection.
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentHub;
