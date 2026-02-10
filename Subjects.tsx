import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Calculator, FlaskConical, MapPin, BookMarked, Newspaper } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Calculator,
  FlaskConical,
  MapPin,
  BookMarked,
  Newspaper,
};

export default function Subjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const content = getContent();
  const { subjects } = content;

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
      const cardElements = cards.querySelectorAll('.subject-card');
      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="subjects"
      ref={sectionRef}
      className="relative w-full bg-[#F6F7F9] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div ref={headerRef} className="max-w-2xl mb-12 lg:mb-16">
          <span className="eyebrow animate-item block mb-4">{subjects.subtitle}</span>
          <h2 className="animate-item text-[clamp(32px,3.6vw,52px)] font-bold text-[#0B1220] leading-tight mb-4">
            {subjects.title}
          </h2>
          <p className="animate-item text-lg text-[#5A6578] leading-relaxed">
            {subjects.description}
          </p>
        </div>

        {/* Grid */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {subjects.items.map((subject) => {
            const IconComponent = iconMap[subject.icon] || BookOpen;
            return (
              <div
                key={subject.name}
                className="subject-card bg-white rounded-[28px] p-6 lg:p-8 border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] flex-shrink-0">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0B1220] mb-2">
                      {subject.name}
                    </h3>
                    <p className="text-[#5A6578] leading-relaxed">
                      {subject.description}
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
