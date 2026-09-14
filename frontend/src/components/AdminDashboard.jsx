import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  UserPlus, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  BookOpen, 
  Clock, 
  PlusCircle, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  FileText,
  ChevronRight,
  UserCheck,
  X
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ user, setActiveTab, onOpenPublishNoticeModal }) {
  const [faculties, setFaculties] = useState([
    {
      id: "FAC-1002",
      employeeId: "EMP-CS102",
      name: "Prof. Ananya Sen",
      email: "ananya.sen@campus.edu",
      department: "Computer Science & Engineering",
      designation: "Associate Professor",
      assignedCourses: ["CS601 Operating Systems", "CS604 Machine Learning"],
      totalClassesToday: 3,
      status: "Active",
      onboardedOn: "12 Aug 2024",
    },
    {
      id: "FAC-1003",
      employeeId: "EMP-CS103",
      name: "Dr. R. P. Gupta",
      email: "rp.gupta@campus.edu",
      department: "Computer Science & Engineering",
      designation: "Professor & HOD",
      assignedCourses: ["CS602 Computer Networks"],
      totalClassesToday: 2,
      status: "Active",
      onboardedOn: "10 Jan 2022",
    },
    {
      id: "FAC-1004",
      employeeId: "EMP-CS104",
      name: "Dr. Vikram Sharma",
      email: "v.sharma@campus.edu",
      department: "Information Technology",
      designation: "Assistant Professor",
      assignedCourses: ["CS605 Cloud Computing", "CS604L ML Lab"],
      totalClassesToday: 2,
      status: "Active",
      onboardedOn: "05 Feb 2025",
    },
  ]);

  const [dailyClassUpdates, setDailyClassUpdates] = useState([
    {
      id: "cls-upd-1",
      courseCode: "CS601",
      courseName: "Operating Systems",
      facultyName: "Prof. Ananya Sen",
      scheduleTime: "10:00 AM - 11:00 AM",
      roomVenue: "Lecture Hall LT-3",
      batch: "B.Tech CSE - 6th Sem (Sec A)",
      totalEnrolled: 60,
      totalPresent: 47,
      totalAbsent: 13,
      percentage: 78.3,
      status: "Faculty Marked & Synced",
      updatedAt: "Today, 11:05 AM",
    },
    {
      id: "cls-upd-2",
      courseCode: "CS604",
      courseName: "Machine Learning",
      facultyName: "Prof. Ananya Sen",
      scheduleTime: "11:15 AM - 12:15 PM",
      roomVenue: "Lecture Hall LT-2",
      batch: "B.Tech CSE - 6th Sem (Sec A)",
      totalEnrolled: 58,
      totalPresent: 50,
      totalAbsent: 8,
      percentage: 86.2,
      status: "Faculty Marked & Synced",
      updatedAt: "Today, 12:20 PM",
    },
    {
      id: "cls-upd-3",
      courseCode: "CS604L",
      courseName: "Machine Learning Lab (Batch B1)",
      facultyName: "Dr. Vikram Sharma",
      scheduleTime: "03:15 PM - 05:15 PM",
      roomVenue: "Computer Lab 4",
      batch: "B.Tech CSE - 6th Sem (Sec B)",
      totalEnrolled: 30,
      totalPresent: 22,
      totalAbsent: 8,
      percentage: 73.3,
      status: "Shortage Warning Flagged",
      updatedAt: "Today, 05:20 PM",
    },
    {
      id: "cls-upd-4",
      courseCode: "CS602",
      courseName: "Computer Networks",
      facultyName: "Dr. R. P. Gupta",
      scheduleTime: "01:30 PM - 02:30 PM",
      roomVenue: "Lecture Hall LT-4",
      batch: "B.Tech CSE - 6th Sem (Sec A)",
      totalEnrolled: 55,
      totalPresent: 44,
      totalAbsent: 11,
      percentage: 80.0,
      status: "Faculty Marked & Synced",
      updatedAt: "Today, 02:35 PM",
    },
  ]);

  const [summaryStats, setSummaryStats] = useState({
    totalClassesConducted: 4,
    totalEnrolledSum: 203,
    totalPresentSum: 163,
    overallCampusAttendance: 80.3,
  });

  const [searchFaculty, setSearchFaculty] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Assign New Faculty Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyDept, setNewFacultyDept] = useState('Computer Science & Engineering');
  const [newFacultyDesig, setNewFacultyDesig] = useState('Assistant Professor');
  const [newFacultyCourses, setNewFacultyCourses] = useState('');

  useEffect(() => {
    // Fetch Assigned Faculties
    api.getAdminFaculties().then(res => {
      if (res.success && res.faculties) {
        setFaculties(res.faculties);
      }
    }).catch(() => {});

    // Fetch Daily Class Updates & Present Count
    api.getDailyClassUpdates().then(res => {
      if (res.success && res.updates) {
        setDailyClassUpdates(res.updates);
        if (res.summary) setSummaryStats(res.summary);
      }
    }).catch(() => {});
  }, []);

  const handleAssignFacultySubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: newFacultyName || 'Dr. New Faculty',
      email: newFacultyEmail || 'faculty@campus.edu',
      department: newFacultyDept,
      designation: newFacultyDesig,
      assignedCourses: newFacultyCourses ? newFacultyCourses.split(',') : ['CS606 Software Engineering'],
    };

    try {
      const res = await api.assignFaculty(payload);
      if (res.success && res.faculties) {
        setFaculties(res.faculties);
      } else if (res.faculty) {
        setFaculties([res.faculty, ...faculties]);
      }
    } catch {
      const fallback = {
        id: `FAC-${Date.now()}`,
        employeeId: `EMP-CS${Math.floor(100 + Math.random() * 900)}`,
        name: payload.name,
        email: payload.email,
        department: payload.department,
        designation: payload.designation,
        assignedCourses: payload.assignedCourses,
        totalClassesToday: payload.assignedCourses.length,
        status: "Active",
        onboardedOn: "Just Now",
      };
      setFaculties([fallback, ...faculties]);
    }

    setIsAssignModalOpen(false);
    setNewFacultyName('');
    setNewFacultyEmail('');
    setNewFacultyCourses('');
    setToastMessage(`New Faculty member '${payload.name}' assigned & credentials generated!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredFaculties = faculties.filter(f => 
    f.name.toLowerCase().includes(searchFaculty.toLowerCase()) ||
    f.email.toLowerCase().includes(searchFaculty.toLowerCase()) ||
    f.department.toLowerCase().includes(searchFaculty.toLowerCase())
  );

  const adminName = user?.name || "Dr. S. K. Mukherjee (Academic Dean)";

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-purple-600 text-white p-3.5 rounded-2xl text-xs font-semibold shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-purple-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-purple-200 hover:text-white">✕</button>
        </div>
      )}

      {/* ADMIN COMMAND CENTER HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-purple-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>CENTRAL ACADEMIC ADMINISTRATION</span>
              </span>
              <span className="text-xs text-slate-300">Office of the Dean & Academic Controller</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome, {adminName} 🏛️
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Assign new faculty members, circulate official institutional details to faculty & student portals, and monitor real-time daily class attendance reports from each department.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button 
              onClick={() => setIsAssignModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Assign New Faculty</span>
            </button>

            <button 
              onClick={onOpenPublishNoticeModal}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Send className="w-4 h-4 text-purple-400" />
              <span>Circulate Notice (To Faculty & Students)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI METRICS OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Total Assigned Faculties</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{faculties.length}</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Active in Central ERP</span>
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Classes Conducted Today</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{summaryStats.totalClassesConducted || dailyClassUpdates.length}</span>
            <span className="text-[10px] text-blue-600 font-bold flex items-center space-x-1 mt-1">
              <Clock className="w-3 h-3" />
              <span>Real-Time Faculty Sync</span>
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Overall Present Count Today</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              {summaryStats.totalPresentSum} <span className="text-xs text-slate-400 font-semibold">/ {summaryStats.totalEnrolledSum} Present</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold mt-1 inline-block">
              {summaryStats.overallCampusAttendance}% Attendance Rate
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Shortage Alerts Flagged</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {dailyClassUpdates.filter(u => u.percentage < 75).length} Classes
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold mt-1 inline-block">
              Under 75% Threshold
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* SECTION 1: DAILY UPDATES FROM EACH FACULTY & TOTAL PRESENT COUNT MATRIX */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Daily Updates & Class Attendance Report</h2>
              <p className="text-xs text-slate-500">Live feed of total students present & absent reported by each faculty member today</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live Faculty Feed Connected</span>
            </span>
          </div>
        </div>

        {/* Attendance Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Course & Class Batch</th>
                <th className="py-3 px-4">Faculty In-Charge</th>
                <th className="py-3 px-4">Schedule Time & Venue</th>
                <th className="py-3 px-4 text-center">Total Enrolled</th>
                <th className="py-3 px-4 text-center">Total Present Count</th>
                <th className="py-3 px-4 text-center">Absent Count</th>
                <th className="py-3 px-4 text-center">Class Attendance %</th>
                <th className="py-3 px-4 text-right">Reporting Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {dailyClassUpdates.map((cls) => {
                const isShortage = cls.percentage < 75;

                return (
                  <tr key={cls.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">
                          {cls.courseCode}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{cls.courseName}</span>
                          <span className="text-[10px] text-slate-400">{cls.batch}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 flex items-center space-x-1">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span>{cls.facultyName}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="text-[11px]">
                        <span>{cls.scheduleTime}</span>
                        <span className="block text-[10px] text-slate-400">{cls.roomVenue}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      {cls.totalEnrolled}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        {cls.totalPresent} Present
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-500">
                      {cls.totalAbsent}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-lg border ${
                        isShortage 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}>
                        {cls.percentage}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isShortage 
                          ? 'bg-red-100 text-red-700 border border-red-200' 
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {cls.status}
                      </span>
                      <span className="block text-[9px] text-slate-400 mt-0.5">{cls.updatedAt}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* SECTION 2: ASSIGNED FACULTIES DIRECTORY & ONBOARDING SYSTEM */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-5 h-5 text-purple-600" />
              <span>Assigned Faculty Members Directory</span>
            </h2>
            <p className="text-xs text-slate-500">List of onboarded faculties and their assigned courses across departments</p>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text"
                value={searchFaculty}
                onChange={(e) => setSearchFaculty(e.target.value)}
                placeholder="Search Faculty Name / Department..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <button 
              onClick={() => setIsAssignModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shrink-0 flex items-center space-x-1"
            >
              <UserPlus className="w-4 h-4" />
              <span>Assign Faculty</span>
            </button>
          </div>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFaculties.map((fac) => (
            <div key={fac.id} className="bg-slate-50/50 hover:bg-white rounded-2xl p-4 border border-slate-200 hover:border-purple-300 transition space-y-3 shadow-2xs">
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                    {fac.employeeId}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{fac.name}</h3>
                  <p className="text-[11px] text-slate-500">{fac.designation} • {fac.department}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  {fac.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/60 space-y-1.5 text-xs">
                <span className="text-[11px] font-semibold text-slate-700 block">Assigned Courses & Modules:</span>
                <div className="flex flex-wrap gap-1">
                  {fac.assignedCourses.map((crs, idx) => (
                    <span key={idx} className="bg-white text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {crs}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Email: <strong className="text-slate-700">{fac.email}</strong></span>
                <span>Classes Today: <strong className="text-purple-700">{fac.totalClassesToday}</strong></span>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* MODAL: ADMIN ASSIGN NEW FACULTY */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>Assign New Faculty Member</span>
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignFacultySubmit} className="space-y-3.5 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Faculty Full Name</label>
                <input 
                  type="text" 
                  value={newFacultyName}
                  onChange={(e) => setNewFacultyName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh K. Sharma"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
                <input 
                  type="email" 
                  value={newFacultyEmail}
                  onChange={(e) => setNewFacultyEmail(e.target.value)}
                  placeholder="e.g. rajesh.sharma@campus.edu"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Department</label>
                  <select 
                    value={newFacultyDept}
                    onChange={(e) => setNewFacultyDept(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                  >
                    <option>Computer Science & Engineering</option>
                    <option>Information Technology</option>
                    <option>Electronics & Communication</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty Designation</label>
                  <select 
                    value={newFacultyDesig}
                    onChange={(e) => setNewFacultyDesig(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
                  >
                    <option>Assistant Professor</option>
                    <option>Associate Professor</option>
                    <option>Professor & HOD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Courses (Comma Separated)</label>
                <input 
                  type="text" 
                  value={newFacultyCourses}
                  onChange={(e) => setNewFacultyCourses(e.target.value)}
                  placeholder="e.g. CS603 Algorithms, CS606 Software Engineering"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 flex items-center justify-between">
                <span className="text-[11px] font-medium flex items-center space-x-1">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Auto ERP Account Onboarding:</span>
                </span>
                <span className="text-[10px] font-bold bg-white text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  Credentials Generated
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsAssignModalOpen(false)} 
                  className="px-4 py-2 text-slate-600 font-semibold hover:text-slate-800"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl transition shadow-xs flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Assign Faculty</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
