'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TESTIMONIALS = [
  {
    quote:
      "2Carvn Academy changed how I think about creativity. The design classes were incredible — I built my first portfolio in just 3 months!",
    name: 'Priya Sharma',
    grade: 'Grade 9',
    programme: 'Programme A',
    avatar: 'PS',
    color: '#F5A623',
  },
  {
    quote:
      "Learning to build websites at Grade 8 felt impossible before this programme. Now I've made two real websites and understand how the internet works!",
    name: 'Arjun Mehta',
    grade: 'Grade 8',
    programme: 'Programme B',
    avatar: 'AM',
    color: '#00E5FF',
  },
  {
    quote:
      "The live classes were my favourite part — I could ask questions in real time. The gamification kept me motivated even during tough weeks.",
    name: 'Sneha Reddy',
    grade: 'Grade 10',
    programme: 'Programme A',
    avatar: 'SR',
    color: '#7B61FF',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        sliderRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: sliderRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setCurrent(index);
  };

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);

  const testimonial = TESTIMONIALS[current];

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="section"
      style={{ background: 'linear-gradient(180deg, #08091c 0%, #060918 100%)' }}
    >
      {/* Background */}
      <div
        className="orb orb-gold orb-anim-3 absolute pointer-events-none"
        style={{ width: 400, height: 400, top: '0%', right: '20%', opacity: 0.1 }}
        aria-hidden="true"
      />

      <div className="w-full px-4 mx-auto max-w-3xl">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623', border: '1px solid rgba(245,166,35,0.3)' }}>
            Student Stories
          </span>
          <h2 className="section-title mb-4">
            Heard from Our{' '}
            <span className="gradient-text-cyan">Students</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Real experiences from real students across different grades and programmes.
          </p>
        </div>

        {/* Testimonial Card */}
        <div ref={sliderRef}>
          <div className="glass-card p-10 relative">
            {/* Quote icon */}
            <div
              className="text-6xl leading-none mb-6 font-serif"
              style={{ color: testimonial.color, opacity: 0.4, fontFamily: 'Georgia, serif' }}
              aria-hidden="true"
            >
              "
            </div>

            {/* Quote text */}
            <p
              className="text-xl leading-relaxed mb-8 text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500, minHeight: 90 }}
            >
              {testimonial.quote}
            </p>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0"
                style={{
                  background: `${testimonial.color}25`,
                  border: `2px solid ${testimonial.color}60`,
                  color: testimonial.color,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {testimonial.avatar}
              </div>
              <div>
                <div className="font-semibold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {testimonial.name}
                </div>
                <div className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {testimonial.grade} · {testimonial.programme}
                </div>
              </div>

              {/* Star rating */}
              <div className="ml-auto flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#F5A623">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>

            {/* Accent glow line */}
            <div
              className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full"
              style={{ background: `linear-gradient(90deg, transparent, ${testimonial.color}, transparent)` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === current ? 28 : 8,
                    height: 8,
                    background: i === current ? TESTIMONIALS[i].color : 'rgba(255,255,255,0.2)',
                  }}
                />
              ))}
            </div>

            <button
              onClick={next}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
