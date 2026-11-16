'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FAQS = [
  {
    q: 'Who can enrol in 2Carvn Academy?',
    a: 'Any student currently enrolled in Grades 6 through 10 can join our programmes. We welcome students from all schools, including those partnered as institutions on our platform and independent learners.',
  },
  {
    q: 'What are the two programmes offered?',
    a: 'Programme A focuses on Designing + Communication, covering graphic design, UI/UX principles, and professional communication skills. Programme B combines Technology (Web Basics) + Designing — perfect for students wanting to build real web projects alongside design fundamentals.',
  },
  {
    q: 'How are classes conducted?',
    a: 'All classes are conducted live via Google Meet. Sessions are interactive with real-time Q&A, screen sharing, and collaborative exercises. Class schedules are fixed and you will receive your timetable after enrolment.',
  },
  {
    q: 'How long is each programme?',
    a: 'Each programme runs for six months. The curriculum is carefully paced to cover theory, practice, and projects — with new content released weekly alongside live sessions.',
  },
  {
    q: 'Will I receive a certificate?',
    a: 'Yes! Students who successfully complete the programme requirements (attendance, assignments, and final project) receive a verifiable digital certificate from 2Carvn Academy. This certificate is shareable on LinkedIn and other platforms.',
  },
  {
    q: 'What is the fee structure?',
    a: 'Fees vary by programme and institution. Please contact us via WhatsApp for the exact pricing for your school or as an individual learner. We offer flexible payment plans.',
  },
  {
    q: 'How does gamified learning work?',
    a: 'Our platform rewards engagement! You earn XP points for attending classes, submitting assignments, and completing quizzes. Accumulate enough XP to level up, unlock badges, and maintain streaks. It makes the learning journey genuinely exciting.',
  },
  {
    q: 'Is 2Carvn Academy available for my school?',
    a: 'Yes — we support multi-institution setups. Schools can register as partner institutions to access batch management, teacher dashboards, institution reports, and more. Reach out to us on WhatsApp to discuss an institutional partnership.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

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

      const items = listRef.current?.querySelectorAll('.faq-item');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: {
              trigger: listRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggle = (index: number) => {
    const isOpen = openIndex === index;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!reduced) {
      // Animate closed panel
      if (openIndex !== null && panelRefs.current[openIndex]) {
        gsap.to(panelRefs.current[openIndex], {
          height: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        });
      }
    } else {
      if (openIndex !== null && panelRefs.current[openIndex]) {
        (panelRefs.current[openIndex] as HTMLElement).style.height = '0px';
      }
    }

    if (isOpen) {
      setOpenIndex(null);
      return;
    }

    setOpenIndex(index);

    // Need to animate open after state update — use setTimeout
    setTimeout(() => {
      const panel = panelRefs.current[index];
      const content = contentRefs.current[index];
      if (!panel || !content) return;
      const targetHeight = content.scrollHeight;
      if (reduced) {
        panel.style.height = `${targetHeight}px`;
      } else {
        gsap.fromTo(
          panel,
          { height: 0 },
          { height: targetHeight, duration: 0.4, ease: 'power2.out' }
        );
      }
    }, 10);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="section"
      style={{ background: 'linear-gradient(180deg, #060918 0%, #070a16 100%)' }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14" style={{ opacity: 0 }}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.3)' }}>
            FAQs
          </span>
          <h2 className="section-title mb-4">
            Frequently Asked{' '}
            <span className="gradient-text-gold">Questions</span>
          </h2>
          <p className="section-subtitle mx-auto text-center">
            Everything you need to know about 2Carvn Academy. Can't find your answer?{' '}
            <a
              href="https://wa.me/917995214340"
              className="text-[#F5A623] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat with us
            </a>.
          </p>
        </div>

        {/* FAQ List */}
        <div ref={listRef} className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="faq-item glass-card overflow-hidden"
                style={{ opacity: 0 }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className="font-semibold text-white leading-snug"
                    style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem' }}
                  >
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: isOpen ? 'rgba(245,166,35,0.2)' : 'rgba(255,255,255,0.07)',
                      border: isOpen ? '1px solid rgba(245,166,35,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={isOpen ? '#F5A623' : 'rgba(255,255,255,0.6)'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
                    >
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </span>
                </button>

                {/* Animated panel */}
                <div
                  ref={(el) => { panelRefs.current[i] = el; }}
                  style={{ height: 0, overflow: 'hidden' }}
                >
                  <div
                    ref={(el) => { contentRefs.current[i] = el; }}
                    className="px-6 pb-6"
                  >
                    <div className="w-full h-px mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
                    <p className="leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
