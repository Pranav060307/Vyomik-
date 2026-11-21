import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, AlertCircle, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { AnnouncementBar } from '../../components/home/AnnouncementBar';
import { HomeNavbar } from '../../components/home/HomeNavbar';
import { HomeFooter } from '../../components/home/HomeFooter';
import { useAdminAuth } from '../context/AdminAuthContext';
import { AdminRole } from '../types';

export const AdminLoginPage: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [accessKey, setAccessKey] = useState('');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('super_admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey.trim()) {
      setError('Enter your administrative passkey');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await login(accessKey, selectedRole);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
    }
  };

  const fillDevKey = () => {
    setAccessKey('vyomik_team_preview_2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F4F0E8] flex flex-col font-montserrat overflow-x-hidden selection:bg-[#A64B2A] selection:text-white">
      {/* 1. Header System matching rest of the website */}
      <AnnouncementBar />
      <HomeNavbar />

      {/* 2. Main Admin Login Experience */}
      <main className="flex-1 w-full flex items-center justify-center px-4 py-12 sm:py-20 relative">
        {/* Subtle Ambient Radial Glow matching SignInPage */}
        <div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none opacity-15 blur-3xl -top-10 left-1/2 -translate-x-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(200, 90, 46, 0.3) 0%, transparent 70%)',
          }}
        />

        {/* Card Container */}
        <div className="w-full max-w-[460px] bg-[#141414] border border-[#242321] rounded-2xl p-7 sm:p-10 shadow-2xl relative z-10 text-left">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-[10px] uppercase font-bold tracking-[0.24em] text-[#C85A2E] block mb-2">
              ADMINISTRATIVE ACCESS
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F4F0E8] tracking-tight">
              Operations Portal<span className="text-[#C85A2E]">.</span>
            </h1>
            <p className="mt-1.5 text-xs text-[#A8A29E] uppercase tracking-wider">
              VYOMIK COMMERCE COMMAND CONSOLE
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 bg-[#261517] border border-[#48282D] rounded-xl flex items-center gap-2.5 text-xs text-[#D47984]">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D47984]" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Switcher */}
            <div>
              <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
                Operator Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['super_admin', 'ops_manager', 'support_agent'] as AdminRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setSelectedRole(r)}
                    className={`py-2 px-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                      selectedRole === r
                        ? 'bg-[#24201D] text-[#F4F0E8] border-[#C85A2E]'
                        : 'bg-[#0B0B0B] text-[#716B63] border-[#242321] hover:text-[#D9D1C3] hover:border-[#38342E]'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Passkey Field */}
            <div>
              <label className="block text-xs font-medium text-[#D9D1C3] mb-1.5">
                Master Security Passkey
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#716B63]">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Enter administrative passkey..."
                  value={accessKey}
                  onChange={(e) => {
                    setAccessKey(e.target.value);
                    setError(null);
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-[#0B0B0B] border border-[#242321] focus:border-[#C85A2E] rounded-xl text-xs sm:text-sm text-[#F4F0E8] placeholder:text-[#716B63] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 sm:h-12 mt-2 rounded-xl bg-[#C85A2E] hover:bg-[#a64720] text-white font-montserrat font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>ENTER CONSOLE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill Dev Bypass */}
          <div className="mt-6 pt-5 border-t border-[#242321] flex items-center justify-between text-xs">
            <span className="text-[#716B63] text-[11px]">Developer Bypass:</span>
            <button
              type="button"
              onClick={fillDevKey}
              className="text-[11px] text-[#C85A2E] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <Sparkles className="w-3 h-3" />
              <span>Use Team Preview Key</span>
            </button>
          </div>

          <div className="mt-5 text-center text-[#544E47] text-[11px] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C85A2E]" />
            <span>Encrypted Session Access Control</span>
          </div>
        </div>
      </main>

      {/* 3. Footer System matching rest of the website */}
      <HomeFooter />
    </div>
  );
};
