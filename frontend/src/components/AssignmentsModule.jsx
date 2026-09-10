import React from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Award,
  Plus
} from 'lucide-react';
import { assignmentsList } from '../data/mockData';

export default function AssignmentsModule({ activeRole, onOpenSubmissionModal }) {
  const pendingAssignments = assignmentsList.filter(a => a.status !== 'Submitted');
  const gradedAssignments = assignmentsList.filter(a => a.status === 'Submitted');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assignments & Lab Submissions</h1>
          <p className="text-slate-500 text-xs">View pending academic assignments and upload completed lab reports.</p>
        </div>

        {activeRole === 'faculty' && (
          <button className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs">
            <Plus className="w-4 h-4" />
            <span>Create New Assignment</span>
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
              <span>Pending Assignments To Complete</span>
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

                {/* Assignment Metadata (Vertical stacked flow) */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>Faculty: <strong className="text-slate-800">{asg.faculty}</strong></span>
                  <span>Weightage: <strong className="text-slate-800">{asg.weightage}</strong></span>
                  <span>Max Marks: <strong className="text-slate-800">{asg.maxMarks}</strong></span>
                </div>

                {/* Action Submit Button */}
                <div className="pt-2">
                  <button 
                    onClick={() => onOpenSubmissionModal(asg)}
                    className="w-full flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit Assignment Solution</span>
                  </button>
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

                {/* Score & Grade Result Badge (Vertical flow) */}
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

    </div>
  );
}
