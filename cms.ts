// Comprehensive CMS Types for Pak Forces Prep

// User and Authentication
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'editor' | 'author';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
}

export interface UserSession {
  userId: string;
  email: string;
  role: string;
  expiresAt: number;
}

// Pages and Sections
export interface Page {
  id: string;
  title: string;
  slug: string;
  description?: string;
  sections: PageSection[];
  isPublished: boolean;
  isHomePage: boolean;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImage?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
}

export interface PageSection {
  id: string;
  type: SectionType;
  name: string;
  order: number;
  isVisible: boolean;
  settings: Record<string, any>;
  content: Record<string, any>;
}

export type SectionType =
  | 'hero'
  | 'text'
  | 'image-text'
  | 'features'
  | 'stats'
  | 'testimonials'
  | 'team'
  | 'pricing'
  | 'faq'
  | 'contact'
  | 'cta'
  | 'gallery'
  | 'video'
  | 'custom';

// Navigation Menu
export interface Menu {
  id: string;
  name: string;
  location: 'header' | 'footer' | 'sidebar';
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  type: 'page' | 'link' | 'dropdown';
  target?: string;
  url?: string;
  pageId?: string;
  children?: MenuItem[];
  order: number;
  isVisible: boolean;
}

// Media Library
export interface MediaFile {
  id: string;
  name: string;
  filename: string;
  url: string;
  thumbnailUrl?: string;
  type: 'image' | 'video' | 'document';
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
  folder: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface MediaFolder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
}

// SEO Settings
export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string;
  favicon?: string;
  ogDefaultImage?: string;
  twitterHandle?: string;
  googleAnalyticsId?: string;
  robotsTxt: string;
  sitemapEnabled: boolean;
  canonicalUrls: boolean;
  structuredData: boolean;
}

// Site Settings
export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo?: string;
  logoDark?: string;
  footerText: string;
  copyrightText: string;
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  address?: string;
  hours?: string;
  mapUrl?: string;
}

// Theme Settings
export interface ThemeSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    lineHeight: number;
  };
  spacing: {
    sectionPadding: number;
    containerWidth: number;
    gridGap: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
    pill: number;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
}

// Analytics
export interface Analytics {
  pageViews: PageView[];
  uniqueVisitors: number;
  topPages: { pageId: string; views: number }[];
  referrers: { source: string; count: number }[];
  devices: { type: string; count: number }[];
}

export interface PageView {
  timestamp: string;
  pageId: string;
  sessionId: string;
  referrer?: string;
  device: string;
  country?: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish' | 'login' | 'logout';
  entityType: 'page' | 'blog' | 'course' | 'user' | 'media' | 'menu' | 'settings';
  entityId?: string;
  entityName?: string;
  details?: string;
  timestamp: string;
  ipAddress?: string;
}

// Backup
export interface Backup {
  id: string;
  name: string;
  description?: string;
  data: string;
  createdAt: string;
  createdBy: string;
  size: number;
}

// Re-export existing types
export * from './index';
