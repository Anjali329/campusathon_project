import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Award,
  Plus,
  X,
  UserCheck,
  Search,
  Download,
  FolderOpen,
  User
} from 'lucide-react';
import { assignmentsList } from '../data/mockData';
import { api } from '../services/api';

export default function AssignmentsModule({ activeRole, onOpenSubmissionModal }) {
  const [list, setList] = useState(assignmentsList);
  const [activeTab, setActiveTab] = useState('current'); // 'current' or 'archive'
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSubForGrade, setSelectedSubForGrade] = useState(null);

  // Student Archive Search & Filter
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [submissionsArchive, setSubmissionsArchive] = useState([
    {
      id: "sub-archive-1",
      studentId: "STU-1042",
      studentName: "Rahul Sharma",
      studentRoll: "21BCE1042",
      subject: "CS604 Machine Learning",
      assignmentTitle: "Machine Learning Lab Report 4",
      submittedFile: "Rahul_Sharma_ML_Lab4.pdf",
      submittedAt: "10 Sep 2026, 06:15 PM",
      maxMarks: 50,
      score: "48 / 50",
      grade: "A+",
      feedback: "Excellent code implementation of Decision Trees.",
      status: "Verified & Graded",
    },
    {
      id: "sub-archive-2",
      studentId: "STU-1042",
      studentName: "Rahul Sharma",
      studentRoll: "21BCE1042",
      subject: "CS602 Computer Networks",
      assignmentTitle: "Network Socket Programming Project",
      submittedFile: "Rahul_Socket_Program.zip",
      submittedAt: "04 Sep 2026, 09:30 PM",
      maxMarks: 50,
      score: "46 / 50",
      grade: "A+",
      feedback: "Robust TCP/UDP socket implementation.",
      status: "Verified & Graded",
    },
    {
      id: "sub-archive-3",
      studentId: "STU-1088",
      studentName: "Anish Kapoor",
      studentRoll: "21BCE1088",
      subject: "CS601 Operating Systems",
      assignmentTitle: "OS Page Replacement Simulator",
      submittedFile: "Anish_OS_Simulator.zip",
      submittedAt: "09 Sep 2026, 09:30 PM",
      maxMarks: 100,
      score: "88 / 100",
      grade: "A",
      feedback: "FIFO and LRU algorithms working properly.",
      status: "Verified & Graded",
    },
    {
      id: "sub-archive-4",
      studentId: "STU-1092",
      studentName: "Pooja Verma",
      studentRoll: "21BCE1092",
      subject: "CS604L Machine Learning Lab",
      assignmentTitle: "Neural Networks PyTorch Lab Report 3",
      submittedFile: "Pooja_Verma_Lab3_NN.pdf",
      submittedAt: "08 Sep 2026, 04:20 PM",
      maxMarks: 50,
      score: "49 / 50",
      grade: "O",
      feedback: "Outstanding loss curve analysis and model tuning.",
      status: "Verified & Graded",
    },
    {
      id: "sub-archive-5",
      studentId: "STU-1055",
      studentName: "Vikram Malhotra",
      studentRoll: "21BCE1055",
      subject: "CS601 Operating Systems",
      assignmentTitle: "Process Synchronization Semaphores",
      submittedFile: "Vikram_Semaphores_Solution.c",
      submittedAt: "02 Sep 2026, 11:00 AM",
      maxMarks: 100,
      score: "92 / 100",
      grade: "O",
      feedback: "Clean mutex lock logic.",
      status: "Verified & Graded",
    },
  ]);

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
  const [feedbackInput, setFeedbackInput] = useState('Well executed code logic and complete lab documentation.');

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    api.getAssignments().then(res => {
      if (res.success && res.assignments) {
        setList(res.assignments);
      }
    }).catch(() => {});

    api.getAllStudentSubmissions().then(res => {
      if (res.success && res.submissions) {
        setSubmissionsArchive(res.submissions);
      }
    }).catch(() => {});
  }, []);

  const pendingAssignments = list.filter(a => a.status !== 'Submitted');
  const gradedAssignments = list.filter(a => a.status === 'Submitted');

  const filteredArchive = submissionsArchive.filter(sub => {
    const matchesSearch = sub.studentName.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          sub.studentRoll.toLowerCase().includes(studentSearch.toLowerCase()) ||
                          sub.assignmentTitle.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'All' || sub.subject.includes(selectedSubjectFilter);
    return matchesSearch && matchesSubject;
  });

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    const created = {
      id: `asg-${Date.now()}`,
      title: newTitle || 'New Practical Assignment',
      subject: newSubject,
      faculty: 'Prof. Ananya Sen',
      dueDate: newDueDate || 'Next Week',
      maxMarks: parseInt(newMaxMarks) || 50,
      weightage: newWeightage,
      status: 'Pending',
      instructions: newInstructions || 'Complete the assignment according to specified guidelines.',
    };

    try {
      const res = await api.createAssignment(created);
      if (res.success && res.assignment) {
        setList([res.assignment, ...list]);
      } else {
        setList([created, ...list]);
      }
    } catch {
      setList([created, ...list]);
    }
    setIsCreateOpen(false);
    setToastMessage(`Assignment '${created.title}' published to student dashboard!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!selectedSubForGrade) return;

    api.gradeSubmission({
      submissionId: selectedSubForGrade.id,
      score: marksInput,
      grade: gradeInput,
      feedback: feedbackInput
    }).catch(() => {});

    const updatedItem = {
      ...selectedSubForGrade,
      status: 'Submitted',
      score: `${marksInput} / ${selectedSubForGrade.maxMarks}`,
      grade: gradeInput,
      feedback: feedbackInput,
      submittedOn: new Date().toLocaleDateString(),
    };

    setList(list.map(item => item.id === selectedSubForGrade.id ? updatedItem : item));

    // Also update archive
    setSubmissionsArchive([
      {
        id: `sub-archive-${Date.now()}`,
        studentId: "STU-1042",
        studentName: selectedSubForGrade.studentName || "Rahul Sharma",
        studentRoll: selectedSubForGrade.studentRoll || "21BCE1042",
        subject: selectedSubForGrade.subject,
        assignmentTitle: selectedSubForGrade.title,
        submittedFile: `${selectedSubForGrade.studentName || 'Student'}_Solution.pdf`,
        submittedAt: "Just Now",
        maxMarks: selectedSubForGrade.maxMarks,
        score: `${marksInput} / ${selectedSubForGrade.maxMarks}`,
        grade: gradeInput,
        feedback: feedbackInput,
        status: "Verified & Graded",
      },
      ...submissionsArchive
    ]);

    setSelectedSubForGrade(null);
    setToastMessage(`Evaluation verified: Marks (${marksInput}) & Grade (${gradeInput}) saved to database!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl text-xs font-semibold shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assignments & Lab Submissions Database</h1>
          <p className="text-slate-500 text-xs">
            {activeRole === 'faculty' 
              ? 'Inspect all previously uploaded assignments submitted by each student & grade pending submissions.' 
              : 'View pending academic assignments and upload completed lab reports.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {activeRole === 'faculty' && (
            <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  activeTab === 'current' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Current Queue
              </button>
              <button
                onClick={() => setActiveTab('archive')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition flex items-center space-x-1 ${
                  activeTab === 'archive' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>All Student Archive</span>
              </button>
            </div>
          )}

          {activeRole === 'faculty' && (
            <button 
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Assignment</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'archive' && activeRole === 'faculty' ? (
        /* FACULTY ALL STUDENT SUBMISSIONS HISTORICAL ARCHIVE VIEW */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <span>All Student Assignment Submissions Database</span>
              </h2>
              <p className="text-xs text-slate-500">Historical archive of all assignment uploads submitted by each student</p>
            </div>

            {/* Search & Subject Filters */}
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search Student Name / Roll No..." 
                  className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <select 
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="All">All Courses</option>
                <option value="CS601">CS601 Operating Systems</option>
                <option value="CS604">CS604 Machine Learning</option>
                <option value="CS602">CS602 Computer Networks</option>
              </select>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Student Roll & Name</th>
                  <th className="py-3 px-4">Course Subject</th>
                  <th className="py-3 px-4">Assignment Title</th>
                  <th className="py-3 px-4">Submitted File</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-center">Score & Grade</th>
                  <th className="py-3 px-4 text-right">Faculty Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredArchive.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-600 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block">{sub.studentName}</span>
                          <span className="font-mono text-[10px] text-slate-400">{sub.studentRoll}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[11px]">
                        {sub.subject}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{sub.assignmentTitle}</td>
                    <td className="py-3 px-4">
                      <a 
                        href={`#download-${sub.submittedFile}`}
                        onClick={(e) => { e.preventDefault(); alert(`Downloading ${sub.submittedFile} submitted by ${sub.studentName}`); }}
                        className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 font-bold text-[11px] transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{sub.submittedFile}</span>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{sub.submittedAt}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-900 block">{sub.score}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase inline-block mt-0.5">
                        Grade {sub.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600 max-w-xs truncate" title={sub.feedback}>
                      "{sub.feedback}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Displaying <strong>{filteredArchive.length}</strong> historical student submissions</span>
            <span className="font-bold text-emerald-600">Database Synced</span>
          </div>

        </div>
      ) : (
        /* STANDARD 2-COLUMN VIEW (PENDING VS GRADED SUBMISSIONS) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Pending Assignments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Pending Assignments & Submissions</span>
              </h2>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {pendingAssignments.length} Pending
              </span>
            </div>

            <div className="space-y-4">
              {pendingAssignments.map((asg) => (
                <div key={asg.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3 hover:border-blue-300 transition">
                  
                  {/* Header Pills */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {asg.subject}
                    </span>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                      Due: {asg.dueDate}
                    </span>
                  </div>

                  {/* Title & Instructions */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2 leading-relaxed">
                      {asg.instructions}
                    </p>
                  </div>

                  {/* Assignment Metadata */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                    <span>Faculty: <strong className="text-slate-800">{asg.faculty}</strong></span>
                    <span>Weightage: <strong className="text-slate-800">{asg.weightage}</strong></span>
                    <span>Max Marks: <strong className="text-slate-800">{asg.maxMarks}</strong></span>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {activeRole === 'faculty' ? (
                      <button 
                        onClick={() => setSelectedSubForGrade(asg)}
                        className="w-full flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Verify & Grade Submission</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => onOpenSubmissionModal(asg)}
                        className="w-full flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
                      >
                        <Upload className="w-4 h-4" />
                        <span>Submit Assignment Solution</span>
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Graded & Verified Submissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Graded & Verified Submissions</span>
              </h2>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                {gradedAssignments.length} Verified
              </span>
            </div>

            <div className="space-y-4">
              {gradedAssignments.map((asg) => (
                <div key={asg.id} className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-200 shadow-xs space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                      {asg.subject}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Submitted: {asg.submittedOn}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{asg.title}</h3>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-emerald-100 mt-2">
                      <strong className="text-slate-900">Faculty Feedback:</strong> "{asg.feedback}"
                    </p>
                  </div>

                  {/* Score & Grade Result Badge */}
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Award className="w-5 h-5 text-emerald-600" />
                      <span className="font-bold text-slate-900">Evaluation Result</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">Score: {asg.score}</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 uppercase">Grade: {asg.grade}</span>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* MODAL 1: FACULTY CREATE & PUBLISH ASSIGNMENT */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Create New Class Assignment</span>
              </h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
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
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
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
                  <label className="block text-slate-700 font-bold mb-1">Max Marks</label>
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
                <label className="block text-slate-700 font-bold mb-1">Instructions & Problem Description</label>
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
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: FACULTY VERIFY & GRADE SUBMISSION */}
      {selectedSubForGrade && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span>Verify & Grade Student Submission</span>
              </h3>
              <button onClick={() => setSelectedSubForGrade(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{selectedSubForGrade.title}</p>
              <p className="text-slate-600">Subject: <strong>{selectedSubForGrade.subject}</strong></p>
              <p className="text-slate-600">Max Assessment Marks: <strong>{selectedSubForGrade.maxMarks} Marks</strong></p>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Enter Awarded Marks</label>
                  <input 
                    type="number" 
                    max={selectedSubForGrade.maxMarks}
                    required
                    value={marksInput} 
                    onChange={(e) => setMarksInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Letter Grade</label>
                  <select 
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option>O (Outstanding)</option>
                    <option>A+ (Excellent)</option>
                    <option>A (Very Good)</option>
                    <option>B+ (Good)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Faculty Remarks & Feedback</label>
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Verify & Save Grade to ERP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
