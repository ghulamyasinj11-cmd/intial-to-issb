import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

export default function SuccessStories() {
  const sectionRef = useRef<HTMLElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const wideCardRef = useRef<HTMLDivElement>(null);

  const content = getContent();
  const { successStories } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const stat = statRef.current;
    const testimonials = testimonialsRef.current;
    const wideCard = wideCardRef.current;

    if (!section || !stat || !testimonials || !wideCard) return;

    const ctx = gsap.context(() => {
      // Stat animation
      gsap.fromTo(
        stat,
        { opacity: 0, x: '-6vw' },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Testimonials animation
      gsap.fromTo(
        testimonials.querySelectorAll('.testimonial-card'),
        { opacity: 0, x: '6vw', rotate: -1 },
        {
          opacity: 1,
          x: 0,
          rotate: 0,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: {
            trigger: testimonials,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Wide card animation
      gsap.fromTo(
        wideCard,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: wideCard,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="success"
      ref={sectionRef}
      className="relative w-full bg-[#F6F7F9] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <span className="eyebrow block mb-4">{successStories.subtitle}</span>
          <h2 className="text-[clamp(32px,3.6vw,52px)] font-bold text-[#0B1220] leading-tight max-w-xl">
            {successStories.title}
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
          {/* Big Stat */}
          <div ref={statRef} className="flex items-center">
            <div className="stat-card w-full py-10 px-8">
              <div className="text-[clamp(48px,6vw,80px)] font-bold text-[#1D4ED8] leading-none">
                {successStories.stat}
              </div>
              <div className="text-lg text-[#5A6578] mt-2">{successStories.statLabel}</div>
            </div>
          </div>

          {/* Testimonials */}
          <div ref={testimonialsRef} className="space-y-4">
            {successStories.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="testimonial-card bg-white rounded-[28px] p-6 lg:p-8 border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              >
                <Quote className="w-8 h-8 text-[#1D4ED8]/30 mb-4" />
                <p className="text-lg text-[#0B1220] font-medium mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] font-bold text-sm">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-semibold text-[#0B1220]">
                      {testimonial.author}
                    </div>
                    <div className="text-xs text-[#5A6578]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Wide Card */}
        <div
          ref={wideCardRef}
          className="relative rounded-[28px] overflow-hidden h-64 lg:h-80"
        >
          <img
            src="/success_parade.jpg"
            alt="Success Parade"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/90 to-[#0B1220]/40"></div>
          <div className="absolute inset-0 flex items-center px-8 lg:px-16">
            <div className="max-w-xl">
              <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                {successStories.wideCardText}
              </h3>
              <p className="text-white/70">
                Join thousands of successful candidates who trusted our preparation methodology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
