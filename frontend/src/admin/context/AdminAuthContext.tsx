import React, { createContext, useContext, useState } from 'react';
import { AdminRole, AdminUser } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const ADMIN_SESSION_KEY = 'vyomik_admin_session_v1';
const MASTER_DEV_KEY = 'vyomik_team_preview_2026';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  role: AdminRole;
  login: (accessKey: string, role?: AdminRole) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRole: (newRole: AdminRole) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      // 8-hour session lifetime
      const now = Date.now();
      if (now - parsed.timestamp > 8 * 60 * 60 * 1000) {
        sessionStorage.removeItem(ADMIN_SESSION_KEY);
        return false;
      }
      return Boolean(parsed.token);
    } catch {
      return false;
    }
  });

  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.user || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const role: AdminRole = user?.role || 'super_admin';

  const login = async (accessKey: string, selectedRole: AdminRole = 'super_admin'): Promise<{ success: boolean; message: string }> => {
    const trimmed = accessKey.trim();

    // 1. Direct match with standard preview/admin master keys
    const isMasterMatch = trimmed === MASTER_DEV_KEY || trimmed === 'vyomik_admin_2026' || trimmed === 'admin';

    let verified = isMasterMatch;

    if (!verified) {
      // 2. Try validating via existing backend POST /api/v1/preview/verify
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/preview/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: trimmed }),
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.valid || data.success) {
            verified = true;
          }
        }
      } catch (err) {
        // Fallback check
        console.warn('Backend preview verification unreachable, checking master key fallback', err);
      }
    }

    if (verified) {
      const adminUser: AdminUser = {
        id: 'usr_admin_01',
        name: selectedRole === 'super_admin' ? 'Vyomik Founder' : selectedRole === 'ops_manager' ? 'Operations Lead' : 'Support Specialist',
        email: 'ops@vyomik.com',
        role: selectedRole,
        avatarUrl: '/assets/brand-symbol.png',
        lastLogin: new Date().toISOString(),
      };

      const sessionData = {
        token: `adm_tok_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        timestamp: Date.now(),
        user: adminUser,
      };

      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
      setUser(adminUser);
      setIsAuthenticated(true);
      return { success: true, message: 'Authentication granted. Welcome to VYOMIK Command Console.' };
    }

    return {
      success: false,
      message: 'Invalid administrative passkey. Please verify your credentials or use the development master key.',
    };
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setUser(null);
  };

  const switchRole = (newRole: AdminRole) => {
    if (!user) return;
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    try {
      const stored = sessionStorage.getItem(ADMIN_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.user = updatedUser;
        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(parsed));
      }
    } catch {
      // ignore
    }
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, user, role, login, logout, switchRole }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
