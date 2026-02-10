import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { getContent } from '@/lib/dataStore';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: '',
    message: '',
  });

  const content = getContent();
  const { contact } = content;

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const form = formRef.current;
    const image = imageRef.current;

    if (!section || !text || !form || !image) return;

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

      // Form animation
      gsap.fromTo(
        form,
        { opacity: 0, x: '-6vw' },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: form,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Image animation
      gsap.fromTo(
        image,
        { opacity: 0, x: '6vw', scale: 0.98 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: image,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', goal: '', message: '' });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full bg-[#F6F7F9] py-20 lg:py-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left Content */}
          <div>
            <div ref={textRef} className="mb-8">
              <span className="eyebrow animate-item block mb-4">{contact.subtitle}</span>
              <h2 className="animate-item text-[clamp(32px,3.6vw,52px)] font-bold text-[#0B1220] leading-tight mb-4">
                {contact.title}
              </h2>
              <p className="animate-item text-lg text-[#5A6578] leading-relaxed">
                {contact.description}
              </p>
            </div>

            {/* Contact Form */}
            <div
              ref={formRef}
              className="bg-white rounded-[28px] p-6 lg:p-8 border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B1220] mb-2">
                      Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-xl border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B1220] mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="rounded-xl border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#0B1220] mb-2">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      placeholder="+92-300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="rounded-xl border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0B1220] mb-2">
                      Goal
                    </label>
                    <Select
                      value={formData.goal}
                      onValueChange={(value) => setFormData({ ...formData, goal: value })}
                    >
                      <SelectTrigger className="rounded-xl border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]">
                        <SelectValue placeholder="Select your goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="issb">ISSB Preparation</SelectItem>
                        <SelectItem value="pma">PMA Long Course</SelectItem>
                        <SelectItem value="paf">PAF GD(P)</SelectItem>
                        <SelectItem value="navy">Pak Navy</SelectItem>
                        <SelectItem value="afns">AFNS</SelectItem>
                        <SelectItem value="cadet">Cadet College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0B1220] mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your preparation goals..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-xl border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8] min-h-[100px]"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Request a Call
                </Button>
              </form>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t border-[rgba(11,18,32,0.08)]">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-[#1D4ED8]" />
                    <span className="text-xs text-[#5A6578]">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-[#1D4ED8]" />
                    <span className="text-xs text-[#5A6578]">{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#1D4ED8]" />
                    <span className="text-xs text-[#5A6578]">{contact.hours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex items-center justify-center">
            <div
              ref={imageRef}
              className="w-full h-[600px] pill-image shadow-2xl"
            >
              <img
                src="/final_study_scene.jpg"
                alt="Study Scene"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
