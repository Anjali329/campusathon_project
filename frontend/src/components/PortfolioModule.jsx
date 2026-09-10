import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Share2, 
  ShieldCheck,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { achievementPortfolio, currentUser } from '../data/mockData';

export default function PortfolioModule({ onOpenExportModal }) {
  const [copied, setCopied] = useState(false);

  const handleSharePortfolio = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Achievement Portfolio</h1>
          <p className="text-slate-500 text-xs">Verified academic transcript, certificates & extracurricular records.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button 
            onClick={handleSharePortfolio}
            className="flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <Share2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>

          <button 
            onClick={onOpenExportModal}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF Transcript</span>
          </button>
        </div>
      </div>

      {/* CGPA Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-blue-900 rounded-xl p-5 text-white shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-400" />
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                {currentUser.name}
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h2>
              <p className="text-xs text-slate-300">{currentUser.department} • {currentUser.rollNo}</p>
            </div>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
            <span className="text-[10px] text-slate-300 block">CGPA</span>
            <span className="text-xl font-bold text-emerald-400">{currentUser.cgpa}</span>
          </div>
        </div>

        {/* CGPA History */}
        <div className="pt-2 border-t border-white/10 space-y-1">
          <span className="text-[10px] text-slate-300 font-bold uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" /> Semester GPA History
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {achievementPortfolio.cgpaHistory.map((s, idx) => (
              <div key={idx} className="bg-white/5 p-1.5 rounded text-center">
                <span className="text-[9px] text-slate-400 block">{s.sem}</span>
                <span className="text-xs font-bold text-white">{s.gpa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verified Certifications */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-blue-600" /> Verified Certifications
        </h3>

        <div className="grid gap-2.5">
          {achievementPortfolio.verifiedCertificates.map((cert) => (
            <div key={cert.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="font-bold text-slate-900 block">{cert.title}</span>
                <span className="text-slate-500">{cert.issuer} ({cert.issueDate})</span>
              </div>

              <a 
                href={cert.certificateUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-bold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
              >
                <span>Verify Credential</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Extracurricular */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" /> Verified Digital Badges
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {achievementPortfolio.badges.map((b, idx) => (
            <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-center space-y-0.5">
              <span className="text-xl block">{b.icon}</span>
              <span className="text-xs font-bold text-slate-800 block leading-tight">{b.name}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
