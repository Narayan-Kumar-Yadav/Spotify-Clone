"use client";

import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase/client";

export type Playlist = {
  createdAt?: { seconds?: number };
  id: string;
  name: string;
};

export type PlaylistSong = {
  addedAt?: { seconds?: number };
  audioUrl: string | null;
  id: string;
  image?: string;
  source?: "admin" | "local" | "sample" | "spotify";
  subtitle: string;
  title: string;
};

export type PlaylistWithSongs = Playlist & {
  songs: PlaylistSong[];
};

function mapPlaylistDoc(snapshot: QueryDocumentSnapshot<DocumentData>): Playlist {
  const data = snapshot.data() as { createdAt?: { seconds?: number }; name?: string };
  return {
    id: snapshot.id,
    name: data.name ?? "Untitled playlist",
    ...(data.createdAt ? { createdAt: data.createdAt } : {}),
  };
}

export async function createPlaylist(userId: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Playlist name is required");

  const playlistsRef = collection(db, "users", userId, "playlists");
  const playlistDoc = await addDoc(playlistsRef, {
    createdAt: serverTimestamp(),
    name: trimmedName,
  });

  return playlistDoc.id;
}

export async function addPlaylist(userId: string, name: string) {
  return createPlaylist(userId, name);
}

export async function getUserPlaylists(userId: string): Promise<Playlist[]> {
  const playlistsRef = collection(db, "users", userId, "playlists");
  const playlistsQuery = query(playlistsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(playlistsQuery);
  return snapshot.docs.map(mapPlaylistDoc);
}

export async function addSongToPlaylist(
  userId: string,
  playlistId: string,
  song: PlaylistSong,
) {
  const songRef = doc(db, "users", userId, "playlists", playlistId, "songs", song.id);
  await setDoc(
    songRef,
    {
      addedAt: serverTimestamp(),
      audioUrl: song.audioUrl ?? null,
      ...(song.image ? { image: song.image } : {}),
      ...(song.source ? { source: song.source } : {}),
      subtitle: song.subtitle,
      title: song.title,
    },
    { merge: true },
  );
}

export async function getPlaylistSongs(userId: string, playlistId: string): Promise<PlaylistSong[]> {
  const songsRef = collection(db, "users", userId, "playlists", playlistId, "songs");
  const songsQuery = query(songsRef, orderBy("addedAt", "desc"));
  const snapshot = await getDocs(songsQuery);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as Omit<PlaylistSong, "id">;
    return {
      audioUrl: data.audioUrl ?? null,
      id: docSnap.id,
      ...(data.image ? { image: data.image } : {}),
      ...(data.source ? { source: data.source } : {}),
      subtitle: data.subtitle ?? "Unknown artist",
      title: data.title ?? "Unknown track",
    };
  });
}

export async function getPlaylistName(userId: string, playlistId: string): Promise<string> {
  const playlistRef = doc(db, "users", userId, "playlists", playlistId);
  const snapshot = await getDoc(playlistRef);
  const data = snapshot.data() as { name?: string } | undefined;
  return data?.name ?? "Playlist";
}

export async function getPlaylist(userId: string, playlistId: string): Promise<PlaylistWithSongs> {
  const playlistRef = doc(db, "users", userId, "playlists", playlistId);
  const [playlistSnapshot, songs] = await Promise.all([
    getDoc(playlistRef),
    getPlaylistSongs(userId, playlistId),
  ]);

  const data = playlistSnapshot.data() as { createdAt?: { seconds?: number }; name?: string } | undefined;

  return {
    ...(data?.createdAt ? { createdAt: data.createdAt } : {}),
    id: playlistId,
    name: data?.name ?? "Playlist",
    songs,
  };
}

export async function updatePlaylistName(userId: string, playlistId: string, name: string) {
  const trimmedName = name.trim();
  if (!trimmedName) {
    throw new Error("Playlist name is required");
  }

  const playlistRef = doc(db, "users", userId, "playlists", playlistId);
  await updateDoc(playlistRef, { name: trimmedName });
}

export async function deletePlaylist(userId: string, playlistId: string) {
  const songsRef = collection(db, "users", userId, "playlists", playlistId, "songs");
  const songsSnapshot = await getDocs(songsRef);

  await Promise.all(songsSnapshot.docs.map((songDoc) => deleteDoc(songDoc.ref)));
  await deleteDoc(doc(db, "users", userId, "playlists", playlistId));
}
