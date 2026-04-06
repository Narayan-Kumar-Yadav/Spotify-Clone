import { collection } from "firebase/firestore";

import { db } from "@/lib/firebase/client";

export function getLikedSongsCollection(userId: string) {
  return collection(db, "users", userId, "likedSongs");
}

export function getPlaylistsCollection(userId: string) {
  return collection(db, "users", userId, "playlists");
}
