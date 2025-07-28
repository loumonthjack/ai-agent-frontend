import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  User,
  loginWithCognito,
  logoutFromCognito,
  getCurrentAuthUser,
} from '../services/authService';
import { clearAuthCookies } from '../utils/cookie-utils';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
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
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSessionExpired = useCallback((): void => {
    // Don't clear session if we're in the middle of logging in
    if (isLoggingIn) {
      console.log('Ignoring session expired during login');
      return;
    }
    console.log('Session expired, clearing user');
    setUser(null);
    clearAuthCookies();
  }, [isLoggingIn]);

  const handleAuthFailure = useCallback((event: CustomEvent): void => {
    console.log('Auth failure event received:', event.detail);
    handleSessionExpired();
  }, [handleSessionExpired]);



  const initializeAuth = async (): Promise<void> => {
    try {
      // Try to get current user from Cognito first
      const currentUser = await getCurrentAuthUser();
      
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If no Cognito user, clear any stale cookies
        clearAuthCookies();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      clearAuthCookies();
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('Auth initialization complete');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    
    try {
      const authUser = await loginWithCognito(email, password);
      
      setUser(authUser);
      
      // Add a small delay to ensure session is fully established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify the user is still authenticated
      const verifyUser = await getCurrentAuthUser();
      if (verifyUser) {
        setUser(verifyUser);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error('AuthContext: Login failed with error:', error);
      
      // Check if user is actually authenticated despite the error
      try {
        await new Promise(resolve => setTimeout(resolve, 200));
        const currentUser = await getCurrentAuthUser();
        
        if (currentUser) {
          setUser(currentUser);
          return true;
        }
      } catch (checkError) {
        console.log('AuthContext: User is not authenticated:', checkError);
      }
      
      setUser(null);
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutFromCognito();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      setUser(null);
      clearAuthCookies();
    }
  };

  useEffect(() => {
    initializeAuth();
    
    // Listen for auth failure events
    const authFailureHandler = (event: Event) => {
      handleAuthFailure(event as CustomEvent);
    };
    
    window.addEventListener('auth-failure', authFailureHandler);
    
    return () => {
      window.removeEventListener('auth-failure', authFailureHandler);
    };
  }, [handleAuthFailure]);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
