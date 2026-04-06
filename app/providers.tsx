"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "@/features/auth/AuthProvider";
import { LikedSongsProvider } from "@/features/library/LikedSongsProvider";
import { PlaylistProvider } from "@/features/library/PlaylistProvider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <LikedSongsProvider>
        <PlaylistProvider>{children}</PlaylistProvider>
      </LikedSongsProvider>
    </AuthProvider>
  );
}
