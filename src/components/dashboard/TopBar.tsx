'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface TopBarProps {
  title?: string;
  subtitle?: string;
  notificationCount?: number;
  userName: string;
  avatarInitials: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  alertText?: string;
  notificationHref?: string;
}

export default function TopBar({
  title,
  subtitle,
  notificationCount = 0,
  userName,
  avatarInitials,
  leftElement,
  rightElement,
  alertText,
  notificationHref,
}: TopBarProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notificationsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !notificationsRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNotificationsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notificationsOpen]);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-4 px-6 py-3.5"
      style={{
        background: 'rgba(13,13,13,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left Area: Either custom control (e.g. Branch dropdown) or Title */}
      <div className="flex items-center gap-3">
        {leftElement ? (
          leftElement
        ) : (
          <div>
            {title && (
              <h1 className="text-base font-semibold text-white tracking-wide" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-xs text-[#888888]">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right Area: Search, alerts, icons, avatar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus-within:border-[#D4A843]/50 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#777777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-xs text-white placeholder:text-[#555555] w-36"
          />
        </div>

        {/* Custom right elements (e.g. Date selector) */}
        {rightElement}

        {/* Activity alerts pill if present */}
        {alertText && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-[#A0A0A0]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{alertText}</span>
          </div>
        )}

        {/* Quick action icons */}
        <div className="flex items-center gap-1">
          <div className="relative" ref={notificationsRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((open) => !open)}
              className="relative p-2 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white"
              aria-label="Notifications"
              aria-haspopup="dialog"
              aria-expanded={notificationsOpen}
              aria-controls="topbar-notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {notificationCount > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ring-2 ring-[#0D0D0D]"
                  style={{ background: '#EF4444', color: '#FFFFFF', fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {notificationCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div
                id="topbar-notifications"
                role="dialog"
                aria-label="Notifications"
                className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 bg-[#141414] p-4 shadow-2xl"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-white">Notifications</h2>
                  <button
                    type="button"
                    onClick={() => setNotificationsOpen(false)}
                    className="rounded-lg px-2 py-1 text-white/50 hover:bg-white/10 hover:text-white"
                    aria-label="Close notifications"
                  >
                    ×
                  </button>
                </div>
                <p className="text-xs leading-relaxed text-white/60">
                  Live notifications are not connected yet. The badge count is sample data.
                </p>
                {notificationHref && (
                  <Link
                    href={notificationHref}
                    onClick={() => setNotificationsOpen(false)}
                    className="mt-4 inline-flex text-xs font-semibold text-[#D4A843] hover:underline"
                  >
                    View system activity
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User avatar */}
        <Link
          href="/dashboard/profile"
          aria-label="View profile"
          className="flex items-center gap-2.5 pl-2 border-l border-white/[0.08] hover:opacity-80 transition-opacity"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-[#D4A843]/50"
            style={{ background: 'linear-gradient(135deg, #D4A843, #B8860B)', color: '#0D0D0D', fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {avatarInitials}
          </div>
          <span className="hidden md:block text-xs font-medium text-white/90" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {userName}
          </span>
        </Link>
      </div>
    </header>
  );
}
