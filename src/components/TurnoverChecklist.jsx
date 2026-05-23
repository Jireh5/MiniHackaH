import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  Lock, 
  AlertCircle, 
  PartyPopper,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const TurnoverChecklist = () => {
  const { 
    currentUser, 
    checklists, 
    documents, 
    setIsUploadOpen, 
    getRoleBadgeColor,
    showNotification
  } = useApp();

  // Guard: Restrict view to officers (admin, executive_board, committee_head)
  const isGeneralMember = currentUser?.org_role === 'general_member';

  if (isGeneralMember) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 max-w-md mx-auto min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-5 shadow-sm">
          <Lock className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-extrabold text-slate-800">Access Restricted</h3>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed">
          The Turnover Checklist is reserved for organization officers (`admin`, `executive_board`, and `committee_head`) managing officer transitions.
        </p>
        <p className="text-xs text-slate-400 mt-2">
          Your active clearance level is: <span className="font-mono text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-100 font-bold">general_member</span>
        </p>
      </div>
    );
  }

  // Calculate statistics
  const totalTasks = checklists.length;
  const completedTasks = checklists.filter(item => item.status === 'Completed').length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Transition status logic
  const isTransitionReady = percentComplete >= 80;

  // Find document title by ID for linking completed tasks
  const getDocumentInfo = (docId) => {
    if (!docId) return null;
    const doc = documents.find(d => d.id === docId);
    // If not found in current documents (due to RBAC restrictions), search original mock documents via state or show backup
    return doc || { title: "Restricted Document Reference", file_name: "restricted_access.pdf" };
  };

  const handleSimulateHandover = () => {
    if (percentComplete === 100) {
      showNotification("Congratulations! Handover packets compile successfully. Transition complete!", "success");
    } else {
      showNotification(`Handover requires 100% completion. You are currently at ${percentComplete}%.`, "warning");
    }
  };

  return (
    <div className="space-y-6">
      {/* CHECKLIST HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/20 pb-5">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-800">Automated Turnover Checklist</h2>
          <p className="text-slate-500 text-sm mt-0.5">Automate officer transition requirements via file uploads.</p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white/40 border border-white/60 px-3 py-2 rounded-xl shadow-sm shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          Role Scope: <span className="text-slate-700 font-extrabold capitalize">{currentUser?.org_role.replace('_', ' ')}</span>
        </div>
      </div>

      {/* OVERVIEW PROGRESS CARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 flex flex-col md:flex-row items-center gap-6 bg-white/50 border-white/40">
          {/* Progress circle SVG */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-slate-200/50"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="62"
                className="stroke-teal-600 transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - percentComplete / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-slate-800">{percentComplete}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Complete</span>
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3.5 text-center md:text-left">
            <div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
                <span className="text-lg font-extrabold text-slate-800">Officer Transition Packet</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isTransitionReady 
                    ? 'bg-teal-500/10 text-teal-700 border border-teal-500/20' 
                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                }`}>
                  {isTransitionReady ? 'Ready for Transition' : 'In Progress'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Your checklist tracks mandatory turnover files required before leadership rotation. Uploading matching files in the hub automatically clears these items.
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-slate-600">
              <div>
                <span className="text-slate-400">Items Done:</span> <span className="text-teal-700 font-extrabold">{completedTasks}</span> / <span className="text-slate-800">{totalTasks}</span>
              </div>
              <div className="w-1 h-4 bg-slate-300/40 hidden md:block"></div>
              <div>
                <span className="text-slate-400">Min. Criteria:</span> <span className="text-slate-800">80% Clearance</span>
              </div>
            </div>

            <button
              onClick={handleSimulateHandover}
              disabled={percentComplete < 80}
              className={`w-full md:w-auto px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow ${
                percentComplete >= 80
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/10 hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 border border-slate-300/20 cursor-not-allowed'
              }`}
            >
              <PartyPopper className="w-4 h-4" />
              Finalize Handover Rotation
            </button>
          </div>
        </div>

        {/* HELPER BOX */}
        <div className="glass-card rounded-3xl p-5 bg-teal-600 text-white flex flex-col justify-between shadow-md shadow-teal-700/15">
          <div className="space-y-2">
            <h3 className="font-bold text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-200 shrink-0" />
              How Automation Works
            </h3>
            <p className="text-xs text-teal-100 leading-relaxed font-medium">
              We match documents to checklist requirements. When you publish a file with:
            </p>
            <ul className="text-xs text-teal-500-100 space-y-1.5 list-disc pl-4 font-semibold text-teal-50">
              <li>Matching Document Type (e.g. SOP)</li>
              <li>Core keywords in Title/Description (e.g. PR, Media, Budget)</li>
            </ul>
            <p className="text-[10px] text-teal-200 mt-2 italic font-medium leading-tight">
              * The system triggers checks in real-time, verifying document integrity and access levels.
            </p>
          </div>
          
          <button
            onClick={() => setIsUploadOpen(true)}
            className="w-full mt-4 bg-white text-teal-700 hover:bg-teal-50 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1"
          >
            Upload Document File <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DETAILED CHECKLIST ITEMS */}
      <div className="space-y-3">
        <h3 className="text-base font-extrabold text-slate-800 px-1">Transition Checkpoints ({totalTasks})</h3>
        
        <div className="space-y-2.5">
          {checklists.map((item) => {
            const isCompleted = item.status === 'Completed';
            const docInfo = getDocumentInfo(item.completed_doc_id);

            return (
              <div 
                key={item.id}
                className={`glass-card rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-all ${
                  isCompleted 
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-white/45 hover:bg-white/60 border-white/30'
                }`}
              >
                {/* Details */}
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5.5 h-5.5 text-emerald-600 bg-emerald-100 rounded-full" />
                    ) : (
                      <Clock className="w-5.5 h-5.5 text-amber-500 bg-amber-50 rounded-full" />
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className={`text-sm font-extrabold ${isCompleted ? 'text-slate-700 line-through' : 'text-slate-800'}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl font-medium">
                      {item.description}
                    </p>
                    
                    {/* Automation result details */}
                    {isCompleted && docInfo && (
                      <div className="text-[10px] font-semibold text-teal-700 mt-2 flex flex-wrap items-center gap-1.5 bg-teal-50 px-2 py-1 rounded-lg border border-teal-100/50 w-fit">
                        <span className="text-slate-400 font-normal">Completed by file:</span> 
                        <span className="font-bold underline flex items-center gap-0.5 cursor-pointer hover:text-teal-800">
                          {docInfo.title} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                    }`}>
                      {item.status}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Req: {item.required_type}
                    </span>
                  </div>

                  {!isCompleted && (
                    <button
                      onClick={() => setIsUploadOpen(true)}
                      className="p-2 rounded-xl bg-white border border-slate-200/50 hover:bg-slate-50 text-teal-600 hover:text-teal-700 hover:border-teal-300/40 shadow-sm hover:shadow transition-all"
                      title="Upload file to satisfy checkpoint"
                    >
                      <UploadCloud className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TurnoverChecklist;
