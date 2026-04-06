import "@/styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  description: "Spotify-inspired design system demo built with Next.js.",
  title: "Spotify Clone",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <body className="bg-background text-textPrimary min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
