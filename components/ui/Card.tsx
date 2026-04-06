"use client";

import Image from "next/image";
import { useState } from "react";

import { HeartIcon, PlayIcon } from "@/components/shared/icons";
import { useLikedSongs } from "@/features/library/LikedSongsProvider";
import { PlaylistPickerModal } from "@/features/library/PlaylistPickerModal";
import { cn } from "@/lib/utils/cn";
import type { PlayerAudioSource } from "@/store/player";
import { usePlayerStore } from "@/store/player";

type ArtworkTone = "accent" | "contrast" | "glow" | "muted";

type CardProps = {
  audioUrl?: string | null;
  artworkLabel: string;
  imageUrl?: string | undefined;
  isPlayable?: boolean;
  source?: PlayerAudioSource | undefined;
  spotifyId?: string;
  trackId?: string;
  subtitle: string;
  title: string;
  tone?: ArtworkTone;
};

// Rich gradient backgrounds for each tone — more vibrant than before
const artworkToneClasses: Record<ArtworkTone, string> = {
  accent:   "from-[#1db954]/50 via-[#1db954]/20 to-[#121212]",
  contrast: "from-[#9333ea]/40 via-[#3b0764]/30 to-[#121212]",
  glow:     "from-[#f59e0b]/40 via-[#78350f]/25 to-[#121212]",
  muted:    "from-[#0ea5e9]/35 via-[#0c4a6e]/25 to-[#121212]",
};

// Accent dot colors for the "no-image" badge
const accentDotClasses: Record<ArtworkTone, string> = {
  accent:   "bg-[#1db954]/80",
  contrast: "bg-[#9333ea]/80",
  glow:     "bg-[#f59e0b]/80",
  muted:    "bg-[#0ea5e9]/80",
};

export function Card({
  audioUrl,
  artworkLabel,
  imageUrl,
  isPlayable = true,
  source,
  spotifyId,
  trackId,
  subtitle,
  title,
  tone = "accent",
}: CardProps) {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const playSong = usePlayerStore((state) => state.playSong);
  const playPlaylist = usePlayerStore((state) => state.playPlaylist);
  const playTrack = usePlayerStore((state) => state.playTrack);
  const { isLiked, toggleLikeSong } = useLikedSongs();

  const isInteractive = Boolean(spotifyId || isPlayable);

  const isActive = currentSong?.title === title && currentSong.subtitle === subtitle;
  const isTrackLikeable = Boolean(trackId);
  const liked = isLiked(trackId);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const sourceLabel =
    source === "sample"
      ? "Sample Audio"
      : source === "local"
        ? "Offline Track"
        : source === "admin"
          ? "Uploaded Track"
        : null;

  function handlePlay() {
    if (!isInteractive) {
      return;
    }

    if (spotifyId) {
      void playPlaylist(spotifyId);
      return;
    }

    if (audioUrl !== undefined) {
      void playTrack({
        audioUrl,
        ...(trackId ? { id: trackId } : {}),
        ...(imageUrl ? { image: imageUrl } : {}),
        ...(source ? { source } : {}),
        subtitle,
        title,
      });
      return;
    }

    playSong({ subtitle, title });
  }

  function handleLikeClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!trackId) return;

    void toggleLikeSong({
      audioUrl: audioUrl ?? null,
      id: trackId,
      ...(imageUrl ? { image: imageUrl } : {}),
      ...(source ? { source } : {}),
      subtitle,
      title,
    });
  }

  function handleAddToPlaylistClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (!trackId) return;
    setIsPickerOpen(true);
  }

  return (
    <>
      <article
        aria-pressed={isActive}
        className={cn(
          "group bg-surface/90 shadow-panel rounded-xl p-4 ring-1 ring-white/6 backdrop-blur-sm",
          "transition-all duration-200 ease-out",
          "hover:bg-elevated hover:shadow-card hover:-translate-y-1 hover:scale-[1.03]",
          isActive && "bg-elevated ring-accent/70 shadow-glow",
          isInteractive ? "cursor-pointer" : "cursor-default",
        )}
        onClick={isInteractive ? handlePlay : undefined}
        onKeyDown={
          isInteractive
            ? (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handlePlay();
                }
              }
            : undefined
        }
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive ? 0 : -1}
      >
      {/* ── Artwork ── */}
      <div
        className={cn(
          "relative mb-4 aspect-square overflow-hidden rounded-xl bg-gradient-to-br",
          artworkToneClasses[tone],
        )}
      >
        {isTrackLikeable && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <button
              aria-label="Add to playlist"
              className="bg-background/70 text-textPrimary hover:bg-background rounded-full p-2 transition"
              onClick={handleAddToPlaylistClick}
              type="button"
            >
              <span className="text-xs font-bold">+</span>
            </button>
            <button
              aria-label={liked ? `Unlike ${title}` : `Like ${title}`}
              className={cn(
                "rounded-full p-2 transition",
                liked
                  ? "bg-accent text-background shadow-glow"
                  : "bg-background/70 text-textPrimary hover:bg-background",
              )}
              onClick={handleLikeClick}
              type="button"
            >
              <HeartIcon className="size-4" fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        )}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={artworkLabel}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 40vw, 200px"
            onError={(e) => {
              // Hide broken img — gradient shows through beneath
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          /* Rich gradient placeholder — Part 6 */
          <>
            <div className="absolute inset-0 bg-gradient-to-br opacity-80" />
            {/* Ambient blobs */}
            <div className={cn("absolute -top-6 -left-6 size-24 rounded-full blur-2xl opacity-60", accentDotClasses[tone])} />
            <div className="absolute -right-6 bottom-0 size-20 rounded-full bg-white/5 blur-2xl" />
            {/* Label overlay */}
            <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
              <p className="text-textPrimary/90 text-sm font-semibold leading-tight line-clamp-2">
                {artworkLabel}
              </p>
            </div>
          </>
        )}

        {/* Hover play button */}
        {isInteractive && (
          <button
            aria-label={`Play ${title}`}
            className={cn(
              "bg-accent text-background shadow-glow",
              "pointer-events-none absolute right-3 bottom-3",
              "translate-y-3 rounded-full p-3 opacity-0",
              "transition-all duration-200 ease-out",
              "group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100",
              isActive && "pointer-events-auto translate-y-0 opacity-100",
            )}
            onClick={(event) => {
              event.stopPropagation();
              handlePlay();
            }}
            type="button"
          >
            <PlayIcon className="size-4" />
          </button>
        )}
      </div>

      {/* ── Text — Part 7: truncated, consistent spacing ── */}
      <div className="space-y-1">
        <h3 className="text-textPrimary truncate text-sm font-semibold leading-5">{title}</h3>
        <p className="text-textSecondary line-clamp-2 text-xs leading-5">{subtitle}</p>
        {sourceLabel && (
          <p className="text-textSecondary/80 text-[11px] leading-4">{sourceLabel}</p>
        )}
        {spotifyId && (
          <p className="text-textSecondary/80 text-[11px] leading-4">
            Preview may not be available
          </p>
        )}
      </div>
      </article>

      {trackId && (
        <PlaylistPickerModal
          isOpen={isPickerOpen}
          onClose={() => {
            setIsPickerOpen(false);
          }}
          song={{
            audioUrl: audioUrl ?? null,
            id: trackId,
            ...(imageUrl ? { image: imageUrl } : {}),
            ...(source ? { source } : {}),
            subtitle,
            title,
          }}
        />
      )}
    </>
  );
}
