'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FEATURES = [
  {
    icon: '🎥',
    title: 'Live Classes via Google Meet',
    text: 'Real-time interactive sessions with experienced instructors. Ask questions, collaborate, and learn from anywhere.',
    color: '#00E5FF',
  },
  {
    icon: '🎮',
    title: 'Gamified Learning',
    text: 'Earn XP points, unlock badges, and maintain streaks. Learning that feels like playing a game — seriously.',
    color: '#F5A623',
  },
  {
    icon: '📊',
    title: 'Progress Tracking & Reports',
    text: 'Detailed performance dashboards for students, parents, and institutions. Know exactly where you stand.',
    color: '#7B61FF',
  },
  {
    icon: '🏆',
    title: 'Certificate on Completion',
    text: 'Earn a verifiable digital certificate upon successfully completing the programme. Shareable on LinkedIn.',
    color: '#F5A623',
  },
  {
    icon: '🏫',
    title: 'Multi-Institution Support',
    text: 'Designed to serve multiple schools under a single platform. Institutions get custom dashboards and control.',
    color: '#00E5FF',
  },
  {
    icon: '🔒',
    title: 'Secure & Role-Based Platform',
    text: 'Separate access levels for Students, Teachers, Institution Heads, and Admins. Privacy by design.',
    color: '#7B61FF',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const cards = cardsContainerRef.current?.querySelectorAll('.feature-card');
      if (!cards || cards.length === 0) return;

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section"
      style={{ background: 'linear-gradient(180deg, #060918 0%, #08091c 100%)' }}
    >
      {/* Background orbs */}
      <div
        className="orb orb-purple orb-anim-2 absolute pointer-events-none"
        style={{ width: 500, height: 500, bottom: '-5%', right: '-10%', opacity: 0.15 }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(123,97,255,0.12)', color: '#7B61FF', border: '1px solid rgba(123,97,255,0.3)' }}>
            Why 2Carvn
          </span>
          <h2 className="section-title mb-4">
            Everything You Need to{' '}
            <span className="gradient-text-gold">Succeed</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            A complete learning ecosystem built from the ground up for school students — not a generic platform, but purpose-designed for Grades 6–10.
          </p>
        </div>

        {/* Feature Grid */}
        <div
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="feature-card glass-card p-7 group hover:-translate-y-1.5 transition-transform duration-300 cursor-default"
              style={{ opacity: 0 }}
            >
              {/* Icon */}
              <div
                className="icon-ring mb-5 text-2xl"
                style={{
                  background: `${feature.color}12`,
                  border: `1px solid ${feature.color}25`,
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                }}
              >
                {feature.icon}
              </div>

              {/* Content */}
              <h3
                className="font-heading font-700 text-lg mb-3 text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700 }}
              >
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                {feature.text}
              </p>

              {/* Hover glow line at bottom */}
              <div
                className="mt-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
