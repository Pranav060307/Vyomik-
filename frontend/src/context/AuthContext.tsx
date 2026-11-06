import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserSession {
  name: string;
  email: string;
}

interface StoredUser {
  name: string;
  email: string;
  hash: string;
}

interface AuthContextType {
  user: UserSession | null;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string; name?: string }>;
  signin: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string; name?: string }>;
  signout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function hashPassword(text: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && window.TextEncoder) {
    try {
      const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buffer))
        .map((b) => ('0' + b.toString(16)).slice(-2))
        .join('');
    } catch {
      // Fallback
    }
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0;
  }
  return 'x' + h;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const s = sessionStorage.getItem('vyomik_session') || localStorage.getItem('vyomik_session');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; name?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const rawUsers = localStorage.getItem('vyomik_users');
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      if (users.some((u) => u.email === cleanEmail)) {
        return { success: false, error: 'An account with this email already exists' };
      }

      const hash = await hashPassword(password);
      users.push({ name: name.trim(), email: cleanEmail, hash });
      localStorage.setItem('vyomik_users', JSON.stringify(users));

      const session = { name: name.trim(), email: cleanEmail };
      localStorage.setItem('vyomik_session', JSON.stringify(session));
      setUser(session);
      return { success: true, name: name.trim() };
    } catch {
      return { success: false, error: 'Unable to save user data' };
    }
  };

  const signin = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string; name?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const rawUsers = localStorage.getItem('vyomik_users');
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];

      const found = users.find((u) => u.email === cleanEmail);
      if (!found) {
        return { success: false, error: 'No account found. Create one first' };
      }

      const hash = await hashPassword(password);
      if (found.hash !== hash) {
        return { success: false, error: 'Wrong password' };
      }

      const session = { name: found.name, email: found.email };
      if (rememberMe) {
        localStorage.setItem('vyomik_session', JSON.stringify(session));
      } else {
        sessionStorage.setItem('vyomik_session', JSON.stringify(session));
      }
      setUser(session);
      return { success: true, name: found.name };
    } catch {
      return { success: false, error: 'Authentication error' };
    }
  };

  const signout = () => {
    try {
      sessionStorage.removeItem('vyomik_session');
      localStorage.removeItem('vyomik_session');
    } catch {
      // Ignore
    }
    setUser(null);
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      const rawUsers = localStorage.getItem('vyomik_users');
      const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [];
      const exists = users.some((u) => u.email === cleanEmail);
      if (exists) {
        return { success: true, message: `Reset link sent to ${cleanEmail} (demo)` };
      }
      return { success: false, message: 'No account found for that email' };
    } catch {
      return { success: false, message: 'Error checking email' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, signin, signout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

const defaultAuthContext: AuthContextType = {
  user: null,
  signup: async () => ({ success: true }),
  signin: async () => ({ success: true }),
  signout: () => {},
  forgotPassword: async () => ({ success: true, message: '' }),
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return defaultAuthContext;
  }
  return ctx;
};
