import { Outlet, Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { initializeCMS } from '@/lib/cmsStore';
import NewAdminSidebar from '@/components/admin/NewSidebar';
import { useEffect } from 'react';

export default function NewAdminLayout() {
  useEffect(() => {
    initializeCMS();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <NewAdminSidebar />
      <div className="ml-72 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
