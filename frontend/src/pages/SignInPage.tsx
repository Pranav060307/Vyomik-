import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HomeNavbar } from '../components/home/HomeNavbar';
import { HomeFooter } from '../components/home/HomeFooter';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { signin, forgotPassword } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const newErrors: Record<string, string> = {};

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Enter your password';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const res = await signin(trimmedEmail, password, rememberMe);
      if (!res.success) {
        if (res.error?.includes('No account')) {
          setErrors({ email: res.error });
        } else {
          setErrors({ password: res.error || 'Wrong password' });
        }
      } else {
        const firstName = res.name ? res.name.split(' ')[0] : 'there';
        toast(`Welcome back, ${firstName}!`);
        setTimeout(() => {
          navigate('/home');
        }, 900);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setErrors((prev) => ({ ...prev, email: 'Enter your email first' }));
      return;
    }
    const res = await forgotPassword(trimmedEmail);
    toast(res.message);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      {/* 1. Header System */}
      <AnnouncementBar />
      <HomeNavbar />

      {/* 2. Main Login Experience */}
      <main className="flex-1 w-full flex items-center justify-center px-4 py-12 sm:py-20 relative">
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-3xl -top-20 left-1/2 -translate-x-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(200, 90, 46, 0.4) 0%, transparent 70%)',
          }}
        />

        {/* Card Container */}
        <div className="w-full max-w-[460px] bg-[#141414] border border-[#242321] rounded-2xl p-7 sm:p-10 shadow-2xl relative z-10 text-left">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-2">
              AUTHENTICATION
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] tracking-tight">
              Welcome Back<span className="text-[#C85A2E]">.</span>
            </h1>
            <p className="mt-1.5 text-xs text-[#A8A29E]">
              SIGN IN TO YOUR VYOMIK ACCOUNT
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#716B63]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-3 bg-[#0B0B0B] border rounded-xl text-xs sm:text-sm text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#242321] focus:border-[#C85A2E]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#D9D1C3]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-[#C85A2E] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#716B63]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={`w-full pl-10 pr-10 py-3 bg-[#0B0B0B] border rounded-xl text-xs sm:text-sm text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors ${
                    errors.password
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[#242321] focus:border-[#C85A2E]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#716B63] hover:text-[#F4F0E8] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#A8A29E] select-none">
                <input
                  data-box="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0B0B0B] border border-[#242321] text-[#C85A2E] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#C85A2E]"
                />
                <span>Remember me</span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 sm:h-12 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(200,90,46,0.4)] transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              <span>SIGN IN</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Divider */}
            <div className="relative py-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#242321]" />
              </div>
              <span className="relative px-3 bg-[#141414] text-[11px] uppercase tracking-widest text-[#716B63]">
                OR
              </span>
            </div>

            {/* Social Google Login Button */}
            <button
              type="button"
              onClick={() => toast('Google sign-in needs a backend (OAuth). Use email for this demo.')}
              className="w-full h-11 rounded-xl bg-[#0B0B0B] hover:bg-white/5 border border-[#242321] hover:border-white/20 text-[#F4F0E8] font-montserrat text-xs font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Bottom Switcher */}
          <div className="mt-7 pt-5 border-t border-[#242321] text-center text-xs text-[#716B63]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/sign-up')}
              className="text-[#C85A2E] hover:underline font-bold uppercase tracking-wider ml-1 cursor-pointer"
            >
              CREATE ACCOUNT
            </button>
          </div>
        </div>
      </main>

      {/* 3. Official Brand Footer */}
      <HomeFooter />
    </div>
  );
};
