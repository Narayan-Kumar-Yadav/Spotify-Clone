import "@/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Spotify Clone",
  description: "Production-grade Spotify-inspired streaming app scaffold.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#121212] text-white antialiased">{children}</body>
    </html>
  );
}
