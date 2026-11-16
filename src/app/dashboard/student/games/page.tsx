'use client';

import { useState } from 'react';
import Sidebar, { NavItem } from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';
import GlassCard from '@/components/dashboard/GlassCard';

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard/student', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
  { label: 'My Courses', href: '/dashboard/student/courses', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg> },
  { label: 'Live Classes', href: '/dashboard/student/live', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg> },
  { label: 'Assignments', href: '/dashboard/student/assignments', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: 'Exams', href: '/dashboard/student/exams', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { label: 'Games', href: '/dashboard/student/games', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg> },
  { label: 'Progress', href: '/dashboard/student/progress', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { label: 'Rewards', href: '/dashboard/student/rewards', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> },
  { label: 'Settings', href: '/dashboard/student/settings', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
];

export default function StudentGamesPage() {
  const [streakFreezeCount, setStreakFreezeCount] = useState(2);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'css'>('flashcards');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const activateStreakFreeze = () => {
    if (streakFreezeCount > 0) {
      setStreakFreezeCount(streakFreezeCount - 1);
      setToast('Streak Freeze activated! Your 7-day streak is safely protected for tomorrow (PRD REQ-065).');
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <div className="flex min-h-screen" style={{ background: '#0D0D0D' }}>
      <Sidebar navItems={NAV_ITEMS} userName="Rohit Sharma" userRole="Student · Grade 7" avatarInitials="RS" />

      <div className="flex-1 flex flex-col md:ml-[230px]">
        <TopBar
          title="Game Zones & Interactive Practice"
          subtitle="Earn XP, protect learning streaks & conquer creative coding puzzles"
          notificationCount={1}
          userName="Rohit Sharma"
          avatarInitials="RS"
        />

        <main className="flex-1 p-5 pb-20 md:pb-6 space-y-5">
          {toast && (
            <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-between">
              <span>❄️ {toast}</span>
              <button onClick={() => setToast(null)} className="text-white/50 hover:text-white">✕</button>
            </div>
          )}

          {/* Action Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Creative Learning Arcade
              </h2>
              <p className="text-xs text-[#888]">
                Healthy gamification: Zero public pressure leaderboards · Private progress & streak preservation
              </p>
            </div>

            {/* Streak Freeze Card */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-cyan-500/30 shadow-md">
              <span className="text-xl">❄️</span>
              <div>
                <div className="text-xs font-bold text-white">Streak Freezes</div>
                <div className="text-[11px] text-cyan-400 font-mono">{streakFreezeCount} Available</div>
              </div>
              <button
                onClick={activateStreakFreeze}
                disabled={streakFreezeCount === 0}
                className="ml-2 px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#0D0D0D] bg-cyan-400 hover:brightness-110 disabled:opacity-40 transition-all"
              >
                Use Freeze
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Flashcard Rapid-Fire Mini Game */}
            <div className="md:col-span-2 space-y-4">
              <GlassCard title="UI/UX Terminology Flashcard Arena">
                <div className="space-y-4 text-center">
                  <div
                    onClick={() => setCardFlipped(!cardFlipped)}
                    className="p-10 rounded-2xl cursor-pointer transition-all border border-[#D4A843]/30 min-h-[200px] flex flex-col items-center justify-center select-none"
                    style={{
                      background: cardFlipped
                        ? 'linear-gradient(135deg, rgba(212,168,67,0.15) 0%, rgba(13,13,13,0.95) 100%)'
                        : '#141414',
                    }}
                  >
                    {!cardFlipped ? (
                      <div>
                        <div className="text-xs font-mono text-[#D4A843] mb-2 uppercase tracking-widest">Question (Click to flip)</div>
                        <h3 className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          "What is the Golden Ratio in Layout Design?"
                        </h3>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs font-mono text-emerald-400 mb-2 uppercase tracking-widest">Answer</div>
                        <h3 className="text-base font-semibold text-white/90 leading-relaxed max-w-md mx-auto" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                          1 : 1.618 (Phi Φ). A mathematical harmonic ratio found in nature, used in UI column sizing, typography scales, and visual balance.
                        </h3>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => setCardFlipped(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/15"
                    >
                      Next Card →
                    </button>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Daily Quests List */}
            <div className="space-y-4">
              <GlassCard title="Daily Quests (+150 XP Total)">
                <div className="space-y-3">
                  {[
                    { task: 'Complete 1 Canvas lesson unit', xp: '+50 XP', done: true },
                    { task: 'Score 80%+ on Checkpoint Quiz', xp: '+50 XP', done: true },
                    { task: 'Submit reflection for Geometry HW', xp: '+50 XP', done: false },
                  ].map((q, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${q.done ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'}`}>
                          {q.done ? '✓' : '○'}
                        </span>
                        <span className={`text-xs ${q.done ? 'line-through text-[#666]' : 'text-white/90'}`}>{q.task}</span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-[#D4A843]">{q.xp}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
