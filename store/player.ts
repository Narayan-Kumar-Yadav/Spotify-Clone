"use client";

import { create } from "zustand";

import { fallbackTracks } from "@/lib/fallbackTracks";
import { getMergedPlayableTracks, getSupplementalTracks } from "@/lib/songs";

export type PlayerAudioSource = "admin" | "local" | "sample" | "spotify";

export type PlayerSong = {
  id?: string;
  image?: string;
  source?: PlayerAudioSource;
  subtitle: string;
  title: string;
};

export type PlayerTrack = PlayerSong & {
  audioUrl: string | null;
};

type StartPlaybackOptions = {
  attemptedUrls?: string[];
  currentIndex: number;
  preserveQueue?: boolean;
  queue: PlayerTrack[];
};

type PlayerState = {
  audio: HTMLAudioElement | null;
  audioUrl: string | null;
  currentIndex: number;
  currentSong: PlayerSong | null;
  currentTime: number;
  duration: number;
  hasPlayablePreview: boolean;
  isPlaying: boolean;
  playNext: () => Promise<void>;
  playPlaylist: (playlistId: string) => Promise<void>;
  playPrevious: () => Promise<void>;
  playSong: (song: PlayerSong) => void;
  playTrack: (track: PlayerTrack) => Promise<void>;
  queue: PlayerTrack[];
  togglePlayback: () => Promise<void>;
};

let audioCleanup: (() => void) | null = null;

function getFallbackTrackForError(failedTrack?: PlayerTrack, attemptedUrls: string[] = []) {
  const attemptedUrlSet = new Set(attemptedUrls);
  const fallback =
    fallbackTracks.find(
      (track) =>
        track.audioUrl !== failedTrack?.audioUrl && !attemptedUrlSet.has(track.audioUrl),
    ) ?? fallbackTracks.find((track) => !attemptedUrlSet.has(track.audioUrl));

  return fallback ?? null;
}

function findNextPlayableIndex(queue: PlayerTrack[], startIndex: number) {
  for (let index = startIndex + 1; index < queue.length; index += 1) {
    if (queue[index]?.audioUrl) {
      return index;
    }
  }

  return -1;
}

function findPreviousPlayableIndex(queue: PlayerTrack[], startIndex: number) {
  for (let index = startIndex - 1; index >= 0; index -= 1) {
    if (queue[index]?.audioUrl) {
      return index;
    }
  }

  return -1;
}

function stopAndCleanupAudio(audio: HTMLAudioElement | null) {
  if (!audio) return;

  if (audioCleanup) {
    audioCleanup();
    audioCleanup = null;
  }

  audio.pause();
  audio.currentTime = 0;
  audio.src = "";
  audio.load();
}

