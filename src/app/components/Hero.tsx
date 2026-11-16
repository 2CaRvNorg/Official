'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const WHATSAPP_URL = 'https://wa.me/917995214340';

// Star field data - generated once so SSR doesn't mismatch
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  left: `${(i * 7.3 + 11) % 100}%`,
  top: `${(i * 11.7 + 5) % 100}%`,
  size: (i % 3) + 1,
  delay: `${(i * 0.17) % 4}s`,
  duration: `${3 + (i % 4)}s`,
}));

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const orbsRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const tagRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.5 });
      tl.fromTo(h1Ref.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' })
        .fromTo(tagRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.4')
        .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4');

      // Parallax on scroll — orbs move slower
      if (orbsRef.current) {
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
          onUpdate: (self) => {
            gsap.set(orbsRef.current, { y: self.progress * 150 });
            if (contentRef.current) {
              gsap.set(contentRef.current, { y: self.progress * 80 });
            }
          },
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#060918' }}
    >
      {/* Background Orbs */}
      <div ref={orbsRef} className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Large gold orb — top left */}
        <div
          className="orb orb-gold orb-anim-1"
          style={{ width: 600, height: 600, top: '-15%', left: '-10%' }}
        />
        {/* Cyan orb — bottom right */}
        <div
          className="orb orb-cyan orb-anim-2"
          style={{ width: 500, height: 500, bottom: '-10%', right: '-5%' }}
        />
        {/* Purple accent — center-right */}
        <div
          className="orb orb-purple orb-anim-3"
          style={{ width: 400, height: 400, top: '30%', right: '15%' }}
        />
        {/* Small gold accent — bottom left */}
        <div
          className="orb orb-gold orb-anim-2"
          style={{ width: 300, height: 300, bottom: '20%', left: '10%', opacity: 0.5 }}
        />
      </div>

      {/* Star Field */}
      <div className="star-field" aria-hidden="true">
        {STARS.map((star) => (
          <span
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animation: `twinkle ${star.duration} ${star.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-sm font-medium"
          style={{ opacity: 1 }}>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/70">Now Enrolling — Grades 6–10</span>
        </div>

        <h1
          ref={h1Ref}
          className="section-title mb-4"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', opacity: 0 }}
        >
          <span className="gradient-text-gold">2Carvn</span>{' '}
          <span className="text-white">Academy</span>
        </h1>

        <p
          ref={tagRef}
          className="font-heading font-semibold text-white/90 mb-6"
          style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', opacity: 0 }}
        >
          Learn <span className="gradient-text-cyan">Design</span>,{' '}
          <span style={{ color: '#F5A623' }}>Technology</span> &amp;{' '}
          <span className="gradient-text-cyan">Communication</span>
        </p>

        <p
          ref={subRef}
          className="section-subtitle mx-auto mb-10 text-center"
          style={{ opacity: 0 }}
        >
          A six-month programme for students in Grades 6–10 across Design, Web Technology,
          and Communication. Multi-institution, live, and gamified.
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center" style={{ opacity: 0 }}>
          <a
            href="#programmes"
            className="btn-gold text-base"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#programmes')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12l4 4 4-4" />
            </svg>
            Explore Programmes
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cyan text-base"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="mt-20 flex justify-center">
          <div className="flex flex-col items-center gap-2 text-white/30 text-xs font-medium tracking-widest uppercase">
            <span>Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
