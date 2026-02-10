// Data Store for Pak Forces Prep - Uses localStorage for persistence

import type { Blog, Course, Theme, SiteContent, SiteData } from '@/types';

const STORAGE_KEY = 'pakforcesprep_data';
const ADMIN_KEY = 'pakforcesprep_admin';

export const defaultTheme: Theme = {
  primaryColor: '#0B1220',
  secondaryColor: '#5A6578',
  accentColor: '#1D4ED8',
  backgroundColor: '#F6F7F9',
  textColor: '#0B1220',
  fontFamily: 'Inter',
};

export const defaultContent: SiteContent = {
  hero: {
    title: 'Start Your Journey',
    subtitle: 'to Serve with Pride',
    description: 'Structured courses, daily tests, and smart revision for ISSB, PMA, PAF, and competitive exams.',
    ctaPrimary: 'Start Free Trial',
    ctaSecondary: 'View Programs',
    stats: [
      { label: '12K+ Students', value: '12K+', description: 'Enrolled across Pakistan' },
      { label: '94% Success', value: '94%', description: 'Recommended by toppers' },
      { label: 'Daily Tests', value: 'Daily', description: 'Live + recorded analysis' },
    ],
  },
  subjects: {
    title: 'Everything you need, topic by topic.',
    subtitle: 'SUBJECTS',
    description: 'Each subject includes video lessons, notes, quizzes, and past-paper solutions.',
    items: [
      { name: 'English', description: 'Grammar, vocabulary, comprehension, and essay frameworks.', icon: 'BookOpen' },
      { name: 'Mathematics', description: 'Arithmetic, algebra, geometry, and problem shortcuts.', icon: 'Calculator' },
      { name: 'General Science', description: 'Physics, chemistry, biology concepts made simple.', icon: 'FlaskConical' },
      { name: 'Pakistan Studies', description: 'History, constitution, and key national events.', icon: 'MapPin' },
      { name: 'Islamiat', description: 'Core teachings, ethics, and exam-focused answers.', icon: 'BookMarked' },
      { name: 'Current Affairs', description: 'Monthly summaries with MCQs and analysis.', icon: 'Newspaper' },
    ],
  },
  studyModes: {
    title: 'Choose how you learn best.',
    subtitle: 'STUDY MODES',
    items: [
      { name: 'Live Classes', description: 'Real-time teaching, Q&A, and weekly masterclasses.', image: '/live_classroom.jpg' },
      { name: 'Self-Paced', description: 'Recorded lessons, notes, and quizzes on your schedule.', image: '/selfpaced_notes.jpg' },
      { name: 'Mock Tests', description: 'Full-length papers with detailed solutions and ranking.', image: '/mock_test_computer.jpg' },
    ],
  },
  successStories: {
    title: 'Built on results. Backed by students.',
    subtitle: 'SUCCESS STORIES',
    stat: '12,000+',
    statLabel: 'Students enrolled',
    testimonials: [
      { quote: 'The daily tests changed my confidence.', author: 'Ayesha K.', role: 'ISSB Recommended' },
      { quote: 'Short notes saved me hours.', author: 'Hassan R.', role: 'PAF GD(P)' },
    ],
    wideCardText: '94% of our students recommend Pak Forces Prep.',
  },
  whyChoose: {
    title: 'Discipline That Delivers',
    subtitle: 'WHY CHOOSE US',
    description: 'We combine clear strategy, daily accountability, and expert mentorship—so you stay ready under pressure.',
    cta: 'See How It Works',
    chips: ['Clear Strategy', 'Daily Accountability', 'Expert Mentorship'],
  },
  examCoverage: {
    title: 'Tests we cover.',
    subtitle: 'EXAM COVERAGE',
    description: 'Targeted batches for each stage of selection.',
    exams: [
      { name: 'ISSB', description: 'Psychology, GTO, interviews' },
      { name: 'PMA Long Course', description: 'Initial + ISSB prep' },
      { name: 'PAF', description: 'GD(P), Admin, Engineering' },
      { name: 'Pak Navy', description: 'PN Cadet + technical entries' },
      { name: 'AFNS', description: 'Nursing entry preparation' },
      { name: 'Cadet Colleges', description: '5th–8th class entry tests' },
    ],
  },
  studyPlanner: {
    title: 'Your weekly roadmap.',
    subtitle: 'STUDY PLANNER',
    description: 'A balanced plan that builds speed without burnout.',
    schedule: [
      { day: 'Monday', topic: 'English + Current Affairs' },
      { day: 'Tuesday', topic: 'Mathematics + Short Notes' },
      { day: 'Wednesday', topic: 'Mock Test + Review' },
      { day: 'Thursday', topic: 'Pak Studies + Islamiat' },
      { day: 'Friday', topic: 'Science + Doubt Session' },
    ],
    pills: ['Daily Targets', 'Revision Blocks', 'Test Analysis'],
  },
  instructors: {
    title: 'Learn from the best.',
    subtitle: 'INSTRUCTORS',
    description: 'Officers, subject specialists, and top scorers who\'ve walked the same path.',
    items: [
      { name: 'Major Ali R.', role: 'ISSB Psychologist', image: '/instructor_01.jpg' },
      { name: 'Dr. Sana T.', role: 'Mathematics Specialist', image: '/instructor_02.jpg' },
      { name: 'Captain Bilal K.', role: 'GTO & Interview Mentor', image: '/instructor_03.jpg' },
    ],
  },
  contact: {
    title: 'Ready to serve? Start today.',
    subtitle: 'BEGIN YOUR PREPARATION',
    description: 'Join thousands of students preparing with discipline, strategy, and support.',
    email: 'support@pakforcesprep.pk',
    phone: '+92-300-1234567',
    hours: 'Mon–Sat, 9:00 AM – 7:00 PM',
  },
};

