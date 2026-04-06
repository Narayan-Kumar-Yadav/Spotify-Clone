import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  theme: {
    extend: {
      borderRadius: {
        panel: "1.5rem",
      },
      boxShadow: {
        card: "0 18px 40px rgba(0, 0, 0, 0.32)",
        glow: "0 12px 32px rgba(29, 185, 84, 0.24)",
        panel: "0 24px 48px rgba(0, 0, 0, 0.28)",
        player: "0 -12px 28px rgba(0, 0, 0, 0.42)",
      },
      colors: {
        accent: "#1DB954",
        background: "#121212",
        elevated: "#282828",
        surface: "#181818",
        textPrimary: "#FFFFFF",
        textSecondary: "#B3B3B3",
      },
      fontFamily: {
        sans: ["Circular Std", "CircularSp", "Spotify Mix", ...defaultTheme.fontFamily.sans],
      },
    },
  },
} satisfies Config;

export default config;
