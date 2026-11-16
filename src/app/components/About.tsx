'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const STATS = [
  { value: '3', label: 'Subjects', icon: '📚', color: '#F5A623' },
  { value: '2', label: 'Programmes', icon: '🎓', color: '#00E5FF' },
  { value: '6–10', label: 'Grades', icon: '🏫', color: '#7B61FF' },
  { value: '6', label: 'Months', icon: '📅', color: '#F5A623' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Text block slide in from left
      gsap.fromTo(
        textRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stat cards stagger in from right
      const cards = statsRef.current?.querySelectorAll('.stat-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 50, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.5)',
            stagger: 0.12,
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section"
      style={{ background: 'linear-gradient(180deg, #060918 0%, #080c1a 100%)' }}
    >
      {/* Background accent */}
      <div
        className="orb orb-cyan orb-anim-3 absolute pointer-events-none"
        style={{ width: 400, height: 400, top: '20%', right: '-10%', opacity: 0.15 }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
            About Us
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div ref={textRef} style={{ opacity: 0 }}>
            <h2 className="section-title mb-6">
              Building Tomorrow's{' '}
              <span className="gradient-text-gold">Creators</span>,{' '}
              <span className="gradient-text-cyan">Today</span>
            </h2>

            <div className="glow-divider mb-8" />

            <p className="mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem' }}>
              <strong className="text-white">2Carvn Academy</strong> is a modern multi-institution learning platform
              purpose-built for school students in <strong className="text-white">Grades 6–10</strong>. We partner
              with schools across the region to deliver structured, six-month skill programmes that go beyond textbooks.
            </p>
            <p className="mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem' }}>
              Students engage in <span className="text-[#F5A623] font-semibold">live Google Meet classes</span>, earn
              badges through gamified challenges, track their progress in real time, and walk away with a verifiable
              certificate — all within a secure, role-based platform.
            </p>
            <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)', fontSize: '1.05rem' }}>
              Whether your school is a registered institution or an independent centre, 2Carvn Academy scales to fit.
              Students gain industry-relevant skills in Design, Web Technology, and Communication — the building blocks
              of every future career.
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              {['Skill-Based', 'Live Classes', 'Gamified', 'Certified'].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full text-sm font-medium glass"
                  style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Stat Cards */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 gap-5"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-card glass-card p-7 flex flex-col items-start gap-3 group hover:-translate-y-1 transition-transform duration-300"
                style={{ opacity: 0 }}
              >
                <div
                  className="icon-ring text-2xl"
                  style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    className="font-heading font-800 text-4xl leading-none mb-1"
                    style={{ color: stat.color, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800 }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {stat.label}
                  </div>
                </div>
                {/* Bottom accent line */}
                <div
                  className="w-0 group-hover:w-full h-0.5 rounded-full transition-all duration-500 mt-auto"
                  style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