export const defaultData: SiteData = {
  blogs: [
    {
      id: '1',
      title: 'How to Crack ISSB: Complete Guide 2024',
      content: 'ISSB (Inter Services Selection Board) is one of the most challenging selection processes...',
      excerpt: 'Complete guide to preparing for ISSB selection process with tips from recommended candidates.',
      author: 'Major Ali R.',
      date: '2024-01-15',
      category: 'ISSB',
      published: true,
    },
    {
      id: '2',
      title: 'Daily Study Routine for PMA Long Course',
      content: 'A structured daily routine is essential for PMA Long Course preparation...',
      excerpt: 'Learn the optimal daily study schedule that has helped 1000+ students get recommended.',
      author: 'Captain Bilal K.',
      date: '2024-01-10',
      category: 'PMA',
      published: true,
    },
  ],
  courses: [
    {
      id: '1',
      title: 'ISSB Complete Preparation',
      description: 'Comprehensive ISSB preparation with psychology, GTO, and interview training.',
      fullDescription: 'This comprehensive course covers all aspects of ISSB preparation including psychological tests, GTO tasks, and interview techniques. Led by recommended candidates and psychologists.',
      duration: '8 Weeks',
      price: 'PKR 15,000',
      category: 'ISSB',
      features: ['Daily Tests', 'Mock Interviews', 'GTO Practice', 'Psychological Assessment'],
      published: true,
    },
    {
      id: '2',
      title: 'PMA Long Course Batch',
      description: 'Complete preparation for PMA Long Course initial test and ISSB.',
      fullDescription: 'Specialized batch for PMA Long Course aspirants covering academic subjects, physical training guidance, and complete ISSB preparation.',
      duration: '12 Weeks',
      price: 'PKR 20,000',
      category: 'PMA',
      features: ['Academic Subjects', 'Physical Training Guide', 'ISSB Prep', 'Past Papers'],
      published: true,
    },
    {
      id: '3',
      title: 'PAF GD(P) Preparation',
      description: 'Specialized course for PAF GD(P) initial test and medical preparation.',
      fullDescription: 'Focused preparation for PAF GD(P) entry including academic tests, ISSB preparation, and guidance for medical standards.',
      duration: '10 Weeks',
      price: 'PKR 18,000',
      category: 'PAF',
      features: ['Academic Tests', 'Medical Guidelines', 'ISSB Prep', 'Personality Development'],
      published: true,
    },
  ],
  sections: [],
  theme: defaultTheme,
  content: defaultContent,
};

