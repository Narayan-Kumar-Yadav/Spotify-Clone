"use client";

import { useState } from "react";

import {
  HeartIcon,
  MusicNoteIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  SpeakerIcon,
  WaveformIcon,
} from "@/components/shared/icons";
import { useLikedSongs } from "@/features/library/LikedSongsProvider";
import { PlaylistPickerModal } from "@/features/library/PlaylistPickerModal";
import { usePlayerStore } from "@/store/player";

function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function BottomPlayer() {
  const audioUrl = usePlayerStore((state) => state.audioUrl);
  const currentIndex = usePlayerStore((state) => state.currentIndex);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const currentTime = usePlayerStore((state) => state.currentTime);
  const duration = usePlayerStore((state) => state.duration);
  const hasPlayablePreview = usePlayerStore((state) => state.hasPlayablePreview);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const playNext = usePlayerStore((state) => state.playNext);
  const playPrevious = usePlayerStore((state) => state.playPrevious);
  const queue = usePlayerStore((state) => state.queue);
  const togglePlayback = usePlayerStore((state) => state.togglePlayback);
  const { isLiked, toggleLikeSong } = useLikedSongs();

  const progress = duration > 0 ? Math.min((currentTime / duration) * 100, 100) : 0;
  const displaySong = currentSong ?? {
    subtitle: "Click any card to start playback",
    title: "Select a mix",
  };
  const canTogglePlayback = Boolean(audioUrl && hasPlayablePreview);
  const showPreviewUnavailable = Boolean(currentSong && !hasPlayablePreview);
  const canLikeCurrentSong = Boolean(currentSong?.id);
  const currentSongLiked = isLiked(currentSong?.id);
  const hasPreviousTrack = queue.slice(0, currentIndex).some((track) => Boolean(track?.audioUrl));
  const hasNextTrack = queue.slice(currentIndex + 1).some((track) => Boolean(track?.audioUrl));
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const displayCurrentTime = showPreviewUnavailable ? "--:--" : formatTime(currentTime);
  const displayDuration = showPreviewUnavailable ? "--:--" : formatTime(duration);

  function handleLikeCurrentSong() {
    if (!currentSong?.id) return;

    void toggleLikeSong({
      audioUrl: audioUrl ?? null,
      id: currentSong.id,
      ...(currentSong.image ? { image: currentSong.image } : {}),
      ...(currentSong.source ? { source: currentSong.source } : {}),
      subtitle: currentSong.subtitle,
      title: currentSong.title,
    });
  }

  return (
    <>
      <footer className="bg-surface/70 shadow-player fixed inset-x-0 bottom-[68px] z-40 border-t border-white/8 backdrop-blur-2xl lg:bottom-0">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-4">
            <div className="from-accent via-accent/70 to-elevated text-background shadow-glow flex size-14 items-center justify-center rounded-xl bg-gradient-to-br">
              <MusicNoteIcon className="size-6" />
            </div>
            <div>
              <p className="text-textPrimary text-sm font-semibold">{displaySong.title}</p>
              <p className="text-textSecondary text-sm">{displaySong.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-start gap-3 lg:max-w-xl lg:items-center">
            <div className="text-textSecondary flex items-center gap-3">
              <button
                className="hover:text-textPrimary rounded-full bg-white/5 p-2 hover:bg-white/10"
                type="button"
              >
                <WaveformIcon className="size-4" />
              </button>
              <button
                aria-label="Previous track"
                className="hover:text-textPrimary rounded-full bg-white/5 p-2 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
                disabled={!hasPreviousTrack}
                onClick={() => {
                  void playPrevious();
                }}
                type="button"
              >
                <SkipBackIcon className="size-4" />
              </button>
              <button
                aria-label={currentSongLiked ? "Unlike current song" : "Like current song"}
                className="hover:text-textPrimary rounded-full bg-white/5 p-2 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
                disabled={!canLikeCurrentSong}
                onClick={handleLikeCurrentSong}
                type="button"
              >
                <HeartIcon className="size-4" fill={currentSongLiked ? "currentColor" : "none"} />
              </button>
              <button
                aria-label="Add current song to playlist"
                className="hover:text-textPrimary rounded-full bg-white/5 p-2 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
                disabled={!canLikeCurrentSong}
                onClick={() => {
                  setIsPickerOpen(true);
                }}
                type="button"
              >
                <span className="text-xs font-bold">+</span>
              </button>
              <button
                className="bg-accent text-background shadow-glow rounded-full p-3.5 hover:scale-105 hover:brightness-110 disabled:pointer-events-none disabled:opacity-60"
                disabled={!canTogglePlayback}
                onClick={() => {
                  void togglePlayback();
                }}
                type="button"
              >
                {isPlaying ? <PauseIcon className="size-5" /> : <PlayIcon className="size-5" />}
              </button>
              <button
                aria-label="Next track"
                className="hover:text-textPrimary rounded-full bg-white/5 p-2 hover:bg-white/10 disabled:pointer-events-none disabled:opacity-40"
                disabled={!hasNextTrack}
                onClick={() => {
                  void playNext();
                }}
                type="button"
              >
                <SkipForwardIcon className="size-4" />
              </button>
              <button
                className="hover:text-textPrimary rounded-full bg-white/5 p-2 hover:bg-white/10"
                type="button"
              >
                <SpeakerIcon className="size-4" />
              </button>
            </div>

            <div className="flex w-full items-center gap-3">
              <span className="text-textSecondary text-xs font-medium">{displayCurrentTime}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="bg-textPrimary relative h-full rounded-full"
                  style={{ width: `${showPreviewUnavailable ? 0 : progress}%` }}
                >
                  <div className="bg-accent shadow-glow absolute top-1/2 right-0 size-3 -translate-y-1/2 rounded-full" />
                </div>
              </div>
              <span className="text-textSecondary text-xs font-medium">{displayDuration}</span>
            </div>
            {showPreviewUnavailable && (
              <p className="text-textSecondary text-xs font-medium">Preview not available</p>
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <span className="text-textSecondary text-xs font-semibold tracking-[0.24em] uppercase">
              Volume
            </span>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-white/10">
              <div className="bg-textPrimary relative h-full w-3/4 rounded-full">
                <div className="bg-textPrimary absolute top-1/2 right-0 size-3 -translate-y-1/2 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </footer>
      {currentSong?.id && (
        <PlaylistPickerModal
          isOpen={isPickerOpen}
          onClose={() => {
            setIsPickerOpen(false);
          }}
          song={{
            audioUrl: audioUrl ?? null,
            id: currentSong.id,
            ...(currentSong.image ? { image: currentSong.image } : {}),
            ...(currentSong.source ? { source: currentSong.source } : {}),
            subtitle: currentSong.subtitle,
            title: currentSong.title,
          }}
        />
      )}
    </>
  );
}
