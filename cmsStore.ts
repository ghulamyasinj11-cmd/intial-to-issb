// Comprehensive CMS Data Store
// Manages pages, menus, media, settings, and all CMS content

import { v4 as uuidv4 } from 'uuid';
import type {
  Page,
  PageSection,
  Menu,
  MediaFile,
  MediaFolder,
  SEOSettings,
  SiteSettings,
  ThemeSettings,
  Backup,
} from '@/types/cms';
import { logActivity } from './auth';

// Storage keys
const PAGES_KEY = 'cms_pages';
const MENUS_KEY = 'cms_menus';
const MEDIA_KEY = 'cms_media';
const MEDIA_FOLDERS_KEY = 'cms_media_folders';
const SEO_KEY = 'cms_seo';
const SITE_SETTINGS_KEY = 'cms_site_settings';
const THEME_KEY = 'cms_theme';
const BACKUPS_KEY = 'cms_backups';

// Default values
const DEFAULT_SEO: SEOSettings = {
  siteTitle: 'Pak Forces Prep - Pakistan Armed Forces Preparation',
  siteDescription: 'Structured courses, daily tests, and smart revision for ISSB, PMA, PAF, and competitive exams.',
  siteKeywords: 'ISSB, PMA, PAF, Pakistan Army, Navy, Air Force, preparation, tests, courses',
  robotsTxt: 'User-agent: *\nDisallow: /admin\nAllow: /',
  sitemapEnabled: true,
  canonicalUrls: true,
  structuredData: true,
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'Pak Forces Prep',
  tagline: 'Structured. Smart. Service-Ready.',
  footerText: 'Pak Forces Prep - Your partner in armed forces preparation.',
  copyrightText: '© {year} Pak Forces Prep. All rights reserved.',
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com/pakforcesprep', icon: 'facebook' },
    { platform: 'Twitter', url: 'https://twitter.com/pakforcesprep', icon: 'twitter' },
    { platform: 'Instagram', url: 'https://instagram.com/pakforcesprep', icon: 'instagram' },
    { platform: 'YouTube', url: 'https://youtube.com/pakforcesprep', icon: 'youtube' },
  ],
  contactInfo: {
    email: 'support@pakforcesprep.pk',
    phone: '+92-300-1234567',
    address: 'Lahore, Pakistan',
    hours: 'Mon–Sat, 9:00 AM – 7:00 PM',
  },
  maintenanceMode: false,
  maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
};

const DEFAULT_THEME: ThemeSettings = {
  colors: {
    primary: '#0B1220',
    secondary: '#5A6578',
    accent: '#1D4ED8',
    background: '#F6F7F9',
    surface: '#FFFFFF',
    text: '#0B1220',
    textMuted: '#5A6578',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  typography: {
    headingFont: 'Space Grotesk',
    bodyFont: 'Inter',
    baseSize: 16,
    lineHeight: 1.6,
  },
  spacing: {
    sectionPadding: 80,
    containerWidth: 1280,
    gridGap: 24,
  },
  borderRadius: {
    small: 8,
    medium: 16,
    large: 28,
    pill: 999,
  },
  shadows: {
    small: '0 2px 8px rgba(0,0,0,0.08)',
    medium: '0 8px 30px rgba(0,0,0,0.12)',
    large: '0 18px 50px rgba(0,0,0,0.15)',
  },
};

// Initialize CMS
export const initializeCMS = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize pages if empty
  if (!localStorage.getItem(PAGES_KEY)) {
    const homePage: Page = {
      id: uuidv4(),
      title: 'Home',
      slug: '/',
      description: 'Welcome to Pak Forces Prep',
      sections: createDefaultHomeSections(),
      isPublished: true,
      isHomePage: true,
      metaTitle: 'Pak Forces Prep - Pakistan Armed Forces Preparation',
      metaDescription: 'Structured courses, daily tests, and smart revision for ISSB, PMA, PAF.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: 'system',
    };
    savePages([homePage]);
  }

  // Initialize menus if empty
  if (!localStorage.getItem(MENUS_KEY)) {
    const headerMenu: Menu = {
      id: uuidv4(),
      name: 'Header Menu',
      location: 'header',
      items: [
        { id: uuidv4(), label: 'Home', type: 'page', pageId: 'home', order: 0, isVisible: true },
        { id: uuidv4(), label: 'Courses', type: 'page', pageId: 'courses', order: 1, isVisible: true },
        { id: uuidv4(), label: 'Blog', type: 'page', pageId: 'blog', order: 2, isVisible: true },
        { id: uuidv4(), label: 'Contact', type: 'page', pageId: 'contact', order: 3, isVisible: true },
      ],
    };
    saveMenus([headerMenu]);
  }

  // Initialize other settings
  if (!localStorage.getItem(SEO_KEY)) {
    localStorage.setItem(SEO_KEY, JSON.stringify(DEFAULT_SEO));
  }
  if (!localStorage.getItem(SITE_SETTINGS_KEY)) {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  }
  if (!localStorage.getItem(THEME_KEY)) {
    localStorage.setItem(THEME_KEY, JSON.stringify(DEFAULT_THEME));
  }
  if (!localStorage.getItem(MEDIA_FOLDERS_KEY)) {
    localStorage.setItem(MEDIA_FOLDERS_KEY, JSON.stringify([{ id: 'root', name: 'Root', createdAt: new Date().toISOString() }]));
  }
};

