import { NextResponse } from "next/server";

import { getPlaylistTracks } from "@/lib/spotify";

type SpotifyTrackArtist = {
  name?: string;
};

type SpotifyTrackImage = {
  url?: string;
};

type SpotifyTrackAlbum = {
  images?: SpotifyTrackImage[];
};

type SpotifyTrack = {
  album?: SpotifyTrackAlbum;
  artists?: SpotifyTrackArtist[];
  id?: string;
  name?: string;
  preview_url?: string | null;
};

type SpotifyTrackItem = {
  track?: SpotifyTrack | null;
};

type PlaylistTracksResponse = {
  items?: SpotifyTrackItem[];
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ playlistId: string }> },
) {
  try {
    const { playlistId } = await params;

    if (!playlistId) {
      return NextResponse.json({ error: "playlistId is required" }, { status: 400 });
    }

    const data = (await getPlaylistTracks(playlistId)) as PlaylistTracksResponse;
    const tracks = (data.items ?? [])
      .map((item) => item.track)
      .filter((track): track is SpotifyTrack => Boolean(track?.id && track?.name))
      .map((track) => ({
        audioUrl: track.preview_url ?? null,
        id: track.id as string,
        image: track.album?.images?.[0]?.url ?? "",
        source: "spotify" as const,
        subtitle: track.artists?.[0]?.name ?? "Unknown artist",
        title: track.name as string,
      }));

    return NextResponse.json({ tracks });
  } catch {
    return NextResponse.json({ error: "Failed to fetch playlist tracks" }, { status: 500 });
  }
}
