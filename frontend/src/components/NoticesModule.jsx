import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Search, 
  Plus, 
  Sparkles, 
  ChevronRight
} from 'lucide-react';
import { smartNotices } from '../data/mockData';
import { api } from '../services/api';

export default function NoticesModule({ activeRole, onOpenNoticeModal, onOpenPublishNoticeModal }) {
  const [notices, setNotices] = useState(smartNotices);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.getNotices().then(res => {
      if (res.success && res.notices) {
        setNotices(res.notices);
      }
    }).catch(() => {});
  }, []);

  const filteredNotices = notices.filter(n => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Smart Notices</h1>
          <p className="text-slate-500 text-xs">Categorized institutional announcements with NLP urgency tags.</p>
        </div>

        {(activeRole === 'admin' || activeRole === 'faculty') ? (
          <button 
            onClick={onOpenPublishNoticeModal}
            className="flex items-center justify-center space-x-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Notice</span>
          </button>
        ) : (
          <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl font-semibold self-start">
            AI Categorization Active
          </span>
        )}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {['All', 'Academic', 'Examination', 'Placement', 'Event'].map((cat) => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices..."
            className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Notices Grid */}
      <div className="grid gap-3">
        {filteredNotices.map((notice) => (
          <div 
            key={notice.id} 
            className="bg-white rounded-xl p-4 border border-slate-200 hover:border-blue-300 transition space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                  {notice.category}
                </span>
                {notice.isImportant && (
                  <span className="text-[9px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded uppercase">
                    Urgent
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">{notice.date}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900">{notice.title}</h3>
            <p className="text-xs text-slate-600">{notice.summary}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <div className="flex gap-1">
                {notice.nlpTags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-1.5 py-0.5 rounded font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => onOpenNoticeModal(notice)}
                className="flex items-center space-x-1 font-bold text-blue-600 hover:underline"
              >
                <span>Read More</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
