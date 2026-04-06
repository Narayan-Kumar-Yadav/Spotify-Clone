"use client";

import { useEffect, useMemo, useState } from "react";

import { SearchIcon } from "@/components/shared/icons";
import { Card } from "@/components/ui/Card";
import { getMergedPlayableTracks, getSupplementalTracks } from "@/lib/songs";
import type { PlayerAudioSource } from "@/store/player";

const searchCategories = [
  { title: "Podcasts", subtitle: "Top trending", artworkLabel: "Talks", tone: "accent" as const },
  { title: "Made For You", subtitle: "Your mixes", artworkLabel: "Mixes", tone: "contrast" as const },
  { title: "New Releases", subtitle: "Latest drops", artworkLabel: "New", tone: "glow" as const },
  { title: "Pop", subtitle: "Global hits", artworkLabel: "Pop", tone: "muted" as const },
  { title: "Hip-Hop", subtitle: "Rap & Trap", artworkLabel: "Rap", tone: "contrast" as const },
  { title: "Rock", subtitle: "Classic & Modern", artworkLabel: "Rock", tone: "accent" as const },
  { title: "Latin", subtitle: "Música Latina", artworkLabel: "Latin", tone: "glow" as const },
  { title: "Mood", subtitle: "Songs for you", artworkLabel: "Mood", tone: "muted" as const },
];

type SearchTrack = {
  audioUrl: string | null;
  id: string;
  image?: string;
  source?: PlayerAudioSource;
  subtitle: string;
  title: string;
};

type SearchEntity = {
  id: string;
  image: string;
  subtitle: string;
  title: string;
};

type SearchResponse = {
  albums: SearchEntity[];
  artists: SearchEntity[];
  tracks: SearchTrack[];
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResponse>({
    albums: [],
    artists: [],
    tracks: [],
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setSearchResults({ albums: [], artists: [], tracks: [] });
      return;
    }

    const controller = new AbortController();

    async function runSearch() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(debouncedQuery)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = (await response.json()) as SearchResponse;
        const spotifyTracks = data.tracks ?? [];
        const tracks =
          spotifyTracks.length === 0 || spotifyTracks.every((track) => !track.audioUrl)
            ? await getMergedPlayableTracks(spotifyTracks)
            : spotifyTracks;

        setSearchResults({
          albums: data.albums ?? [],
          artists: data.artists ?? [],
          tracks,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          const tracks = await getSupplementalTracks();
          setSearchResults({ albums: [], artists: [], tracks });
        }
      } finally {
        setIsLoading(false);
      }
    }

    void runSearch();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery]);

  const tracks = useMemo(() => searchResults.tracks, [searchResults.tracks]);

  const hasNoResults =
    debouncedQuery.length > 0 &&
    !isLoading &&
    tracks.length === 0 &&
    searchResults.artists.length === 0 &&
    searchResults.albums.length === 0;

  return (
    <div className="space-y-8">
      <div className="sticky top-0 z-10 -mx-4 bg-background/95 px-4 py-4 pt-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:pt-8">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center justify-center">
            <SearchIcon className="size-6 text-textSecondary transition group-focus-within:text-textPrimary" />
          </div>
          <input
            className="group w-full rounded-full bg-elevated px-12 py-3.5 text-textPrimary outline-none ring-1 ring-white/10 transition hover:bg-elevated/80 focus:ring-2 focus:ring-white/20 placeholder:text-textSecondary font-medium"
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="What do you want to listen to?"
            type="text"
            value={query}
          />
        </div>
      </div>

      {!debouncedQuery ? (
        <section>
          <h2 className="text-heading mb-6">Browse all</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {searchCategories.map((card) => (
              <Card key={card.title} {...card} />
            ))}
          </div>
        </section>
      ) : (
        <div className="space-y-10">
          {isLoading && <p className="text-textSecondary text-sm">Searching...</p>}

          {tracks.length > 0 && (
            <section>
              <h2 className="text-heading mb-6">Tracks</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {tracks.map((track) => (
                  <Card
                    key={track.id}
                    audioUrl={track.audioUrl}
                    artworkLabel={track.title}
                    imageUrl={track.image}
                    isPlayable={Boolean(track.audioUrl)}
                    source={track.source}
                    subtitle={track.subtitle}
                    trackId={track.id}
                    title={track.title}
                  />
                ))}
              </div>
            </section>
          )}

          {searchResults.artists.length > 0 && (
            <section>
              <h2 className="text-heading mb-6">Artists</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {searchResults.artists.map((artist) => (
                  <Card
                    key={artist.id}
                    artworkLabel={artist.title}
                    imageUrl={artist.image}
                    isPlayable={false}
                    subtitle={artist.subtitle}
                    title={artist.title}
                  />
                ))}
              </div>
            </section>
          )}

          {searchResults.albums.length > 0 && (
            <section>
              <h2 className="text-heading mb-6">Albums</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {searchResults.albums.map((album) => (
                  <Card
                    key={album.id}
                    artworkLabel={album.title}
                    imageUrl={album.image}
                    isPlayable={false}
                    subtitle={album.subtitle}
                    title={album.title}
                  />
                ))}
              </div>
            </section>
          )}

          {hasNoResults && (
            <div className="rounded-xl bg-surface/80 p-6 ring-1 ring-white/8">
              <p className="text-textSecondary text-sm">
                No results found. Try a different search term.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
