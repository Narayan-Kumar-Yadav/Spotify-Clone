"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/features/auth/AuthProvider";
import type { PlaylistSong } from "@/features/library/playlists";
import { getPlaylist } from "@/features/library/playlists";

export default function PlaylistPage() {
  const params = useParams<{ id: string }>();
  const playlistId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("Playlist");
  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!user || user.isGuest) {
        setName("Playlist");
        setSongs([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const playlist = await getPlaylist(user.uid, playlistId);
        if (cancelled) return;
        setName(playlist.name);
        setSongs(playlist.songs);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [playlistId, user]);

  const hasSongs = useMemo(() => songs.length > 0, [songs.length]);

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-display">{name}</h1>
          <p className="text-textSecondary mt-2 text-sm">Your saved playlist songs.</p>
        </div>
        <Button
          onClick={() => {
            router.push("/library");
          }}
          variant="ghost"
        >
          Back
        </Button>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-surface/60 p-6 ring-1 ring-white/8">
          <p className="text-textSecondary text-sm">Loading playlist...</p>
        </div>
      ) : !hasSongs ? (
        <div className="rounded-xl bg-surface/60 p-6 ring-1 ring-white/8">
          <p className="text-textSecondary text-sm">No songs yet. Add tracks from search or the player.</p>
        </div>
      ) : (
        <section>
          <h2 className="text-heading mb-6">Songs</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {songs.map((song) => (
              <Card
                key={song.id}
                audioUrl={song.audioUrl}
                artworkLabel={song.title}
                imageUrl={song.image}
                isPlayable={Boolean(song.audioUrl)}
                source={song.source}
                subtitle={song.subtitle}
                title={song.title}
                trackId={song.id}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
