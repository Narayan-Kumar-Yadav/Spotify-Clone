import { NextResponse } from "next/server";

import { searchSpotify } from "@/lib/spotify";

type SpotifyImage = { url?: string };
type SpotifyArtist = { id?: string; images?: SpotifyImage[]; name?: string };
type SpotifyAlbum = { artists?: { name?: string }[]; id?: string; images?: SpotifyImage[]; name?: string };
type SpotifyTrack = {
  album?: SpotifyAlbum;
  artists?: { name?: string }[];
  id?: string;
  name?: string;
  preview_url?: string | null;
};

type SpotifySearchResponse = {
  albums?: { items?: SpotifyAlbum[] };
  artists?: { items?: SpotifyArtist[] };
  tracks?: { items?: SpotifyTrack[] };
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";

    if (!query) {
      return NextResponse.json({
        albums: [],
        artists: [],
        tracks: [],
      });
    }

    const data = (await searchSpotify(query)) as SpotifySearchResponse;

    const tracks = (data.tracks?.items ?? [])
      .filter((track) => Boolean(track.id && track.name))
      .map((track) => ({
        audioUrl: track.preview_url ?? null,
        id: track.id as string,
        image: track.album?.images?.[0]?.url ?? "",
        source: "spotify" as const,
        subtitle: track.artists?.[0]?.name ?? "Unknown artist",
        title: track.name as string,
      }));

    const artists = (data.artists?.items ?? [])
      .filter((artist) => Boolean(artist.id && artist.name))
      .map((artist) => ({
        id: artist.id as string,
        image: artist.images?.[0]?.url ?? "",
        subtitle: "Artist",
        title: artist.name as string,
      }));

    const albums = (data.albums?.items ?? [])
      .filter((album) => Boolean(album.id && album.name))
      .map((album) => ({
        id: album.id as string,
        image: album.images?.[0]?.url ?? "",
        subtitle: album.artists?.[0]?.name ?? "Album",
        title: album.name as string,
      }));

    return NextResponse.json({ albums, artists, tracks });
  } catch {
    return NextResponse.json({ error: "Failed to search Spotify" }, { status: 500 });
  }
}
