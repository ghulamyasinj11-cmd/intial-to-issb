import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hero from '@/sections/Hero';
import Subjects from '@/sections/Subjects';
import StudyModes from '@/sections/StudyModes';
import SuccessStories from '@/sections/SuccessStories';
import WhyChoose from '@/sections/WhyChoose';
import ExamCoverage from '@/sections/ExamCoverage';
import StudyPlanner from '@/sections/StudyPlanner';
import Instructors from '@/sections/Instructors';
import Contact from '@/sections/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    // Global snap configuration for pinned sections
    const setupSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter((st) => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map((st) => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              (r) => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    // Delay to ensure all ScrollTriggers are created
    const timer = setTimeout(setupSnap, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative">
      <Hero />
      <Subjects />
      <StudyModes />
      <SuccessStories />
      <WhyChoose />
      <ExamCoverage />
      <StudyPlanner />
      <Instructors />
      <Contact />
    </div>
  );
}
