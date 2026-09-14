import React from 'react';
import { 
  Home,
  Zap, 
  Clock, 
  CheckSquare, 
  FileText, 
  BellRing, 
  Calendar, 
  Award,
  BookOpen
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, activeRole }) {
  
  const navItems = [
    {
      id: 'home',
      label: 'Modules Home',
      icon: Home,
      badge: 'Grid',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 font-bold',
    },
    {
      id: 'dashboard',
      label: 'Smart Command Center',
      icon: Zap,
      badge: 'AI Engine',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    {
      id: 'attendance',
      label: 'Attendance & Risk Alerts',
      icon: CheckSquare,
      badge: '74.2% Risk',
      badgeColor: 'bg-red-100 text-red-700 border-red-200 animate-pulse',
    },
    {
      id: 'timeline',
      label: 'Unified Academic Timeline',
      icon: Clock,
      badge: 'Live',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'assignments',
      label: 'Assignments & Exams',
      icon: FileText,
      badge: '1 Due Today',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'notices',
      label: 'Smart Notices',
      icon: BellRing,
      badge: 'NLP Categorized',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      id: 'events',
      label: 'Campus Events',
      icon: Calendar,
      badge: 'Hackathon',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'portfolio',
      label: 'Achievement Portfolio',
      icon: Award,
      badge: 'Verified',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (activeRole === 'faculty') {
      if (item.id === 'timeline' || item.id === 'portfolio') return false;
    }
    return true;
  });

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-slate-200 shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div>
        
        {/* Module Nav Category Title */}
        <div className="px-3 mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span>Campus Modules</span>
          <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">v2.4</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                    isActive ? 'bg-white/20 text-white border-transparent' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Role-Specific Quick Info Card */}
        <div className="mt-6 p-3.5 bg-blue-50 border border-blue-100 rounded-xl">
          <div className="flex items-center space-x-2 text-blue-900 font-semibold text-xs mb-1">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>Active Academic Context</span>
          </div>
          <p className="text-[11px] text-blue-700 leading-snug">
            {activeRole === 'student' && 'B.Tech CSE - 6th Semester (Section A) • Autumn 2026 Term'}
            {activeRole === 'faculty' && 'Faculty Member: CS601 Operating Systems & CS604 ML'}
            {activeRole === 'admin' && 'Central Academic Audit & Notice Dispatch Desk'}
          </p>
        </div>

      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 px-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            ERP API Linked
          </span>
          <span className="text-[11px] font-mono text-slate-400">Campusathon PS4</span>
        </div>
      </div>
    </aside>
  );
}
