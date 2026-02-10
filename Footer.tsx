import { Link } from 'react-router-dom';
import { Mail, Phone, Clock, MapPin } from 'lucide-react';
import { getContent } from '@/lib/dataStore';

export default function Footer() {
  const content = getContent();
  const { contact } = content;

  return (
    <footer className="bg-[#111827] text-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Pak Forces Prep
              </span>
            </Link>
            <p className="mt-4 text-white/60 text-sm leading-relaxed">
              Structured courses, daily tests, and smart revision for ISSB, PMA, PAF, and competitive exams.
            </p>
            <div className="mt-6 flex items-center space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#1D4ED8] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-white/60 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-white/60 hover:text-white transition-colors text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-white/60 hover:text-white transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <a href="/#instructors" className="text-white/60 hover:text-white transition-colors text-sm">
                  Instructors
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-white/60 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Programs</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  ISSB Preparation
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  PMA Long Course
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  PAF GD(P)
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Pak Navy
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white transition-colors text-sm">
                  Cadet Colleges
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-[#1D4ED8] mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">{contact.email}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-[#1D4ED8] mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">{contact.phone}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#1D4ED8] mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">{contact.hours}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#1D4ED8] mt-0.5 flex-shrink-0" />
                <span className="text-white/60 text-sm">Lahore, Pakistan</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} Pak Forces Prep. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link to="/admin" className="text-white/40 hover:text-white text-sm transition-colors">
                Admin Panel
              </Link>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
