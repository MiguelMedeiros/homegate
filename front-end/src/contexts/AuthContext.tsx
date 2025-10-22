"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type PlanType = "free" | "onetime" | "premium" | "pro";

interface AuthData {
  isAuthenticated: boolean;
  plan: PlanType | null;
  publicKey: string | null;
  signupCompletedAt: string | null;
}

interface AuthContextType {
  auth: AuthData;
  login: (plan: PlanType, publicKey: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "pubky_auth";

const defaultAuthData: AuthData = {
  isAuthenticated: false,
  plan: null,
  publicKey: null,
  signupCompletedAt: null,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthData>(defaultAuthData);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load auth from localStorage on mount
  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY);
      if (storedAuth) {
        setAuthState(JSON.parse(storedAuth));
      }
    } catch (error) {
      console.error("Error loading auth from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = (plan: PlanType, publicKey: string) => {
    const authData: AuthData = {
      isAuthenticated: true,
      plan,
      publicKey,
      signupCompletedAt: new Date().toISOString(),
    };
    
    setAuthState(authData);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error("Error saving auth to localStorage:", error);
    }
  };

  const logout = () => {
    setAuthState(defaultAuthData);
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Also clear profile
      localStorage.removeItem("pubky_profile");
    } catch (error) {
      console.error("Error removing auth from localStorage:", error);
    }
  };

  // Don't render children until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAuthenticated: auth.isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

