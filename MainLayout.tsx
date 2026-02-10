import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F6F7F9]">
      <div className="grain-overlay"></div>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
