import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ApiError, apiRequest, isBackendAvailable } from '@/lib/api';
import { getGuestName } from '@/lib/storage';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_active: boolean;
  profile: {
    display_name: string;
    bio: string;
    avatar_url: string;
    total_score: number;
    challenges_completed: number;
    badges_earned: number;
    joined_challenges: string[];
  };
}

interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOfflineMode: boolean;
  guestName: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const offline = !isBackendAvailable();
  const guestName = getGuestName();

  const clearAuthState = useCallback(() => {
    localStorage.removeItem('hackops_token');
    setToken(null);
    setUser(null);
  }, []);

  const fetchUserProfile = useCallback(async (authToken: string) => {
    try {
      const userData = await apiRequest<User>('/api/auth/me', {
        method: 'GET',
        token: authToken,
        retry: 1,
      });
      setUser(userData);
      return true;
    } catch (error) {
      clearAuthState();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthState]);

  useEffect(() => {
    // In offline mode, skip backend auth entirely
    if (offline) {
      setIsLoading(false);
      return;
    }

    const storedToken = localStorage.getItem('hackops_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);
    void fetchUserProfile(storedToken);
  }, [fetchUserProfile, offline]);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (offline) {
      // In offline mode, there's no backend to auth against
      return false;
    }

    try {
      const data = await apiRequest<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: { username, password },
      });

      const authToken = data.accessToken;
      setToken(authToken);
      localStorage.setItem('hackops_token', authToken);

      return fetchUserProfile(authToken);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return false;
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    if (offline) return false;

    try {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { username, email, password },
      });

      return login(username, password);
    } catch {
      return false;
    }
  };

  const logout = () => {
    clearAuthState();
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isOfflineMode: offline,
    guestName,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
