// Types for Pak Forces Prep Website

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  date: string;
  image?: string;
  category: string;
  published: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  duration: string;
  price: string;
  image?: string;
  category: string;
  features: string[];
  published: boolean;
}

export interface Section {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  order: number;
  visible: boolean;
  type: 'hero' | 'features' | 'courses' | 'testimonials' | 'team' | 'contact' | 'custom';
}

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

export interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stats: { label: string; value: string; description: string }[];
  };
  subjects: {
    title: string;
    subtitle: string;
    description: string;
    items: { name: string; description: string; icon: string }[];
  };
  studyModes: {
    title: string;
    subtitle: string;
    items: { name: string; description: string; image: string }[];
  };
  successStories: {
    title: string;
    subtitle: string;
    stat: string;
    statLabel: string;
    testimonials: { quote: string; author: string; role: string }[];
    wideCardText: string;
  };
  whyChoose: {
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    chips: string[];
  };
  examCoverage: {
    title: string;
    subtitle: string;
    description: string;
    exams: { name: string; description: string }[];
  };
  studyPlanner: {
    title: string;
    subtitle: string;
    description: string;
    schedule: { day: string; topic: string }[];
    pills: string[];
  };
  instructors: {
    title: string;
    subtitle: string;
    description: string;
    items: { name: string; role: string; image: string }[];
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    email: string;
    phone: string;
    hours: string;
  };
}

export interface AdminUser {
  email: string;
  isAuthenticated: boolean;
}

export interface SiteData {
  blogs: Blog[];
  courses: Course[];
  sections: Section[];
  theme: Theme;
  content: SiteContent;
}
