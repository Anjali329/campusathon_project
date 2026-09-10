import React from 'react';
import { X, Printer, ShieldCheck, Download, Award, GraduationCap } from 'lucide-react';
import { currentUser, achievementPortfolio } from '../../data/mockData';

export default function ExportModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-6 my-8">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Official CampusFlow Digital Portfolio Transcript
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Transcript Card */}
        <div className="border border-slate-300 rounded-xl p-6 space-y-6 bg-white shadow-xs">
          
          {/* Institution Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">CAMPUSFLOW DIGITAL TRANSCRIPT</h1>
              <p className="text-xs text-slate-500 font-mono">Verifiable Student Journey Record • Hash: 0x89F2A...4B</p>
            </div>
            <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center font-black text-xl">
              CF
            </div>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p><strong className="text-slate-900">Student Name:</strong> {currentUser.name}</p>
              <p><strong className="text-slate-900">Roll Number:</strong> {currentUser.rollNo}</p>
              <p><strong className="text-slate-900">Department:</strong> {currentUser.department}</p>
            </div>
            <div>
              <p><strong className="text-slate-900">Current CGPA:</strong> {currentUser.cgpa} / 10.0</p>
              <p><strong className="text-slate-900">Completed Credits:</strong> {currentUser.creditsCompleted}</p>
              <p><strong className="text-slate-900">Verification Status:</strong> <span className="text-emerald-700 font-bold">ERP Authenticated</span></p>
            </div>
          </div>

          {/* Verified Certificates */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Certifications</h3>
            <div className="divide-y divide-slate-200 text-xs">
              {achievementPortfolio.verifiedCertificates.map(c => (
                <div key={c.id} className="py-2 flex justify-between">
                  <div>
                    <span className="font-bold text-slate-900">{c.title}</span>
                    <p className="text-[11px] text-slate-500">{c.issuer} ({c.issueDate})</p>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{c.credentialId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hackathons & Awards */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracurricular Honors & Hackathons</h3>
            <div className="divide-y divide-slate-200 text-xs">
              {achievementPortfolio.extracurricularAchievements.map(a => (
                <div key={a.id} className="py-2">
                  <span className="font-bold text-slate-900">{a.title} ({a.date})</span>
                  <p className="text-[11px] text-slate-600">{a.details}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
            <span>Generated on: {new Date().toLocaleDateString()}</span>
            <span>Digitally Signed by Registrar of Academic Affairs</span>
          </div>

        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 print:hidden">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
          
          <button 
            onClick={handlePrint}
            className="flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}

