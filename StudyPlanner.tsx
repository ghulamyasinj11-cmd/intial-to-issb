import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, BookOpen, BarChart3, CheckCircle2 } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

const pillIcons = [
  <CheckCircle2 className="w-5 h-5" />,
  <BookOpen className="w-5 h-5" />,
  <BarChart3 className="w-5 h-5" />,
];

export default function StudyPlanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null);
  const pillsRef = useRef<HTMLDivElement>(null);

  const content = getContent();
  const { studyPlanner } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const schedule = scheduleRef.current;
    const pills = pillsRef.current;

    if (!section || !text || !schedule || !pills) return;

    const ctx = gsap.context(() => {
      // Text animation
      gsap.fromTo(
        text.querySelectorAll('.animate-item'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: text,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Schedule card animation
      gsap.fromTo(
        schedule,
        { opacity: 0, x: '6vw' },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: schedule,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Pills animation
      gsap.fromTo(
        pills.querySelectorAll('.planner-pill'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: pills,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F6F7F9] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Content */}
          <div>
            <div ref={textRef} className="max-w-md mb-10">
              <span className="eyebrow animate-item block mb-4">{studyPlanner.subtitle}</span>
              <h2 className="animate-item text-[clamp(32px,3.6vw,52px)] font-bold text-[#0B1220] leading-tight mb-4">
                {studyPlanner.title}
              </h2>
              <p className="animate-item text-lg text-[#5A6578] leading-relaxed">
                {studyPlanner.description}
              </p>
            </div>

            {/* Feature Pills */}
            <div ref={pillsRef} className="flex flex-wrap gap-3">
              {studyPlanner.pills.map((pill, index) => (
                <div
                  key={pill}
                  className="planner-pill inline-flex items-center space-x-2 px-5 py-3 bg-white rounded-full border border-[rgba(11,18,32,0.08)] shadow-sm"
                >
                  <span className="text-[#1D4ED8]">{pillIcons[index]}</span>
                  <span className="text-sm font-medium text-[#0B1220]">{pill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Schedule Card */}
          <div
            ref={scheduleRef}
            className="bg-white rounded-[28px] p-6 lg:p-8 border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8]">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-[#0B1220]">Weekly Study Schedule</h3>
            </div>

            <div className="space-y-3">
              {studyPlanner.schedule.map((item, index) => (
                <div
                  key={item.day}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#F6F7F9] hover:bg-[#1D4ED8]/5 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-[#1D4ED8] text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="font-semibold text-[#0B1220]">{item.day}</span>
                  </div>
                  <span className="text-sm text-[#5A6578]">{item.topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
