"use client";

import type { ReactNode } from "react";

import { BottomPlayer } from "@/components/layout/BottomPlayer";
import { cn } from "@/lib/utils/cn";
import { usePlayerStore } from "@/store/player";

type MainContentProps = {
  children: ReactNode;
};

export function MainContent({ children }: MainContentProps) {
  const currentSong = usePlayerStore((state) => state.currentSong);

  return (
    <>
      <main
        className={cn(
          "h-screen flex-1 overflow-y-auto lg:pl-72",
          currentSong ? "pb-44 lg:pb-32" : "pb-24 lg:pb-8",
        )}
      >
        <div className="from-elevated/50 via-background to-background min-h-full bg-gradient-to-b px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </div>
      </main>

      {currentSong && (
        <div className="animate-slide-up">
          <BottomPlayer />
        </div>
      )}
    </>
  );
}
