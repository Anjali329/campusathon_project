import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import AuthPage from './components/AuthPage';
import SmartPriorityEngine from './components/SmartPriorityEngine';
import AttendanceModule from './components/AttendanceModule';
import TimelineModule from './components/TimelineModule';
import AssignmentsModule from './components/AssignmentsModule';
import ExaminationModule from './components/ExaminationModule';
import NoticesModule from './components/NoticesModule';
import EventsModule from './components/EventsModule';
import PortfolioModule from './components/PortfolioModule';

import CorrectionModal from './components/modals/CorrectionModal';
import SubmissionModal from './components/modals/SubmissionModal';
import NoticeModal from './components/modals/NoticeModal';
import PublishNoticeModal from './components/modals/PublishNoticeModal';
import ExportModal from './components/modals/ExportModal';

import { ArrowLeft } from 'lucide-react';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [activeRole, setActiveRole] = useState('student'); // 'student', 'faculty', 'admin'

  // Modals state
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false);
  const [submissionAssignment, setSubmissionAssignment] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isPublishNoticeOpen, setIsPublishNoticeOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleLoginSuccess = (userProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    if (userProfile.role) {
      setActiveRole(userProfile.role);
    }
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('campusflow_token');
  };

  if (!isAuthenticated) {
    return (
      <AuthPage 
        onLoginSuccess={handleLoginSuccess}
        setActiveRole={setActiveRole}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar 
        activeRole={activeRole} 
        setActiveRole={setActiveRole} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Body Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Role Switching Context Banner */}
        {activeRole !== 'student' && (
          <div className="mb-5 p-3.5 bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-2xl flex items-center justify-between text-xs shadow-sm">
            <span className="font-medium">
              Viewing as <strong>{activeRole.toUpperCase()}</strong> perspective. Role-specific administrative controls & forms are enabled.
            </span>
            <button 
              onClick={() => setActiveRole('student')}
              className="bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-lg transition"
            >
              Switch Back to Student View
            </button>
          </div>
        )}

        {/* Back to Home Navigation Bar when inside a specific module */}
        {activeTab !== 'home' && (
          <div className="mb-5 flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center space-x-2 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Modules Home</span>
            </button>

            <span className="text-xs font-semibold text-slate-500 capitalize">
              Active Module: <strong className="text-slate-900">{activeTab}</strong>
            </span>
          </div>
        )}

        {/* Main View Area */}
        <main className="w-full">
          {activeTab === 'home' && (
            <HomePage 
              activeRole={activeRole}
              user={user}
              setActiveTab={setActiveTab} 
              onOpenCorrectionModal={() => setIsCorrectionOpen(true)}
            />
          )}

          {activeTab === 'dashboard' && (
            <SmartPriorityEngine 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceModule 
              activeRole={activeRole} 
              onOpenCorrectionModal={() => setIsCorrectionOpen(true)} 
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineModule 
              setActiveTab={setActiveTab} 
            />
          )}

          {activeTab === 'assignments' && (
            <AssignmentsModule 
              activeRole={activeRole}
              onOpenSubmissionModal={(asg) => setSubmissionAssignment(asg)} 
            />
          )}

          {activeTab === 'exams' && (
            <ExaminationModule 
              activeRole={activeRole} 
              user={user}
            />
          )}

          {activeTab === 'notices' && (
            <NoticesModule 
              activeRole={activeRole} 
              onOpenNoticeModal={(not) => setSelectedNotice(null)} 
              onOpenPublishNoticeModal={() => setIsPublishNoticeOpen(true)} 
            />
          )}

          {activeTab === 'events' && (
            <EventsModule />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioModule 
              onOpenExportModal={() => setIsExportOpen(true)} 
            />
          )}
        </main>

      </div>

      {/* Global Interactive Modals */}
      <CorrectionModal 
        isOpen={isCorrectionOpen} 
        onClose={() => setIsCorrectionOpen(false)} 
      />

      <SubmissionModal 
        isOpen={!!submissionAssignment} 
        onClose={() => setSubmissionAssignment(null)} 
        assignment={submissionAssignment} 
      />

      <NoticeModal 
        isOpen={!!selectedNotice} 
        onClose={() => setSelectedNotice(null)} 
        notice={selectedNotice} 
      />

      <PublishNoticeModal 
        isOpen={isPublishNoticeOpen} 
        onClose={() => setIsPublishNoticeOpen(false)} 
      />

      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
      />

    </div>
  );
}
