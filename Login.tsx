import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { loginAdmin, isAdminAuthenticated } from '@/lib/dataStore';
import { toast } from 'sonner';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAdminAuthenticated()) {
    navigate('/admin/dashboard');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const success = loginAdmin(email);
      
      if (success) {
        toast.success('Welcome to Admin Panel!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Access denied. Please use the authorized email.');
      }
      
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1D4ED8] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#0B1220]" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Pak Forces Prep
          </h1>
          <p className="text-[#5A6578]">Admin Panel</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-[28px] p-8 border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
          <h2 className="text-xl font-bold text-[#0B1220] mb-2">Welcome Back</h2>
          <p className="text-sm text-[#5A6578] mb-6">
            Enter your email to access the admin panel.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0B1220] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
                <Input
                  type="email"
                  placeholder="meergyj@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-3 rounded-xl border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[rgba(11,18,32,0.08)]">
            <p className="text-xs text-[#5A6578] text-center">
              Only authorized administrators can access this panel.
            </p>
          </div>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-[#5A6578] hover:text-[#1D4ED8] transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
