"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ProfileData {
  name: string;
  avatar: string | null;
}

interface ProfileContextType {
  profile: ProfileData | null;
  setProfile: (profile: ProfileData) => void;
  clearProfile: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const STORAGE_KEY = "pubky_profile";

export function ProfileProvider({ children }: { children: ReactNode }) {
  // Initialize with null, will be loaded from localStorage in useEffect
  const [profile, setProfileState] = useState<ProfileData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(STORAGE_KEY);
      if (storedProfile) {
        setProfileState(JSON.parse(storedProfile));
      }
    } catch (error) {
      console.error("Error loading profile from localStorage:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const setProfile = (profile: ProfileData) => {
    setProfileState(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error("Error saving profile to localStorage:", error);
    }
  };

  const clearProfile = () => {
    setProfileState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error removing profile from localStorage:", error);
    }
  };

  // Don't render children until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}