export const usePlayerStore = create<PlayerState>((set, get) => {
  const startTrackPlayback = async (track: PlayerTrack, options: StartPlaybackOptions) => {
    const { currentIndex, queue } = options;
    const attemptedUrls = options.attemptedUrls ?? [];
    const preserveQueue = options.preserveQueue ?? false;
    const existingAudio = get().audio;

    stopAndCleanupAudio(existingAudio);

    if (!track.audioUrl) {
      const fallback = getFallbackTrackForError(track, attemptedUrls);

      if (!fallback) {
        set({
          audio: null,
          audioUrl: null,
          currentIndex,
          currentSong: track,
          currentTime: 0,
          duration: 0,
          hasPlayablePreview: false,
          isPlaying: false,
          queue,
        });
        return;
      }

      await startTrackPlayback(fallback, {
        attemptedUrls,
        currentIndex: preserveQueue ? currentIndex : 0,
        preserveQueue,
        queue: preserveQueue ? queue : [fallback],
      });
      return;
    }

    const audio = new Audio(track.audioUrl);
    let hasSwitchedToFallback = false;

    const switchToFallback = () => {
      if (hasSwitchedToFallback) {
        return;
      }

      hasSwitchedToFallback = true;

      const nextAttemptedUrls = [...attemptedUrls, track.audioUrl].filter(
        (value): value is string => Boolean(value),
      );
      const fallback = getFallbackTrackForError(track, nextAttemptedUrls);

      if (!fallback) {
        set((state) =>
          state.audio === audio
            ? {
                hasPlayablePreview: false,
                isPlaying: false,
              }
            : state,
        );
        return;
      }

      void startTrackPlayback(fallback, {
        attemptedUrls: nextAttemptedUrls,
        currentIndex: preserveQueue ? currentIndex : 0,
        preserveQueue,
        queue: preserveQueue ? queue : [fallback],
      });
    };

    const onTimeUpdate = () => {
      set((state) => (state.audio === audio ? { currentTime: audio.currentTime } : state));
    };

    const onLoadedMetadata = () => {
      set((state) => (state.audio === audio ? { duration: audio.duration || 0 } : state));
    };

    const onEnded = () => {
      if (preserveQueue) {
        void get().playNext();
        return;
      }

      set((state) =>
        state.audio === audio
          ? {
              currentTime: audio.duration || state.currentTime,
              isPlaying: false,
            }
          : state,
      );
    };

    const onError = () => {
      switchToFallback();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    audioCleanup = () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };

    set({
      audio,
      audioUrl: track.audioUrl,
      currentIndex,
      currentSong: track,
      currentTime: 0,
      duration: 0,
      hasPlayablePreview: true,
      isPlaying: false,
      queue,
    });

    try {
      await audio.play();
      set((state) => (state.audio === audio ? { isPlaying: true } : state));
    } catch {
      switchToFallback();
    }
  };

  const playFirstPlayableTrack = async (queue: PlayerTrack[]) => {
    const firstPlayableIndex = findNextPlayableIndex(queue, -1);

    if (firstPlayableIndex === -1) {
      set({
        audio: null,
        audioUrl: null,
        currentIndex: -1,
        currentSong: null,
        currentTime: 0,
        duration: 0,
        hasPlayablePreview: false,
        isPlaying: false,
        queue,
      });
      return;
    }

    const playableTrack = queue[firstPlayableIndex];
    if (!playableTrack) return;

    await startTrackPlayback(playableTrack, {
      currentIndex: firstPlayableIndex,
      preserveQueue: true,
      queue,
    });
  };

  return {
    audio: null,
    audioUrl: null,
    currentIndex: -1,
    currentSong: null,
    currentTime: 0,
    duration: 0,
    hasPlayablePreview: false,
    isPlaying: false,
    playNext: async () => {
      const { audio, currentIndex, queue } = get();
      const nextIndex = findNextPlayableIndex(queue, currentIndex);

      if (nextIndex === -1) {
        set((state) => ({
          currentTime: audio?.duration || state.duration || state.currentTime,
          isPlaying: false,
        }));
        return;
      }

      const nextTrack = queue[nextIndex];
      if (!nextTrack) return;

      await startTrackPlayback(nextTrack, {
        currentIndex: nextIndex,
        preserveQueue: true,
        queue,
      });
    },
    playPlaylist: async (playlistId) => {
      try {
        const response = await fetch(`/api/spotify/playlists/${playlistId}/tracks`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch playlist tracks");
        }

        const data = (await response.json()) as { tracks?: PlayerTrack[] };
        const tracks = data.tracks ?? [];
        const queue = tracks.some((track) => Boolean(track.audioUrl))
          ? tracks
          : await getMergedPlayableTracks(tracks);

        await playFirstPlayableTrack(queue);
      } catch {
        const queue = await getSupplementalTracks();
        await playFirstPlayableTrack(queue);
      }
    },
    playPrevious: async () => {
      const { currentIndex, queue } = get();
      const previousIndex = findPreviousPlayableIndex(queue, currentIndex);

      if (previousIndex === -1) {
        return;
      }

      const previousTrack = queue[previousIndex];
      if (!previousTrack) return;

      await startTrackPlayback(previousTrack, {
        currentIndex: previousIndex,
        preserveQueue: true,
        queue,
      });
    },
    playSong: (song) => {
      const existingAudio = get().audio;
      stopAndCleanupAudio(existingAudio);

      set({
        audio: null,
        audioUrl: null,
        currentIndex: -1,
        currentSong: song,
        currentTime: 0,
        duration: 0,
        hasPlayablePreview: false,
        isPlaying: false,
        queue: [],
      });
    },
    playTrack: async (track) => {
      await startTrackPlayback(track, {
        currentIndex: 0,
        queue: [track],
      });
    },
    queue: [],
    togglePlayback: async () => {
      const { audio, hasPlayablePreview, isPlaying } = get();
      if (!audio || !hasPlayablePreview) return;

      if (isPlaying) {
        audio.pause();
        set({ isPlaying: false });
        return;
      }

      try {
        await audio.play();
        set({ isPlaying: true });
      } catch {
        set({ isPlaying: false });
      }
    },
  };
});
