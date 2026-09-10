import React from 'react';
import { X, Tag, Download, Calendar, Building2, ShieldAlert } from 'lucide-react';

export default function NoticeModal({ isOpen, onClose, notice }) {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
        
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              notice.category === 'Academic' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              notice.category === 'Examination' ? 'bg-red-100 text-red-800 border-red-200' :
              'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              {notice.category} Notice
            </span>
            <h2 className="font-bold text-lg text-slate-900 leading-snug">{notice.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" /> {notice.publisher}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {notice.date}
          </span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed space-y-2">
          <p>{notice.content}</p>
        </div>

        {/* NLP Tags */}
        <div className="flex items-center space-x-2 pt-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">NLP Categories:</span>
          {notice.nlpTags.map((tag, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-100 text-[11px] font-medium px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button className="flex items-center space-x-1.5 text-xs font-semibold text-blue-600 hover:underline">
            <Download className="w-4 h-4" />
            <span>Download Official Notice PDF (Signed)</span>
          </button>

          <button 
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

