import { Outlet, Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '@/lib/dataStore';
import AdminSidebar from '@/components/admin/Sidebar';

export default function AdminLayout() {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
