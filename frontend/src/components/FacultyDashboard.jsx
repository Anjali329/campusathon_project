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
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';

export default function FacultyDashboard({ user, setActiveTab, onOpenGradeModal, onOpenPublishNoticeModal }) {
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

  // Defaulter subject filter state
  const [selectedDefaulterSubject, setSelectedDefaulterSubject] = useState('All');

  // Modals inside FacultyDashboard
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false);
  const [selectedSubForGrade, setSelectedSubForGrade] = useState(null);
  const [isAddLectureOpen, setIsAddLectureOpen] = useState(false);

  // New Assignment form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('CS601 Operating Systems');
  const [newDueDate, setNewDueDate] = useState('');
  const [newWeightage, setNewWeightage] = useState('15%');
  const [newMaxMarks, setNewMaxMarks] = useState('50');
  const [newInstructions, setNewInstructions] = useState('');

  // Grade Modal form state
  const [marksInput, setMarksInput] = useState('48');
  const [gradeInput, setGradeInput] = useState('A+');
  const [feedbackInput, setFeedbackInput] = useState('Well executed logic and clean code documentation.');

  // New Lecture form state
  const [newLecCode, setNewLecCode] = useState('CS602');
  const [newLecName, setNewLecName] = useState('Computer Networks');
  const [newLecTime, setNewLecTime] = useState('02:00 PM - 03:00 PM');
  const [newLecRoom, setNewLecRoom] = useState('Lecture Hall LT-4');
  const [newLecBatch, setNewLecBatch] = useState('B.Tech CSE - 6th Sem (Sec A)');
  const [newLecStudents, setNewLecStudents] = useState('60');

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

  const handleCreateAssignmentSubmit = (e) => {
    e.preventDefault();
    const created = {
      id: `asg-${Date.now()}`,
      title: newTitle || 'New Practical Assignment',
      subject: newSubject,
      faculty: user?.name || 'Prof. Ananya Sen',
      dueDate: newDueDate || 'Next Week',
      maxMarks: parseInt(newMaxMarks) || 50,
      weightage: newWeightage,
      status: 'Pending',
      instructions: newInstructions || 'Complete according to guidelines.',
    };

    api.publishExamSlot(created).catch(() => {});
    setIsCreateAssignmentOpen(false);
    setToastMessage(`Assignment '${created.title}' published successfully to student portal!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    if (!selectedSubForGrade) return;

    api.gradeSubmission({
      submissionId: selectedSubForGrade.id,
      score: marksInput,
      grade: gradeInput,
      feedback: feedbackInput
    }).catch(() => {});

    setEvaluations(evaluations.filter(ev => ev.id !== selectedSubForGrade.id));
    setSelectedSubForGrade(null);
    setToastMessage(`Evaluation verified: Marks (${marksInput}/${selectedSubForGrade.maxMarks}) & Grade (${gradeInput}) saved!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddLectureSubmit = (e) => {
    e.preventDefault();
    const newLec = {
      id: `lec-${Date.now()}`,
      time: newLecTime,
      subjectCode: newLecCode,
      subjectName: newLecName,
      room: newLecRoom,
      batch: newLecBatch,
      totalStudents: parseInt(newLecStudents) || 60,
      status: "Upcoming Today",
      markedAttendance: false
    };
    setSchedule([...schedule, newLec]);
    setIsAddLectureOpen(false);
    setToastMessage(`New lecture slot for ${newLecName} added to today's schedule!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const safeSchedule = Array.isArray(schedule) ? schedule : [];
  const safeDefaulters = Array.isArray(defaulters) ? defaulters : [];
  const safeEvaluations = Array.isArray(evaluations) ? evaluations : [];

  const completedCount = safeSchedule.filter(s => s && s.markedAttendance).length;
  const totalCount = safeSchedule.length;
  const facultyName = user?.name || "Prof. Ananya Sen";

  const filteredDefaulters = safeDefaulters.filter(st => {
    if (!st) return false;
    if (selectedDefaulterSubject === 'All') return true;
    const code = st.courseCode || st.subject || st.code || '';
    return code.toLowerCase().includes(selectedDefaulterSubject.toLowerCase());
  });

  const facultyModules = [
    {
      id: 'attendance',
      title: "Today's Schedule & Attendance",
      sub: `${totalCount} Classes Scheduled Today • LT-3, LT-2, Lab 4`,
      icon: UserCheck,
      iconBg: 'bg-emerald-500',
      iconColor: 'text-white',
      badge: `${totalCount} Classes Today`,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold',
    },
    {
      id: 'assignments',
      title: 'Assignments & Marking Queue',
      sub: 'Publish Tasks & Evaluate Student Solution Uploads',
      icon: FileText,
      iconBg: 'bg-blue-500',
      iconColor: 'text-white',
      badge: `${safeEvaluations.length} Solution Files`,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200 font-bold',
    },
    {
      id: 'exams',
      title: 'Examination & Timetables',
      sub: 'Upload Exam Schedules, Room Venues & Seat Allocations',
      icon: BookOpen,
      iconBg: 'bg-indigo-500',
      iconColor: 'text-white',
      badge: 'Timetable Control',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200 font-bold',
    },
    {
      id: 'notices',
      title: 'Department Notices & Warning Alerts',
      sub: 'Post Smart NLP Notices & Issue Attendance Shortage Warnings',
      icon: Bell,
      iconBg: 'bg-purple-500',
      iconColor: 'text-white',
      badge: 'Broadcast Notice',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200 font-bold',
    },
    {
      id: 'dashboard',
      title: 'Smart Command Center',
      sub: 'AI Priority Engine & Department Workload Analytics',
      icon: Zap,
      iconBg: 'bg-amber-500',
      iconColor: 'text-white',
      badge: 'AI Priority Engine',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200 font-bold',
    },
    {
      id: 'timeline',
      title: 'Academic Stream & Time Table',
      sub: 'Unified Department Teaching Timeline & Schedule Stream',
      icon: Clock,
      iconBg: 'bg-blue-600',
      iconColor: 'text-white',
      badge: 'Live Schedule',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
    },
    {
      id: 'events',
      title: 'Campus Events & Workshops',
      sub: 'Department Hackathons, Guest Lectures & RSVPs',
      icon: Calendar,
      iconBg: 'bg-rose-500',
      iconColor: 'text-white',
      badge: 'Campus Events',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
    },
    {
      id: 'portfolio',
      title: 'Student Portfolios & Verification',
      sub: 'Review Student Achievements, Projects & Verified Records',
      icon: Award,
      iconBg: 'bg-cyan-500',
      iconColor: 'text-white',
      badge: 'ERP Verification',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200 font-bold',
    },
  ];

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
              Welcome Back, {facultyName} 👋
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Manage today's lectures schedule, class attendance logs, defaulter lists, assignment grading queues, and exam timetables.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button 
              onClick={() => setIsCreateAssignmentOpen(true)}
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

      {/* FACULTY INTERACTIVE CLICKABLE MODULES GRID (HOME PAGE STYLE) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Faculty Portal Modules</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click any module to launch task workspace</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {facultyModules.map((mod) => {
            const IconComponent = mod.icon;
            return (
              <div 
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-xl ${mod.iconBg} ${mod.iconColor} shadow-xs group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    {mod.badge && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border ${mod.badgeColor}`}>
                        {mod.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {mod.sub}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-600 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Module</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: TODAY'S ASSIGNED LECTURES SCHEDULE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900">Today's Assigned Lectures & Schedule</h2>
                <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200">
                  {totalCount} Lectures Today
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {completedCount} Completed • {totalCount - completedCount} Upcoming Pending
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsAddLectureOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl border border-blue-200 transition flex items-center space-x-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add Lecture Slot</span>
            </button>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeSchedule.length === 0 ? (
            <div className="col-span-3 py-6 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-2xl">
              No lecture classes scheduled for today.
            </div>
          ) : (
            safeSchedule.map((lec) => (
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
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: TWO COLUMN LAYOUT (DEFAULTER LIST & ASSIGNMENT GRADING QUEUE) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DEFAULTER LIST (<75% ATTENDANCE THRESHOLD) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Attendance Defaulter List (&lt;75%)</h2>
                  <p className="text-xs text-slate-500">Students with critical attendance shortfall by subject</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <select 
                  value={selectedDefaulterSubject}
                  onChange={(e) => setSelectedDefaulterSubject(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-2.5 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="All">All Subjects</option>
                  <option value="CS601">CS601 OS</option>
                  <option value="CS604">CS604 ML</option>
                  <option value="CS604L">CS604L Lab</option>
                </select>

                <button 
                  onClick={() => setActiveTab('attendance')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <span>Full List</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredDefaulters.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 font-medium">
                  No defaulters found under selected subject.
                </div>
              ) : (
                filteredDefaulters.map((st) => (
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
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Minimum Exam Requirement: <strong>75.0%</strong></span>
            <span className="text-red-600 font-bold">{filteredDefaulters.length} Students At Risk</span>
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
              {safeEvaluations.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-2xl">
                  No pending student solutions in evaluation queue.
                </div>
              ) : (
                safeEvaluations.map((sub) => (
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
                        onClick={() => setSelectedSubForGrade(sub)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1 shadow-2xs"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Verify & Grade</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Pending Evaluation Queue</span>
            <span className="font-bold text-emerald-600">{safeEvaluations.length} Solution Files</span>
          </div>
        </div>

      </div>

      {/* QUICK FACULTY ACTION TILES */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          onClick={() => setIsCreateAssignmentOpen(true)}
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

      {/* MODAL 1: CREATE & PUBLISH ASSIGNMENT */}
      {isCreateAssignmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <span>Create & Publish New Assignment</span>
              </h3>
              <button onClick={() => setIsCreateAssignmentOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateAssignmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Assignment Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. OS Page Replacement Simulator" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject</label>
                  <select 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option>CS601 Operating Systems</option>
                    <option>CS604 Machine Learning</option>
                    <option>CS604L Machine Learning Lab</option>
                    <option>CS602 Computer Networks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Submission Due Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 18 Sep 2026, 05:00 PM" 
                    value={newDueDate} 
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Weightage (%)</label>
                  <input 
                    type="text" 
                    placeholder="15%" 
                    value={newWeightage} 
                    onChange={(e) => setNewWeightage(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Max Evaluation Marks</label>
                  <input 
                    type="number" 
                    placeholder="50" 
                    value={newMaxMarks} 
                    onChange={(e) => setNewMaxMarks(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Instructions & Requirements</label>
                <textarea 
                  rows={3}
                  placeholder="Enter problem requirements..." 
                  value={newInstructions} 
                  onChange={(e) => setNewInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreateAssignmentOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: VERIFY & GRADE SUBMISSION */}
      {selectedSubForGrade && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Verify & Allot Marks</span>
              </h3>
              <button onClick={() => setSelectedSubForGrade(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedSubForGrade.assignmentTitle || selectedSubForGrade.title}</p>
              <p className="text-slate-600">Subject: <strong>{selectedSubForGrade.subject}</strong></p>
              <p className="text-slate-600">Student: <strong>{selectedSubForGrade.studentName}</strong> ({selectedSubForGrade.studentRoll})</p>
              <p className="text-slate-600">Submitted File: <span className="font-mono text-blue-700">{selectedSubForGrade.submittedFile || 'Solution.pdf'}</span></p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Enter Marks (Out of {selectedSubForGrade.maxMarks || 50})</label>
                  <input 
                    type="number" 
                    max={selectedSubForGrade.maxMarks || 50}
                    required
                    value={marksInput} 
                    onChange={(e) => setMarksInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assign Letter Grade</label>
                  <select 
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                  >
                    <option>O (Outstanding)</option>
                    <option>A+ (Excellent)</option>
                    <option>A (Very Good)</option>
                    <option>B+ (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Faculty Evaluation Remarks</label>
                <textarea 
                  rows={3}
                  value={feedbackInput} 
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setSelectedSubForGrade(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save & Verify Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW LECTURE SLOT */}
      {isAddLectureOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Add Lecture Slot To Today's Schedule</span>
              </h3>
              <button onClick={() => setIsAddLectureOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddLectureSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Subject Code</label>
                  <input 
                    type="text" 
                    required
                    value={newLecCode} 
                    onChange={(e) => setNewLecCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Time Slot</label>
                  <input 
                    type="text" 
                    required
                    value={newLecTime} 
                    onChange={(e) => setNewLecTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Subject Name</label>
                <input 
                  type="text" 
                  required
                  value={newLecName} 
                  onChange={(e) => setNewLecName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Classroom / Lab</label>
                  <input 
                    type="text" 
                    required
                    value={newLecRoom} 
                    onChange={(e) => setNewLecRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Enrolled Students</label>
                  <input 
                    type="number" 
                    required
                    value={newLecStudents} 
                    onChange={(e) => setNewLecStudents(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Batch / Semester</label>
                <input 
                  type="text" 
                  required
                  value={newLecBatch} 
                  onChange={(e) => setNewLecBatch(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddLectureOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Add Lecture Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
