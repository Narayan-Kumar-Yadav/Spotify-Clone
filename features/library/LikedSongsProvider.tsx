"use client";

import { deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/features/auth/AuthProvider";
import { getLikedSongsCollection, getPlaylistsCollection } from "@/features/library/firestore";
import { db } from "@/lib/firebase/client";
import type { PlayerTrack } from "@/store/player";

type LikedSong = {
  audioUrl: string | null;
  id: string;
  image?: string;
  source?: "admin" | "local" | "sample" | "spotify";
  subtitle: string;
  title: string;
};

type LikedSongsContextValue = {
  isLiked: (songId?: string) => boolean;
  likedSongs: LikedSong[];
  toggleLikeSong: (song: LikedSong) => Promise<void>;
};

const LikedSongsContext = createContext<LikedSongsContextValue | null>(null);

type FirestoreLikedSong = LikedSong & {
  likedAt?: { seconds?: number };
};

type LikedSongsProviderProps = {
  children: ReactNode;
};

function mapTrackToLikedSong(track: PlayerTrack & { id: string }): LikedSong {
  return {
    audioUrl: track.audioUrl,
    id: track.id,
    ...(track.image ? { image: track.image } : {}),
    ...(track.source ? { source: track.source } : {}),
    subtitle: track.subtitle,
    title: track.title,
  };
}

export function LikedSongsProvider({ children }: LikedSongsProviderProps) {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState<LikedSong[]>([]);

  useEffect(() => {
    if (!user || user.isGuest) return;

    // Initialize both user library collection paths used by the app.
    getPlaylistsCollection(user.uid);
    const likedSongsRef = getLikedSongsCollection(user.uid);
    const likedSongsQuery = query(likedSongsRef, orderBy("likedAt", "desc"));
    const unsubscribe = onSnapshot(likedSongsQuery, (snapshot) => {
      const nextLikedSongs = snapshot.docs.map((documentSnapshot) => {
        const data = documentSnapshot.data() as FirestoreLikedSong;
        return {
          audioUrl: data.audioUrl ?? null,
          id: documentSnapshot.id,
          ...(data.image ? { image: data.image } : {}),
          ...(data.source ? { source: data.source } : {}),
          subtitle: data.subtitle ?? "Unknown artist",
          title: data.title ?? "Unknown track",
        };
      });

      setLikedSongs(nextLikedSongs);
    });

    return unsubscribe;
  }, [user]);

  const effectiveLikedSongs = useMemo(
    () => (user && !user.isGuest ? likedSongs : []),
    [likedSongs, user],
  );
  const likedSongIdSet = useMemo(() => new Set(effectiveLikedSongs.map((song) => song.id)), [effectiveLikedSongs]);

  const isLiked = useCallback((songId?: string) => {
    if (!songId) return false;
    return likedSongIdSet.has(songId);
  }, [likedSongIdSet]);

  const toggleLikeSong = useCallback(
    async (song: LikedSong) => {
      if (!user || user.isGuest || !song.id) return;

      const songRef = doc(db, "users", user.uid, "likedSongs", song.id);

      if (likedSongIdSet.has(song.id)) {
        await deleteDoc(songRef);
        return;
      }

      await setDoc(songRef, {
        audioUrl: song.audioUrl ?? null,
        ...(song.image ? { image: song.image } : {}),
        likedAt: serverTimestamp(),
        ...(song.source ? { source: song.source } : {}),
        subtitle: song.subtitle,
        title: song.title,
      });
    },
    [likedSongIdSet, user],
  );

  const value = useMemo(
    () => ({
      isLiked,
      likedSongs: effectiveLikedSongs,
      toggleLikeSong,
    }),
    [effectiveLikedSongs, isLiked, toggleLikeSong],
  );

  return <LikedSongsContext.Provider value={value}>{children}</LikedSongsContext.Provider>;
}

export function useLikedSongs() {
  const context = useContext(LikedSongsContext);
  if (!context) {
    throw new Error("useLikedSongs must be used within a LikedSongsProvider.");
  }
  return context;
}

export function toLikedSong(track: PlayerTrack & { id: string }): LikedSong {
  return mapTrackToLikedSong(track);
}
