"use client";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function HomeError({ error: _error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/30 to-elevated ring-1 ring-white/10">
        <svg
          className="text-textSecondary size-9"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 9a3 3 0 1 1 4.5 2.598c-.68.393-1.5 1.123-1.5 2.152M12 17h.008M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-textPrimary text-xl font-semibold">Unable to load music right now</h2>
        <p className="text-textSecondary max-w-sm text-sm leading-relaxed">
          We couldn&apos;t connect to Spotify. Check your connection or API credentials and try again.
        </p>
      </div>

      <button
        className="bg-accent hover:bg-accent/90 text-background rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-150 hover:scale-105 active:scale-95"
        onClick={reset}
        type="button"
      >
        Try again
      </button>
    </div>
  );
}
