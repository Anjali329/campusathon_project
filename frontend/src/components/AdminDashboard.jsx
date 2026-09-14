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
  GraduationCap,
  Layers,
  Filter,
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

  // Year-wise and Division-wise HOD Department Reports State
  const [departmentReports, setDepartmentReports] = useState([
    // 2nd Year
    {
      id: "rep-2a",
      year: "2nd Year",
      semester: "4th Semester",
      division: "Division A",
      batchName: "B.Tech CSE 2nd Year (Sec A)",
      totalEnrolled: 64,
      totalPresent: 55,
      totalAbsent: 9,
      attendancePercentage: 85.9,
      shortageRiskCount: 2,
      facultyInCharge: "Dr. A. K. Verma",
      subjects: [
        { code: "CS401", name: "Discrete Mathematics", faculty: "Dr. A. K. Verma", present: 55, total: 64, percentage: 85.9 },
        { code: "CS403", name: "OOP Java", faculty: "Prof. S. K. Roy", present: 52, total: 64, percentage: 81.3 }
      ]
    },
    {
      id: "rep-2b",
      year: "2nd Year",
      semester: "4th Semester",
      division: "Division B",
      batchName: "B.Tech CSE 2nd Year (Sec B)",
      totalEnrolled: 62,
      totalPresent: 49,
      totalAbsent: 13,
      attendancePercentage: 79.0,
      shortageRiskCount: 5,
      facultyInCharge: "Prof. Neha Gupta",
      subjects: [
        { code: "CS402", name: "Microprocessors & Interfacing", faculty: "Prof. Neha Gupta", present: 49, total: 62, percentage: 79.0 }
      ]
    },
    {
      id: "rep-2c",
      year: "2nd Year",
      semester: "4th Semester",
      division: "Division C",
      batchName: "B.Tech CSE 2nd Year (Sec C)",
      totalEnrolled: 60,
      totalPresent: 48,
      totalAbsent: 12,
      attendancePercentage: 80.0,
      shortageRiskCount: 3,
      facultyInCharge: "Prof. S. K. Roy",
      subjects: [
        { code: "CS404L", name: "Java OOP Lab", faculty: "Prof. S. K. Roy", present: 48, total: 60, percentage: 80.0 }
      ]
    },
    // 3rd Year
    {
      id: "rep-3a",
      year: "3rd Year",
      semester: "6th Semester",
      division: "Division A",
      batchName: "B.Tech CSE 3rd Year (Sec A)",
      totalEnrolled: 60,
      totalPresent: 47,
      totalAbsent: 13,
      attendancePercentage: 78.3,
      shortageRiskCount: 4,
      facultyInCharge: "Prof. Ananya Sen",
      subjects: [
        { code: "CS601", name: "Operating Systems", faculty: "Prof. Ananya Sen", present: 47, total: 60, percentage: 78.3 },
        { code: "CS604", name: "Machine Learning", faculty: "Prof. Ananya Sen", present: 50, total: 58, percentage: 86.2 }
      ]
    },
    {
      id: "rep-3b",
      year: "3rd Year",
      semester: "6th Semester",
      division: "Division B",
      batchName: "B.Tech CSE 3rd Year (Sec B)",
      totalEnrolled: 58,
      totalPresent: 42,
      totalAbsent: 16,
      attendancePercentage: 72.4,
      shortageRiskCount: 6,
      facultyInCharge: "Dr. Vikram Sharma",
      subjects: [
        { code: "CS604L", name: "ML Lab (Sec B)", faculty: "Dr. Vikram Sharma", present: 22, total: 30, percentage: 73.3 },
        { code: "CS602", name: "Computer Networks", faculty: "Dr. R. P. Gupta", present: 44, total: 55, percentage: 80.0 }
      ]
    },
    {
      id: "rep-3c",
      year: "3rd Year",
      semester: "6th Semester",
      division: "Division C",
      batchName: "B.Tech CSE 3rd Year (Sec C)",
      totalEnrolled: 55,
      totalPresent: 46,
      totalAbsent: 9,
      attendancePercentage: 83.6,
      shortageRiskCount: 2,
      facultyInCharge: "Dr. Sunita Rao",
      subjects: [
        { code: "CS603", name: "Design & Analysis of Algorithms", faculty: "Dr. Sunita Rao", present: 46, total: 55, percentage: 83.6 }
      ]
    },
    // Final Year
    {
      id: "rep-4a",
      year: "Final Year",
      semester: "8th Semester",
      division: "Division A",
      batchName: "B.Tech CSE Final Year (Sec A)",
      totalEnrolled: 50,
      totalPresent: 45,
      totalAbsent: 5,
      attendancePercentage: 90.0,
      shortageRiskCount: 1,
      facultyInCharge: "Dr. R. P. Gupta (HOD)",
      subjects: [
        { code: "CS801", name: "Cloud Infrastructure & DevOps", faculty: "Dr. R. P. Gupta", present: 45, total: 50, percentage: 90.0 }
      ]
    },
    {
      id: "rep-4b",
      year: "Final Year",
      semester: "8th Semester",
      division: "Division B",
      batchName: "B.Tech CSE Final Year (Sec B)",
      totalEnrolled: 48,
      totalPresent: 43,
      totalAbsent: 5,
      attendancePercentage: 89.5,
      shortageRiskCount: 1,
      facultyInCharge: "Prof. Ananya Sen",
      subjects: [
        { code: "CS802", name: "Deep Learning & NLP", faculty: "Prof. Ananya Sen", present: 43, total: 48, percentage: 89.5 }
      ]
    },
    {
      id: "rep-4c",
      year: "Final Year",
      semester: "8th Semester",
      division: "Division C",
      batchName: "B.Tech CSE Final Year (Sec C)",
      totalEnrolled: 46,
      totalPresent: 40,
      totalAbsent: 6,
      attendancePercentage: 86.9,
      shortageRiskCount: 2,
      facultyInCharge: "Dr. Vikram Sharma",
      subjects: [
        { code: "CS803", name: "Cyber Security & Forensic Audit", faculty: "Dr. Vikram Sharma", present: 40, total: 46, percentage: 86.9 }
      ]
    }
  ]);

  const [summaryStats, setSummaryStats] = useState({
    totalClassesConducted: 4,
    totalEnrolledSum: 203,
    totalPresentSum: 163,
    overallCampusAttendance: 80.3,
  });

  // HOD Filters
  const [selectedYearFilter, setSelectedYearFilter] = useState('All'); // 'All', '2nd Year', '3rd Year', 'Final Year'
  const [selectedDivisionFilter, setSelectedDivisionFilter] = useState('All'); // 'All', 'Division A', 'Division B', 'Division C'
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

    // Fetch HOD Year-Wise & Division-Wise Department Reports
    api.getDepartmentReports().then(res => {
      if (res.success && res.reports) {
        setDepartmentReports(res.reports);
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

  const filteredReports = departmentReports.filter(rep => {
    const matchesYear = selectedYearFilter === 'All' || rep.year === selectedYearFilter;
    const matchesDivision = selectedDivisionFilter === 'All' || rep.division === selectedDivisionFilter;
    return matchesYear && matchesDivision;
  });

  const adminName = user?.name || "Dr. R. P. Gupta (HOD & Academic Controller)";

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

      {/* HOD CONTROL CENTER HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-purple-500/30 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HOD DEPARTMENT DESK • COMPUTER SCIENCE & ENGINEERING</span>
              </span>
              <span className="text-xs text-slate-300">Year-Wise & Division-Wise (A, B, C) Auditing</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome, {adminName} 🏛️
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Inspect separate year-wise (2nd Year, 3rd Year, Final Year) and division-wise (Div A, Div B, Div C) student attendance reports, onboard new faculty members, and circulate official HOD details directly to faculty & student portals.
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
              <span>Active HOD Roster</span>
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Academic Batches Tracked</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">9 Divisions</span>
            <span className="text-[10px] text-blue-600 font-bold flex items-center space-x-1 mt-1">
              <Layers className="w-3 h-3" />
              <span>Div A, B, C across 3 Years</span>
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Overall Department Present Count</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">
              423 <span className="text-xs text-slate-400 font-semibold">/ 503 Enrolled</span>
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold mt-1 inline-block">
              84.1% Campus Average Today
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Department Shortage Flags</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">
              {departmentReports.reduce((acc, r) => acc + r.shortageRiskCount, 0)} Students
            </span>
            <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold mt-1 inline-block">
              Attendance &lt; 75% Risk
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* SECTION 1: HOD YEAR-WISE & DIVISION-WISE (DIV A, B, C) STUDENT ATTENDANCE & PERFORMANCE REPORTS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <GraduationCap className="w-5 h-5 text-purple-600" />
              <span>HOD Department Reports: Year-Wise & Division-Wise (A, B, C)</span>
            </h2>
            <p className="text-xs text-slate-500">Separated reports for 2nd Year, 3rd Year, and Final Year students split by Division A, B, and C</p>
          </div>

          {/* Year & Division Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Year Selector Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
              {['All', '2nd Year', '3rd Year', 'Final Year'].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYearFilter(yr)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                    selectedYearFilter === yr 
                      ? 'bg-purple-600 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            {/* Division Selector Pills */}
            <div className="flex items-center space-x-1 bg-purple-50 border border-purple-200 p-1 rounded-xl">
              {['All', 'Division A', 'Division B', 'Division C'].map((div) => (
                <button
                  key={div}
                  onClick={() => setSelectedDivisionFilter(div)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                    selectedDivisionFilter === div 
                      ? 'bg-white text-purple-900 shadow-xs border border-purple-300' 
                      : 'text-purple-700 hover:text-purple-950'
                  }`}
                >
                  {div}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Division Reports Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReports.map((rep) => {
            const isCritical = rep.attendancePercentage < 75;

            return (
              <div key={rep.id} className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200 hover:border-purple-300 transition space-y-4 shadow-2xs flex flex-col justify-between group">
                
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-md border border-purple-200">
                      {rep.year} • {rep.division}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-md">
                      {rep.semester}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-purple-700 transition">
                    {rep.batchName}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    Faculty In-Charge: <strong className="text-slate-800">{rep.facultyInCharge}</strong>
                  </p>

                  {/* Attendance Stats Counter Box */}
                  <div className="bg-white rounded-xl p-3 border border-slate-200/80 mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Total Enrolled: {rep.totalEnrolled}</span>
                      <span className="text-emerald-600">{rep.totalPresent} Present Today</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          rep.attendancePercentage >= 85 ? 'bg-emerald-500' :
                          rep.attendancePercentage >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${rep.attendancePercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold pt-1">
                      <span className="text-slate-400">{rep.totalAbsent} Absent</span>
                      <span className={`px-2 py-0.5 rounded font-extrabold ${
                        isCritical ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {rep.attendancePercentage}% Attendance Rate
                      </span>
                    </div>
                  </div>

                  {/* Division Subject Reports List */}
                  <div className="mt-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">Class Subjects & Present Count:</span>
                    {rep.subjects.map((sub, idx) => (
                      <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.code}: {sub.name}</span>
                          <span className="text-[10px] text-slate-400">{sub.faculty}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-emerald-700 block">{sub.present} / {sub.total}</span>
                          <span className="text-[9px] text-slate-500 font-semibold">{sub.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Card Footer Warning Status */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 flex items-center space-x-1">
                    <AlertTriangle className={`w-3.5 h-3.5 ${rep.shortageRiskCount > 3 ? 'text-amber-500' : 'text-slate-400'}`} />
                    <span><strong>{rep.shortageRiskCount}</strong> Shortage Risks (&lt;75%)</span>
                  </span>
                  <button 
                    onClick={() => {
                      setToastMessage(`HOD Notice circulated for ${rep.batchName}`);
                      setTimeout(() => setToastMessage(null), 4000);
                    }}
                    className="text-purple-700 hover:text-purple-900 font-bold flex items-center space-x-1"
                  >
                    <span>Issue Circular</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* SECTION 2: DAILY UPDATES FROM EACH FACULTY & TOTAL PRESENT COUNT MATRIX */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Faculty Daily Class Attendance Reports</h2>
              <p className="text-xs text-slate-500">Live updates of total students present & absent submitted by each faculty member today</p>
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

      {/* SECTION 3: ASSIGNED FACULTIES DIRECTORY & ONBOARDING SYSTEM */}
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
