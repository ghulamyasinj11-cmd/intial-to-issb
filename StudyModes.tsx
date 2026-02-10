import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

export default function StudyModes() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const content = getContent();
  const { studyModes } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header.querySelectorAll('.animate-item'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.mode-card');
      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image parallax
      const images = cards.querySelectorAll('.mode-image');
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.06 },
          {
            scale: 1,
            scrollTrigger: {
              trigger: img,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: 0.6,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F6F7F9] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <span className="eyebrow animate-item block mb-4">{studyModes.subtitle}</span>
          <h2 className="animate-item text-[clamp(32px,3.6vw,52px)] font-bold text-[#0B1220] leading-tight">
            {studyModes.title}
          </h2>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {studyModes.items.map((mode) => (
            <div
              key={mode.name}
              className="mode-card bg-white rounded-[28px] overflow-hidden border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              <div className="h-48 lg:h-56 overflow-hidden">
                <img
                  src={mode.image}
                  alt={mode.name}
                  className="mode-image w-full h-full object-cover"
                />
              </div>
              <div className="p-6 lg:p-8">
                <h3 className="text-xl font-bold text-[#0B1220] mb-3">
                  {mode.name}
                </h3>
                <p className="text-[#5A6578] leading-relaxed">
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
