import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  GraduationCap, 
  UserCheck, 
  Building2, 
  ShieldCheck,
  CheckCircle2,
  Zap,
  BookOpen,
  BellRing,
  Award
} from 'lucide-react';
import { currentUser, facultyUser, adminUser } from '../data/mockData';

export default function AuthPage({ onLoginSuccess, setActiveRole }) {
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [role, setRole] = useState('student'); // 'student', 'faculty', 'admin'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleEmailAuth = (e) => {
    e.preventDefault();
    setActiveRole(role);
    let userProfile = currentUser;
    if (role === 'faculty') userProfile = facultyUser;
    if (role === 'admin') userProfile = adminUser;
    
    if (fullName) {
      userProfile = { ...userProfile, name: fullName, email: email || userProfile.email };
    }
    onLoginSuccess(userProfile);
  };

  const handleGoogleSignIn = (selectedAccount) => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      setShowGoogleModal(false);
      setActiveRole('student');
      onLoginSuccess({
        ...currentUser,
        name: selectedAccount.name,
        email: selectedAccount.email,
        avatar: selectedAccount.picture,
      });
    }, 1000);
  };

  const handleQuickDemoLogin = (demoRole) => {
    setActiveRole(demoRole);
    let userProfile = currentUser;
    if (demoRole === 'faculty') userProfile = facultyUser;
    if (demoRole === 'admin') userProfile = adminUser;
    onLoginSuccess(userProfile);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden font-sans">
      
      {/* Background Radial Glow Accents */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main 2-Column Split Container */}
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        
        {/* LEFT COLUMN: CampusFlow Branding & Core Platform Highlights */}
        <div className="lg:col-span-6 space-y-6 text-left">
          
          {/* Logo & Title */}
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-3 bg-blue-950/80 border border-blue-800/60 px-3.5 py-1.5 rounded-2xl shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold text-blue-300 tracking-wide uppercase">Institutional Command Center</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
              Campus<span className="text-blue-400">Flow</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-xl">
              Unified Student Journey & Smart Action Platform bringing scattered academic deadlines, attendance risk alerts, assignments, exam timetables, and digital portfolios into one place.
            </p>
          </div>

          {/* Key Platform Value Cards */}
          <div className="space-y-3.5 pt-2">
            
            <div className="flex items-start space-x-3.5 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 shadow-xs">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl mt-0.5 border border-blue-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Smart Priority Engine</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Converts student information into prioritized action queues based on deadline urgency & attendance risk.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 shadow-xs">
              <div className="p-2.5 bg-emerald-600/20 text-emerald-400 rounded-xl mt-0.5 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">Faculty-Controlled Attendance & RBAC</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Secure access control for Students, Faculty, and Administrators with duty leave correction claims.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800/80 shadow-xs">
              <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl mt-0.5 border border-purple-500/20">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs sm:text-sm">NLP Notice Classification</h4>
                <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                  Automatic AI tagging of institutional notices into Academic Risk, Placement, and Examination categories.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>JWT Authenticated</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Supabase / PostgreSQL Ready</span>
            </span>
          </div>

        </div>

        {/* RIGHT COLUMN: White Authentication Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5">
            
            {/* Sign In / Sign Up Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'signin' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                  authMode === 'signup' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Student Sign Up
              </button>
            </div>

            {/* Continue with Google Button */}
            <div className="space-y-3">
              <button 
                onClick={() => setShowGoogleModal(true)}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs py-3 px-4 rounded-xl border border-slate-300 shadow-xs transition hover:border-slate-400"
              >
                {/* Google G Logo SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center space-x-3 my-2">
                <div className="h-px bg-slate-200 flex-1"></div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Or with Email</span>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              
              {/* Role Selection Buttons */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Select Role</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border flex items-center justify-center space-x-1 transition ${
                      role === 'student' ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('faculty')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border flex items-center justify-center space-x-1 transition ${
                      role === 'faculty' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Faculty</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-1.5 px-2 text-[11px] font-bold rounded-lg border flex items-center justify-center space-x-1 transition ${
                      role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Registration / Roll No</label>
                    <input 
                      type="text" 
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g. 21BCE1042"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@campus.edu"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md transition pt-2.5 mt-2"
              >
                <span>{authMode === 'signin' ? 'Sign In to Portal' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Login Presets */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Instant 1-Click Demo Login
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button 
                  onClick={() => handleQuickDemoLogin('student')}
                  className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] rounded-lg border border-blue-200 transition"
                >
                  Demo Student
                </button>
                <button 
                  onClick={() => handleQuickDemoLogin('faculty')}
                  className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-lg border border-emerald-200 transition"
                >
                  Demo Faculty
                </button>
                <button 
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10px] rounded-lg border border-purple-200 transition"
                >
                  Demo Admin
                </button>
              </div>
            </div>

          </div>

          <p className="text-[11px] text-slate-500 text-center mt-4">
            Secured with JWT & Role-Based Access Control • Campusathon 2026
          </p>
        </div>

      </div>

      {/* Simulated Google Account Selector Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.0 10.04.0 12s.47 3.8 1.29 5.42l3.99-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <h3 className="font-bold text-sm text-slate-900">Sign in with Google</h3>
            </div>

            <p className="text-xs text-slate-500">Choose a Google account to continue to CampusFlow:</p>

            <div className="space-y-2">
              <button 
                disabled={isGoogleLoading}
                onClick={() => handleGoogleSignIn({
                  name: "Rahul Sharma",
                  email: "rahul.sharma@campus.edu",
                  picture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"
                })}
                className="w-full flex items-center space-x-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition text-left"
              >
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250" 
                  alt="Rahul" 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Rahul Sharma</span>
                  <span className="text-[11px] text-slate-500">rahul.sharma@campus.edu</span>
                </div>
              </button>

              <button 
                disabled={isGoogleLoading}
                onClick={() => handleGoogleSignIn({
                  name: "Anjali Kharade",
                  email: "anjali.kharade@campus.edu",
                  picture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
                })}
                className="w-full flex items-center space-x-3 p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition text-left"
              >
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250" 
                  alt="Anjali" 
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Anjali Kharade</span>
                  <span className="text-[11px] text-slate-500">anjali.kharade@campus.edu</span>
                </div>
              </button>
            </div>

            {isGoogleLoading && (
              <div className="text-center py-2 text-xs font-bold text-blue-600 flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating with Google...</span>
              </div>
            )}

            <div className="pt-2 text-right">
              <button 
                onClick={() => setShowGoogleModal(false)} 
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
