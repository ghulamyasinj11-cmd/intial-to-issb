import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Shield, Plane, Anchor, GraduationCap, Heart, School } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

export default function ExamCoverage() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const content = getContent();
  const { examCoverage } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        header,
        { opacity: 0, x: '-4vw' },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      const cardElements = cards.querySelectorAll('.exam-card');
      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
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

  const getIconForExam = (name: string) => {
    if (name.includes('ISSB')) return Shield;
    if (name.includes('PMA')) return GraduationCap;
    if (name.includes('PAF')) return Plane;
    if (name.includes('Navy')) return Anchor;
    if (name.includes('AFNS')) return Heart;
    if (name.includes('Cadet')) return School;
    return Shield;
  };

  return (
    <section
      id="courses"
      ref={sectionRef}
      className="relative w-full bg-[#F6F7F9] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Header */}
          <div ref={headerRef} className="lg:col-span-1">
            <span className="eyebrow block mb-4">{examCoverage.subtitle}</span>
            <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#0B1220] leading-tight mb-4">
              {examCoverage.title}
            </h2>
            <p className="text-lg text-[#5A6578] leading-relaxed">
              {examCoverage.description}
            </p>
          </div>

          {/* Cards Grid */}
          <div
            ref={cardsRef}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6"
          >
            {examCoverage.exams.map((exam) => {
              const IconComponent = getIconForExam(exam.name);
              return (
                <div
                  key={exam.name}
                  className="exam-card bg-white rounded-[24px] p-6 border border-[rgba(11,18,32,0.08)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(0,0,0,0.1)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0B1220] mb-2">
                    {exam.name}
                  </h3>
                  <p className="text-sm text-[#5A6578]">{exam.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
