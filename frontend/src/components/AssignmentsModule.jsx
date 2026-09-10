import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Award,
  Plus,
  X,
  UserCheck
} from 'lucide-react';
import { assignmentsList } from '../data/mockData';
import { api } from '../services/api';

export default function AssignmentsModule({ activeRole, onOpenSubmissionModal }) {
  const [list, setList] = useState(assignmentsList);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedSubForGrade, setSelectedSubForGrade] = useState(null);

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

  const pendingAssignments = list.filter(a => a.status !== 'Submitted');
  const gradedAssignments = list.filter(a => a.status === 'Submitted');

  const handleCreateAssignment = (e) => {
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

    api.publishExamSlot(created).catch(() => {});
    setList([created, ...list]);
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

    setList(list.map(item => {
      if (item.id === selectedSubForGrade.id) {
        return {
          ...item,
          status: 'Submitted',
          score: `${marksInput} / ${item.maxMarks}`,
          grade: gradeInput,
          feedback: feedbackInput,
          submittedOn: new Date().toLocaleDateString(),
        };
      }
      return item;
    }));

    setSelectedSubForGrade(null);
    setToastMessage(`Evaluation verified: Marks (${marksInput}) & Grade (${gradeInput}) saved!`);
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
          <h1 className="text-xl font-bold text-slate-900">Assignments & Lab Submissions</h1>
          <p className="text-slate-500 text-xs">
            {activeRole === 'faculty' 
              ? 'Create new assignments, inspect student solutions, and enter marks to sync with ERP.' 
              : 'View pending academic assignments and upload completed lab reports.'}
          </p>
        </div>

        {activeRole === 'faculty' && (
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create & Publish Assignment</span>
          </button>
        )}
      </div>

      {/* 2-Column Vertical Alignment Layout: Pending vs Graded Submissions */}
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

                {/* Action Button: Student Submit vs Faculty Grade */}
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
