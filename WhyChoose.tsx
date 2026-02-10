import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Calendar, Users } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

const chipIcons = [
  <Target className="w-5 h-5" />,
  <Calendar className="w-5 h-5" />,
  <Users className="w-5 h-5" />,
];

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);

  const content = getContent();
  const { whyChoose } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    const chips = chipsRef.current;

    if (!section || !image || !text || !chips) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          image,
          { x: '60vw', scale: 0.92, opacity: 0 },
          { x: 0, scale: 1, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(
          text.querySelectorAll('.animate-item'),
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0
        )
        .fromTo(
          chips.querySelectorAll('.feature-chip'),
          { y: '30vh', opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.02, ease: 'none' },
          0.1
        );

      // SETTLE (30% - 70%) - hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          text,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          image,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          chips,
          { y: 0, opacity: 1 },
          { y: '10vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="why-choose"
      ref={sectionRef}
      className="relative w-full h-screen bg-[#111827] overflow-hidden z-20"
    >
      {/* Left Text Block */}
      <div
        ref={textRef}
        className="absolute left-[6vw] top-[22vh] w-[40vw] max-w-xl z-10"
      >
        <span className="eyebrow animate-item block mb-4 text-white/60">
          {whyChoose.subtitle}
        </span>
        <h2 className="animate-item text-[clamp(36px,4.5vw,64px)] font-bold text-white leading-tight mb-6">
          {whyChoose.title}
        </h2>
        <p className="animate-item text-lg text-white/70 leading-relaxed mb-8">
          {whyChoose.description}
        </p>
        <button className="animate-item btn-primary">
          {whyChoose.cta}
        </button>
      </div>

      {/* Right Image Pill */}
      <div
        ref={imageRef}
        className="absolute right-[6vw] top-[16vh] w-[44vw] h-[68vh] pill-image shadow-2xl"
      >
        <img
          src="/why_drill.jpg"
          alt="Training Drill"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Feature Chips */}
      <div
        ref={chipsRef}
        className="absolute left-[6vw] right-[6vw] bottom-[8vh] flex flex-wrap gap-4 z-10"
      >
        {whyChoose.chips.map((chip, index) => (
          <div
            key={chip}
            className="feature-chip flex items-center space-x-3 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <span className="text-[#1D4ED8]">{chipIcons[index]}</span>
            <span className="text-white font-medium">{chip}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
