# 🎵 Spotify Clone

> A full-stack music streaming web app built with Next.js, Firebase, and the Spotify Web API — featuring a resilient multi-source audio fallback system, secure admin uploads, and real-time Firestore sync.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-orange?logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)
![Zustand](https://img.shields.io/badge/Zustand-State%20Management-brown)

**Live Demo:** [your-deployment-url.com](#) &nbsp;|&nbsp; **GitHub:** [Narayan-Kumar-Yadav/Spotify-Clone](https://github.com/Narayan-Kumar-Yadav/Spotify-Clone)

---

## 📸 Screenshots

### 🔐 Login
![Login](https://github.com/user-attachments/assets/6f2c0be3-df56-47d9-ab5d-11920124d4c8)

### 🔍 Search
![Search](https://github.com/user-attachments/assets/197034b3-e766-43ec-8024-d839407af001)

### 📚 Library
![Library](https://github.com/user-attachments/assets/f0eea113-1362-40f8-a01f-9eb60e9318f6)

### 👤 Profile
![Profile](https://github.com/user-attachments/assets/94c34b3d-a7e4-4a38-b433-2d1856a2041f)

### 🛡️ Admin Panel
![Admin Panel](https://github.com/user-attachments/assets/3825d670-7451-4f97-be27-fc027adcf85b)

---

## 🧠 What Makes This Different

Most Spotify clones break silently when a track has no preview URL. This one doesn't.

I built a **4-tier audio fallback system** that resolves playback sources at runtime in priority order:

```
1. Spotify preview_url       (real API data)
2. Admin-uploaded audio      (Firestore)
3. Public sample URLs        (online fallbacks)
4. Local /public/music/      (offline fallbacks)
```

The player always has something to play. The UI clearly labels each source — "Sample Audio", "Offline Track" — so users are never left confused by a broken play button.

---

## 🚀 Features

### 🔐 Authentication
- **Google Sign-In** via Firebase Auth
- **Guest mode** — enter a name, explore the app, no database writes
- Guest sessions stored in `localStorage` only; Firestore rules block unauthenticated writes

### 🎵 Music Player
- Global audio state via **Zustand**
- Play / pause / next / previous / queue
- Single audio instance enforced across the app
- Graceful error recovery on playback failure

### 🔍 Search
- Real-time Spotify Web API integration
- **300ms debounced** input to minimize API calls
- Returns tracks, artists, albums
- Falls back to curated local tracks when no results found

### 📚 Library
- Liked Songs stored in Firestore, synced in real-time via `onSnapshot`
- Like/unlike from track cards or the bottom player bar
- Guest users see a read-only experience — no data written

### 🎼 Playlists
- User playlists stored at `users/{userId}/playlists/{playlistId}/songs`
- Create playlists, add/remove songs, queue entire playlist
- All mutations scoped to the authenticated user

### 🛡️ Admin Panel
- Admin identity verified **server-side only** via `/api/admin/access`
- Admin email stored in `.env` — never exposed to the client
- Upload songs: title, artist, audio URL, cover image → saved to Firestore

### 🎨 UI
- Spotify-inspired dark theme with Tailwind CSS
- Fully responsive layout
- Reusable `Card` component supporting playable/non-playable states, multiple audio sources
- Fixed bottom player bar, sidebar navigation

---

## 🏗️ Architecture

```
app/
├── (admin)/          # Admin-protected routes
├── (auth)/           # Login / session restore
├── (main)/           # Core app: home, search, library, profile
└── api/
    └── admin/access  # Server-side admin verification

components/
├── layout/           # Sidebar, BottomPlayer, AppShell
├── music/            # TrackCard, PlayerControls, PlaylistCard
├── ui/               # Buttons, Inputs, Modals
└── shared/           # Card (unified playable component)

features/
├── auth/             # Firebase auth logic, guest session
├── library/          # Liked songs, real-time sync
└── playlists/        # Playlist CRUD

lib/
├── firebase/         # Firestore client, auth helpers
├── spotify/          # Spotify API wrapper
└── fallbackTracks/   # Local + sample audio definitions

store/
└── player.ts         # Zustand global player state

public/
└── music/            # Offline fallback .mp3 files
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| State | Zustand |
| Music API | Spotify Web API |
| Deployment | Vercel |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project (Auth + Firestore enabled)
- Spotify Developer API credentials

### 1. Clone the repo

```bash
git clone https://github.com/Narayan-Kumar-Yadav/Spotify-Clone.git
cd Spotify-Clone
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Spotify
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=

# Admin
ADMIN_EMAIL=your-admin@email.com
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔒 Security Notes

- `.env.local` is gitignored — never committed
- Admin email is only read server-side in `/api/admin/access`
- All Firestore writes are blocked for unauthenticated/guest users at the security rule level
- No `console.log` statements in production build

---

## 🧩 Key Engineering Decisions

**Why Zustand over Redux?**
The audio player needs lightweight, globally accessible state. Zustand's minimal API — no boilerplate, no providers — was the right fit for managing a single audio instance across deeply nested components.

**Why block guest writes at the app level _and_ Firestore level?**
Defense in depth. Client-side checks prevent unnecessary round-trips; Firestore security rules are the actual enforcement layer that can't be bypassed.

**Why a 4-tier audio fallback?**
Spotify's free-tier API returns no `preview_url` for a significant portion of tracks. Rather than showing a broken UI, the app silently escalates through fallback sources and labels the audio type so users understand what they're hearing.

---

## 🗺️ Roadmap / Future Ideas

- [ ] Spotify full track streaming (requires Premium OAuth)
- [ ] Waveform visualizer on the player bar
- [ ] Collaborative playlists (shared Firestore subcollections)
- [ ] PWA support for mobile / offline listening
- [ ] AI-powered recommendations based on listening history
- [ ] Dark/light theme toggle

---

## 👤 Author

**Narayan Kumar Yadav**
[GitHub](https://github.com/Narayan-Kumar-Yadav) · [LinkedIn]([#your-linkedin](https://www.linkedin.com/in/narayan-kumar-yadav-3808943b7/))

---

## 📄 License

This project is for educational and portfolio purposes. It uses the Spotify Web API under Spotify's [Developer Terms of Service](https://developer.spotify.com/terms). Not affiliated with Spotify AB.
