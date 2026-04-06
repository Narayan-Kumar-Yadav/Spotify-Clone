export type FallbackTrack = {
  audioUrl: string;
  id: string;
  image?: string;
  source: "local" | "sample";
  subtitle: string;
  title: string;
};

export const fallbackTracks: FallbackTrack[] = [
  {
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    id: "fallback-1",
    image: "/images/demo1.jpg",
    source: "sample",
    subtitle: "Sample Audio",
    title: "Demo Track 1",
  },
  {
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    id: "fallback-2",
    source: "sample",
    subtitle: "Sample Audio",
    title: "Demo Track 2",
  },
  {
    audioUrl: "/music/song1.mp3",
    id: "local-1",
    source: "local",
    subtitle: "Offline Demo",
    title: "Local Track 1",
  },
  {
    audioUrl: "/music/song2.mp3",
    id: "local-2",
    source: "local",
    subtitle: "Offline Demo",
    title: "Local Track 2",
  },
];
