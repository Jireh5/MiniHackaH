import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UploadCloud, File, AlertTriangle, Lock } from 'lucide-react';

const ROLE_RANKING = {
  general_member: 0,
  committee_head: 1,
  executive_board: 2,
  admin: 3
};

const ACCESS_OPTIONS = [
  { value: 'general_member', label: 'General Member (Open)' },
  { value: 'committee_head', label: 'Committee Head Only' },
  { value: 'executive_board', label: 'Executive Board Only' },
  { value: 'admin', label: 'President / Admin Only' }
];

export const UploadModal = () => {
  const { isUploadOpen, setIsUploadOpen, currentUser, uploadDoc } = useApp();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('SOP');
  const [roleAccess, setRoleAccess] = useState('general_member');
  const [mockFileName, setMockFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Actual File object
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  if (!isUploadOpen || !currentUser) return null;

  const userRank = ROLE_RANKING[currentUser.org_role] || 0;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setMockFileName(file.name);
      setSelectedFile(file); // Store file object
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMockFileName(file.name);
      setSelectedFile(file); // Store file object
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim()) {
      setError('Please fill in the title and description.');
      return;
    }

    if (!mockFileName || !selectedFile) {
      setError('Please select or drag a file to upload.');
      return;
    }

    // Role-based validations
    const targetRank = ROLE_RANKING[roleAccess];
    if (targetRank > userRank) {
      setError(`Access level too high! You cannot upload a document with '${roleAccess}' clearance because your current role is '${currentUser.org_role}'.`);
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      type,
      role_access: roleAccess,
      file_name: mockFileName
    };

    uploadDoc(payload, selectedFile); // Pass the binary file to context
    
    // Reset state
    setTitle('');
    setDescription('');
    setType('SOP');
    setRoleAccess('general_member');
    setMockFileName('');
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-[4px]">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header (Solid Slate BG) */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/20 text-teal-700">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Upload New Turnover Document</h3>
          </div>
          <button 
            onClick={() => setIsUploadOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-all focus:outline-none cursor-pointer"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-start gap-2 animate-shake">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wide">Document Title</label>
            <input
              type="text"
              placeholder="e.g., Q2 Sponsors Engagement Presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-xl text-sm focus:outline-none placeholder:text-slate-400 font-medium transition-all"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wide">Short Description / Purpose</label>
            <textarea
              placeholder="Describe the context of this document so future officers understand its purpose..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-xl text-sm focus:outline-none placeholder:text-slate-400 font-medium resize-none transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Document Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide">Document Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-xl text-sm focus:outline-none font-bold text-slate-700 cursor-pointer shadow-sm transition-all"
              >
                <option value="SOP">SOP (Standard Guide)</option>
                <option value="Report">Report (Financial/Activity)</option>
                <option value="Project">Project (Folder/Details)</option>
              </select>
            </div>

            {/* Clearance Access Level */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center gap-1">
                Required Access <Lock className="w-3 h-3 text-slate-400" />
              </label>
              <select
                value={roleAccess}
                onChange={(e) => setRoleAccess(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 rounded-xl text-sm focus:outline-none font-bold text-slate-700 cursor-pointer shadow-sm transition-all"
              >
                {ACCESS_OPTIONS.map((opt) => {
                  const optRank = ROLE_RANKING[opt.value];
                  const isDisabled = optRank > userRank;
                  return (
                    <option key={opt.value} value={opt.value} disabled={isDisabled}>
                      {opt.label} {isDisabled ? '(Locked)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* File Drag and Drop zone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 tracking-wide">Attach Document File</label>
            
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                dragActive 
                  ? 'border-teal-500 bg-teal-500/5' 
                  : mockFileName 
                    ? 'border-teal-500/40 bg-teal-500/5' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
              }`}
            >
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleFileSelect}
              />
              
              {mockFileName ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 border border-teal-200">
                    <File className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[280px]">{mockFileName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Ready to upload</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setMockFileName(''); setSelectedFile(null); }}
                    className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-400 border border-slate-200/60">
                    <UploadCloud className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-600 hover:text-teal-700 underline">
                      Choose file
                    </span>
                    <span className="text-xs font-medium text-slate-500"> or drag it here</span>
                  </div>
                  <p className="text-[10px] text-slate-400">PDF, DOCX, XLSX, or PPTX up to 10MB</p>
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4.5 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 px-6 pb-6 mt-6">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-sm font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-sm font-bold shadow-md shadow-teal-500/10 hover:shadow-lg transition-all cursor-pointer"
            >
              Publish Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;
