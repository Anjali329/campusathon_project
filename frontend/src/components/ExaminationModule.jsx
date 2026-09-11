import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Award, 
  FileText, 
  Download, 
  Plus, 
  CheckCircle2,
  X
} from 'lucide-react';
import { upcomingExams, currentUser } from '../data/mockData';
import { api } from '../services/api';

export default function ExaminationModule({ activeRole, user }) {
  const [activeSubTab, setActiveSubTab] = useState('timetable'); // 'timetable' or 'gradecards'
  const [selectedSem, setSelectedSem] = useState('Sem 5');
  const profile = user || currentUser;
  
  // Faculty timetable entries state
  const [examTimetable, setExamTimetable] = useState([
    {
      id: "ex-1",
      code: "CS602",
      subject: "Computer Networks",
      type: "Mid-Term Written Exam",
      date: "13 Sep 2026",
      time: "10:00 AM - 12:00 PM",
      venue: "Lecture Hall LT-3",
      seatNo: "LT3-B-42",
      updatedBy: "Dr. R. P. Gupta (Faculty)",
      updatedOn: "08 Sep 2026",
    },
    {
      id: "ex-2",
      code: "CS601",
      subject: "Operating Systems",
      type: "Mid-Term Written Exam",
      date: "16 Sep 2026",
      time: "02:00 PM - 04:00 PM",
      venue: "Exam Block Hall-A",
      seatNo: "HA-118",
      updatedBy: "Prof. Ananya Sen (Faculty)",
      updatedOn: "07 Sep 2026",
    },
    {
      id: "ex-3",
      code: "CS604",
      subject: "Machine Learning Practical",
      type: "Lab Examination",
      date: "19 Sep 2026",
      time: "09:00 AM - 01:00 PM",
      venue: "Computer Lab 4",
      seatNo: "LAB4-08",
      updatedBy: "Prof. Ananya Sen (Faculty)",
      updatedOn: "09 Sep 2026",
    },
  ]);

  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [newSubject, setNewSubject] = useState('CS603: Design & Analysis of Algorithms');
  const [newType, setNewType] = useState('Mid-Term Written Exam');
  const [newDate, setNewDate] = useState('2026-09-22');
  const [newTime, setNewTime] = useState('10:00 AM - 12:00 PM');
  const [newVenue, setNewVenue] = useState('Lecture Hall LT-1');
  const [newSeat, setNewSeat] = useState('LT1-A-15');

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    api.getExamsTimetable().then(res => {
      if (res.success && res.timetable) {
        setExamTimetable(res.timetable);
      }
    }).catch(() => {});
  }, []);

  const handleAddExam = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `ex-${Date.now()}`,
      code: newSubject.split(':')[0].trim(),
      subject: (newSubject.split(':')[1] || newSubject).trim(),
      type: newType,
      date: newDate,
      time: newTime,
      venue: newVenue,
      seatNo: newSeat,
      updatedBy: "Prof. Ananya Sen (Faculty)",
      updatedOn: "Just Now",
    };

    api.publishExamSlot(newEntry).catch(() => {});

    setExamTimetable(prev => [newEntry, ...prev]);
    setShowAddExamModal(false);
    setToastMessage(`Exam timetable slot for '${newEntry.subject}' published successfully!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mock grade card datasets for semesters
  const gradeCards = {
    'Sem 5': {
      sgpa: 9.10,
      totalCredits: 22,
      status: "Passed with Distinction",
      courses: [
        { code: "CS501", name: "Database Management Systems", credits: 4, grade: "O", points: 10, marks: 92 },
        { code: "CS502", name: "Theory of Computation", credits: 4, grade: "A+", points: 9, marks: 86 },
        { code: "CS503", name: "Software Engineering", credits: 3, grade: "O", points: 10, marks: 95 },
        { code: "CS504L", name: "DBMS Lab", credits: 2, grade: "O", points: 10, marks: 98 },
        { code: "CS505", name: "Artificial Intelligence", credits: 4, grade: "A+", points: 9, marks: 88 },
        { code: "CS506", name: "Open Elective: Environmental Sci", credits: 5, grade: "A", points: 8, marks: 81 },
      ]
    },
    'Sem 4': {
      sgpa: 8.70,
      totalCredits: 24,
      status: "Passed First Class",
      courses: [
        { code: "CS401", name: "Discrete Mathematics", credits: 4, grade: "A+", points: 9, marks: 85 },
        { code: "CS402", name: "Microprocessors & Interfacing", credits: 4, grade: "A", points: 8, marks: 78 },
        { code: "CS403", name: "Object Oriented Programming", credits: 4, grade: "O", points: 10, marks: 91 },
        { code: "CS404L", name: "OOP Java Lab", credits: 2, grade: "O", points: 10, marks: 96 },
      ]
    },
    'Sem 3': {
      sgpa: 8.90,
      totalCredits: 23,
      status: "Passed First Class",
      courses: [
        { code: "CS301", name: "Data Structures & Algorithms", credits: 4, grade: "O", points: 10, marks: 94 },
        { code: "CS302", name: "Digital Logic Design", credits: 4, grade: "A+", points: 9, marks: 88 },
      ]
    }
  };

  const currentGradeCard = gradeCards[selectedSem] || gradeCards['Sem 5'];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      
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
          <h1 className="text-xl font-bold text-slate-900">Examinations & Semester Grade Cards</h1>
          <p className="text-slate-500 text-xs">Faculty-updated examination timetables and official semester marksheets.</p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveSubTab('timetable')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'timetable' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Exam Timetable</span>
          </button>

          <button 
            onClick={() => setActiveSubTab('gradecards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'gradecards' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Semester Grade Cards</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'timetable' ? (
        <div className="space-y-4">
          
          {/* Timetable Header & Faculty Action */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Official Examination Schedule • Autumn 2026</span>
              <p className="text-[11px] text-slate-500">Timetables are updated in real-time directly by respective subject faculty.</p>
            </div>

            {activeRole === 'faculty' && (
              <button 
                onClick={() => setShowAddExamModal(true)}
                className="flex items-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Upload / Edit Exam Timetable</span>
              </button>
            )}
          </div>

          {/* Exam Timetable Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examTimetable.map((ex) => (
              <div key={ex.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                      {ex.type}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      Seat: {ex.seatNo}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400">{ex.code}</span>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{ex.subject}</h3>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{ex.date} • {ex.time}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Venue: <strong>{ex.venue}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Updated by: <strong className="text-slate-600">{ex.updatedBy}</strong></span>
                  <span>{ex.updatedOn}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Semester Grade Cards View */
        <div className="space-y-4">
          
          {/* Semester Selector Pills */}
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center space-x-1 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2">Select Semester:</span>
              {['Sem 5', 'Sem 4', 'Sem 3'].map((sem) => (
                <button
                  key={sem}
                  onClick={() => setSelectedSem(sem)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    selectedSem === sem ? 'bg-blue-600 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sem} Marksheet
                </button>
              ))}
            </div>

            <button className="flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:underline">
              <Download className="w-4 h-4" />
              <span>Download Official Grade Card PDF</span>
            </button>
          </div>

          {/* Grade Card Summary Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white rounded-xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-300 font-bold uppercase">{selectedSem} Grade Sheet Summary</span>
              <h2 className="text-lg font-bold text-white mt-0.5">{profile.name} • {profile.rollNo || profile.rollNumber || "21BCE1092"}</h2>
              <p className="text-xs text-slate-300">Total Credits Earned: {currentGradeCard.totalCredits} • Status: <strong className="text-emerald-400">{currentGradeCard.status}</strong></p>
            </div>

            <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-center">
              <span className="text-[10px] text-slate-300 uppercase block">Semester SGPA</span>
              <span className="text-2xl font-black text-emerald-400">{currentGradeCard.sgpa}</span>
            </div>
          </div>

          {/* Grade Card Marksheet Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Course Performance Breakdown ({selectedSem})</span>
              <span>Result: PASS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Course Code</th>
                    <th className="py-2.5 px-4">Subject Title</th>
                    <th className="py-2.5 px-4 text-center">Credits</th>
                    <th className="py-2.5 px-4 text-center">Marks Obtained</th>
                    <th className="py-2.5 px-4 text-center">Letter Grade</th>
                    <th className="py-2.5 px-4 text-right">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {currentGradeCard.courses.map((crs) => (
                    <tr key={crs.code} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{crs.code}</td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">{crs.name}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{crs.credits}</td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">{crs.marks} / 100</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-xs">
                          {crs.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">{crs.points} / 10</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Add Exam Modal for Faculty */}
      {showAddExamModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <span>Publish Exam Timetable Entry</span>
              </h3>
              <button onClick={() => setShowAddExamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExam} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject & Course Code</label>
                <select 
                  value={newSubject} 
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                >
                  <option>CS601: Operating Systems</option>
                  <option>CS604: Machine Learning</option>
                  <option>CS602: Computer Networks</option>
                  <option>CS603: Design & Analysis of Algorithms</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Type</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option>Mid-Term Written Exam</option>
                    <option>End-Term Examination</option>
                    <option>Practical Lab Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                  <input 
                    type="date" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Time Slot</label>
                <input 
                  type="text" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Venue</label>
                  <input 
                    type="text" 
                    value={newVenue} 
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Seat Range</label>
                  <input 
                    type="text" 
                    value={newSeat} 
                    onChange={(e) => setNewSeat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddExamModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
