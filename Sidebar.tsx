import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Palette, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { logoutAdmin, getAdminEmail } from '@/lib/dataStore';
import { toast } from 'sonner';

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const adminEmail = getAdminEmail();

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/blogs', label: 'Blogs', icon: FileText },
    { path: '/admin/courses', label: 'Courses', icon: BookOpen },
    { path: '/admin/content', label: 'Content', icon: Settings },
    { path: '/admin/theme', label: 'Theme', icon: Palette },
  ];

  const handleLogout = () => {
    logoutAdmin();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <aside className="admin-sidebar">
      <div className="p-6">
        {/* Logo */}
        <Link to="/admin/dashboard" className="flex items-center mb-10">
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Admin Panel
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-[#1D4ED8] text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="mb-4 px-4 py-3 bg-white/10 rounded-xl">
          <p className="text-xs text-white/50 mb-1">Logged in as</p>
          <p className="text-sm text-white font-medium truncate">{adminEmail}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
