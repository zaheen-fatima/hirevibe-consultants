import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../../services/api';
import { tokenStorage, type StoredUser } from '../../lib/storage';
import type { LoginRequest } from '../../types/api';

type AuthContextValue = {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(payload);
      const nextUser: StoredUser = {
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        permissions: [...response.permissions],
      };
      tokenStorage.setSession(nextUser, response.accessToken, response.refreshToken);
      setUser(nextUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user && tokenStorage.getAccessToken()), isLoading, login, logout }),
    [user, isLoading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
