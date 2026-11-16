'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/teacher', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Batches', href: '/dashboard/teacher/batches', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
  { label: 'Calendar', href: '/dashboard/teacher/calendar', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Lesson Builder', href: '/dashboard/teacher/lessons', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { label: 'Live Classes', href: '/dashboard/teacher/live', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assignments & Grading', href: '/dashboard/teacher/grading', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg> },
  { label: 'Student Progress', href: '/dashboard/teacher/progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
];

export default function TeacherCalendarPage() {
  const [selectedDay, setSelectedDay] = useState(11);

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarCells = Array.from({ length: 30 }, (_, i) => i + 1);

  const EVENTS: Record<number, { title: string; time: string; color: string }[]> = {
    4: [{ title: 'Scheduled Class', time: '10:00 AM', color: '#D4A843' }],
    7: [{ title: 'Checkpoint Quiz', time: '02:00 PM', color: '#7C4DFF' }],
    11: [
      { title: 'Live Now: Math Class', time: '10:00 AM', color: '#D4A843' },
      { title: 'Physics 101 Lecture', time: '12:00 PM', color: '#00BCD4' },
      { title: 'Assignment Deadline', time: '02:00 PM', color: '#FF5252' },
    ],
    18: [{ title: 'Web Basics Lab', time: '10:00 AM', color: '#00BCD4' }],
    25: [{ title: 'Exam Date: Capstone', time: '11:00 AM', color: '#FF5252' }],
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Ms. Sharma" userRole="Teacher · Designing" avatarInitials="MS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Operational Teaching Calendar"
          subtitle="Monthly overview, class slots & assignment submission windows"
          notificationCount={2}
          userName="Ms. Sharma"
          avatarInitials="MS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              November 2026
            </h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white">‹ Previous</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-white">Next ›</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* Calendar Grid */}
            <div className="lg:col-span-3">
              <GlassCard title="Monthly Calendar View">
                <div className="space-y-2">
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#888] pb-2 border-b border-white/[0.06]">
                    {DAYS.map(d => <div key={d}>{d}</div>)}
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {calendarCells.map(day => {
                      const events = EVENTS[day] || [];
                      const isToday = day === 11;
                      const isSelected = day === selectedDay;
                      return (
                        <div
                          key={day}
                          onClick={() => setSelectedDay(day)}
                          className={`p-2 rounded-xl min-h-[90px] border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#D4A843] bg-[#D4A843]/10'
                              : isToday
                              ? 'border-white/30 bg-white/[0.04]'
                              : 'border-white/[0.06] bg-[#141414] hover:border-white/20'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isToday ? 'text-[#D4A843]' : 'text-white/80'}`}>
                            {day}
                          </span>

                          <div className="space-y-1 mt-1">
                            {events.map((ev, idx) => (
                              <div
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[9px] font-bold text-[#0D0D0D] truncate"
                                style={{ background: ev.color }}
                                title={`${ev.title} (${ev.time})`}
                              >
                                {ev.title}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Selected Day Agenda */}
            <div>
              <GlassCard title={`Agenda: Nov ${selectedDay}, 2026`}>
                <div className="space-y-3">
                  {(EVENTS[selectedDay] || []).length > 0 ? (
                    EVENTS[selectedDay].map((ev, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-mono text-[#D4A843]">
                          <span>{ev.time}</span>
                          <span className="w-2 h-2 rounded-full" style={{ background: ev.color }} />
                        </div>
                        <h4 className="text-xs font-bold text-white">{ev.title}</h4>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-xs text-[#777]">
                      No events scheduled for this day.
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
