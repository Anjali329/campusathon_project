import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  RotateCw,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { smartPriorityActions, attendanceSummary, currentUser } from '../data/mockData';

export default function SmartPriorityEngine({ setActiveTab }) {
  const [actions, setActions] = useState(smartPriorityActions);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const filteredActions = actions.filter(act => {
    if (selectedFilter === 'high') return act.priorityScore >= 85;
    if (selectedFilter === 'attendance') return act.category.includes('Attendance');
    if (selectedFilter === 'assignment') return act.category.includes('Academic') || act.category.includes('Assignment');
    return true;
  });

  return (
    <div className="space-y-5">
      
      {/* Top Banner / Student Greeting */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-5 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-1.5 text-blue-300 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>AI Smart Priority Command Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Hello, {currentUser.name}!
          </h1>
          <p className="text-slate-300 text-xs mt-0.5">
            4 urgent actions prioritized for your academic success today.
          </p>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
            <span className="text-[10px] text-slate-300 block">Attendance</span>
            <span className="text-base font-bold text-red-400 flex items-center justify-center gap-0.5">
              {attendanceSummary.overallPercentage}%
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </span>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
            <span className="text-[10px] text-slate-300 block">Current CGPA</span>
            <span className="text-base font-bold text-emerald-400 flex items-center justify-center gap-0.5">
              {currentUser.cgpa}
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          </div>

          <div className="bg-white/10 p-2.5 rounded-xl text-center border border-white/10">
            <span className="text-[10px] text-slate-300 block">Due Today</span>
            <span className="text-base font-bold text-amber-300">1 Task</span>
          </div>
        </div>
      </div>

      {/* Header bar & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-bold text-slate-900">Prioritized Action Items</h2>
          <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded-full">
            {filteredActions.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Filter Pills */}
          <div className="flex items-center space-x-1">
            {['all', 'high', 'attendance', 'assignment'].map((flt) => (
              <button 
                key={flt}
                onClick={() => setSelectedFilter(flt)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition ${
                  selectedFilter === flt ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {flt === 'all' ? 'All' : flt === 'high' ? 'High Risk' : flt}
              </button>
            ))}
          </div>

          <button 
            onClick={handleRefresh}
            className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 rounded-lg border border-slate-200 transition"
            title="Refresh Priorities"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Simplified Action Cards */}
      <div className="grid gap-3">
        {filteredActions.map((action, idx) => {
          const isTopPriority = idx === 0;
          return (
            <div 
              key={action.id}
              className={`bg-white rounded-xl p-4 border transition hover:shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                isTopPriority ? 'border-red-300 ring-1 ring-red-400/30' : 'border-slate-200'
              }`}
            >
              <div className="space-y-2 flex-1">
                
                <div className="flex items-center space-x-2">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                    action.priorityScore >= 90
                      ? 'bg-red-100 text-red-700 border-red-200'
                      : action.priorityScore >= 80
                      ? 'bg-amber-100 text-amber-700 border-amber-200'
                      : 'bg-blue-100 text-blue-700 border-blue-200'
                  }`}>
                    Priority Index: {action.priorityScore}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    {action.category}
                  </span>

                  <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {action.deadline}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{action.title}</h3>

                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-blue-900">AI Advice:</strong> {action.recommendation}
                </p>

              </div>

              <div className="shrink-0 text-right">
                <button 
                  onClick={() => setActiveTab(action.targetTab)}
                  className={`w-full md:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl font-semibold text-xs transition shadow-xs ${
                    action.priorityScore >= 90
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>{action.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
