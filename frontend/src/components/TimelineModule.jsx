import React, { useState } from 'react';
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Calendar, 
  BellRing, 
  Search,
  ArrowUpRight
} from 'lucide-react';
import { academicTimeline } from '../data/mockData';

export default function TimelineModule({ setActiveTab }) {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = academicTimeline.filter(item => {
    const matchesFilter = filterType === 'All' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Assignment': return FileText;
      case 'Examination': return BookOpen;
      case 'Event': return Calendar;
      case 'Notice': return BellRing;
      default: return Clock;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Unified Academic Timeline</h1>
          <p className="text-slate-500 text-xs">Chronological feed of deadlines, exams & events.</p>
        </div>

        <div className="flex items-center space-x-1 overflow-x-auto">
          {['All', 'Assignment', 'Examination', 'Event', 'Notice'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                filterType === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="relative pl-6 space-y-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {filteredItems.map((item) => {
          const Icon = getTypeIcon(item.type);

          return (
            <div key={item.id} className="relative">
              <div className="absolute -left-6 top-2 w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                <Icon className="w-3 h-3 text-blue-600" />
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                      {item.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">{item.subject}</span>
                    <span className="text-[11px] text-slate-400 font-medium">({item.date})</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                </div>

                <button 
                  onClick={() => {
                    if (item.type === 'Assignment' || item.type === 'Examination') setActiveTab('assignments');
                    if (item.type === 'Notice') setActiveTab('notices');
                    if (item.type === 'Event') setActiveTab('events');
                  }}
                  className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:underline shrink-0"
                >
                  <span>Open Module</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
