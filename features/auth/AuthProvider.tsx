"use client";

import type { User } from "firebase/auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { auth } from "@/lib/firebase/client";

const GUEST_USER_STORAGE_KEY = "guestUser";

export type AppUser = {
  displayName: string;
  email?: string | null;
  isGuest?: boolean;
  photoURL?: string | null;
  uid: string;
};

type AuthContextValue = {
  isLoading: boolean;
  signInAsGuest: (name: string) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  user: AppUser | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

type AuthProviderProps = {
  children: ReactNode;
};

function toAppUser(user: User): AppUser {
  return {
    displayName: user.displayName || "Spotify Listener",
    email: user.email,
    photoURL: user.photoURL,
    uid: user.uid,
  };
}

function getStoredGuestUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedGuestUser = window.localStorage.getItem(GUEST_USER_STORAGE_KEY);
  if (!storedGuestUser) {
    return null;
  }

  try {
    return JSON.parse(storedGuestUser) as AppUser;
  } catch {
    window.localStorage.removeItem(GUEST_USER_STORAGE_KEY);
    return null;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(() => getStoredGuestUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (nextUser) {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(GUEST_USER_STORAGE_KEY);
        }
        setUser(toAppUser(nextUser));
        setIsLoading(false);
        return;
      }

      const storedGuestUser = getStoredGuestUser();
      setUser(storedGuestUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(GUEST_USER_STORAGE_KEY);
    }

    await signInWithPopup(auth, googleProvider);
  }, []);

  const signInAsGuest = useCallback((name: string) => {
    const guestName = name.trim();
    if (!guestName) {
      return;
    }

    const guestUser: AppUser = {
      displayName: guestName,
      email: null,
      isGuest: true,
      photoURL: null,
      uid: `guest-${Date.now()}`,
    };

    setUser(guestUser);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(GUEST_USER_STORAGE_KEY, JSON.stringify(guestUser));
    }
  }, []);

  const signOutUser = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(GUEST_USER_STORAGE_KEY);
    }

    if (user?.isGuest) {
      setUser(null);
      return;
    }

    await signOut(auth);
    setUser(null);
  }, [user?.isGuest]);

  const value = useMemo(
    () => ({
      isLoading,
      signInAsGuest,
      signInWithGoogle,
      signOutUser,
      user,
    }),
    [isLoading, signInAsGuest, signInWithGoogle, signOutUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
