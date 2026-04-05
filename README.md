# Spotify Clone

Production-grade starter architecture for a Spotify-like music streaming
application built with Next.js App Router, TypeScript, Tailwind CSS, and strict
linting standards.

## Tech Stack

- Next.js `16.2.2` with App Router
- React `19.2.4`
- TypeScript with strict compiler settings
- Tailwind CSS `4`
- ESLint `9` + Prettier `3`

## Project Structure

```text
app/
  (auth)/
  (main)/
  api/
components/
  ui/
  layout/
  music/
  shared/
features/
  auth/
  player/
  playlist/
  search/
  library/
lib/
  firebase/
  spotify/
  utils/
  hooks/
store/
styles/
types/
```

## Directory Intent

- `app/`: Route segments, layouts, and API entrypoints.
- `components/`: Reusable presentational building blocks grouped by concern.
- `features/`: Feature-scoped modules for business logic and feature UI.
- `lib/`: Shared integrations, hooks, and application-level utilities.
- `store/`: Future client/server state management layers.
- `styles/`: Global styling entrypoints and shared style primitives.
- `types/`: Shared TypeScript contracts and domain models.

## Available Scripts

- `npm run dev`: Start the local development server.
- `npm run build`: Create the production build.
- `npm run start`: Run the production server locally.
- `npm run lint`: Run ESLint with zero warnings allowed.
- `npm run lint:fix`: Automatically fix supported lint issues.
- `npm run typecheck`: Run strict TypeScript checks.
- `npm run format`: Format the codebase with Prettier.
- `npm run format:check`: Verify formatting without writing changes.

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the Firebase and Spotify
credentials before implementing authentication or API integrations.

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local env file:

   ```bash
   cp .env.local.example .env.local
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.local.example .env.local
   ```

3. Start the app:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Notes

- This repository intentionally includes only the application foundation.
- No product features, authentication flows, or music playback logic are
  implemented yet.
