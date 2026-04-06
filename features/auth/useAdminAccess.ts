"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";

type AdminAccessState = {
  isAdmin: boolean;
  isChecking: boolean;
};

export function useAdminAccess(): AdminAccessState {
  const { isLoading, user } = useAuth();
  const [adminAccess, setAdminAccess] = useState<AdminAccessState>({
    isAdmin: false,
    isChecking: true,
  });

  useEffect(() => {
    if (isLoading) {
      setAdminAccess((current) => ({ ...current, isChecking: true }));
      return;
    }

    if (!user || user.isGuest || !user.email) {
      setAdminAccess({
        isAdmin: false,
        isChecking: false,
      });
      return;
    }

    const controller = new AbortController();
    const userEmail = user.email;

    async function checkAdminAccess() {
      try {
        const response = await fetch("/api/admin/access", {
          body: JSON.stringify({ email: userEmail }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to verify admin access");
        }

        const data = (await response.json()) as { isAdmin?: boolean };

        setAdminAccess({
          isAdmin: Boolean(data.isAdmin),
          isChecking: false,
        });
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          return;
        }

        setAdminAccess({
          isAdmin: false,
          isChecking: false,
        });
      }
    }

    setAdminAccess((current) => ({ ...current, isChecking: true }));
    void checkAdminAccess();

    return () => {
      controller.abort();
    };
  }, [isLoading, user]);

  return adminAccess;
}
