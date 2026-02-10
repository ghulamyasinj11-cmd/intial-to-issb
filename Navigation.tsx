import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Programs', href: '#courses' },
    { label: 'Subjects', href: '#subjects' },
    { label: 'Success', href: '#success' },
    { label: 'Why Us', href: '#why-choose' },
    { label: 'Instructors', href: '#instructors' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 backdrop-blur-md shadow-sm' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl lg:text-2xl font-bold text-[#0B1220]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Pak Forces Prep
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {isHomePage ? (
                navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="nav-link"
                  >
                    {link.label}
                  </button>
                ))
              ) : (
                <>
                  <Link to="/" className="nav-link">Home</Link>
                  <Link to="/courses" className="nav-link">Courses</Link>
                  <Link to="/blog" className="nav-link">Blog</Link>
                </>
              )}
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link 
                to="/admin" 
                className="text-sm font-medium text-[#5A6578] hover:text-[#0B1220] transition-colors"
              >
                Login
              </Link>
              <Button 
                className="btn-primary"
                onClick={() => isHomePage && scrollToSection('#contact')}
              >
                Start Free Trial
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#0B1220]" />
              ) : (
                <Menu className="w-6 h-6 text-[#0B1220]" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
        <div 
          className={`absolute right-0 top-0 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="p-6 pt-20">
            <div className="flex flex-col space-y-4">
              {isHomePage ? (
                navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="text-left text-lg font-medium text-[#0B1220] hover:text-[#1D4ED8] transition-colors py-2"
                  >
                    {link.label}
                  </button>
                ))
              ) : (
                <>
                  <Link 
                    to="/" 
                    className="text-lg font-medium text-[#0B1220] hover:text-[#1D4ED8] transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/courses" 
                    className="text-lg font-medium text-[#0B1220] hover:text-[#1D4ED8] transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link 
                    to="/blog" 
                    className="text-lg font-medium text-[#0B1220] hover:text-[#1D4ED8] transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </>
              )}
              <hr className="my-4 border-[rgba(11,18,32,0.14)]" />
              <Link 
                to="/admin" 
                className="text-lg font-medium text-[#5A6578] hover:text-[#0B1220] transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Button 
                className="btn-primary w-full"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  isHomePage && scrollToSection('#contact');
                }}
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