// Create default home page sections
const createDefaultHomeSections = (): PageSection[] => [
  {
    id: uuidv4(),
    type: 'hero',
    name: 'Hero Section',
    order: 0,
    isVisible: true,
    settings: {
      backgroundImage: '/hero_cadets.jpg',
      overlayOpacity: 0.3,
      textAlign: 'left',
    },
    content: {
      eyebrow: 'PAKISTAN ARMED FORCES PREPARATION',
      title: 'Start Your Journey',
      subtitle: 'to Serve with Pride',
      description: 'Structured courses, daily tests, and smart revision for ISSB, PMA, PAF, and competitive exams.',
      ctaPrimary: { text: 'Start Free Trial', link: '#contact' },
      ctaSecondary: { text: 'View Programs', link: '#courses' },
      stats: [
        { value: '12K+', label: 'Students', description: 'Enrolled across Pakistan' },
        { value: '94%', label: 'Success', description: 'Recommended by toppers' },
        { value: 'Daily', label: 'Tests', description: 'Live + recorded analysis' },
      ],
    },
  },
  {
    id: uuidv4(),
    type: 'features',
    name: 'Subjects Section',
    order: 1,
    isVisible: true,
    settings: { columns: 2, style: 'cards' },
    content: {
      eyebrow: 'SUBJECTS',
      title: 'Everything you need, topic by topic.',
      description: 'Each subject includes video lessons, notes, quizzes, and past-paper solutions.',
      features: [
        { icon: 'BookOpen', title: 'English', description: 'Grammar, vocabulary, comprehension, and essay frameworks.' },
        { icon: 'Calculator', title: 'Mathematics', description: 'Arithmetic, algebra, geometry, and problem shortcuts.' },
        { icon: 'FlaskConical', title: 'General Science', description: 'Physics, chemistry, biology concepts made simple.' },
        { icon: 'MapPin', title: 'Pakistan Studies', description: 'History, constitution, and key national events.' },
        { icon: 'BookMarked', title: 'Islamiat', description: 'Core teachings, ethics, and exam-focused answers.' },
        { icon: 'Newspaper', title: 'Current Affairs', description: 'Monthly summaries with MCQs and analysis.' },
      ],
    },
  },
];

// ==================== PAGES ====================

export const getPages = (): Page[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(PAGES_KEY);
  return data ? JSON.parse(data) : [];
};

