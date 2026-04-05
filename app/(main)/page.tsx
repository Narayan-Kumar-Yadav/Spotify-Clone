export default function SetupCompletePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121212] px-6">
      <div className="space-y-4 text-center">
        <p className="text-xs font-medium tracking-[0.4em] text-emerald-400 uppercase">
          Foundation Ready
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          Spotify Clone - Setup Complete
        </h1>
        <p className="mx-auto max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
          Next.js, TypeScript, Tailwind CSS, strict linting, and a scalable production-first
          architecture are in place.
        </p>
      </div>
    </main>
  );
}
