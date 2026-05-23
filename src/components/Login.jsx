import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Mail, Lock, User, ArrowRight, Sparkles, Key, Loader2 } from 'lucide-react';

export const Login = () => {
  const { 
    isLiveMode, 
    loginWithEmail, 
    signUpWithEmail, 
    switchRole, 
    usersList, 
    getRoleBadgeColor, 
    getRoleLabel,
    isLoading 
  } = useApp();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState('general_member');
  const [error, setError] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setError('Please provide your full name.');
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, fullName, selectedRole);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-tr from-sky-100 via-teal-50 to-emerald-100 flex items-center justify-center p-4">
      {/* Background Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* LOGO BLOCK */}
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/logo.jpg" 
            alt="OrgVault Logo" 
            className="w-24 h-24 rounded-2xl object-cover shadow-xl shadow-teal-500/10 mb-2 border border-white/50"
          />
          <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">OrgVault</h1>
          <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">Secure Turnover & SOP Hub</p>
        </div>

        {/* LOGIN CONTAINER */}
        <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl border-white/40">
          {/* LIVE MODE: Email / Password Authentication */}
          {isLiveMode ? (
            <div className="space-y-6">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-700 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Supabase Live Connection
                </span>
                <h2 className="text-lg font-extrabold text-slate-800 mt-2">
                  {isSignUp ? 'Create Officer Account' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isSignUp ? 'Register your profile in the database.' : 'Enter your credentials to access the vault.'}
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm focus:outline-none font-medium"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="name@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 glass-input rounded-xl text-sm focus:outline-none font-medium"
                      required
                    />
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Assign Role (`org_role` enum)</label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white/40 border border-white/60 focus:border-teal-500/40 rounded-xl text-sm focus:outline-none font-bold text-slate-700 cursor-pointer shadow-sm"
                    >
                      <option value="general_member">General Member</option>
                      <option value="committee_head">Committee Head</option>
                      <option value="executive_board">Executive Board</option>
                      <option value="admin">President / Admin</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl shadow-md font-bold text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? 'Sign Up Account' : 'Authenticate'}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                  }}
                  className="text-xs font-bold text-teal-600 hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'New officer? Request profile creation'}
                </button>
              </div>
            </div>
          ) : (
            /* MOCK MODE: Direct User Profile Switch Grid */
            <div className="space-y-5">
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-700 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Mock DB Offline Demo
                </span>
                <h2 className="text-lg font-extrabold text-slate-800 mt-2">Simulate Authentication</h2>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  OrgVault is operating in Demo Mode. Select an officer role profile below to log in and inspect permissions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {usersList.map((usr) => (
                  <button
                    key={usr.id}
                    onClick={() => switchRole(usr.id)}
                    className="w-full p-3 rounded-xl border border-white/60 bg-white/40 hover:bg-white/70 hover:border-slate-200 transition-all flex items-center gap-3.5 text-left group hover:-translate-y-0.5 shadow-sm"
                  >
                    <img
                      src={usr.avatar}
                      alt={usr.name}
                      className="w-11 h-11 rounded-xl object-cover border border-white shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{usr.name}</span>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${getRoleBadgeColor(usr.org_role)}`}>
                          {getRoleLabel(usr.org_role)}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{usr.email}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 bg-teal-50 border border-teal-100/50 rounded-2xl flex items-start gap-2 text-[10px] text-teal-800 leading-relaxed font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>To connect to a live Supabase server with email logins, set your keys inside the `.env` file at the root.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
