import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Award, 
  CheckSquare, 
  Square
} from 'lucide-react';
import { assignmentsList, upcomingExams } from '../data/mockData';

export default function AssignmentsExamsModule({ onOpenSubmissionModal }) {
  const [subTab, setSubTab] = useState('assignments');
  const [exams, setExams] = useState(upcomingExams);

  const toggleTopicCheck = (examId, topicIdx) => {
    setExams(prev => prev.map(ex => {
      if (ex.id === examId) {
        const newSyllabus = [...ex.syllabus];
        newSyllabus[topicIdx] = {
          ...newSyllabus[topicIdx],
          completed: !newSyllabus[topicIdx].completed
        };
        return { ...ex, syllabus: newSyllabus };
      }
      return ex;
    }));
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Sub-tab switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Assignments & Exams</h1>
          <p className="text-slate-500 text-xs">Track pending lab submissions & examination readiness.</p>
        </div>

        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setSubTab('assignments')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              subTab === 'assignments' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Assignments</span>
          </button>
          
          <button 
            onClick={() => setSubTab('exams')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              subTab === 'exams' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Exams</span>
          </button>
        </div>
      </div>

      {subTab === 'assignments' ? (
        <div className="space-y-4">
          
          {/* Pending */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" /> Pending Submissions
            </h2>

            <div className="grid gap-3">
              {assignmentsList.filter(a => a.status !== 'Submitted').map((asg) => (
                <div key={asg.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {asg.subject}
                      </span>
                      <span className="text-xs font-semibold text-amber-600">Due: {asg.dueDate}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{asg.title}</h3>
                    <p className="text-xs text-slate-500">Weightage: {asg.weightage} • Max Marks: {asg.maxMarks}</p>
                  </div>

                  <button 
                    onClick={() => onOpenSubmissionModal(asg)}
                    className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow-xs shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Submit Solution</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Graded */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Graded & Evaluated
            </h2>

            {assignmentsList.filter(a => a.status === 'Submitted').map((asg) => (
              <div key={asg.id} className="bg-emerald-50/40 rounded-xl p-4 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {asg.subject}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{asg.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">Feedback: "{asg.feedback}"</p>
                </div>

                <div className="text-right shrink-0 bg-white p-2 rounded-lg border border-emerald-200">
                  <span className="text-xs font-bold text-slate-900 block">{asg.score}</span>
                  <span className="text-[10px] font-bold text-emerald-700">Grade: {asg.grade}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => {
            const completedCount = exam.syllabus.filter(s => s.completed).length;
            const progressPct = Math.round((completedCount / exam.syllabus.length) * 100);

            return (
              <div key={exam.id} className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      {exam.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{exam.subject}</h3>
                    <p className="text-xs text-slate-500">{exam.date} • {exam.venue}</p>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-800">
                    Seat: {exam.seatNo}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Syllabus Checklist:</span>
                    <span className="text-blue-600">{progressPct}% Ready</span>
                  </div>
                  {exam.syllabus.map((top, idx) => (
                    <div 
                      key={idx}
                      onClick={() => toggleTopicCheck(exam.id, idx)}
                      className="flex items-center space-x-2 p-1.5 rounded hover:bg-slate-50 cursor-pointer text-xs"
                    >
                      {top.completed ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                      <span className={top.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>
                        {top.topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
