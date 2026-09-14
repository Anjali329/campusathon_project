import React, { useState } from 'react';
import { 
  Zap, 
  CheckSquare, 
  FileText, 
  BookOpen, 
  BellRing, 
  Clock, 
  Calendar, 
  Award, 
  FileSpreadsheet,
  Search,
  Compass,
  Target,
  Building,
  Sparkles
} from 'lucide-react';
import { currentUser } from '../data/mockData';
import FacultyDashboard from './FacultyDashboard';
import AdminDashboard from './AdminDashboard';

export default function HomePage({ activeRole, user, setActiveTab, onOpenCorrectionModal, onOpenPublishNoticeModal }) {
  const [searchQuery, setSearchQuery] = useState('');

  if (activeRole === 'faculty') {
    return (
      <FacultyDashboard 
        user={user}
        setActiveTab={setActiveTab}
        onOpenPublishNoticeModal={onOpenPublishNoticeModal}
      />
    );
  }

  if (activeRole === 'admin') {
    return (
      <AdminDashboard 
        user={user}
        setActiveTab={setActiveTab}
        onOpenPublishNoticeModal={onOpenPublishNoticeModal}
      />
    );
  }

  const profile = user || currentUser;

  const modules = [
    {
      id: 'dashboard',
      title: 'Smart Command Center',
      sub: 'AI Priority Engine',
      icon: Zap,
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      badge: 'AI Alert',
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'attendance',
      title: 'Attendance',
      sub: 'Monitoring & Risk Alerts',
      icon: CheckSquare,
      iconBg: 'bg-amber-400',
      iconColor: 'text-slate-900',
      badge: '74.2% Risk',
      badgeColor: 'bg-red-100 text-red-700 border-red-200 font-bold',
    },
    {
      id: 'assignments',
      title: 'Assignment',
      sub: 'Lab Reports & Homework',
      icon: FileText,
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      badge: '1 Due Today',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200 font-bold',
    },
    {
      id: 'exams',
      title: 'Examination',
      sub: 'Faculty Timetable & Grade Cards',
      icon: BookOpen,
      iconBg: 'bg-indigo-500',
      iconColor: 'text-white',
      badge: 'Timetable Ready',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200 font-bold',
    },
    {
      id: 'notices',
      title: 'Notification & Notices',
      sub: 'Smart NLP Categorized',
      icon: BellRing,
      iconBg: 'bg-purple-500',
      iconColor: 'text-white',
      badge: 'NLP Active',
      badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      id: 'timeline',
      title: 'My Time Table & Stream',
      sub: 'Unified Academic Timeline',
      icon: Clock,
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
    },
    {
      id: 'events',
      title: 'Events & Hackathons',
      sub: 'Campus Activities & RSVPs',
      icon: Calendar,
      iconBg: 'bg-rose-500',
      iconColor: 'text-white',
    },
    {
      id: 'portfolio',
      title: 'Certificates & Portfolio',
      sub: 'Digital Achievement Record',
      icon: Award,
      iconBg: 'bg-cyan-500',
      iconColor: 'text-white',
      badge: 'Verified',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      id: 'grievance',
      title: 'Grievance & Duty Leave',
      sub: 'Attendance Correction Claims',
      icon: FileSpreadsheet,
      iconBg: 'bg-teal-500',
      iconColor: 'text-white',
      isModalAction: true,
    },
  ];

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.sub.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleModuleClick = (mod) => {
    if (mod.isModalAction) {
      onOpenCorrectionModal();
    } else {
      setActiveTab(mod.targetTab || mod.id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Top Dynamic Student Header Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Profile Info */}
        <div className="flex items-center space-x-3.5 w-full md:w-auto">
          <img 
            src={profile.avatar || profile.avatar_url || currentUser.avatar} 
            alt={profile.name} 
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">{profile.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span> Active Student
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Registration No: <strong className="text-slate-800 font-mono">{profile.rollNo || profile.rollNumber || "21BCE1092"}</strong> • {profile.department || "Computer Science & Engineering"}
            </p>
          </div>
        </div>

        {/* Right Academic Term Info */}
        <div className="flex items-center space-x-3 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full md:w-auto justify-between md:justify-end">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Academic Term</span>
            <span className="font-bold text-slate-900">B.Tech Sem 6 (2026)</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Section</span>
            <span className="font-bold text-blue-700">CSE-A</span>
          </div>
        </div>

      </div>

      {/* Centered Module Search Bar */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Module..." 
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl shadow-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      {/* Main Grid & Side Widget Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Modules Grid */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => handleModuleClick(mod)}
                className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between h-44 relative"
              >
                {/* Top Soft Blue Gradient Arc Header */}
                <div className="bg-gradient-to-b from-blue-100/80 via-blue-50/50 to-white pt-4 px-4 pb-2 text-center h-24 flex flex-col justify-center items-center relative">
                  
                  {mod.badge && (
                    <span className={`absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full font-bold shadow-2xs ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  )}

                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight group-hover:text-blue-600 transition">
                    {mod.title}
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 line-clamp-1">{mod.sub}</p>
                </div>

                {/* Circular Icon in Center Bottom */}
                <div className="pb-4 flex justify-center items-center">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full ${mod.iconBg} ${mod.iconColor} flex items-center justify-center shadow-md border-4 border-white group-hover:scale-110 transition duration-200`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side Institution Vision Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          
          <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs pb-2 border-b border-slate-100">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>Institution & Department Vision</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                <Building className="w-3.5 h-3.5 text-slate-500" /> Organization Vision
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                To satisfy the academic and career aspirations of student youth through excellence in technical education.
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 flex items-center gap-1 mb-1">
                <Target className="w-3.5 h-3.5 text-slate-500" /> Department Objectives
              </span>
              <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                Create quality computer engineering professionals through AI-driven student tracking and hands-on learning.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
              <span className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Need Assistance?
              </span>
              <p className="text-[10px] text-blue-700">Contact College Academic Help Desk or submit duty leave correction claims.</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
