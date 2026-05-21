import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0d10",
        panel: "#14171c",
        panel2: "#1c2026",
        border: "#262b33",
        text: "#e8ecf1",
        muted: "#8a93a3",
        accent: "#7cf08a",
        accentDark: "#4cc35d",
        warn: "#f5a524",
        danger: "#f06c6c",
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
