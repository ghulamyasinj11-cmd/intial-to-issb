import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { initializeData } from '@/lib/dataStore';
import { initializeAuth } from '@/lib/auth';
import { isAuthenticated } from '@/lib/auth';
import MainLayout from '@/layouts/MainLayout';
import NewAdminLayout from '@/layouts/NewAdminLayout';
import Home from '@/pages/Home';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Courses from '@/pages/Courses';

// New Admin Pages
import AdminLogin from '@/pages/admin/NewLogin';
import AdminDashboard from '@/pages/admin/NewDashboard';
import AdminPages from '@/pages/admin/Pages';
import PageBuilder from '@/pages/admin/PageBuilder';
import AdminBlogs from '@/pages/admin/Blogs';
import AdminCourses from '@/pages/admin/Courses';
import MediaLibrary from '@/pages/admin/MediaLibrary';
import UserManagement from '@/pages/admin/UserManagement';
import SEOSettings from '@/pages/admin/SEOSettings';
import SiteSettings from '@/pages/admin/SiteSettings';
import AdminTheme from '@/pages/admin/Theme';

import { Toaster } from '@/components/ui/sonner';

function App() {
  useEffect(() => {
    initializeData();
    initializeAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Website Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/courses" element={<Courses />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          isAuthenticated() ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />
        } />
        
        <Route element={<NewAdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Content Management */}
          <Route path="/admin/pages" element={<AdminPages />} />
          <Route path="/admin/pages/new" element={<PageBuilder />} />
          <Route path="/admin/pages/edit/:id" element={<PageBuilder />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/courses" element={<AdminCourses />} />
          
          {/* Media & Menus */}
          <Route path="/admin/media" element={<MediaLibrary />} />
          <Route path="/admin/menus" element={<div className="p-8">Menu Management (Coming Soon)</div>} />
          
          {/* Users & Settings */}
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/seo" element={<SEOSettings />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
          <Route path="/admin/theme" element={<AdminTheme />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
