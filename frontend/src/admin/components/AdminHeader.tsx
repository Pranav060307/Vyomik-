import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, RefreshCw, Shield } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { StatusBadge } from './StatusBadge';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const AdminHeader: React.FC = () => {
  const { role, switchRole } = useAdminAuth();
  const location = useLocation();
  const [apiHealth, setApiHealth] = useState<'healthy' | 'offline' | 'checking'>('checking');
  const [latency, setLatency] = useState<number | null>(null);

  // Format breadcrumbs from path
  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, index) => {
    const url = `/${pathParts.slice(0, index + 1).join('/')}`;
    const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
    return { url, label };
  });

  const checkHealth = async () => {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/health`, { method: 'GET' });
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      if (res.ok) {
        setApiHealth('healthy');
      } else {
        setApiHealth('offline');
      }
    } catch {
      setApiHealth('offline');
      setLatency(null);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#100F0E] border-b border-[#242321] px-6 flex items-center justify-between sticky top-0 z-30 font-montserrat">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#716B63] uppercase tracking-wider font-semibold">CONSOLE</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.url}>
            <span className="text-[#38342E]">/</span>
            {idx === breadcrumbs.length - 1 ? (
              <span className="text-[#F4F0E8] font-bold tracking-wide">{crumb.label}</span>
            ) : (
              <Link to={crumb.url} className="text-[#A8A29E] hover:text-[#F4F0E8] transition-colors">
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Backend Health Monitor Pill */}
        <button
          onClick={checkHealth}
          title="Click to re-ping backend"
          className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#242321] hover:border-[#38342E] rounded-xl transition-all"
        >
          <StatusBadge
            status={apiHealth === 'healthy' ? 'healthy' : 'offline'}
            label={apiHealth === 'healthy' ? `API ONLINE (${latency ?? 0}ms)` : 'API OFFLINE'}
          />
          <RefreshCw className="w-3 h-3 text-[#716B63] hover:text-[#F4F0E8] transition-colors" />
        </button>

        {/* Role Switcher Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#141414] border border-[#242321] rounded-xl">
          <Shield className="w-3.5 h-3.5 text-[#C85A2E]" />
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value as any)}
            className="bg-transparent text-xs text-[#F4F0E8] font-montserrat font-medium focus:outline-none cursor-pointer"
          >
            <option value="super_admin" className="bg-[#141414] text-[#F4F0E8]">Super Admin</option>
            <option value="ops_manager" className="bg-[#141414] text-[#F4F0E8]">Ops Manager</option>
            <option value="support_agent" className="bg-[#141414] text-[#F4F0E8]">Support Agent</option>
          </select>
        </div>

        {/* View Store Live Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#D9D1C3] hover:text-[#F4F0E8] bg-[#141414] hover:bg-[#1C1A18] border border-[#242321] rounded-xl transition-colors"
        >
          <span>Storefront</span>
          <ExternalLink className="w-3 h-3 text-[#C85A2E]" />
        </a>
      </div>
    </header>
  );
};
