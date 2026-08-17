'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, auth as authApi, getStoredToken, setStoredToken } from '@/lib/api';
import type { Role, User } from '@/lib/api';

interface AuthContextValue {
  user: User | null;
  /** True until the stored token has been validated against the API. */
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  refresh: () => Promise<void>;
  hasRole: (...roles: Role[]) => boolean;
  canManageNews: boolean;
  canManageCareers: boolean;
  canManageTeam: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/** Landing route for each role, used after login and by the /admin redirect. */
export function homeRouteForRole(role: Role): string {
  switch (role) {
    case 'HR':
      return '/admin/careers';
    case 'Marketer':
      return '/admin/blog';
    default:
      return '/admin/super';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // The JWT is never trusted for authorization data; the server is asked who the
  // caller is so revoked accounts and role changes take effect immediately.
  const refresh = useCallback(async () => {
    if (!getStoredToken()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setUser(await authApi.me());
    } catch (error) {
      if (error instanceof ApiError && (error.isUnauthorized || error.isForbidden)) {
        setStoredToken(null);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    setStoredToken(result.token);
    setUser(result.user);
    setLoading(false);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const hasRole = (...roles: Role[]) => !!user && roles.includes(user.role);
    return {
      user,
      loading,
      login,
      logout,
      refresh,
      hasRole,
      canManageNews: hasRole('Super_Admin', 'Marketer'),
      canManageCareers: hasRole('Super_Admin', 'HR'),
      canManageTeam: hasRole('Super_Admin'),
    };
  }, [user, loading, login, logout, refresh]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
