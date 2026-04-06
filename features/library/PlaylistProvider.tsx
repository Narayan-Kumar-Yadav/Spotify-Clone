"use client";

import { onSnapshot, orderBy, query } from "firebase/firestore";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";
import { getPlaylistsCollection } from "@/features/library/firestore";
import type { Playlist, PlaylistSong } from "@/features/library/playlists";
import { addPlaylist, addSongToPlaylist } from "@/features/library/playlists";

type PlaylistContextValue = {
  addSongToPlaylist: (playlistId: string, song: PlaylistSong) => Promise<void>;
  createPlaylist: (name: string) => Promise<string | null>;
  playlists: Playlist[];
};

const PlaylistContext = createContext<PlaylistContextValue | null>(null);

type PlaylistProviderProps = {
  children: ReactNode;
};

export function PlaylistProvider({ children }: PlaylistProviderProps) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    if (!user || user.isGuest) return;

    const playlistsRef = getPlaylistsCollection(user.uid);
    const playlistsQuery = query(playlistsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(playlistsQuery, (snapshot) => {
      const nextPlaylists = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as { createdAt?: { seconds?: number }; name?: string };
        return {
          id: docSnap.id,
          name: data.name ?? "Untitled playlist",
          ...(data.createdAt ? { createdAt: data.createdAt } : {}),
        };
      });
      setPlaylists(nextPlaylists);
    });

    return unsubscribe;
  }, [user]);

  const effectivePlaylists = useMemo(
    () => (user && !user.isGuest ? playlists : []),
    [playlists, user],
  );

  const createPlaylistAction = useCallback(
    async (name: string) => {
      if (!user || user.isGuest) return null;
      const id = await addPlaylist(user.uid, name);
      return id;
    },
    [user],
  );

  const addSongToPlaylistAction = useCallback(
    async (playlistId: string, song: PlaylistSong) => {
      if (!user || user.isGuest) return;
      await addSongToPlaylist(user.uid, playlistId, song);
    },
    [user],
  );

  const value = useMemo(
    () => ({
      addSongToPlaylist: addSongToPlaylistAction,
      createPlaylist: createPlaylistAction,
      playlists: effectivePlaylists,
    }),
    [addSongToPlaylistAction, createPlaylistAction, effectivePlaylists],
  );

  return <PlaylistContext.Provider value={value}>{children}</PlaylistContext.Provider>;
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error("usePlaylists must be used within a PlaylistProvider.");
  }
  return context;
}
