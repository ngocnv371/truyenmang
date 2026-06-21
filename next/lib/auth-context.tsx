'use client';

import { SessionProvider } from 'next-auth/react';
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from 'next-auth/react';
import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
} from 'react';

interface StrapiUser {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
}

interface AuthContextType {
  user: StrapiUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();

  const user = session?.user
    ? {
        id: Number((session.user as any).id) || 0,
        username: session.user.name || '',
        email: session.user.email || '',
        confirmed: true,
      }
    : null;

  const token = (session?.user as any)?.token || null;

  const login = useCallback(async (email: string, password: string) => {
    const result = await nextAuthSignIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      throw new Error(result.error);
    }
  }, []);

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${API_URL}/api/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        const message =
          data?.error?.message || data?.message || 'Registration failed';
        throw new Error(message);
      }

      await nextAuthSignIn('credentials', { email, password, redirect: false });
    },
    []
  );

  const logout = useCallback(() => {
    nextAuthSignOut({ redirect: false });
  }, []);

  const clearError = useCallback(() => {}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading: status === 'loading',
        error: null,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <AuthWrapper>{children}</AuthWrapper>
    </SessionProvider>
  );
};
