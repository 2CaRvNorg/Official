'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Programmes', href: '#programmes' },
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'FAQ', href: '#faq' },
];

const WHATSAPP_URL = 'https://wa.me/917995214340';

const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate navbar in
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!navRef.current) return;
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!mobileMenuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  }, [menuOpen]);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-4'
      }`}
    >
      <div className="w-full px-4 mx-auto sm:px-6">
        <nav
          className={`glass rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'shadow-lg' : ''
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/2carvn-logo.png"
              alt="2Carvn"
              width="96"
              height="47"
              className="brand-mark h-9 w-[86px] sm:h-10 sm:w-24 object-contain"
            />
            <span className="font-heading font-700 text-white text-lg tracking-tight hidden sm:block">
              <span className="gradient-text-gold">Academy</span>
            </span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 text-white/70 hover:text-white hover:bg-white/8"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {link.label}
                </button>
              </li>
            ))}
            {/* Dashboard Demo Dropdown */}
            <li className="relative group">
              <button
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl text-[#F5A623] hover:text-white hover:bg-white/8 transition-all"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Dashboards
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl glass p-2 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 border border-white/10">
                <a href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#D4A843]" />
                  Admin Dashboard
                </a>
                <a href="/dashboard/student" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Student Dashboard
                </a>
                <a href="/dashboard/teacher" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 font-medium">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Teacher Dashboard
                </a>
                <a href="/dashboard/institution" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white/80 hover:text-white hover:bg-white/10 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Institution Head
                </a>
              </div>
            </li>
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-2 min-w-0">
            <a
              href="/login"
              className="flex-shrink-0 px-4 py-2 rounded-xl text-xs font-semibold text-white/90 hover:text-white bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] transition-all hidden sm:inline-flex items-center gap-1.5"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </a>

            {/* Compact login action for small screens (also available in the drawer) */}
            <a
              href="/login"
              aria-label="Sign in"
              className="sm:hidden inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-white/90 bg-white/[0.08] border border-white/[0.1] transition-all hover:bg-white/[0.14]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </a>

            {/* Compact mobile WhatsApp action next to the login icon */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="sm:hidden inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d={WHATSAPP_PATH} />
              </svg>
            </a>

            {/* WhatsApp CTA: wrapper owns the visibility, so Tailwind hidden wins in components */}
            <div className="hidden sm:block">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex flex-shrink-0 text-sm px-4 py-2.5 gap-2 whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="whatsapp-icon">
                  <path d={WHATSAPP_PATH} />
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2 flex-shrink-0 rounded-xl hover:bg-white/8 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-1"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-left px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/8 transition-all font-medium"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {link.label}
              </button>
            ))}
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-sm font-semibold text-white/90 transition-all hover:bg-white/[0.14]"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 flex-shrink-0">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn-gold whatsapp-cta mt-2 w-full justify-center"
              style={{ padding: '10px 16px', fontSize: '0.875rem' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="whatsapp-icon">
                <path d={WHATSAPP_PATH} />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
