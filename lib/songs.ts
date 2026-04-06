import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import { fallbackTracks } from "@/lib/fallbackTracks";
import { db } from "@/lib/firebase/client";

export type SongSource = "admin" | "local" | "sample" | "spotify";

export type PlayableTrack = {
  audioUrl: string | null;
  id: string;
  image?: string;
  source: SongSource;
  subtitle: string;
  title: string;
};

export type AppSong = {
  audioUrl: string;
  createdAt?: { seconds?: number };
  createdBy?: string;
  id: string;
  image?: string;
  source: "admin";
  subtitle: string;
  title: string;
};

export type CreateSongInput = {
  audioUrl: string;
  createdBy: string;
  image?: string;
  subtitle: string;
  title: string;
};

function getSongsCollection() {
  return collection(db, "songs");
}

function mapSongDoc(snapshot: QueryDocumentSnapshot<DocumentData>): AppSong {
  const data = snapshot.data() as Omit<AppSong, "id">;

  return {
    audioUrl: data.audioUrl ?? "",
    ...(data.createdAt ? { createdAt: data.createdAt } : {}),
    ...(data.createdBy ? { createdBy: data.createdBy } : {}),
    id: snapshot.id,
    ...(data.image ? { image: data.image } : {}),
    source: "admin",
    subtitle: data.subtitle ?? "Unknown artist",
    title: data.title ?? "Untitled song",
  };
}

type MergeableTrack = {
  audioUrl: string | null;
  id?: string;
  image?: string;
  source?: SongSource;
  subtitle: string;
  title: string;
};

function normalizeTrack(track: MergeableTrack, index: number): PlayableTrack {
  return {
    audioUrl: track.audioUrl ?? null,
    id: track.id ?? `${track.source ?? "spotify"}-${track.title}-${index}`,
    ...(track.image ? { image: track.image } : {}),
    source: track.source ?? "spotify",
    subtitle: track.subtitle,
    title: track.title,
  };
}

export async function createSong(input: CreateSongInput) {
  const title = input.title.trim();
  const subtitle = input.subtitle.trim();
  const audioUrl = input.audioUrl.trim();
  const image = input.image?.trim();

  if (!title || !subtitle || !audioUrl) {
    throw new Error("Title, artist, and audio URL are required.");
  }

  const songRef = await addDoc(getSongsCollection(), {
    audioUrl,
    createdAt: serverTimestamp(),
    createdBy: input.createdBy,
    ...(image ? { image } : {}),
    source: "admin",
    subtitle,
    title,
  });

  return songRef.id;
}

export async function getAllSongs() {
  const songsQuery = query(getSongsCollection(), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(songsQuery);

  return snapshot.docs.map(mapSongDoc);
}

export async function getSupplementalTracks() {
  const adminSongs = await getAllSongs().catch(() => []);

  return [...fallbackTracks, ...adminSongs] satisfies PlayableTrack[];
}

export async function getMergedPlayableTracks(
  spotifyTracks: MergeableTrack[] = [],
) {
  const normalizedSpotifyTracks = spotifyTracks.map(normalizeTrack);
  const supplementalTracks = await getSupplementalTracks();

  return [...normalizedSpotifyTracks, ...supplementalTracks];
}
