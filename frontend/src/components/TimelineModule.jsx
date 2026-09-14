import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  FileText, 
  BookOpen, 
  Calendar, 
  BellRing, 
  Search,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { academicTimeline } from '../data/mockData';
import { api } from '../services/api';

export default function TimelineModule({ setActiveTab }) {
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(academicTimeline);
  const [todayLectures, setTodayLectures] = useState([]);

  useEffect(() => {
    // Fetch live exam timetables & faculty schedule
    Promise.all([
      api.getFacultySchedule().catch(() => ({})),
      api.getExamsTimetable().catch(() => ({})),
      api.getAssignments().catch(() => ({}))
    ]).then(([schedRes, examRes, asgRes]) => {
      let combined = [...academicTimeline];

      if (schedRes?.success && schedRes?.schedule) {
        setTodayLectures(schedRes.schedule);
      }

      if (examRes?.success && examRes?.timetable) {
        const liveExams = examRes.timetable.map(ex => ({
          id: `ex-live-${ex.id}`,
          date: ex.date,
          time: ex.time,
          title: `${ex.subject} (${ex.type})`,
          type: 'Examination',
          category: 'Exams',
          urgency: 'Critical',
          subject: ex.code,
          description: `Venue: ${ex.venue} • Seat No: ${ex.seatNo} • Updated by: ${ex.updatedBy || 'Faculty'}`,
          status: 'Scheduled',
        }));
        combined = [...liveExams, ...combined];
      }

      if (asgRes?.success && asgRes?.assignments) {
        const liveAsgs = asgRes.assignments.map(a => ({
          id: `asg-live-${a.id}`,
          date: a.dueDate,
          time: '11:59 PM',
          title: a.title,
          type: 'Assignment',
          category: 'Academic',
          urgency: a.status === 'Submitted' ? 'Normal' : 'Urgent',
          subject: a.subject,
          description: a.instructions,
          status: a.status,
          score: a.score,
          grade: a.grade,
          feedback: a.feedback
        }));
        combined = [...liveAsgs, ...combined];
      }

      setItems(combined);
    });
  }, []);

  const filteredItems = items.filter(item => {
    const matchesFilter = filterType === 'All' || item.type === filterType;
    const matchesSearch = (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
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

      {/* Today's Live Class Timetable (Updated by Faculty) */}
      {todayLectures.length > 0 && (
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold tracking-tight">Today's Class Timetable (Updated by Faculty)</h2>
            </div>
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              {todayLectures.length} Lectures Scheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {todayLectures.map((lec) => (
              <div key={lec.id} className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15 text-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-200">
                  <span>{lec.subjectCode}</span>
                  <span className="bg-white/20 text-white px-2 py-0.5 rounded-md">{lec.time}</span>
                </div>
                <h3 className="font-bold text-white text-xs">{lec.subjectName}</h3>
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 border-t border-white/10">
                  <span>Room: <strong>{lec.room}</strong></span>
                  <span className="text-emerald-300 font-semibold">{lec.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
