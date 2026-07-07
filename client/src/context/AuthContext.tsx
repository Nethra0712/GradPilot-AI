import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAccessToken, registerRefreshFailureCallback } from '@/services/api';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  subscriptionPlan: string;
}

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Silent session restore on application mount
  const refreshSession = async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { accessToken } = response.data.data;
      setAccessToken(accessToken);

      // Fetch user profile info
      const meResponse = await api.get('/auth/me');
      setCurrentUser(meResponse.data.data.user);
    } catch {
      // Refresh failed, user is unauthenticated
      setAccessToken(null);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, user } = response.data.data;
      setAccessToken(accessToken);

      // Normalize user object format from API response
      setCurrentUser({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        subscriptionPlan: user.subscriptionTier,
      });
    } catch (error) {
      setAccessToken(null);
      setCurrentUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password, fullName });
      const { accessToken, user } = response.data.data;
      setAccessToken(accessToken);

      setCurrentUser({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        subscriptionPlan: user.subscriptionTier,
      });
    } catch (error) {
      setAccessToken(null);
      setCurrentUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch {
      // Fail silently, force clear local storage/state anyway
    } finally {
      setAccessToken(null);
      setCurrentUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Register global interceptor callback to clear state on token refresh failure
    registerRefreshFailureCallback(() => {
      setCurrentUser(null);
    });

    // Run silent refresh on load
    refreshSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
