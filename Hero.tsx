import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, TrendingUp, Calendar } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  const content = getContent();
  const { hero } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const text = textRef.current;
    const stats = statsRef.current;

    if (!section || !image || !text || !stats) return;

    const ctx = gsap.context(() => {
      // Auto-play entrance animation
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

      tl.fromTo(
        image,
        { opacity: 0, scale: 0.96, x: '6vw' },
        { opacity: 1, scale: 1, x: 0, duration: 1.1 }
      )
        .fromTo(
          text.querySelectorAll('.animate-item'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          '-=0.7'
        )
        .fromTo(
          stats.querySelectorAll('.stat-card'),
          { opacity: 0, y: '10vh' },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 },
          '-=0.5'
        );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset to visible state when scrolling back to top
            gsap.set([image, text.querySelectorAll('.animate-item'), stats.querySelectorAll('.stat-card')], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            });
          },
        },
      });

      // EXIT phase (70% - 100%)
      scrollTl
        .fromTo(
          text,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          image,
          { x: 0, scale: 1, opacity: 1 },
          { x: '18vw', scale: 0.98, opacity: 0, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          stats,
          { y: 0, opacity: 1 },
          { y: '12vh', opacity: 0, ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    const element = document.querySelector('#contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCourses = () => {
    const element = document.querySelector('#courses');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statIcons = [
    <Users className="w-6 h-6" />,
    <TrendingUp className="w-6 h-6" />,
    <Calendar className="w-6 h-6" />,
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen bg-[#F6F7F9] overflow-hidden z-10"
    >
      {/* Left Text Block */}
      <div
        ref={textRef}
        className="absolute left-[6vw] top-[18vh] w-[38vw] max-w-xl z-10"
      >
        <span className="eyebrow animate-item block mb-4">
          PAKISTAN ARMED FORCES PREPARATION
        </span>
        <h1 className="text-[clamp(40px,5vw,72px)] font-bold text-[#0B1220] leading-[0.95] tracking-[-0.02em] mb-2">
          <span className="animate-item block">{hero.title}</span>
        </h1>
        <h1 className="text-[clamp(40px,5vw,72px)] font-bold text-[#0B1220] leading-[0.95] tracking-[-0.02em] mb-6">
          <span className="animate-item block">{hero.subtitle}</span>
        </h1>
        <p className="animate-item text-lg text-[#5A6578] leading-relaxed mb-8 max-w-md">
          {hero.description}
        </p>
        <div className="animate-item flex flex-wrap gap-4">
          <button onClick={scrollToContact} className="btn-primary">
            {hero.ctaPrimary}
          </button>
          <button onClick={scrollToCourses} className="btn-secondary">
            {hero.ctaSecondary}
          </button>
        </div>
      </div>

      {/* Right Hero Image Pill */}
      <div
        ref={imageRef}
        className="absolute right-[6vw] top-[14vh] w-[44vw] h-[72vh] pill-image shadow-2xl"
      >
        <img
          src="/hero_cadets.jpg"
          alt="Pakistan Armed Forces Cadets"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom Stats Row */}
      <div
        ref={statsRef}
        className="absolute left-[6vw] right-[6vw] bottom-[6vh] flex flex-wrap gap-4 lg:gap-6 z-10"
      >
        {hero.stats.map((stat, index) => (
          <div
            key={stat.label}
            className="stat-card flex-1 min-w-[200px] max-w-[28vw] flex items-center space-x-4"
          >
            <div className="w-12 h-12 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
              {statIcons[index]}
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0B1220]">{stat.value}</div>
              <div className="text-sm text-[#5A6578]">{stat.description}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
