import { UploadedSongsSection } from "@/components/music/UploadedSongsSection";
import { Card } from "@/components/ui/Card";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  getBrowseCategories,
  getFeaturedPlaylists,
  getNewReleases,
} from "@/lib/spotify";

const fallbackGoodEvening = [
  {
    artworkLabel: "Liked",
    subtitle: "Your saved tracks",
    title: "Liked Songs",
    tone: "glow" as const,
  },
  {
    artworkLabel: "Mix 1",
    subtitle: "Made for you",
    title: "Daily Mix 1",
    tone: "accent" as const,
  },
  {
    artworkLabel: "Discover",
    subtitle: "New music update",
    title: "Discover Weekly",
    tone: "contrast" as const,
  },
  {
    artworkLabel: "Focus",
    subtitle: "Stay in the zone",
    title: "Focus Flow",
    tone: "muted" as const,
  },
  {
    artworkLabel: "Radar",
    subtitle: "Catch up on latest",
    title: "Release Radar",
    tone: "accent" as const,
  },
  {
    artworkLabel: "Coding",
    subtitle: "Deep work",
    title: "Coding Mode",
    tone: "glow" as const,
  },
];

const fallbackMadeForYou = [
  {
    artworkLabel: "Mix 2",
    subtitle: "Arctic Monkeys, The Strokes...",
    title: "Daily Mix 2",
    tone: "contrast" as const,
  },
  {
    artworkLabel: "Mix 3",
    subtitle: "Daft Punk, Justice...",
    title: "Daily Mix 3",
    tone: "glow" as const,
  },
  {
    artworkLabel: "Mix 4",
    subtitle: "Lofi beats, Chillhop...",
    title: "Daily Mix 4",
    tone: "muted" as const,
  },
  {
    artworkLabel: "Mix 5",
    subtitle: "Hans Zimmer, Ramin Djawadi...",
    title: "Daily Mix 5",
    tone: "accent" as const,
  },
  {
    artworkLabel: "Mix 6",
    subtitle: "Synthwave, Retrowave...",
    title: "Daily Mix 6",
    tone: "contrast" as const,
  },
];

const fallbackTrending = [
  {
    artworkLabel: "Pop",
    subtitle: "Today's biggest hits",
    title: "Pop",
    tone: "accent" as const,
  },
  {
    artworkLabel: "Hip-Hop",
    subtitle: "Fresh drops",
    title: "Hip-Hop",
    tone: "glow" as const,
  },
  {
    artworkLabel: "Electronic",
    subtitle: "Beats & bass",
    title: "Electronic",
    tone: "contrast" as const,
  },
  {
    artworkLabel: "R&B",
    subtitle: "Soul & rhythm",
    title: "R&B",
    tone: "muted" as const,
  },
  {
    artworkLabel: "Workout",
    subtitle: "High energy",
    title: "Workout",
    tone: "accent" as const,
  },
];

const fallbackPopularAlbums = [
  {
    artworkLabel: "Beatles",
    subtitle: "The Beatles",
    title: "Abbey Road",
    tone: "contrast" as const,
  },
  {
    artworkLabel: "Floyd",
    subtitle: "Pink Floyd",
    title: "Dark Side of the Moon",
    tone: "muted" as const,
  },
  {
    artworkLabel: "Daft",
    subtitle: "Daft Punk",
    title: "Random Access Memories",
    tone: "glow" as const,
  },
  {
    artworkLabel: "Tame",
    subtitle: "Tame Impala",
    title: "Currents",
    tone: "accent" as const,
  },
  {
    artworkLabel: "Mac",
    subtitle: "Fleetwood Mac",
    title: "Rumours",
    tone: "contrast" as const,
  },
];

type ArtworkTone = "accent" | "contrast" | "glow" | "muted";

const tones: ArtworkTone[] = ["accent", "contrast", "glow", "muted"];

type SpotifyCardItem = {
  description?: string;
  icons?: Array<{ url?: string }>;
  id?: string;
  images?: Array<{ url?: string }>;
  name?: string;
  artists?: Array<{ name?: string }>;
  publisher?: string;
};

function mapToCards(items: SpotifyCardItem[], toneOffset = 0) {
  return items.map((item, index) => {
    const rawSubtitle =
      item.description || item.artists?.[0]?.name || item.publisher || "Spotify";
    const cleanSubtitle = rawSubtitle.replace(/<[^>]*>?/gm, "").substring(0, 60);
    const imageUrl = item.images?.[0]?.url || item.icons?.[0]?.url;
    const tone = tones[(index + toneOffset) % tones.length] ?? "accent";

    return {
      artworkLabel: item.name || "Mix",
      ...(imageUrl ? { imageUrl } : {}),
      ...(typeof item.id === "string" ? { spotifyId: item.id } : {}),
      subtitle: cleanSubtitle || "Playlist",
      title: item.name || "Unknown",
      tone,
    };
  });
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";

  return "Good evening";
}

export default async function HomePage() {
  const [featured, newReleases, categories] = await Promise.all([
    getFeaturedPlaylists().catch(() => null),
    getNewReleases().catch(() => null),
    getBrowseCategories().catch(() => null),
  ]);

  const featuredItems = featured?.playlists?.items ?? [];
  const goodEveningCards =
    featuredItems.length >= 6 ? mapToCards(featuredItems.slice(0, 6), 0) : fallbackGoodEvening;
  const madeForYouCards =
    featuredItems.length > 6 ? mapToCards(featuredItems.slice(6, 12), 1) : fallbackMadeForYou;
  const popularAlbumsCards = newReleases?.albums?.items?.length
    ? mapToCards(newReleases.albums.items.slice(0, 10), 2)
    : fallbackPopularAlbums;
  const trendingCards = categories?.categories?.items?.length
    ? mapToCards(categories.categories.items.slice(0, 10), 3)
    : fallbackTrending;
  const apiPartiallyFailed = !featured && !newReleases && !categories;
  const greeting = getGreeting();

  return (
    <div className="space-y-10">
      {apiPartiallyFailed && (
        <ErrorMessage message="Unable to load music right now. Showing curated content instead." />
      )}

      <UploadedSongsSection />

      <section>
        <h1 className="text-display mb-6">{greeting}</h1>
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
          {goodEveningCards.map((card, index) => (
            <Card key={`ge-${index}`} {...card} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <SectionHeader actionLabel="Show all" title="Made for you" />
        </div>
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {madeForYouCards.map((card, index) => (
            <div
              key={`mfy-${index}`}
              className="w-[180px] min-w-[180px] snap-start sm:w-[200px] sm:min-w-[200px]"
            >
              <Card {...card} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <SectionHeader title="Trending Artists" />
        </div>
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {trendingCards.map((card, index) => (
            <div
              key={`tr-${index}`}
              className="w-[180px] min-w-[180px] snap-start sm:w-[200px] sm:min-w-[200px]"
            >
              <Card {...card} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <SectionHeader title="Popular albums" />
        </div>
        <div className="flex gap-4 overflow-x-auto whitespace-nowrap pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {popularAlbumsCards.map((card, index) => (
            <div
              key={`pa-${index}`}
              className="w-[180px] min-w-[180px] snap-start sm:w-[200px] sm:min-w-[200px]"
            >
              <Card {...card} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
