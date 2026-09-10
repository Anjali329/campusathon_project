import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Award, 
  PlusCircle, 
  Upload, 
  UserCheck, 
  Bell, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function FacultyDashboard({ setActiveTab, onOpenGradeModal, onOpenPublishNoticeModal }) {
  const [schedule, setSchedule] = useState([
    { id: "lec-1", time: "10:00 AM - 11:00 AM", subjectCode: "CS601", subjectName: "Operating Systems", room: "Lecture Hall LT-3", batch: "B.Tech CSE - 6th Sem (Sec A)", totalStudents: 60, status: "Completed", markedAttendance: true },
    { id: "lec-2", time: "11:15 AM - 12:15 PM", subjectCode: "CS604", subjectName: "Machine Learning", room: "Lecture Hall LT-2", batch: "B.Tech CSE - 6th Sem (Sec A)", totalStudents: 58, status: "Upcoming Today", markedAttendance: false },
    { id: "lec-3", time: "03:15 PM - 05:15 PM", subjectCode: "CS604L", subjectName: "Machine Learning Lab", room: "Computer Lab 4", batch: "B.Tech CSE - 6th Sem (Sec B)", totalStudents: 30, status: "Scheduled", markedAttendance: false },
  ]);

  const [defaulters, setDefaulters] = useState([
    { id: "STU-1042", roll: "21BCE1042", name: "Rahul Sharma", courseCode: "CS601", percentage: 68.5, attended: 24, total: 35, status: "Critical Risk" },
    { id: "STU-1088", roll: "21BCE1088", name: "Anish Kapoor", courseCode: "CS601", percentage: 64.2, attended: 22, total: 35, status: "Critical Risk" },
    { id: "STU-1092", roll: "21BCE1092", name: "Pooja Verma", courseCode: "CS604L", percentage: 61.3, attended: 19, total: 31, status: "Critical Risk" },
  ]);

  const [evaluations, setEvaluations] = useState([
    { id: "sub-101", assignmentTitle: "ML Lab Assignment 4", subject: "CS604 Machine Learning", studentRoll: "21BCE1042", studentName: "Rahul Sharma", submittedFile: "Rahul_Sharma_ML_Lab4.pdf", submittedAt: "Today, 06:15 PM", maxMarks: 50, evaluated: false },
    { id: "sub-102", assignmentTitle: "OS Page Replacement Simulator", subject: "CS601 Operating Systems", studentRoll: "21BCE1088", studentName: "Anish Kapoor", submittedFile: "Anish_OS_Simulator.zip", submittedAt: "Yesterday, 09:30 PM", maxMarks: 100, evaluated: false },
  ]);

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Fetch live backend data if available
    api.getFacultySchedule().then(res => {
      if (res.success && res.schedule) setSchedule(res.schedule);
    }).catch(() => {});

    api.getFacultyDefaulters().then(res => {
      if (res.success && res.data?.defaultersList) setDefaulters(res.data.defaultersList);
    }).catch(() => {});

    api.getFacultyEvaluations().then(res => {
      if (res.success && res.evaluations) setEvaluations(res.evaluations);
    }).catch(() => {});
  }, []);

  const handleIssueWarning = (student) => {
    api.issueWarningNotice({ studentId: student.id, studentName: student.name, courseCode: student.courseCode }).then(res => {
      setToastMessage(res.message || `Shortage warning notice dispatched to ${student.name}`);
      setTimeout(() => setToastMessage(null), 4000);
    });
  };

  const handleMarkAttendanceClick = (lec) => {
    setActiveTab('attendance');
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-semibold shadow-md flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center space-x-1">
                <UserCheck className="w-3 h-3" />
                <span>FACULTY COMMAND CENTER</span>
              </span>
              <span className="text-xs text-slate-300">Department of Computer Science</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome Back, Prof. Ananya Sen 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Manage today's lectures, class attendance logs, defaulter lists, assignment grading queues, and exam timetables.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button 
              onClick={() => setActiveTab('assignments')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-sm flex items-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
            <button 
              onClick={() => setActiveTab('exams')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Upload className="w-4 h-4 text-purple-400" />
              <span>Upload Exam Schedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: TODAY'S ASSIGNED LECTURES SCHEDULE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Today's Assigned Lectures & Schedule</h2>
              <p className="text-xs text-slate-500">Your assigned teaching classes for today</p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schedule.map((lec) => (
            <div key={lec.id} className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-white transition space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-md">
                  {lec.subjectCode}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  lec.markedAttendance ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {lec.markedAttendance ? '✓ Attendance Logged' : 'Pending Attendance'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{lec.subjectName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{lec.batch}</p>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                <div className="flex items-center space-x-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{lec.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lec.room}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{lec.totalStudents} Enrolled Students</span>
                </div>
              </div>

              <button 
                onClick={() => handleMarkAttendanceClick(lec)}
                className={`w-full text-xs font-bold py-2 rounded-xl border transition flex items-center justify-center space-x-1.5 ${
                  lec.markedAttendance 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-2xs'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{lec.markedAttendance ? 'Edit Class Attendance' : 'Mark Attendance Now'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: TWO COLUMN LAYOUT (DEFAULTER LIST & ASSIGNMENT GRADING QUEUE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DEFAULTER LIST (<75% ATTENDANCE THRESHOLD) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Attendance Defaulter List (&lt;75%)</h2>
                  <p className="text-xs text-slate-500">Students with critical attendance shortfall under your subjects</p>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('attendance')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Full List</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {defaulters.map((st) => (
                <div key={st.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({st.roll})</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Course: <strong>{st.courseCode}</strong> • Attended: {st.attended}/{st.total} classes
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="font-bold text-red-600 text-sm block">{st.percentage}%</span>
                      <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1.5 py-0.5 rounded">Critical Risk</span>
                    </div>

                    <button 
                      onClick={() => handleIssueWarning(st)}
                      title="Dispatch warning notice to student"
                      className="p-1.5 text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition flex items-center space-x-1 text-[11px] font-bold"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Warn</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Minimum Exam Requirement: <strong>75.0%</strong></span>
            <span className="text-red-600 font-bold">{defaulters.length} Students At Risk</span>
          </div>
        </div>

        {/* ASSIGNMENT SUBMISSIONS AWAITING FACULTY EVALUATION */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Submissions To Verify & Grade</h2>
                  <p className="text-xs text-slate-500">Student assignment solutions awaiting marks evaluation</p>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('assignments')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>Assignments Tab</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {evaluations.map((sub) => (
                <div key={sub.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {sub.subject}
                    </span>
                    <h4 className="font-bold text-slate-900 text-xs mt-1">{sub.assignmentTitle}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Student: <strong>{sub.studentName}</strong> ({sub.studentRoll})
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1.5">
                    <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
                    <button 
                      onClick={() => setActiveTab('assignments')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Verify & Grade</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending Evaluation Queue</span>
            <span className="font-bold text-emerald-600">{evaluations.length} Solution Files</span>
          </div>
        </div>

      </div>

      {/* QUICK FACULTY ACTION TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveTab('assignments')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer flex items-center space-x-3"
        >
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Create Assignment</h4>
            <p className="text-[10px] text-slate-500">Publish task for class</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('exams')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-md transition cursor-pointer flex items-center space-x-3"
        >
          <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
            <Upload className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Upload Exam Schedule</h4>
            <p className="text-[10px] text-slate-500">Update exam timetables</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('attendance')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-md transition cursor-pointer flex items-center space-x-3"
        >
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Mark Attendance</h4>
            <p className="text-[10px] text-slate-500">Manual & RFID Logging</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('notices')}
          className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex items-center space-x-3"
        >
          <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Broadcast Notice</h4>
            <p className="text-[10px] text-slate-500">Post department notice</p>
          </div>
        </div>
      </div>

    </div>
  );
}
