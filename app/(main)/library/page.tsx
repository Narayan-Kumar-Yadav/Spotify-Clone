"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { MusicNoteIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useLikedSongs } from "@/features/library/LikedSongsProvider";
import { usePlaylists } from "@/features/library/PlaylistProvider";

export default function LibraryPage() {
  const { likedSongs } = useLikedSongs();
  const { createPlaylist, playlists } = usePlaylists();
  const router = useRouter();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const hasAnyContent = useMemo(() => likedSongs.length > 0 || playlists.length > 0, [likedSongs.length, playlists.length]);

  async function handleCreatePlaylist() {
    if (!playlistName.trim()) return;
    setIsCreating(true);
    try {
      const id = await createPlaylist(playlistName);
      if (id) {
        setIsCreateOpen(false);
        setPlaylistName("");
        router.push(`/playlist/${id}`);
      }
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-display">Your Library</h1>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-heading">Playlists</h2>
          <Button
            onClick={() => {
              setIsCreateOpen(true);
            }}
            variant="ghost"
          >
            Create playlist
          </Button>
        </div>

        {playlists.length === 0 ? (
          <div className="rounded-xl bg-surface/60 p-6 ring-1 ring-white/8">
            <p className="text-textSecondary text-sm">No playlists yet. Create one to start collecting songs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {playlists.map((playlist) => (
              <Card
                key={playlist.id}
                artworkLabel={playlist.name}
                spotifyId={playlist.id}
                subtitle="Playlist"
                title={playlist.name}
              />
            ))}
          </div>
        )}
      </section>

      {likedSongs.length === 0 ? (
        !hasAnyContent ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
            <div className="bg-surface ring-1 ring-white/6 mb-6 flex size-20 items-center justify-center rounded-full shadow-panel">
              <MusicNoteIcon className="size-8 text-textSecondary" />
            </div>
            <h2 className="text-heading mb-2">Your library is empty</h2>
            <p className="text-textSecondary max-w-sm text-base leading-relaxed">
              Like songs or create a playlist to start building your collection.
            </p>
          </div>
        ) : null
      ) : (
        <section>
          <h2 className="text-heading mb-6">Liked songs</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {likedSongs.map((song) => (
              <Card
                key={song.id}
                audioUrl={song.audioUrl}
                artworkLabel={song.title}
                imageUrl={song.image}
                source={song.source}
                subtitle={song.subtitle}
                title={song.title}
                trackId={song.id}
              />
            ))}
          </div>
        </section>
      )}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm">
          <div className="bg-surface/95 shadow-panel w-full max-w-md rounded-2xl p-6 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-textPrimary text-lg font-semibold">Create playlist</p>
                <p className="text-textSecondary mt-1 text-sm">Give your playlist a name.</p>
              </div>
              <button
                className="text-textSecondary hover:text-textPrimary rounded-full bg-white/5 px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
                onClick={() => {
                  setIsCreateOpen(false);
                }}
                type="button"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <input
                className="w-full rounded-xl bg-elevated px-4 py-3 text-textPrimary outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-white/20 placeholder:text-textSecondary font-medium"
                onChange={(event) => {
                  setPlaylistName(event.target.value);
                }}
                placeholder="My playlist"
                value={playlistName}
              />

              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setIsCreateOpen(false);
                  }}
                  variant="ghost"
                >
                  Cancel
                </Button>
                <Button disabled={isCreating || !playlistName.trim()} onClick={handleCreatePlaylist}>
                  {isCreating ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