const savePages = (pages: Page[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
};

export const getPageById = (id: string): Page | undefined => {
  return getPages().find((p) => p.id === id);
};

export const getPageBySlug = (slug: string): Page | undefined => {
  return getPages().find((p) => p.slug === slug);
};

export const createPage = (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>): Page => {
  const pages = getPages();
  const newPage: Page = {
    ...page,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  pages.push(newPage);
  savePages(pages);

  logActivity({
    userId: 'current',
    userName: 'Admin',
    action: 'create',
    entityType: 'page',
    entityId: newPage.id,
    entityName: newPage.title,
    details: 'Page created',
  });

  return newPage;
};

export const updatePage = (id: string, updates: Partial<Page>): Page | null => {
  const pages = getPages();
  const index = pages.findIndex((p) => p.id === id);
  if (index === -1) return null;

  pages[index] = { ...pages[index], ...updates, updatedAt: new Date().toISOString() };
  savePages(pages);

  logActivity({
    userId: 'current',
    userName: 'Admin',
    action: 'update',
    entityType: 'page',
    entityId: id,
    entityName: pages[index].title,
    details: 'Page updated',
  });

  return pages[index];
};

export const deletePage = (id: string): boolean => {
  const pages = getPages();
  const page = pages.find((p) => p.id === id);
  if (!page || page.isHomePage) return false;

  const filtered = pages.filter((p) => p.id !== id);
  savePages(filtered);

  logActivity({
    userId: 'current',
    userName: 'Admin',
    action: 'delete',
    entityType: 'page',
    entityId: id,
    entityName: page.title,
    details: 'Page deleted',
  });

  return true;
};

export const duplicatePage = (id: string): Page | null => {
  const page = getPageById(id);
  if (!page) return null;

  const duplicated: Page = {
    ...page,
    id: uuidv4(),
    title: `${page.title} (Copy)`,
    slug: `${page.slug}-copy`,
    isHomePage: false,
    isPublished: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const pages = getPages();
  pages.push(duplicated);
  savePages(pages);

  return duplicated;
};

// ==================== SECTIONS ====================

export const addSectionToPage = (pageId: string, section: Omit<PageSection, 'id'>): PageSection | null => {
  const page = getPageById(pageId);
  if (!page) return null;

  const newSection: PageSection = {
    ...section,
    id: uuidv4(),
  };

  page.sections.push(newSection);
  page.sections.sort((a, b) => a.order - b.order);
  updatePage(pageId, { sections: page.sections });

  return newSection;
};

export const updateSection = (pageId: string, sectionId: string, updates: Partial<PageSection>): boolean => {
  const page = getPageById(pageId);
  if (!page) return false;

  const index = page.sections.findIndex((s) => s.id === sectionId);
  if (index === -1) return false;

  page.sections[index] = { ...page.sections[index], ...updates };
  updatePage(pageId, { sections: page.sections });

  return true;
};

export const deleteSection = (pageId: string, sectionId: string): boolean => {
  const page = getPageById(pageId);
  if (!page) return false;

  page.sections = page.sections.filter((s) => s.id !== sectionId);
  updatePage(pageId, { sections: page.sections });

  return true;
};

export const reorderSections = (pageId: string, sectionIds: string[]): boolean => {
  const page = getPageById(pageId);
  if (!page) return false;

  const reordered: PageSection[] = [];
  sectionIds.forEach((id, index) => {
    const section = page.sections.find((s) => s.id === id);
    if (section) {
      section.order = index;
      reordered.push(section);
    }
  });

  updatePage(pageId, { sections: reordered });
  return true;
};

// ==================== MENUS ====================

export const getMenus = (): Menu[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MENUS_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMenus = (menus: Menu[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MENUS_KEY, JSON.stringify(menus));
};

export const createMenu = (menu: Omit<Menu, 'id'>): Menu => {
  const menus = getMenus();
  const newMenu: Menu = { ...menu, id: uuidv4() };
  menus.push(newMenu);
  saveMenus(menus);
  return newMenu;
};

export const updateMenu = (id: string, updates: Partial<Menu>): Menu | null => {
  const menus = getMenus();
  const index = menus.findIndex((m) => m.id === id);
  if (index === -1) return null;

  menus[index] = { ...menus[index], ...updates };
  saveMenus(menus);
  return menus[index];
};

export const deleteMenu = (id: string): boolean => {
  const menus = getMenus();
  const filtered = menus.filter((m) => m.id !== id);
  saveMenus(filtered);
  return filtered.length < menus.length;
};

// ==================== MEDIA ====================

export const getMediaFiles = (): MediaFile[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MEDIA_KEY);
  return data ? JSON.parse(data) : [];
};

const saveMediaFiles = (files: MediaFile[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEDIA_KEY, JSON.stringify(files));
};

export const getMediaFolders = (): MediaFolder[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MEDIA_FOLDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const uploadMedia = (file: File, folder: string = 'root'): Promise<MediaFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const mediaFile: MediaFile = {
        id: uuidv4(),
        name: file.name.split('.')[0],
        filename: file.name,
        url: e.target?.result as string,
        type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
        mimeType: file.type,
        size: file.size,
        folder,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current',
      };

      const files = getMediaFiles();
      files.push(mediaFile);
      saveMediaFiles(files);

      resolve(mediaFile);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const deleteMedia = (id: string): boolean => {
  const files = getMediaFiles();
  const filtered = files.filter((f) => f.id !== id);
  saveMediaFiles(filtered);
  return filtered.length < files.length;
};

// ==================== SETTINGS ====================

export const getSEOSettings = (): SEOSettings => {
  if (typeof window === 'undefined') return DEFAULT_SEO;
  const data = localStorage.getItem(SEO_KEY);
  return data ? { ...DEFAULT_SEO, ...JSON.parse(data) } : DEFAULT_SEO;
};

export const updateSEOSettings = (settings: Partial<SEOSettings>): SEOSettings => {
  const current = getSEOSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SEO_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const getSiteSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  const data = localStorage.getItem(SITE_SETTINGS_KEY);
  return data ? { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(data) } : DEFAULT_SITE_SETTINGS;
};

export const updateSiteSettings = (settings: Partial<SiteSettings>): SiteSettings => {
  const current = getSiteSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(updated));
  }
  return updated;
};

export const getThemeSettings = (): ThemeSettings => {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  const data = localStorage.getItem(THEME_KEY);
  return data ? { ...DEFAULT_THEME, ...JSON.parse(data) } : DEFAULT_THEME;
};

export const updateThemeSettings = (settings: Partial<ThemeSettings>): ThemeSettings => {
  const current = getThemeSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    localStorage.setItem(THEME_KEY, JSON.stringify(updated));
  }
  return updated;
};

// ==================== BACKUPS ====================

export const createBackup = (name: string, description?: string): Backup => {
  const backup: Backup = {
    id: uuidv4(),
    name,
    description,
    data: JSON.stringify({
      pages: getPages(),
      menus: getMenus(),
      media: getMediaFiles(),
      seo: getSEOSettings(),
      site: getSiteSettings(),
      theme: getThemeSettings(),
    }),
    createdAt: new Date().toISOString(),
    createdBy: 'current',
    size: 0,
  };

  backup.size = new Blob([backup.data]).size;

  const backups = getBackups();
  backups.push(backup);
  if (typeof window !== 'undefined') {
    localStorage.setItem(BACKUPS_KEY, JSON.stringify(backups));
  }

  return backup;
};

export const getBackups = (): Backup[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(BACKUPS_KEY);
  return data ? JSON.parse(data) : [];
};

export const restoreBackup = (backupId: string): boolean => {
  const backups = getBackups();
  const backup = backups.find((b) => b.id === backupId);
  if (!backup) return false;

  try {
    const data = JSON.parse(backup.data);
    if (data.pages) savePages(data.pages);
    if (data.menus) saveMenus(data.menus);
    if (data.media) saveMediaFiles(data.media);
    if (data.seo) localStorage.setItem(SEO_KEY, JSON.stringify(data.seo));
    if (data.site) localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(data.site));
    if (data.theme) localStorage.setItem(THEME_KEY, JSON.stringify(data.theme));
    return true;
  } catch {
    return false;
  }
};

export const deleteBackup = (backupId: string): boolean => {
  const backups = getBackups();
  const filtered = backups.filter((b) => b.id !== backupId);
  if (typeof window !== 'undefined') {
    localStorage.setItem(BACKUPS_KEY, JSON.stringify(filtered));
  }
  return filtered.length < backups.length;
};

// ==================== EXPORT/IMPORT ====================

export const exportAllData = (): string => {
  return JSON.stringify({
    pages: getPages(),
    menus: getMenus(),
    media: getMediaFiles(),
    seo: getSEOSettings(),
    site: getSiteSettings(),
    theme: getThemeSettings(),
  }, null, 2);
};

export const importAllData = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    if (data.pages) savePages(data.pages);
    if (data.menus) saveMenus(data.menus);
    if (data.media) saveMediaFiles(data.media);
    if (data.seo) localStorage.setItem(SEO_KEY, JSON.stringify(data.seo));
    if (data.site) localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(data.site));
    if (data.theme) localStorage.setItem(THEME_KEY, JSON.stringify(data.theme));
    return true;
  } catch {
    return false;
  }
};
