# 🎧 Spotify Clone – Full Stack Music Streaming App

A production-ready Spotify-inspired music streaming application built with
Next.js App Router, TypeScript, Firebase, Firestore, Zustand, and Tailwind CSS.
It supports Spotify-powered discovery, admin-uploaded tracks, guest access, and
resilient playback with a multi-source fallback audio system.

## 🚀 Features

- Spotify API integration (search, playlists)
- Real audio playback system
- Multi-source fallback audio (Spotify -> Admin -> Sample -> Local)
- Admin panel (upload songs)
- Google + Guest authentication
- Firestore liked songs & playlists
- Zustand-based player with queue, next/previous

## 🧠 Tech Stack

- Next.js (App Router)
- TypeScript
- Firebase Auth
- Firestore
- Zustand
- Tailwind CSS

## 🔐 Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
ADMIN_EMAIL=
```

Copy `.env.local.example` to `.env.local` and fill in the required values before
running the app.

## ⚙️ Setup

```bash
npm install
npm run dev
```

## 📸 Screenshots

- Home page screenshot: coming soon
- Player screenshot: coming soon
- Admin panel screenshot: coming soon
