"use client";

import { Button } from "@/components/ui/Button";
import { usePlaylists } from "@/features/library/PlaylistProvider";
import type { PlaylistSong } from "@/features/library/playlists";

type PlaylistPickerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  song: PlaylistSong;
};

export function PlaylistPickerModal({ isOpen, onClose, song }: PlaylistPickerModalProps) {
  const { addSongToPlaylist, playlists } = usePlaylists();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 px-4 backdrop-blur-sm">
      <div className="bg-surface/95 shadow-panel w-full max-w-md rounded-2xl p-6 ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-textPrimary text-lg font-semibold">Add to playlist</p>
            <p className="text-textSecondary mt-1 text-sm">Choose a playlist for this track.</p>
          </div>
          <button
            className="text-textSecondary hover:text-textPrimary rounded-full bg-white/5 px-3 py-1.5 text-sm font-semibold hover:bg-white/10"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        {playlists.length === 0 ? (
          <div className="mt-5 rounded-xl bg-surface/60 p-4 ring-1 ring-white/8">
            <p className="text-textSecondary text-sm">No playlists yet. Create one from your Library.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                className="hover:bg-elevated/80 flex w-full items-center justify-between rounded-xl bg-elevated px-4 py-3 text-left ring-1 ring-white/10 transition"
                onClick={() => {
                  void addSongToPlaylist(playlist.id, song).then(onClose);
                }}
                type="button"
              >
                <div>
                  <p className="text-textPrimary text-sm font-semibold">{playlist.name}</p>
                  <p className="text-textSecondary text-xs">Add track</p>
                </div>
                <span className="text-textSecondary text-xs font-semibold tracking-[0.18em] uppercase">
                  Add
                </span>
              </button>
            ))}

            <div className="mt-4 flex justify-end">
              <Button onClick={onClose} variant="ghost">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

