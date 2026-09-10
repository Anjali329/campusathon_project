import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  CheckCircle2
} from 'lucide-react';
import { campusEvents } from '../data/mockData';

export default function EventsModule() {
  const [events, setEvents] = useState(campusEvents);

  const toggleRsvp = (id) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        const nextState = !evt.isRegistered;
        return {
          ...evt,
          isRegistered: nextState,
          attendeesCount: nextState ? evt.attendeesCount + 1 : evt.attendeesCount - 1
        };
      }
      return evt;
    }));
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Campus Events & Hackathons</h1>
        <p className="text-slate-500 text-xs">Explore upcoming workshops & inter-college hackathons.</p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="h-36 relative bg-slate-900">
                <img src={evt.banner} alt={evt.title} className="w-full h-full object-cover opacity-90" />
                <span className="absolute top-2.5 left-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {evt.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">{evt.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{evt.description}</p>

                <div className="space-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{evt.date} • {evt.time}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{evt.location}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{evt.attendeesCount} Registered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">By {evt.organizer}</span>
              
              <button 
                onClick={() => toggleRsvp(evt.id)}
                className={`flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition ${
                  evt.isRegistered 
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {evt.isRegistered ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>RSVPed</span>
                  </>
                ) : (
                  <span>Register</span>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
