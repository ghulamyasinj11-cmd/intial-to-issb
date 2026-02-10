import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft, UserPlus, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { initializeAuth, login, isAuthenticated, registerUser, createPasswordResetToken, resetPassword } from '@/lib/auth';
import { toast } from 'sonner';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    initializeAuth();
    
    // Redirect if already logged in
    if (isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);
      
      if (user) {
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/admin/dashboard');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');
    setIsLoading(true);

    // Validation
    if (!registerName.trim()) {
      setRegisterError('Please enter your name');
      setIsLoading(false);
      return;
    }

    if (!registerEmail.trim()) {
      setRegisterError('Please enter your email');
      setIsLoading(false);
      return;
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await registerUser(registerEmail, registerPassword, registerName, 'editor');
      toast.success('Account created successfully! Please log in.');
      setActiveTab('login');
      setLoginEmail(registerEmail);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setRegisterConfirmPassword('');
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setIsLoading(true);

    if (!forgotEmail.trim()) {
      setForgotError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const token = createPasswordResetToken(forgotEmail);
      
      if (token) {
        // In a real app, this would send an email
        // For demo, we show the token
        setResetToken(token);
        setResetSent(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        setForgotError('No account found with this email');
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to send reset instructions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setIsLoading(true);

    if (newPassword.length < 6) {
      setForgotError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const success = await resetPassword(resetToken, newPassword);
      
      if (success) {
        toast.success('Password reset successful! Please log in.');
        setActiveTab('login');
        setResetSent(false);
        setResetToken('');
        setNewPassword('');
        setConfirmNewPassword('');
        setForgotEmail('');
      } else {
        setForgotError('Invalid or expired reset token');
      }
    } catch (err: any) {
      setForgotError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1220] via-[#1a2744] to-[#0B1220] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1D4ED8] to-[#1e40af] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-[#1D4ED8]/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Pak Forces Prep
          </h1>
          <p className="text-white/60">Admin Control Panel</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3 bg-white/5 mb-6">
              <TabsTrigger value="login" className="data-[state=active]:bg-[#1D4ED8]">Login</TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-[#1D4ED8]">Register</TabsTrigger>
              <TabsTrigger value="forgot" className="data-[state=active]:bg-[#1D4ED8]">Forgot</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Welcome Back</h2>
                <p className="text-white/60 text-sm">Sign in to access the admin dashboard</p>
              </div>

              {loginError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{loginError}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-white/80 text-sm font-medium mb-2 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-white/80 text-sm font-medium mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-12 pr-12 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      className="border-white/30 data-[state=checked]:bg-[#1D4ED8] data-[state=checked]:border-[#1D4ED8]"
                    />
                    <Label htmlFor="remember" className="text-white/60 text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#1D4ED8] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#1D4ED8]/30"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-white/40 text-xs">
                  Default: meergyj@gmail.com / admin_panel123
                </p>
              </div>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
                <p className="text-white/60 text-sm">Register for admin access</p>
              </div>

              {registerError && (
                <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-200 text-sm">{registerError}</p>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-white/80 text-sm font-medium mb-2 block">
                    Full Name
                  </Label>
                  <div className="relative">
                    <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-white/80 text-sm font-medium mb-2 block">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-white/80 text-sm font-medium mb-2 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-confirm" className="text-white/80 text-sm font-medium mb-2 block">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="register-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={registerConfirmPassword}
                      onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                      className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#1D4ED8] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#1D4ED8]/30"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Forgot Password Tab */}
            <TabsContent value="forgot">
              {!resetSent ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Reset Password</h2>
                    <p className="text-white/60 text-sm">Enter your email to receive reset instructions</p>
                  </div>

                  {forgotError && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-200 text-sm">{forgotError}</p>
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="forgot-email" className="text-white/80 text-sm font-medium mb-2 block">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="your@email.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-[#1D4ED8] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#1D4ED8]/30"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Send Reset Instructions'
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-1">Set New Password</h2>
                    <p className="text-white/60 text-sm">Enter your new password below</p>
                  </div>

                  <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                    <p className="text-green-200 text-sm">
                      Reset token generated. In production, this would be sent via email.
                    </p>
                  </div>

                  {forgotError && (
                    <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-200 text-sm">{forgotError}</p>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <Label htmlFor="new-password" className="text-white/80 text-sm font-medium mb-2 block">
                        New Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Minimum 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                          required
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirm-new-password" className="text-white/80 text-sm font-medium mb-2 block">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          id="confirm-new-password"
                          type="password"
                          placeholder="Confirm your new password"
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-xl focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-gradient-to-r from-[#1D4ED8] to-[#1e40af] hover:from-[#1e40af] hover:to-[#1D4ED8] text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-[#1D4ED8]/30"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </form>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Back to Website */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center text-white/50 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Website
          </Link>
        </div>
      </div>
    </div>
  );
}
