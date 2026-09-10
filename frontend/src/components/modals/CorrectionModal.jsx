import React, { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CorrectionModal({ isOpen, onClose }) {
  const [subject, setSubject] = useState('CS601: Operating Systems');
  const [leaveDate, setLeaveDate] = useState('2026-09-10');
  const [reasonType, setReasonType] = useState('Hackathon / Duty Leave');
  const [remarks, setRemarks] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

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
          <h2 className="font-bold text-lg text-slate-900">Raise Attendance Correction Request</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Request Submitted to Faculty</h3>
            <p className="text-xs text-slate-500">Your duty leave application has been routed to Prof. Ananya Sen for ERP attendance regularization.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Course / Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option>CS601: Operating Systems (Prof. Ananya Sen)</option>
                <option>CS602: Computer Networks (Dr. R. P. Gupta)</option>
                <option>CS603: Algorithms (Dr. Meenakshi S.)</option>
                <option>CS605L: Web Dev Lab (Er. Vikramaditya)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Absence Date</label>
                <input 
                  type="date"
                  value={leaveDate}
                  onChange={(e) => setLeaveDate(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reason Category</label>
                <select 
                  value={reasonType}
                  onChange={(e) => setReasonType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                >
                  <option>Hackathon / Duty Leave</option>
                  <option>Medical Emergency</option>
                  <option>Sports / Cultural Event</option>
                  <option>Biometric / RFID Scanner Error</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Explanation & Remarks</label>
              <textarea 
                rows="3"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Participated in Campusathon 2026 Hackathon finale. Attached official approval slip..."
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400"
                required
              ></textarea>
            </div>

            {/* File Upload Simulator */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-xs font-semibold text-blue-600 block">Attach Certificate / Permission Slip PDF</span>
              <span className="text-[10px] text-slate-400">Supported formats: PDF, JPG, PNG (Max 5MB)</span>
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
                Submit Correction Claim
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

