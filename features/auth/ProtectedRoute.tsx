"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { useAuth } from "@/features/auth/AuthProvider";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="bg-surface/90 shadow-panel rounded-xl p-8 text-center ring-1 ring-white/6 backdrop-blur-sm">
          <p className="text-caption text-accent">Authenticating</p>
          <p className="text-textPrimary mt-3 text-lg font-semibold">Restoring your session</p>
          <p className="text-textSecondary mt-2 text-sm">
            Please wait while we bring your library back.
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
