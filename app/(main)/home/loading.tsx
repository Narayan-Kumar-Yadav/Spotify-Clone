// app/(main)/home/loading.tsx
// Next.js automatically shows this while the async page is fetching data.

export default function HomeLoading() {
  return (
    <div className="space-y-10 animate-pulse">

      {/* Greeting skeleton */}
      <section>
        <div className="mb-6 h-9 w-52 rounded-xl bg-white/8" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonGridCard key={i} />
          ))}
        </div>
      </section>

      {/* Made for you skeleton */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="mb-2 h-3 w-20 rounded-full bg-white/8" />
            <div className="h-6 w-36 rounded-xl bg-white/8" />
          </div>
          <div className="h-4 w-16 rounded-full bg-white/8" />
        </div>
        <SkeletonScrollRow />
      </section>

      {/* Trending skeleton */}
      <section>
        <div className="mb-4">
          <div className="mb-2 h-3 w-20 rounded-full bg-white/8" />
          <div className="h-6 w-44 rounded-xl bg-white/8" />
        </div>
        <SkeletonScrollRow />
      </section>

      {/* Popular albums skeleton */}
      <section>
        <div className="mb-4">
          <div className="mb-2 h-3 w-20 rounded-full bg-white/8" />
          <div className="h-6 w-40 rounded-xl bg-white/8" />
        </div>
        <SkeletonScrollRow />
      </section>

    </div>
  );
}

function SkeletonGridCard() {
  return (
    <div className="bg-surface/60 rounded-xl p-4 ring-1 ring-white/6">
      <div className="mb-4 aspect-square w-full rounded-xl bg-white/8" />
      <div className="mb-2 h-4 w-3/4 rounded-full bg-white/8" />
      <div className="h-3 w-1/2 rounded-full bg-white/6" />
    </div>
  );
}

function SkeletonScrollRow() {
  return (
    <div className="flex gap-4 overflow-hidden pb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-[180px] min-w-[180px] sm:w-[200px] sm:min-w-[200px]">
          <div className="bg-surface/60 rounded-xl p-4 ring-1 ring-white/6">
            <div className="mb-4 aspect-square w-full rounded-xl bg-white/8" />
            <div className="mb-2 h-4 w-3/4 rounded-full bg-white/8" />
            <div className="h-3 w-1/2 rounded-full bg-white/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
