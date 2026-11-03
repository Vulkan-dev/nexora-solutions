import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f6f2", // Warm gallery white
        surface: "#ffffff", // Pure white crisp cards that pop with high contrast
        surfaceElevated: "#f2efe9", // Distinct layered panels, insets, tags
        surfaceCard: "#ffffff",
        borderLight: "#e5e2d8",
        borderDark: "#d5d1c4",
        cream: {
          50: "#faf8f4",
          100: "#14151a", // Deep high-contrast obsidian text
          200: "#282a33",
          300: "#454854",
          400: "#927144", // Rich warm bronze gold accent
          500: "#795c34",
        },
        gold: {
          light: "#d4b88f",
          DEFAULT: "#a17e4d", // High-contrast metallic gold
          dark: "#75582f",
        },
      },
      boxShadow: {
        atelier: "0 10px 30px -4px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
        glow: "0 0 25px rgba(161, 126, 77, 0.16)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.03)",
        cardHover: "0 14px 34px -4px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
