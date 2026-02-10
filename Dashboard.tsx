import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  BookOpen, 
  Users, 
  Eye,
  TrendingUp,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogs, getCourses } from '@/lib/dataStore';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    courses: 0,
    views: 0,
    growth: 0,
  });

  useEffect(() => {
    const blogs = getBlogs();
    const courses = getCourses();
    
    setStats({
      blogs: blogs.length,
      courses: courses.length,
      views: 1247, // Simulated
      growth: 23, // Simulated
    });
  }, []);

  const recentActivity = [
    { action: 'New blog post published', item: 'How to Crack ISSB', time: '2 hours ago' },
    { action: 'Course updated', item: 'ISSB Complete Preparation', time: '5 hours ago' },
    { action: 'Content edited', item: 'Hero Section', time: '1 day ago' },
  ];

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220] mb-2">Dashboard</h1>
          <p className="text-[#5A6578]">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/">
            <Button variant="outline" className="rounded-full">
              <Eye className="w-4 h-4 mr-2" />
              View Site
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8]">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <p className="text-3xl font-bold text-[#0B1220]">{stats.blogs}</p>
          <p className="text-sm text-[#5A6578]">Total Blogs</p>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8]">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +5%
            </span>
          </div>
          <p className="text-3xl font-bold text-[#0B1220]">{stats.courses}</p>
          <p className="text-sm text-[#5A6578]">Active Courses</p>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8]">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <p className="text-3xl font-bold text-[#0B1220]">{stats.views}</p>
          <p className="text-sm text-[#5A6578]">Site Views</p>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +{stats.growth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-[#0B1220]">94%</p>
          <p className="text-sm text-[#5A6578]">Success Rate</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="admin-card">
          <h3 className="text-lg font-bold text-[#0B1220] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/admin/blogs">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center rounded-xl border-dashed border-2 hover:border-[#1D4ED8] hover:bg-[#1D4ED8]/5">
                <Plus className="w-6 h-6 mb-2 text-[#1D4ED8]" />
                <span className="text-sm font-medium">Add Blog</span>
              </Button>
            </Link>
            <Link to="/admin/courses">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center rounded-xl border-dashed border-2 hover:border-[#1D4ED8] hover:bg-[#1D4ED8]/5">
                <Plus className="w-6 h-6 mb-2 text-[#1D4ED8]" />
                <span className="text-sm font-medium">Add Course</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="admin-card">
          <h3 className="text-lg font-bold text-[#0B1220] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-[#1D4ED8] mt-2"></div>
                <div>
                  <p className="text-sm text-[#0B1220]">{activity.action}</p>
                  <p className="text-xs text-[#5A6578]">{activity.item}</p>
                  <p className="text-xs text-[#5A6578]/60">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/blogs" className="admin-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0B1220] mb-1">Manage Blogs</h3>
              <p className="text-sm text-[#5A6578]">Add, edit, or remove blog posts</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#1D4ED8]" />
          </div>
        </Link>

        <Link to="/admin/courses" className="admin-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0B1220] mb-1">Manage Courses</h3>
              <p className="text-sm text-[#5A6578]">Update course content and pricing</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#1D4ED8]" />
          </div>
        </Link>

        <Link to="/admin/content" className="admin-card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0B1220] mb-1">Edit Content</h3>
              <p className="text-sm text-[#5A6578]">Modify website text and sections</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#1D4ED8]" />
          </div>
        </Link>
      </div>
    </div>
  );
}
