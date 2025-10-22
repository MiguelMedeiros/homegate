"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Keypair, Session } from "@synonymdev/pubky";

export type PlanType = "free" | "onetime" | "premium" | "pro";

interface AuthData {
  isAuthenticated: boolean;
  plan: PlanType | null;
  publicKey: string | null;
  signupCompletedAt: string | null;
  seedPhrase: string[] | null;
  keypair: Keypair | null;
  session: Session | null;
}

interface AuthContextType {
  auth: AuthData;
  login: (plan: PlanType, publicKey: string, seedPhrase?: string[], keypair?: Keypair, session?: Session) => void;
  signin: (plan: PlanType, publicKey: string, keypair: Keypair, session: Session) => void;
  signinWithSession: (plan: PlanType, publicKey: string, session: Session) => void;
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
  seedPhrase: null,
  keypair: null,
  session: null,
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

  const login = (plan: PlanType, publicKey: string, seedPhrase?: string[], keypair?: Keypair, session?: Session) => {
    const authData: AuthData = {
      isAuthenticated: true,
      plan,
      publicKey,
      signupCompletedAt: new Date().toISOString(),
      seedPhrase: seedPhrase || null,
      keypair: keypair || null,
      session: session || null,
    };
    
    setAuthState(authData);
    
    try {
      // Note: We can't serialize Keypair and Session objects to JSON
      // Store only the serializable data
      const serializableData = {
        isAuthenticated: authData.isAuthenticated,
        plan: authData.plan,
        publicKey: authData.publicKey,
        signupCompletedAt: authData.signupCompletedAt,
        seedPhrase: authData.seedPhrase,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
    } catch (error) {
      console.error("Error saving auth to localStorage:", error);
    }
  };

  const signin = (plan: PlanType, publicKey: string, keypair: Keypair, session: Session) => {
    const authData: AuthData = {
      isAuthenticated: true,
      plan,
      publicKey,
      signupCompletedAt: null, // For signin, we don't know when they originally signed up
      seedPhrase: null, // For signin, we don't have the seed phrase
      keypair,
      session,
    };
    
    setAuthState(authData);
    
    try {
      // Note: We can't serialize Keypair and Session objects to JSON
      // Store only the serializable data
      const serializableData = {
        isAuthenticated: authData.isAuthenticated,
        plan: authData.plan,
        publicKey: authData.publicKey,
        signupCompletedAt: authData.signupCompletedAt,
        seedPhrase: authData.seedPhrase,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
    } catch (error) {
      console.error("Error saving auth to localStorage:", error);
    }
  };

  const signinWithSession = (plan: PlanType, publicKey: string, session: Session) => {
    const authData: AuthData = {
      isAuthenticated: true,
      plan,
      publicKey,
      signupCompletedAt: null, // For QR auth, we don't know when they originally signed up
      seedPhrase: null, // For QR auth, we don't have the seed phrase
      keypair: null, // For QR auth, we don't have access to the private key
      session,
    };
    
    setAuthState(authData);
    
    try {
      // Note: We can't serialize Session objects to JSON
      // Store only the serializable data
      const serializableData = {
        isAuthenticated: authData.isAuthenticated,
        plan: authData.plan,
        publicKey: authData.publicKey,
        signupCompletedAt: authData.signupCompletedAt,
        seedPhrase: authData.seedPhrase,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableData));
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
    <AuthContext.Provider value={{ auth, login, signin, signinWithSession, logout, isAuthenticated: auth.isAuthenticated }}>
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