// Initialize data in localStorage
export const initializeData = (): void => {
  if (typeof window === 'undefined') return;
  
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  }
};

// Get all site data
export const getSiteData = (): SiteData => {
  if (typeof window === 'undefined') return defaultData;
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    initializeData();
    return defaultData;
  }
  return { ...defaultData, ...JSON.parse(data) };
};

// Save all site data
export const saveSiteData = (data: SiteData): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Blog operations
export const getBlogs = (): Blog[] => {
  return getSiteData().blogs;
};

export const getBlogById = (id: string): Blog | undefined => {
  return getSiteData().blogs.find(b => b.id === id);
};

export const addBlog = (blog: Omit<Blog, 'id'>): Blog => {
  const data = getSiteData();
  const newBlog = { ...blog, id: Date.now().toString() };
  data.blogs = [...data.blogs, newBlog];
  saveSiteData(data);
  return newBlog;
};

export const updateBlog = (id: string, blog: Partial<Blog>): Blog | null => {
  const data = getSiteData();
  const index = data.blogs.findIndex(b => b.id === id);
  if (index === -1) return null;
  
  data.blogs[index] = { ...data.blogs[index], ...blog };
  saveSiteData(data);
  return data.blogs[index];
};

export const deleteBlog = (id: string): boolean => {
  const data = getSiteData();
  const initialLength = data.blogs.length;
  data.blogs = data.blogs.filter(b => b.id !== id);
  saveSiteData(data);
  return data.blogs.length < initialLength;
};

// Course operations
export const getCourses = (): Course[] => {
  return getSiteData().courses;
};

export const getCourseById = (id: string): Course | undefined => {
  return getSiteData().courses.find(c => c.id === id);
};

export const addCourse = (course: Omit<Course, 'id'>): Course => {
  const data = getSiteData();
  const newCourse = { ...course, id: Date.now().toString() };
  data.courses = [...data.courses, newCourse];
  saveSiteData(data);
  return newCourse;
};

export const updateCourse = (id: string, course: Partial<Course>): Course | null => {
  const data = getSiteData();
  const index = data.courses.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  data.courses[index] = { ...data.courses[index], ...course };
  saveSiteData(data);
  return data.courses[index];
};

export const deleteCourse = (id: string): boolean => {
  const data = getSiteData();
  const initialLength = data.courses.length;
  data.courses = data.courses.filter(c => c.id !== id);
  saveSiteData(data);
  return data.courses.length < initialLength;
};

// Theme operations
export const getTheme = (): Theme => {
  return getSiteData().theme;
};

export const updateTheme = (theme: Partial<Theme>): Theme => {
  const data = getSiteData();
  data.theme = { ...data.theme, ...theme };
  saveSiteData(data);
  return data.theme;
};

// Content operations
export const getContent = (): SiteContent => {
  return getSiteData().content;
};

export const updateContent = (content: Partial<SiteContent>): SiteContent => {
  const data = getSiteData();
  data.content = { ...data.content, ...content };
  saveSiteData(data);
  return data.content;
};

// Admin authentication
export const loginAdmin = (email: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Only allow meergyj@gmail.com
  if (email.toLowerCase() !== 'meergyj@gmail.com') {
    return false;
  }
  
  localStorage.setItem(ADMIN_KEY, JSON.stringify({ email, isAuthenticated: true }));
  return true;
};

export const logoutAdmin = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_KEY);
};

export const isAdminAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const admin = localStorage.getItem(ADMIN_KEY);
  if (!admin) return false;
  
  try {
    const parsed = JSON.parse(admin);
    return parsed.isAuthenticated === true && parsed.email === 'meergyj@gmail.com';
  } catch {
    return false;
  }
};

export const getAdminEmail = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const admin = localStorage.getItem(ADMIN_KEY);
  if (!admin) return null;
  
  try {
    const parsed = JSON.parse(admin);
    return parsed.email;
  } catch {
    return null;
  }
};

// Reset to defaults
export const resetToDefaults = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
};
