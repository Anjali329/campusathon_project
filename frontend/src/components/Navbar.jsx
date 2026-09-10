import React, { useState } from 'react';
import { 
  Sparkles, 
  Bell, 
  Search, 
  UserCheck, 
  GraduationCap, 
  Building2, 
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  X,
  Home,
  LogOut
} from 'lucide-react';
import { currentUser, facultyUser, adminUser } from '../data/mockData';

export default function Navbar({ activeRole, setActiveRole, activeTab, setActiveTab, user, onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: "Attendance Warning", text: "CS601 OS Attendance dropped to 68.5%", time: "10m ago", type: "warning" },
    { id: 2, title: "Assignment Reminder", text: "ML Lab Report 4 due in 4 hours", time: "1h ago", type: "urgent" },
    { id: 3, title: "New Notice", text: "Final Year Capstone Proposal Guidelines released", time: "3h ago", type: "info" },
  ];

  const getRoleUser = () => {
    if (user) return user;
    if (activeRole === 'faculty') return facultyUser;
    if (activeRole === 'admin') return adminUser;
    return currentUser;
  };

  const currentProfile = getRoleUser();

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">Campus<span className="text-blue-400">Flow</span></span>
                <span className="bg-blue-950 text-blue-300 text-[10px] px-2 py-0.5 rounded-md font-semibold border border-blue-800 hidden sm:inline">
                  Student Portal
                </span>
              </div>
            </div>

            {/* Home Quick Button */}
            <button 
              onClick={() => setActiveTab('home')}
              className={`flex items-center space-x-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition ${
                activeTab === 'home' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Modules Home</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search modules, notices, exams..." 
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Actions & Role Switcher */}
          <div className="flex items-center space-x-3">
            
            {/* Role Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {activeRole === 'student' && <GraduationCap className="w-4 h-4 text-blue-400" />}
                {activeRole === 'faculty' && <UserCheck className="w-4 h-4 text-emerald-400" />}
                {activeRole === 'admin' && <Building2 className="w-4 h-4 text-purple-400" />}
                <span className="font-semibold capitalize">{activeRole} View</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Switch Role</div>
                  
                  <button 
                    onClick={() => { setActiveRole('student'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-700 transition ${activeRole === 'student' ? 'text-blue-400 font-bold bg-slate-700/40' : 'text-slate-200'}`}
                  >
                    <GraduationCap className="w-4 h-4 text-blue-400" />
                    <span>Student (Rahul)</span>
                  </button>

                  <button 
                    onClick={() => { setActiveRole('faculty'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-700 transition ${activeRole === 'faculty' ? 'text-emerald-400 font-bold bg-slate-700/40' : 'text-slate-200'}`}
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <span>Faculty (Prof. Sen)</span>
                  </button>

                  <button 
                    onClick={() => { setActiveRole('admin'); setShowRoleDropdown(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center space-x-2 hover:bg-slate-700 transition ${activeRole === 'admin' ? 'text-purple-400 font-bold bg-slate-700/40' : 'text-slate-200'}`}
                  >
                    <Building2 className="w-4 h-4 text-purple-400" />
                    <span>Administrator (Dean)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-slate-800">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 hover:bg-slate-50 transition cursor-pointer flex items-start space-x-2 text-xs">
                        {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />}
                        {n.type === 'urgent' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />}
                        {n.type === 'info' && <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />}
                        <div>
                          <p className="font-bold text-slate-900 text-[11px]">{n.title}</p>
                          <p className="text-slate-600 text-[11px]">{n.text}</p>
                          <span className="text-[9px] text-slate-400 mt-0.5 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Logout Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 pl-2 border-l border-slate-800 focus:outline-none"
              >
                <img 
                  src={currentProfile.avatar} 
                  alt={currentProfile.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-400" 
                />
                <span className="hidden sm:inline text-xs font-semibold text-slate-200">{currentProfile.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-700">
                    <p className="text-xs font-bold text-white">{currentProfile.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{currentProfile.email}</p>
                  </div>
                  
                  <button 
                    onClick={() => { setShowProfileMenu(false); onLogout && onLogout(); }}
                    className="w-full text-left px-3 py-2 text-xs flex items-center space-x-2 text-red-400 hover:bg-slate-700/60 transition font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
