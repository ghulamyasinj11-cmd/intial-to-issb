import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Image,
  Menu,
  Users,
  Settings,
  Globe,
  TrendingUp,
  Eye,
  Plus,
  Activity,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser, getActivityLogs } from '@/lib/auth';
import { getPages, getMenus, getMediaFiles } from '@/lib/cmsStore';
import { getBlogs, getCourses } from '@/lib/dataStore';
import type { User, ActivityLog } from '@/types/cms';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    pages: 0,
    blogs: 0,
    courses: 0,
    media: 0,
    menus: 0,
    views: 1247,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [quickStats, setQuickStats] = useState({
    publishedPages: 0,
    draftPages: 0,
    totalVisitors: 1247,
    newVisitors: 89,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Load stats
    setStats({
      pages: getPages().length,
      blogs: getBlogs().length,
      courses: getCourses().length,
      media: getMediaFiles().length,
      menus: getMenus().length,
      views: 1247,
    });

    // Load activity logs
    setRecentActivity(getActivityLogs(5));

    // Calculate quick stats
    const pages = getPages();
    setQuickStats({
      publishedPages: pages.filter((p) => p.isPublished).length,
      draftPages: pages.filter((p) => !p.isPublished).length,
      totalVisitors: 1247,
      newVisitors: 89,
    });
  }, []);

  const quickActions = [
    { icon: FileText, label: 'New Page', href: '/admin/pages/new', color: 'bg-blue-500' },
    { icon: BookOpen, label: 'New Blog', href: '/admin/blogs', color: 'bg-green-500' },
    { icon: Image, label: 'Upload Media', href: '/admin/media', color: 'bg-purple-500' },
    { icon: Menu, label: 'Edit Menu', href: '/admin/menus', color: 'bg-orange-500' },
  ];

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', description: 'Overview and analytics' },
    { icon: FileText, label: 'Pages', href: '/admin/pages', description: 'Manage website pages' },
    { icon: BookOpen, label: 'Blog', href: '/admin/blogs', description: 'Articles and posts' },
    { icon: BookOpen, label: 'Courses', href: '/admin/courses', description: 'Courses and programs' },
    { icon: Image, label: 'Media', href: '/admin/media', description: 'Images and files' },
    { icon: Menu, label: 'Menus', href: '/admin/menus', description: 'Navigation menus' },
    { icon: Users, label: 'Users', href: '/admin/users', description: 'User management' },
    { icon: Globe, label: 'SEO', href: '/admin/seo', description: 'Search optimization' },
    { icon: Settings, label: 'Settings', href: '/admin/settings', description: 'Site configuration' },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220]">
            Welcome back, {user?.name || 'Admin'}!
          </h1>
          <p className="text-[#5A6578] mt-1">
            Here's what's happening with your website today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" className="rounded-full">
              <Eye className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>
          <Link to="/admin/pages/new">
            <Button className="btn-primary rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              New Page
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A6578]">Total Pages</p>
                <p className="text-2xl font-bold text-[#0B1220]">{stats.pages}</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs">
              <span className="text-green-600 flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                {quickStats.publishedPages} published
              </span>
              <span className="text-[#5A6578] mx-2">•</span>
              <span className="text-orange-600">{quickStats.draftPages} draft</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A6578]">Blog Posts</p>
                <p className="text-2xl font-bold text-[#0B1220]">{stats.blogs}</p>
              </div>
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A6578]">Media Files</p>
                <p className="text-2xl font-bold text-[#0B1220]">{stats.media}</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Image className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs text-[#5A6578]">
              <span>Images, videos & docs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#5A6578]">Site Views</p>
                <p className="text-2xl font-bold text-[#0B1220]">{stats.views.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+{quickStats.newVisitors} new today</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.label}
                    to={action.href}
                    className="flex flex-col items-center p-4 rounded-2xl bg-[#F6F7F9] hover:bg-[#1D4ED8]/10 transition-colors group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#0B1220]">{action.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Admin Menu */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center p-4 rounded-xl border border-[rgba(11,18,32,0.08)] hover:border-[#1D4ED8]/30 hover:bg-[#1D4ED8]/5 transition-all group"
                  >
                    <div className="w-10 h-10 bg-[#F6F7F9] rounded-lg flex items-center justify-center mr-4 group-hover:bg-[#1D4ED8]/10 transition-colors">
                      <item.icon className="w-5 h-5 text-[#5A6578] group-hover:text-[#1D4ED8]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0B1220]">{item.label}</p>
                      <p className="text-xs text-[#5A6578]">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#5A6578] group-hover:text-[#1D4ED8]" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#5A6578]" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-[#1D4ED8] mt-2" />
                      <div>
                        <p className="text-sm text-[#0B1220]">
                          <span className="font-medium">{log.userName}</span>{' '}
                          {log.action === 'create' && 'created'}
                          {log.action === 'update' && 'updated'}
                          {log.action === 'delete' && 'deleted'}
                          {log.action === 'publish' && 'published'}
                          {log.action === 'unpublish' && 'unpublished'}
                          {log.action === 'login' && 'logged in'}
                          {log.action === 'logout' && 'logged out'}{' '}
                          <span className="font-medium">{log.entityName}</span>
                        </p>
                        <p className="text-xs text-[#5A6578]">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-[#5A6578]/50 mx-auto mb-2" />
                  <p className="text-sm text-[#5A6578]">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-[#0B1220] to-[#1a2744] text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-white">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    <span className="text-sm text-white/80">Website</span>
                  </div>
                  <span className="text-sm font-medium text-green-400">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    <span className="text-sm text-white/80">Database</span>
                  </div>
                  <span className="text-sm font-medium text-green-400">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    <span className="text-sm text-white/80">CDN</span>
                  </div>
                  <span className="text-sm font-medium text-green-400">Active</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center text-xs text-white/60">
                  <Calendar className="w-4 h-4 mr-2" />
                  Last backup: Today, 3:00 AM
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
