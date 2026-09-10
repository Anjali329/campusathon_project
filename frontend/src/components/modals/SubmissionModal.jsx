import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileCode } from 'lucide-react';

export default function SubmissionModal({ isOpen, onClose, assignment }) {
  const [fileName, setFileName] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
              {assignment.subject}
            </span>
            <h2 className="font-bold text-base text-slate-900 mt-1">{assignment.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Assignment Successfully Uploaded!</h3>
            <p className="text-xs text-slate-500">Timestamp recorded: {new Date().toLocaleTimeString()} • Routed to {assignment.faculty}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 flex justify-between">
              <span>Deadline: <strong>{assignment.dueDate}</strong></span>
              <span>Weightage: <strong>{assignment.weightage}</strong></span>
            </div>

            {/* File Dropzone */}
            <div 
              onClick={() => setFileName('Rahul_Sharma_ML_LabReport4.pdf')}
              className="border-2 border-dashed border-blue-200 rounded-xl p-6 text-center bg-blue-50/50 hover:bg-blue-50 transition cursor-pointer space-y-2"
            >
              <FileCode className="w-8 h-8 text-blue-600 mx-auto" />
              <div>
                <span className="text-xs font-bold text-blue-700 block">
                  {fileName || 'Click to select project files / PDF'}
                </span>
                <span className="text-[11px] text-slate-400">PDF, ZIP, or Jupyter Notebook (.ipynb)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student Comments for Evaluator</label>
              <textarea 
                rows="2"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Included GitHub repository link and cross-validation accuracy metrics..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              ></textarea>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm transition"
              >
                Submit Solution
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

