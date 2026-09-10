import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Calculator,
  UserCheck
} from 'lucide-react';
import { attendanceSummary } from '../data/mockData';

export default function AttendanceModule({ activeRole, onOpenCorrectionModal }) {
  const [extraAttended, setExtraAttended] = useState(3);
  
  const [studentSheet, setStudentSheet] = useState([
    { id: "STU-101", roll: "21BCE1040", name: "Anish Kapoor", status: "Present" },
    { id: "STU-102", roll: "21BCE1041", name: "Priya Sharma", status: "Present" },
    { id: "STU-1042", roll: "21BCE1042", name: "Rahul Sharma (You)", status: "Absent" },
    { id: "STU-104", roll: "21BCE1043", name: "Rohan Verma", status: "Present" },
    { id: "STU-105", roll: "21BCE1044", name: "Sneha Nair", status: "Present" },
  ]);
  const [isSaved, setIsSaved] = useState(false);

  const totalAttendedSim = attendanceSummary.totalAttended + extraAttended;
  const totalConductedSim = attendanceSummary.totalConducted + extraAttended;
  const simulatedPercentage = ((totalAttendedSim / totalConductedSim) * 100).toFixed(1);

  const toggleStudentStatus = (id) => {
    setStudentSheet(prev => prev.map(s => s.id === id ? {
      ...s,
      status: s.status === 'Present' ? 'Absent' : 'Present'
    } : s));
  };

  const handleSaveAttendance = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (activeRole === 'faculty') {
    return (
      <div className="space-y-5">
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold">
              <UserCheck className="w-4 h-4" />
              <span>Faculty Attendance Portal</span>
            </div>
            <h1 className="text-xl font-bold">Class Attendance Logger</h1>
            <p className="text-slate-300 text-xs mt-0.5">CS601 Operating Systems (Section A)</p>
          </div>

          <button className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition">
            <Upload className="w-4 h-4" />
            <span>Bulk CSV Upload</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Today's Class Sheet (10 Sep 2026)</span>
            <button 
              onClick={() => setStudentSheet(prev => prev.map(s => ({ ...s, status: 'Present' })))}
              className="font-semibold text-blue-600 hover:underline"
            >
              Mark All Present
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Roll</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Current %</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {studentSheet.map((st) => (
                  <tr key={st.id}>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{st.roll}</td>
                    <td className="py-2.5 px-3 text-slate-900">{st.name}</td>
                    <td className="py-2.5 px-3 text-slate-600">{st.name.includes('Rahul') ? '68.5%' : '82.0%'}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        st.status === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {st.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button 
                        onClick={() => toggleStudentStatus(st.id)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {isSaved ? (
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Synced with ERP!
              </span>
            ) : (
              <span className="text-slate-400">Total: 5 Students</span>
            )}
            <button 
              onClick={handleSaveAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-xl transition"
            >
              Submit Attendance Log
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance Monitoring</h1>
          <p className="text-slate-500 text-xs">Track subject percentages, safe margins & raise duty leave requests.</p>
        </div>

        <button 
          onClick={onOpenCorrectionModal}
          className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Duty Leave / Correction</span>
        </button>
      </div>

      {/* Risk Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
          <div>
            <span className="font-bold text-sm text-red-900 block">Attendance Risk Warning</span>
            <p className="text-xs text-red-800">
              Your overall attendance is <span className="font-bold">{attendanceSummary.overallPercentage}%</span> (Required: <span className="font-bold">75.0%</span>). Attending the next <strong>3 classes</strong> clears risk!
            </p>
          </div>
        </div>

        <span className="bg-red-600 text-white font-bold text-xs px-3 py-1 rounded-lg shrink-0">
          Need 3 Classes
        </span>
      </div>

      {/* Predictor & Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase">Overall Attendance</span>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900">{attendanceSummary.overallPercentage}%</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
              {attendanceSummary.status}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-red-500 h-full rounded-full" style={{ width: `${attendanceSummary.overallPercentage}%` }}></div>
          </div>
          <span className="text-xs text-slate-500 block">Attended: {attendanceSummary.totalAttended} / {attendanceSummary.totalConducted} classes</span>
        </div>

        {/* Interactive Safe Margin Predictor */}
        <div className="md:col-span-2 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center space-x-1.5 text-blue-300 text-xs font-bold uppercase mb-1">
              <Calculator className="w-4 h-4" />
              <span>Safe-Margin Calculator</span>
            </div>
            <h3 className="text-sm font-bold">Simulate Future Attendance</h3>

            <div className="mt-3 space-y-1 bg-white/10 p-3 rounded-lg border border-white/10">
              <div className="flex justify-between text-xs font-semibold">
                <span>Attend next {extraAttended} classes</span>
                <span className="text-blue-300 font-mono">{simulatedPercentage}% Projected</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="10" 
                value={extraAttended}
                onChange={(e) => setExtraAttended(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-blue-400"
              />
            </div>
          </div>

          <div className="flex justify-between text-xs text-blue-200">
            <span>Eligibility Status:</span>
            <span className={`font-bold px-2 py-0.5 rounded ${
              parseFloat(simulatedPercentage) >= 75.0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {parseFloat(simulatedPercentage) >= 75.0 ? 'Safe for Exams' : 'Risk of Debarment'}
            </span>
          </div>
        </div>

      </div>

      {/* Subject breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">Subject Breakdown</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attendanceSummary.subjects.map((subj) => {
            const isRisk = subj.percentage < 75.0;
            return (
              <div key={subj.code} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-500">{subj.code}</span>
                    <h4 className="font-bold text-slate-900">{subj.name}</h4>
                  </div>
                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                    isRisk ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {subj.percentage}%
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${isRisk ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${subj.percentage}%` }}></div>
                </div>

                <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                  <span>Attended: {subj.attended}/{subj.total}</span>
                  <span className={isRisk ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                    {isRisk ? `Need ${subj.requiredAttends} classes` : `Can miss ${subj.missableClasses} classes`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
