import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Menu,
  Users,
  Settings,
  Globe,
  Palette,
  LogOut,
  ChevronRight,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { logout, getCurrentUser, hasRole } from '@/lib/auth';
import { toast } from 'sonner';
import type { User } from '@/types/cms';

interface MenuItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles?: string[];
  children?: { path: string; label: string }[];
}

export default function NewAdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const menuItems: MenuItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      path: '/admin/content',
      label: 'Content',
      icon: FileText,
      children: [
        { path: '/admin/pages', label: 'Pages' },
        { path: '/admin/blogs', label: 'Blog Posts' },
        { path: '/admin/courses', label: 'Courses' },
      ],
    },
    { path: '/admin/media', label: 'Media Library', icon: Image },
    { path: '/admin/menus', label: 'Menus', icon: Menu },
    { path: '/admin/users', label: 'Users', icon: Users, roles: ['admin'] },
    { path: '/admin/seo', label: 'SEO', icon: Globe },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
    { path: '/admin/theme', label: 'Theme', icon: Palette },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const toggleMenu = (path: string) => {
    setExpandedMenus((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isActive = (path: string) => location.pathname === path;
  const isChildActive = (children?: { path: string }[]) =>
    children?.some((child) => location.pathname === child.path);

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#0B1220] text-white z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1D4ED8] to-[#1e40af] rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Pak Forces Prep
            </span>
            <p className="text-xs text-white/50">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            // Check role permissions
            if (item.roles && !hasRole(item.roles as ('admin' | 'editor' | 'author')[])) {
              return null;
            }

            const Icon = item.icon;
            const active = isActive(item.path) || isChildActive(item.children);
            const expanded = expandedMenus.includes(item.path);

            if (item.children) {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => toggleMenu(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-[#1D4ED8] text-white'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all ${
                            isActive(child.path)
                              ? 'bg-[#1D4ED8]/50 text-white'
                              : 'text-white/60 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4 mr-2" />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  active
                    ? 'bg-[#1D4ED8] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-4 py-3 bg-white/5 rounded-xl">
          <div className="w-10 h-10 bg-[#1D4ED8]/20 rounded-full flex items-center justify-center">
            <span className="text-[#1D4ED8] font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
          <span className="px-2 py-1 bg-[#1D4ED8]/20 text-[#1D4ED8] text-xs rounded-full capitalize">
            {user?.role}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
