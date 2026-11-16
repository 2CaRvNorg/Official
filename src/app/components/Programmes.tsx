'use client';

import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PROGRAMMES = [
  {
    id: 'A',
    title: 'Programme A',
    subtitle: 'Designing + Communication',
    icon: '🎨',
    accentColor: '#F5A623',
    glowColor: 'rgba(245,166,35,0.35)',
    description:
      'A creative powerhouse programme combining visual design principles with professional communication skills. Perfect for students passionate about visual storytelling.',
    subjects: [
      { icon: '🖌️', name: 'Graphic Design Fundamentals', detail: 'Canva, colour theory, typography' },
      { icon: '📐', name: 'UI/UX Principles', detail: 'Layout, wireframing, design thinking' },
      { icon: '🗣️', name: 'Communication Skills', detail: 'Public speaking, presentations, writing' },
      { icon: '📸', name: 'Visual Storytelling', detail: 'Social media, branding, portfolios' },
    ],
    badge: 'Creative Track',
  },
  {
    id: 'B',
    title: 'Programme B',
    subtitle: 'Technology (Web Basics) + Designing',
    icon: '💻',
    accentColor: '#00E5FF',
    glowColor: 'rgba(0,229,255,0.3)',
    description:
      'The ultimate maker programme combining the foundations of web technology with design thinking. Build real projects from day one.',
    subjects: [
      { icon: '🌐', name: 'Web Technology Basics', detail: 'HTML, CSS, intro to JavaScript' },
      { icon: '⚡', name: 'Interactive Web Design', detail: 'Responsive layouts, animations' },
      { icon: '🎨', name: 'Digital Design', detail: 'Figma basics, design for web' },
      { icon: '🚀', name: 'Mini Projects', detail: 'Portfolio site, landing page, blog' },
    ],
    badge: 'Tech + Design Track',
  },
];

export default function Programmes() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 70, opacity: 0, rotateX: 8 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            delay: i * 0.15,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = cardsRef.current[index];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = ((centerY - y) / centerY) * 6;

    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1200,
    });
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    const card = cardsRef.current[index];
    if (!card) return;
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power3.out',
      transformPerspective: 1200,
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="programmes"
      className="section"
      style={{ background: 'linear-gradient(180deg, #080c1a 0%, #060918 100%)' }}
    >
      {/* Background orb */}
      <div
        className="orb orb-gold orb-anim-1 absolute pointer-events-none"
        style={{ width: 500, height: 500, top: '10%', left: '-15%', opacity: 0.12 }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.3)' }}>
            Our Programmes
          </span>
          <h2 className="section-title mb-4">
            Choose Your{' '}
            <span className="gradient-text-gold">Learning Path</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Two carefully crafted six-month programmes designed for different interests and career paths. Both include live classes, gamified learning, and a certificate.
          </p>
        </div>

        {/* Programme Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {PROGRAMMES.map((prog, i) => (
            <div
              key={prog.id}
              className="tilt-wrapper"
              style={{ perspective: '1200px' }}
            >
              <div
                ref={(el) => { cardsRef.current[i] = el; }}
                className="tilt-card glass-card p-8 cursor-default group"
                style={{ opacity: 0 }}
                onMouseMove={(e) => handleMouseMove(e, i)}
                onMouseLeave={() => handleMouseLeave(i)}
              >
                {/* Top badge */}
                <div className="flex items-start justify-between mb-6">
                  <span
                    className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full"
                    style={{
                      background: `${prog.accentColor}18`,
                      color: prog.accentColor,
                      border: `1px solid ${prog.accentColor}40`,
                    }}
                  >
                    {prog.badge}
                  </span>
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `${prog.accentColor}15`, border: `1px solid ${prog.accentColor}30` }}
                  >
                    {prog.icon}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="font-heading text-2xl font-700 mb-1"
                  style={{ color: prog.accentColor, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
                >
                  {prog.title}
                </h3>
                <p className="text-white font-semibold text-lg mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {prog.subtitle}
                </p>

                <p className="mb-7 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem' }}>
                  {prog.description}
                </p>

                {/* Subject list */}
                <div className="space-y-3 mb-8">
                  {prog.subjects.map((subj) => (
                    <div
                      key={subj.name}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-white/5"
                    >
                      <span className="text-xl w-8 flex-shrink-0">{subj.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-white">{subj.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{subj.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <a
                  href="https://wa.me/917995214340"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${prog.accentColor}20, ${prog.accentColor}08)`,
                    border: `1px solid ${prog.accentColor}50`,
                    color: prog.accentColor,
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `${prog.accentColor}25`;
                    (e.currentTarget as HTMLElement).style.boxShadow = `0 0 25px ${prog.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = `linear-gradient(135deg, ${prog.accentColor}20, ${prog.accentColor}08)`;
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  }}
                >
                  Enrol in {prog.title}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Duration badge */}
        <div className="flex justify-center mt-12">
          <div className="glass rounded-2xl px-8 py-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span className="text-white/70">Duration: <strong className="text-white">6 Months</strong></span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-white/70">Certificate: <strong className="text-white">Included</strong></span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span className="text-white/70">Grades: <strong className="text-white">6–10</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
