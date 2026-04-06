const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const API_BASE = "https://api.spotify.com/v1";

let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const basicAuth = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify access token");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000 - 60000; // Subtract 1 min for safety buffer

  return cachedToken;
}

export async function getFeaturedPlaylists() {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/browse/featured-playlists?limit=20`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error("Failed to fetch featured playlists");
  return response.json();
}

export async function getNewReleases() {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/browse/new-releases?limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error("Failed to fetch new releases");
  return response.json();
}

export async function getBrowseCategories() {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/browse/categories?limit=10&locale=en_US`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) throw new Error("Failed to fetch browse categories");
  return response.json();
}

export async function getPlaylistTracks(playlistId: string) {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/playlists/${playlistId}/tracks?limit=50`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) throw new Error("Failed to fetch playlist tracks");
  return response.json();
}

export async function searchSpotify(query: string) {
  const token = await getAccessToken();
  const encodedQuery = encodeURIComponent(query.trim());
  const response = await fetch(`${API_BASE}/search?q=${encodedQuery}&type=track,artist,album&limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    await response.text();
    throw new Error("Failed to search Spotify");
  }

  return response.json();
}
