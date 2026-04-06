"use client";

import { useEffect, useState } from "react";

import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AppSong } from "@/lib/songs";
import { getAllSongs } from "@/lib/songs";

export function UploadedSongsSection() {
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<AppSong[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadSongs() {
      try {
        const nextSongs = await getAllSongs();
        if (cancelled) return;
        setSongs(nextSongs);
      } catch {
        if (cancelled) return;
        setSongs([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadSongs();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading || songs.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-4">
        <SectionHeader title="Admin Picks" />
      </div>
      <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {songs.map((song) => (
          <div
            key={song.id}
            className="w-[180px] min-w-[180px] snap-start sm:w-[200px] sm:min-w-[200px]"
          >
            <Card
              audioUrl={song.audioUrl}
              artworkLabel={song.title}
              imageUrl={song.image}
              source={song.source}
              subtitle={song.subtitle}
              title={song.title}
              trackId={song.id}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
